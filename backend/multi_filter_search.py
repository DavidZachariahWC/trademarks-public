# multi_filter_search.py

from typing import List, Dict, Any
import logging
import time

from sqlalchemy import union_all, or_, and_, select, func, desc
from sqlalchemy.orm import Session, Query
from models import CaseFile, CaseFileHeader
from search_engine import SearchEngine
from db_utils import get_db_session, base_query


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def multi_filter_search(filter_tree: Dict, page: int = 1, per_page: int = 10) -> Dict[str, Any]:
    """
    Combine multiple search conditions (strategies) using AND/OR logic to filter CaseFiles,
    and unify scoring for any scoring strategies (0-100 range).

    Two-phase approach:
      1) Build a 'final_query' that captures the set of matching CaseFile.serial_number 
         (via build_query_recursive).
      2) Gather scoring subqueries, union them, group by serial_number to get max(score).
      3) Build a NEW query that:
         - Joins CaseFile + CaseFileHeader
         - Filters by final_query's matching serial_number list
         - Outer-joins the aggregated score subquery
         - Orders by combined_score desc (if any) or filing_date desc otherwise
    """
    start_time = time.time()
    logger.info(f"Starting search with filter tree: {filter_tree}, page={page}, per_page={per_page}")

    session = get_db_session()

    # ----------------------------------------------------------------------
    # 1) Recursively build a Query that filters records (via AND/OR logic).
    #    This returns serial_numbers that match all conditions.
    # ----------------------------------------------------------------------
    def build_query_recursive(node: Dict, session: Session) -> Query:
        """
        Returns a Query object (CaseFile rows) that match the node's filters.
        DOES NOT incorporate final scoring columns. 
        """
        if 'strategy' in node:
            strategy_name = node['strategy']
            query_str = node.get('query', "")
            StrategyClass = SearchEngine.STRATEGY_MAP.get(strategy_name)
            if not StrategyClass:
                logger.warning(f"Unknown strategy: {strategy_name}")
                return None

            strategy = StrategyClass(query_str, page=1, per_page=999999999)
            query = strategy.build_query(session)  # applies .filter(*filters)
            if query is not None:
                logger.info(f"Generated query for strategy '{strategy_name}'.")
            else:
                logger.warning(f"Query generation failed for strategy: {strategy_name}")
            return query

        elif 'operator' in node and 'operands' in node:
            operator = node['operator']
            operands = node['operands']
            if not operands:
                return None

            subqueries = [build_query_recursive(op, session) for op in operands]
            subqueries = [sq for sq in subqueries if sq is not None]

            if not subqueries:
                return None

            
            if operator == 'AND':
                
                combined_query = base_query(session)
                for sq in subqueries:
                    
                    serial_number_subselect = select(sq.with_entities(CaseFile.serial_number).subquery().c.serial_number)
                    combined_query = combined_query.filter(
                        CaseFile.serial_number.in_(serial_number_subselect)
                    )
                return combined_query

            elif operator == 'OR':
                
                or_conditions = []
                for sq in subqueries:
                    serial_number_subselect = select(sq.with_entities(CaseFile.serial_number).subquery().c.serial_number)
                    or_conditions.append(CaseFile.serial_number.in_(serial_number_subselect))

                combined_query = base_query(session).filter(or_(*or_conditions))
                return combined_query

            else:
                logger.warning(f"Unknown operator: {operator}")
                return None

        else:
            logger.error(f"Invalid filter tree node: {node}")
            return None

    
    
    
    
    scoring_subqueries = []

    def gather_scoring_subqueries(node: Dict):
        """Collect subqueries of (sn, score) from all scoring strategies."""
        if 'strategy' in node:
            strategy_name = node['strategy']
            query_str = node.get('query', "")
            StrategyClass = SearchEngine.STRATEGY_MAP.get(strategy_name)
            if not StrategyClass:
                return

            strategy = StrategyClass(query_str, page=1, per_page=999999999)
            if getattr(strategy, 'is_scoring_strategy', False):
                
                if hasattr(strategy, 'get_subquery_for_scoring'):
                    sub_scoring_q = strategy.get_subquery_for_scoring(session)
                    if sub_scoring_q is not None:
                        subq = sub_scoring_q.subquery()
                        scoring_subqueries.append(subq)
                else:
                    
                    filters, scoring_cols = strategy.get_filters_and_scoring()
                    if scoring_cols:
                        score_col = scoring_cols[0]
                        subq = (
                            base_query(session)
                            .filter(*filters)
                            .with_entities(
                                CaseFile.serial_number.label('sn'),
                                score_col.label('score')
                            )
                            .subquery()
                        )
                        scoring_subqueries.append(subq)

        elif 'operator' in node and 'operands' in node:
            for op in node['operands']:
                gather_scoring_subqueries(op)

    
    
    
    if not filter_tree:
        return {
            'results': [],
            'pagination': {
                'current_page': 1,
                'total_pages': 0,
                'total_results': 0,
                'per_page': per_page
            }
        }

    try:
        # Build the main "filter" query
        final_query = build_query_recursive(filter_tree, session)
        if final_query is None:
            return {
                'results': [],
                'pagination': {
                    'current_page': 1,
                    'total_pages': 0,
                    'total_results': 0,
                    'per_page': per_page
                }
            }

        
        gather_scoring_subqueries(filter_tree)

        # ------------------------------------------------------------------
        # PHASE 2: Build a fresh final query from:
        #   1) The matching serial_numbers from final_query
        #   2) A union of scoring subqueries aggregated to max(score)
        # ------------------------------------------------------------------

        # A. matching_serials_subq: all CaseFile.serial_number that passed filters
        matching_serials_subq = select(
            final_query.with_entities(CaseFile.serial_number).subquery().c.serial_number
        ).subquery()

        # B. union scoring subqueries => group by => max(score)
        if scoring_subqueries:
            
            unioned_select = union_all(*[
                session.query(
                    s.c.sn.label("sn"),
                    s.c.score.label("score")
                ).statement
                for s in scoring_subqueries
            ]).alias("unioned_scores")

            scoring_agg = (
                session.query(
                    unioned_select.c.sn.label('sn'),
                    func.max(unioned_select.c.score).label('combined_score')
                )
                .group_by(unioned_select.c.sn)
            ).subquery()
        else:
            scoring_agg = None

        
        
        
        
        final_results_query = (
            session.query(
                CaseFile.serial_number.label('serial_number'),
                CaseFile.registration_number.label('registration_number'),
                CaseFileHeader.mark_identification.label('mark_identification'),
                CaseFileHeader.status_code.label('status_code'),
                CaseFileHeader.filing_date.label('filing_date'),
                CaseFileHeader.registration_date.label('registration_date'),
                CaseFileHeader.attorney_name.label('attorney_name')
            )
            .join(CaseFileHeader, CaseFile.serial_number == CaseFileHeader.serial_number)
            .filter(CaseFile.serial_number.in_(select(matching_serials_subq.c.serial_number)))
        )

        if scoring_agg is not None:
            final_results_query = (
                final_results_query
                .add_columns(func.coalesce(scoring_agg.c.combined_score, 0).label('combined_score'))
                .outerjoin(scoring_agg, scoring_agg.c.sn == CaseFile.serial_number)
                .filter(
                    or_(
                        scoring_agg.c.combined_score == None,  
                        func.coalesce(scoring_agg.c.combined_score, 0) >= 15
                    )
                )
                .order_by(
                    desc('combined_score'),
                    desc(CaseFileHeader.filing_date)
                )
            )
        else:
            final_results_query = final_results_query.order_by(desc(CaseFileHeader.filing_date))

        
        filtered_count_query = final_results_query.with_entities(func.count()).order_by(None)
        total_count = filtered_count_query.scalar()
        total_pages = (total_count + per_page - 1) // per_page

        
        offset = (page - 1) * per_page
        final_results_query = final_results_query.limit(per_page).offset(offset)

        
        try:
            compiled_query = final_results_query.statement.compile(
                compile_kwargs={'literal_binds': True}
            )
            logger.info("Final SQL Query with parameters:")
            logger.info("-" * 80)
            logger.info(str(compiled_query))
            logger.info("-" * 80)
            
            
            if compiled_query.params:
                logger.info("Query parameters:")
                for key, value in compiled_query.params.items():
                    logger.info(f"{key}: {value}")
        except Exception as sql_log_error:
            logger.warning(f"Could not log complete SQL query: {str(sql_log_error)}")

        
        rows = final_results_query.all()
        results = []
        for row in rows:
            
            if scoring_agg is not None:
                (serial_number,
                 registration_number,
                 mark_identification,
                 status_code,
                 filing_date,
                 registration_date,
                 attorney_name,
                 combined_score) = row
            else:
                (serial_number,
                 registration_number,
                 mark_identification,
                 status_code,
                 filing_date,
                 registration_date,
                 attorney_name) = row
                combined_score = 0

            results.append({
                'serial_number': serial_number,
                'registration_number': registration_number,
                'mark_identification': mark_identification,
                'status_code': status_code,
                'filing_date': str(filing_date) if filing_date else None,
                'registration_date': str(registration_date) if registration_date else None,
                'attorney_name': attorney_name,
                'combined_score': combined_score
            })

        query_time = time.time() - start_time
        logger.info(f"Query executed in {query_time:.2f}s")

        return {
            'results': results,
            'pagination': {
                'current_page': page,
                'total_pages': total_pages,
                'total_results': total_count,
                'per_page': per_page
            }
        }

    except Exception as e:
        logger.error(f"Error in multi_filter_search: {str(e)}", exc_info=True)
        raise
    finally:
        session.close()
