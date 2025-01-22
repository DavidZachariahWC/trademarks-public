from typing import List, Dict, Any
import logging
import time
from sqlalchemy import union_all, intersect, text, select, distinct, func, or_, and_
from sqlalchemy.orm import Session, Query
from models import CaseFile, CaseFileHeader
from search_engine import SearchEngine
from db_utils import get_db_session, base_query

# Configure logging
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
    Combine multiple search conditions using JOINs for AND and UNION ALL for OR.

    Args:
        filter_tree: Dict representing the nested filter structure.
        page: int, the page number (1-indexed)
        per_page: int, results per page

    Returns:
        Dict containing:
            - results: List of matching cases
            - pagination: Dict with pagination info
    """
    start_time = time.time()
    logger.info(f"Starting search with filter tree: {filter_tree}, page={page}, per_page={per_page}")

    session = get_db_session()
    try:
        def build_query_recursive(node: Dict, session: Session) -> Query:
            if 'strategy' in node:
                # Base case: This is a filter condition
                strategy_name = node['strategy']
                query_str = node['query']
                StrategyClass = SearchEngine.STRATEGY_MAP.get(strategy_name)
                if not StrategyClass:
                    logger.warning(f"Unknown strategy: {strategy_name}")
                    return None  # Or handle unknown strategy appropriately

                strategy = StrategyClass(query_str, page=1, per_page=999999999)
                query = strategy.build_query(session)

                if query is not None:
                    logger.info(f"Generated query for strategy '{strategy_name}': {query.statement.compile(compile_kwargs={'literal_binds': True})}")
                else:
                    logger.warning(f"Query generation failed for strategy: {strategy_name}")
                return query

            elif 'operator' in node and 'operands' in node:
                # Recursive case: This is a group of conditions
                operator = node['operator']
                operands = node['operands']

                if not operands:
                    return None

                subqueries = [build_query_recursive(op, session) for op in operands]
                subqueries = [sq for sq in subqueries if sq is not None]  # Filter out None queries

                if not subqueries:
                    return None

                if operator == 'AND':
                    # Use the base_query to maintain all original columns
                    combined_query = base_query(session)
                    # Filter the base query by serial numbers from each subquery
                    for sq in subqueries:
                        # Convert to subquery before using with_only_columns
                        serial_number_subquery = sq.with_entities(CaseFile.serial_number).subquery()
                        combined_query = combined_query.filter(CaseFile.serial_number.in_(serial_number_subquery))
                    return combined_query
                elif operator == 'OR':
                    # Instead of joining, perform the filtering logic in a WHERE clause of a new query.
                    # Create a list of conditions based on the serial numbers from each subquery
                    or_conditions = [CaseFile.serial_number.in_(sq.with_entities(CaseFile.serial_number).subquery()) for sq in subqueries]

                    # Use the base_query and filter it with the OR conditions
                    combined_query = base_query(session).filter(or_(*or_conditions))

                    return combined_query
                else:
                    logger.warning(f"Unknown operator: {operator}")
                    return None
            else:
                logger.error(f"Invalid filter tree node: {node}")
                return None

        # Handle empty filter tree case
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

        # Start the recursive query building process
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

        # Count total results for pagination (before applying limit and offset)
        query_start = time.time()
        total_count = final_query.count()
        total_pages = (total_count + per_page - 1) // per_page
        logger.info(f"Total results before pagination: {total_count}")

        # Apply pagination
        offset = (page - 1) * per_page

        # Select the necessary columns and apply pagination directly
        final_results_query = final_query.add_columns(
            CaseFile.serial_number,
            CaseFile.registration_number,
            CaseFileHeader.mark_identification,
            CaseFileHeader.status_code,
            CaseFileHeader.filing_date,
            CaseFileHeader.registration_date,
            CaseFileHeader.attorney_name
        ).order_by(CaseFileHeader.filing_date.desc()).limit(per_page).offset(offset)

        # Print the final query SQL before execution
        logger.info(f"Final query SQL: {str(final_results_query.statement.compile(compile_kwargs={'literal_binds': True}))}")

        # Execute and format results
        results = []
        for row in final_results_query.all():
            results.append({
                'serial_number': row.serial_number,
                'registration_number': row.registration_number,
                'mark_identification': row.mark_identification,
                'status_code': row.status_code,
                'filing_date': str(row.filing_date) if row.filing_date else None,
                'registration_date': str(row.registration_date) if row.registration_date else None,
                'attorney_name': row.attorney_name
            })

        query_time = time.time() - query_start
        total_time = time.time() - start_time
        logger.info(f"Query executed in {query_time:.2f}s, total processing time: {total_time:.2f}s")

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