# search_engine.py
from typing import Dict, Any
from search_strategies import (
    WordmarkSearchStrategy, 
    PhoneticSearchStrategy, 
    BaseSearchStrategy,
    Section12cSearchStrategy,
    Section8SearchStrategy,
    Section15SearchStrategy,
    AttorneySearchStrategy,
    ForeignPriorityClaimSearchStrategy,
    ForeignRegistrationSearchStrategy,
    ExtensionProtectionSearchStrategy,
    NoCurrentBasisSearchStrategy,
    NoInitialBasisSearchStrategy,
    InternationalClassSearchStrategy,
    USClassSearchStrategy,
    CoordinatedClassSearchStrategy,
    CancellationDateSearchStrategy,
    ChangeRegistrationSearchStrategy,
    ConcurrentUseSearchStrategy,
    ConcurrentUseProceedingSearchStrategy,
    DesignSearchCodeStrategy,
    DisclaimerStatementsSearchStrategy
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
        'attorney': AttorneySearchStrategy,
        'foreign_priority': ForeignPriorityClaimSearchStrategy,
        'foreign_registration': ForeignRegistrationSearchStrategy,
        'extension_protection': ExtensionProtectionSearchStrategy,
        'no_current_basis': NoCurrentBasisSearchStrategy,
        'no_initial_basis': NoInitialBasisSearchStrategy,
        'international_class': InternationalClassSearchStrategy,
        'us_class': USClassSearchStrategy,
        'coordinated_class': CoordinatedClassSearchStrategy,
        'cancellation_date': CancellationDateSearchStrategy,
        'change_registration': ChangeRegistrationSearchStrategy,
        'concurrent_use': ConcurrentUseSearchStrategy,
        'concurrent_use_proceeding': ConcurrentUseProceedingSearchStrategy,
        'design_code': DesignSearchCodeStrategy,
        'disclaimer_statements': DisclaimerStatementsSearchStrategy
    }
    
    @classmethod
    def search(cls, query: str, search_type: str = 'wordmark', page: int = 1, per_page: int = 10) -> Dict[str, Any]:
        """
        Execute a search using specified strategy and advanced options
        """
        if search_type not in cls.STRATEGY_MAP:
            search_type = 'wordmark'
            strategy = cls.STRATEGY_MAP[search_type](query, page, per_page)
        else:
            strategy = cls.STRATEGY_MAP[search_type](query, page, per_page)
        
        return strategy.execute()