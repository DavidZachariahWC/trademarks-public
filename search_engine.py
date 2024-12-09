# search_engine.py
from typing import Dict, Any
from search_strategies import (
    WordmarkSearchStrategy, 
    PhoneticSearchStrategy, 
    CombinedSearchStrategy,
    LogicBuilder,
    LogicOperator,
    BaseSearchStrategy
)
from db_utils import get_db_session

class SearchEngine:
    """Search engine that coordinates different search strategies"""
    
    STRATEGY_MAP = {
        'wordmark': WordmarkSearchStrategy,
        'phonetic': PhoneticSearchStrategy,
        'combined': CombinedSearchStrategy
    }
    
    @classmethod
    def search(cls, query: str, search_type: str = 'wordmark', page: int = 1, per_page: int = 10) -> Dict[str, Any]:
        """
        Execute a simple search using a single strategy
        
        Args:
            query: The search query string
            search_type: Type of search ('wordmark', 'phonetic', or 'combined')
            page: Page number for pagination
            per_page: Number of results per page
            
        Returns:
            Dictionary containing search results and pagination info
        """
        if search_type not in cls.STRATEGY_MAP:
            search_type = 'wordmark'
        
        strategy_class = cls.STRATEGY_MAP[search_type]
        strategy = strategy_class(query, page, per_page)
        return strategy.execute()
    
    @classmethod
    def build_search(cls) -> LogicBuilder:
        """
        Create a new logic builder for complex searches
        
        Returns:
            LogicBuilder instance for building complex searches
        """
        return LogicBuilder()
    
    @classmethod
    def create_strategy(cls, strategy_type: str, query: str) -> BaseSearchStrategy:
        """
        Create a strategy instance of the specified type
        
        Args:
            strategy_type: Type of search strategy to create
            query: The search query string
            
        Returns:
            Instance of the specified search strategy
            
        Raises:
            ValueError: If strategy_type is not recognized
        """
        if strategy_type not in cls.STRATEGY_MAP:
            raise ValueError(f"Unknown strategy type: {strategy_type}")
        
        strategy_class = cls.STRATEGY_MAP[strategy_type]
        return strategy_class(query)

    @classmethod
    def execute_complex_search(
        cls,
        builder: LogicBuilder,
        page: int = 1,
        per_page: int = 10
    ) -> Dict[str, Any]:
        """
        Execute a complex search using the logic builder
        
        Args:
            builder: LogicBuilder instance with search conditions
            page: Page number for pagination
            per_page: Number of results per page
            
        Returns:
            Dictionary containing search results and pagination info
            
        Raises:
            Exception: If there's an error executing the search
        """
        try:
            session = get_db_session()
            
            # Get count for pagination
            count_query = builder.count_query(session)
            total_count = count_query.scalar()

            # Execute main query
            query = builder.build_query(session, page, per_page)
            results = query.all()

            # Calculate pagination info
            total_pages = (total_count + per_page - 1) // per_page
            
            # Convert results to dictionaries using _mapping
            result_dicts = [dict(r._mapping) for r in results]
            
            return {
                'results': result_dicts,
                'pagination': {
                    'current_page': page,
                    'total_pages': total_pages,
                    'total_results': total_count,
                    'per_page': per_page
                }
            }
            
        except Exception as e:
            raise Exception(f"Complex search execution error: {str(e)}")
        
        finally:
            session.close() 