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
    DisclaimerStatementsSearchStrategy,
    DescriptionOfMarkSearchStrategy,
    OwnerNameSearchStrategy,
    DBASearchStrategy,
    NameChangeSearchStrategy,
    FilingDateSearchStrategy,
    ForeignFilingDateSearchStrategy,
    InternationalRegistrationNumberSearchStrategy,
    InternationalRegistrationDateSearchStrategy,
    InternationalPublicationDateSearchStrategy,
    AutoProtectionDateSearchStrategy,
    InternationalStatusCodeSearchStrategy,
    PriorityClaimedSearchStrategy,
    FirstRefusalSearchStrategy,
    DrawingCodeTypeSearchStrategy,
    ColorDrawingSearchStrategy,
    ThreeDDrawingSearchStrategy,
    PublishedOppositionDateSearchStrategy,
    PriorRegistrationPresentSearchStrategy,
    RegistrationDateSearchStrategy,
    ForeignRegistrationDateSearchStrategy,
    RenewalDateSearchStrategy,
    InternationalRenewalDateSearchStrategy,
    ForeignRenewalDateSearchStrategy,
    StandardCharacterClaimSearchStrategy,
    AcquiredDistinctivenessWholeSearchStrategy,
    AcquiredDistinctivenessPartSearchStrategy,
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
        'disclaimer_statements': DisclaimerStatementsSearchStrategy,
        'description_of_mark': DescriptionOfMarkSearchStrategy,
        'owner_name': OwnerNameSearchStrategy,
        'dba_name': DBASearchStrategy,
        'name_change': NameChangeSearchStrategy,
        'filing_date': FilingDateSearchStrategy,
        'foreign_filing_date': ForeignFilingDateSearchStrategy,
        'int_reg_number': InternationalRegistrationNumberSearchStrategy,
        'int_reg_date': InternationalRegistrationDateSearchStrategy,
        'int_pub_date': InternationalPublicationDateSearchStrategy,
        'auto_protection_date': AutoProtectionDateSearchStrategy,
        'int_status_code': InternationalStatusCodeSearchStrategy,
        'priority_claimed': PriorityClaimedSearchStrategy,
        'first_refusal': FirstRefusalSearchStrategy,
        'drawing_code_type': DrawingCodeTypeSearchStrategy,
        'color_drawing': ColorDrawingSearchStrategy,
        'three_d_drawing': ThreeDDrawingSearchStrategy,
        'design_code': DesignSearchCodeStrategy,
        'published_opposition_date': PublishedOppositionDateSearchStrategy,
        'prior_registration_present': PriorRegistrationPresentSearchStrategy,
        'registration_date': RegistrationDateSearchStrategy,
        'foreign_registration_date': ForeignRegistrationDateSearchStrategy,
        'renewal_date': RenewalDateSearchStrategy,
        'international_renewal_date': InternationalRenewalDateSearchStrategy,
        'foreign_renewal_date': ForeignRenewalDateSearchStrategy,
        'standard_character_claim': StandardCharacterClaimSearchStrategy,
        'acquired_distinctiveness_whole': AcquiredDistinctivenessWholeSearchStrategy,
        'acquired_distinctiveness_part': AcquiredDistinctivenessPartSearchStrategy,
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