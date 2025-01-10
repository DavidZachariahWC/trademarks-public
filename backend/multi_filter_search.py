# multi_filter_search.py
from typing import List, Dict, Any
import logging
import time
from sqlalchemy import union, intersect, text
from sqlalchemy.orm import Session
from models import CaseFile, CaseFileHeader
from search_engine import SearchEngine
from db_utils import get_db_session

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

def multi_filter_search(conditions: List[Dict[str, Any]], page: int = 1, per_page: int = 10, logic_operator: str = 'OR') -> Dict[str, Any]:
    """
    Combine multiple search conditions using CTEs.
    
    Args:
        conditions: List of dicts, each containing:
            - strategy: str, the search strategy name
            - query: str, the search query
            - operator: str, optional, 'AND' or 'OR' (defaults to top-level logic_operator)
        page: int, the page number (1-indexed)
        per_page: int, results per page
        logic_operator: str, 'AND' or 'OR', applied to entire set if not specified per condition
    
    Returns:
        Dict containing:
            - results: List of matching cases
            - pagination: Dict with pagination info
    """
    start_time = time.time()
    logger.info(f"Starting search with {len(conditions)} conditions, page={page}, per_page={per_page}")
    
    session = get_db_session()
    try:
        # Build subqueries for each condition
        subqueries = []
        for i, condition in enumerate(conditions):
            strategy_name = condition.get('strategy')
            query_str = condition.get('query', '')
            logger.info(f"Processing condition {i+1}: strategy={strategy_name}, query={query_str}")
            
            # Get the strategy class from our existing SearchEngine
            StrategyClass = SearchEngine.STRATEGY_MAP.get(strategy_name)
            if not StrategyClass:
                logger.warning(f"Unknown strategy: {strategy_name}")
                continue
                
            # Initialize strategy with query but disable pagination
            strategy = StrategyClass(query_str, page=1, per_page=999999999)
            
            # Build the base query
            subq = strategy.build_query(session)
            
            # Extract just the serial_number for combining
            subq_serials = subq.with_entities(CaseFile.serial_number.label('serial_number'))
            subqueries.append(subq_serials)
            logger.debug(f"Built subquery for condition {i+1}")
            
        if not subqueries:
            logger.warning("No valid subqueries generated")
            return {
                'results': [],
                'pagination': {
                    'current_page': page,
                    'total_pages': 0,
                    'total_results': 0,
                    'per_page': per_page
                }
            }
            
        # Combine subqueries using the specified logic operator
        logger.debug("Starting query combination")
        combined_query = subqueries[0]
        for i, subq in enumerate(subqueries[1:], 1):
            if logic_operator.upper() == 'AND':
                combined_query = combined_query.intersect(subq)
            else:  # OR
                combined_query = combined_query.union(subq)
            logger.debug(f"Combined query {i+1} with operator {logic_operator}")
                
        # Create CTE from combined serial numbers
        combined_cte = combined_query.cte('combined_serials')
        
        # Get total count for pagination
        count_start = time.time()
        count_query = session.query(text('COUNT(*)')).select_from(combined_cte)
        total_count = count_query.scalar() or 0
        logger.info(f"Found {total_count} total results in {time.time() - count_start:.2f}s")
        
        total_pages = (total_count + per_page - 1) // per_page
        offset = (page - 1) * per_page
        logger.debug(f"Pagination: page {page}/{total_pages}, offset={offset}, limit={per_page}")
        
        # Build final query joining back to get full case details
        query_start = time.time()
        final_query = (
            session.query(
                CaseFile.serial_number,
                CaseFile.registration_number,
                CaseFileHeader.mark_identification,
                CaseFileHeader.status_code,
                CaseFileHeader.filing_date,
                CaseFileHeader.registration_date,
                CaseFileHeader.attorney_name
            )
            .join(CaseFileHeader)
            .join(combined_cte, combined_cte.c.serial_number == CaseFile.serial_number)
            .order_by(CaseFileHeader.filing_date.desc())
        )
        
        # Apply pagination to final query
        final_query = final_query.limit(per_page).offset(offset)
        
        # Execute and format results
        results = []
        for row in final_query.all():
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
