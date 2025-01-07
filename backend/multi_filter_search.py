# multi_filter_search.py
from typing import List, Dict, Any
from sqlalchemy import union, intersect, text
from sqlalchemy.orm import Session
from models import CaseFile, CaseFileHeader
from search_engine import SearchEngine
from db_utils import get_db_session

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
    session = get_db_session()
    try:
        # Build subqueries for each condition
        subqueries = []
        for condition in conditions:
            strategy_name = condition.get('strategy')
            query_str = condition.get('query', '')
            
            # Get the strategy class from our existing SearchEngine
            StrategyClass = SearchEngine.STRATEGY_MAP.get(strategy_name)
            if not StrategyClass:
                continue
                
            # Initialize strategy with query but disable pagination
            strategy = StrategyClass(query_str, page=1, per_page=999999999)
            
            # Build the base query
            subq = strategy.build_query(session)
            
            # Extract just the serial_number for combining
            subq_serials = subq.with_entities(CaseFile.serial_number.label('serial_number'))
            subqueries.append(subq_serials)
            
        if not subqueries:
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
        combined_query = subqueries[0]
        for subq in subqueries[1:]:
            if logic_operator.upper() == 'AND':
                combined_query = combined_query.intersect(subq)
            else:  # OR
                combined_query = combined_query.union(subq)
                
        # Create CTE from combined serial numbers
        combined_cte = combined_query.cte('combined_serials')
        
        # Build final query joining back to get full case details
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
        
        # Get total count for pagination
        count_query = session.query(text('COUNT(*)')).select_from(combined_cte)
        total_count = count_query.scalar() or 0
        total_pages = (total_count + per_page - 1) // per_page
        
        # Apply pagination to final query
        offset = (page - 1) * per_page
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
            
        return {
            'results': results,
            'pagination': {
                'current_page': page,
                'total_pages': total_pages,
                'total_results': total_count,
                'per_page': per_page
            }
        }
        
    finally:
        session.close()
