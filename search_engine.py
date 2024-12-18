# search_engine.py
from typing import Dict, Any
from search_strategies import (
    WordmarkSearchStrategy, 
    PhoneticSearchStrategy, 
    BaseSearchStrategy,
    Section12cSearchStrategy,
    Section8SearchStrategy,
    Section15SearchStrategy,
    AttorneySearchStrategy
)
from db_utils import get_db_session

class SearchEngine:
    """Search engine that coordinates different search strategies"""
    
    STRATEGY_MAP = {
        'wordmark': WordmarkSearchStrategy,
        'phonetic': PhoneticSearchStrategy,
        'section_12c': Section12cSearchStrategy,
        'section_8': Section8SearchStrategy,
        'section_15': Section15SearchStrategy,
        'attorney': AttorneySearchStrategy
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