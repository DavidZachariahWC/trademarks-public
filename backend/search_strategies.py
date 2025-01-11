# search_strategies.py
from enum import Enum
from typing import List, Tuple, Optional, Dict, Any, Type
from sqlalchemy import func, case, and_, or_, text, cast, Boolean, literal, String
from sqlalchemy.orm import Session
from models import CaseFile, CaseFileHeader, Classification, DesignSearch, CaseFileStatement, Owner, ForeignApplication, InternationalRegistration, PriorRegistrationApplication
from db_utils import get_db_session, create_soundex_array, base_query
from sqlalchemy.dialects.postgresql import ARRAY, TEXT as PgText
from coordinated_class_config import COORDINATED_CLASS_CONFIG
from datetime import datetime

class LogicOperator(Enum):
    AND = 'AND'
    OR = 'OR'

class SearchCondition:
    def __init__(self, strategy: 'BaseSearchStrategy', operator: Optional[LogicOperator] = None):
        self.strategy = strategy
        self.operator = operator

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        """Get filters and scoring expressions for this condition"""
        return self.strategy.get_filters_and_scoring()

class BaseSearchStrategy:
    def __init__(self, query: str, page: int = 1, per_page: int = 10):
        self.query_str = query.strip()
        self.page = page
        self.per_page = per_page

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        """Returns ([filter conditions], [scoring columns])"""
        raise NotImplementedError

    def build_query(self, session: Session):
        """Build the complete query with filters and scoring"""
        filters, scoring = self.get_filters_and_scoring()
        query = base_query(session)
        
        if filters:
            query = query.filter(*filters)
        
        for score_col in scoring:
            query = query.add_columns(score_col)
            
        return query

    def count_query(self, session: Session):
        """Build query to count total matching rows"""
        filters, _ = self.get_filters_and_scoring()
        return session.query(func.count(CaseFile.serial_number)).join(CaseFileHeader).filter(*filters)

    def execute(self) -> Dict[str, Any]:
        """Execute the search and return results with pagination"""
        session = get_db_session()
        try:
            # Get total count
            total_count = self.count_query(session).scalar()
            
            # Get paginated results
            query = self.build_query(session)
            offset = (self.page - 1) * self.per_page
            results = query.limit(self.per_page).offset(offset).all()
            
            # Calculate pagination info
            total_pages = (total_count + self.per_page - 1) // self.per_page
            
            # Convert results to dictionaries using _mapping
            result_dicts = [dict(r._mapping) for r in results]
            
            return {
                'results': result_dicts,
                'pagination': {
                    'current_page': self.page,
                    'total_pages': total_pages,
                    'total_results': total_count,
                    'per_page': self.per_page
                }
            }
        finally:
            session.close()

class WordmarkSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        # Filters
        filters = [
            or_(
                func.similarity(CaseFileHeader.mark_identification, self.query_str) > 0.3,
                func.lower(CaseFileHeader.mark_identification).like(func.lower(f"%{self.query_str}%"))
            )
        ]
        
        # Scoring expressions
        similarity_score = (func.similarity(CaseFileHeader.mark_identification, self.query_str) * 100).label('similarity_score')
        
        match_quality = case(
            (func.similarity(CaseFileHeader.mark_identification, self.query_str) >= 0.8, 'Very High'),
            (func.similarity(CaseFileHeader.mark_identification, self.query_str) >= 0.6, 'High'),
            (func.similarity(CaseFileHeader.mark_identification, self.query_str) >= 0.4, 'Medium'),
            else_='Low'
        ).label('match_quality')
        
        return filters, [similarity_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        _, scoring = self.get_filters_and_scoring()
        similarity_score = scoring[0]  # First scoring expression is similarity_score
        return query

class PhoneticSearchStrategy(BaseSearchStrategy):
    def __init__(self, query: str, page: int = 1, per_page: int = 10):
        super().__init__(query, page, per_page)
        self.query_soundex = create_soundex_array(self.query_str)

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        # Create the overlap condition
        overlap_condition = CaseFileHeader.mark_identification_soundex.overlap(self.query_soundex)
        
        # Create a subquery to calculate the match count
        subq = text("""
            (SELECT CAST(COUNT(*) AS FLOAT) 
             FROM unnest(:query_soundex) q_soundex 
             WHERE q_soundex = ANY(mark_identification_soundex)) / 
            GREATEST(array_length(:query_soundex, 1), 
                    array_length(mark_identification_soundex, 1))
        """).bindparams(query_soundex=self.query_soundex)
        
        # Create the phonetic score expression
        phonetic_score = (func.coalesce(subq, 0.0) * 100.0).label('phonetic_score')
        
        # Filters - only include results where arrays overlap
        filters = [overlap_condition]
        
        # Match quality based on the phonetic_score
        match_quality = case(
            (phonetic_score >= 80, 'Very High'),
            (phonetic_score >= 60, 'High'),
            (phonetic_score >= 40, 'Medium'),
            else_='Low'
        ).label('match_quality')
        
        return filters, [phonetic_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        _, scoring = self.get_filters_and_scoring()
        phonetic_score = scoring[0]  # First scoring expression is phonetic_score
        
        # Filter results with score > 35%
        query = query.filter(phonetic_score > 35)
        return query

# class CombinedSearchStrategy(BaseSearchStrategy):
#     def __init__(self, query: str, page: int = 1, per_page: int = 10):
#         super().__init__(query, page, per_page)
#         self.query_soundex = create_soundex_array(self.query_str)
# 
#     def get_filters_and_scoring(self) -> Tuple[List, List]:
#         # Get individual strategy scores
#         word_filters, word_scoring = WordmarkSearchStrategy(self.query_str).get_filters_and_scoring()
#         phon_filters, phon_scoring = PhoneticSearchStrategy(self.query_str).get_filters_and_scoring()
#         
#         # Combine filters with OR
#         filters = [or_(*word_filters, *phon_filters)]
#         
#         # Calculate combined score
#         similarity_score = word_scoring[0]
#         phonetic_score = phon_scoring[0]
#         
#         combined_score = ((func.coalesce(similarity_score, 0) + 
#                           func.coalesce(phonetic_score, 0)) / 2).label('combined_score')
#         
#         match_quality = case(
#             (combined_score >= 80, 'Very High'),
#             (combined_score >= 60, 'High'),
#             (combined_score >= 40, 'Medium'),
#             else_='Low'
#         ).label('match_quality')
#         
#         return filters, [similarity_score, phonetic_score, combined_score, match_quality]
# 
#     def build_query(self, session: Session):
#         query = super().build_query(session)
#         _, scoring = self.get_filters_and_scoring()
#         combined_score = scoring[2]  # Third scoring expression is combined_score
#         return query.order_by(combined_score.desc())

class Section12cSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.section_12c_in == True]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class Section8SearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.section_8_filed_in == True]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class Section15SearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.section_15_filed_in == True]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class AttorneySearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        # Handle potential special characters in the query
        escaped_query = self.query_str.replace("'", "''")
        
        filters = [
            CaseFileHeader.attorney_name.isnot(None),  # Ensure attorney_name is not null
            or_(
                func.similarity(func.coalesce(CaseFileHeader.attorney_name, ''), escaped_query) > 0.3,
                func.lower(func.coalesce(CaseFileHeader.attorney_name, '')).like(func.lower(f"%{escaped_query}%"))
            )
        ]
        
        # Calculate similarity score for attorney name matches
        similarity_score = (func.similarity(func.coalesce(CaseFileHeader.attorney_name, ''), escaped_query) * 100).label('similarity_score')
        
        match_quality = case(
            (func.similarity(func.coalesce(CaseFileHeader.attorney_name, ''), escaped_query) >= 0.8, 'Very High'),
            (func.similarity(func.coalesce(CaseFileHeader.attorney_name, ''), escaped_query) >= 0.6, 'High'),
            (func.similarity(func.coalesce(CaseFileHeader.attorney_name, ''), escaped_query) >= 0.4, 'Medium'),
            else_='Low'
        ).label('match_quality')
        
        return filters, [similarity_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        _, scoring = self.get_filters_and_scoring()
        for score_col in scoring:
            query = query.add_columns(score_col)
        return query

class ForeignPriorityClaimSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [
            or_(
                CaseFileHeader.filing_basis_current_44d_in == True,
                CaseFileHeader.amended_to_44d_application_in == True,
                CaseFileHeader.filing_basis_filed_as_44d_in == True
            )
        ]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class ForeignRegistrationSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [
            or_(
                CaseFileHeader.filing_basis_filed_as_44e_in == True,
                CaseFileHeader.amended_to_44e_application_in == True,
                CaseFileHeader.filing_basis_current_44e_in == True
            )
        ]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class ExtensionProtectionSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [
            or_(
                CaseFileHeader.filing_basis_filed_as_66a_in == True,
                CaseFileHeader.filing_basis_current_66a_in == True
            )
        ]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class NoCurrentBasisSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.filing_current_no_basis_in == True]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class NoInitialBasisSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.without_basis_currently_in == True]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class InternationalClassSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [Classification.international_code == self.query_str]
        return filters, []  # No scoring needed for exact matches

    def build_query(self, session: Session):
        query = (session.query(
            CaseFile.serial_number,
            CaseFile.registration_number,
            CaseFileHeader.mark_identification,
            CaseFileHeader.status_code,
            CaseFileHeader.filing_date,
            CaseFileHeader.registration_date,
            CaseFileHeader.attorney_name,
            Classification.international_code
        )
        .join(CaseFileHeader)
        .join(Classification))
        
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
            
        return query

class USClassSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [Classification.us_code == self.query_str]
        return filters, []  # No scoring needed for exact matches

    def build_query(self, session: Session):
        query = (session.query(
            CaseFile.serial_number,
            CaseFile.registration_number,
            CaseFileHeader.mark_identification,
            CaseFileHeader.status_code,
            CaseFileHeader.filing_date,
            CaseFileHeader.registration_date,
            CaseFileHeader.attorney_name,
            Classification.us_code
        )
        .join(CaseFileHeader)
        .join(Classification))
        
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
            
        return query

class CoordinatedClassSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        # We'll handle filters differently in build_query, so just return empty here
        return [], []

    def build_query(self, session: Session):
        # Get the config set
        config = COORDINATED_CLASS_CONFIG.get(self.query_str)
        if not config:
            # Return zero results if invalid
            return session.query(
                CaseFile.serial_number,
                CaseFile.registration_number,
                CaseFileHeader.mark_identification,
                CaseFileHeader.status_code,
                CaseFileHeader.filing_date,
                CaseFileHeader.registration_date,
                CaseFileHeader.attorney_name,
                Classification.international_code,
                Classification.us_code
            ).filter(text('1=0'))

        # Subquery #1: serials with at least one row matching international_code
        subq_intl = (
            session.query(Classification.serial_number)
            .filter(Classification.international_code.in_(config['intl_classes']))
        )

        # Subquery #2: serials with at least one row matching us_code
        subq_us = (
            session.query(Classification.serial_number)
            .filter(Classification.us_code.in_(config['us_classes']))
        )

        # We want cases that appear in both sets (meaning they have at least one row with each match)
        intersect_subq = subq_intl.intersect(subq_us)

        # Use these serials to get the main data
        query = (
            session.query(
                CaseFile.serial_number,
                CaseFile.registration_number,
                CaseFileHeader.mark_identification,
                CaseFileHeader.status_code,
                CaseFileHeader.filing_date,
                CaseFileHeader.registration_date,
                CaseFileHeader.attorney_name,
                Classification.international_code,
                Classification.us_code
            )
            .join(CaseFileHeader)
            .join(Classification)
            .filter(CaseFile.serial_number.in_(intersect_subq))
        )
        return query

    def count_query(self, session: Session):
        config = COORDINATED_CLASS_CONFIG.get(self.query_str)
        if not config:
            # Return zero results if invalid
            return session.query(func.count(CaseFile.serial_number)).filter(text('1=0'))
        
        subq_intl = session.query(Classification.serial_number).filter(
            Classification.international_code.in_(config['intl_classes'])
        )
        subq_us = session.query(Classification.serial_number).filter(
            Classification.us_code.in_(config['us_classes'])
        )
        intersect_subq = subq_intl.intersect(subq_us)

        return (
            session.query(func.count(func.distinct(CaseFile.serial_number)))
            .join(CaseFileHeader)
            .join(Classification)
            .filter(CaseFile.serial_number.in_(intersect_subq))
        )

class CancellationDateSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            # Convert string date to datetime
            search_date = datetime.strptime(self.query_str, '%Y-%m-%d').date()
            filters = [CaseFileHeader.cancellation_date == search_date]
            return filters, []  # No scoring needed for exact date match
        except ValueError:
            # Return no results if date format is invalid
            return [False], []

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class ChangeRegistrationSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.change_registration_in == True]
        return filters, []  # No scoring needed for exact match

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class ConcurrentUseSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.concurrent_use_in == True]
        return filters, []  # No scoring needed for exact match

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class ConcurrentUseProceedingSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.concurrent_use_proceeding_in == True]
        return filters, []  # No scoring needed for exact match

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class DesignSearchCodeStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            search_code = int(self.query_str)  # Design codes should be integers
            filters = [DesignSearch.design_search_code == search_code]
            return filters, []  # No scoring needed for exact match
        except ValueError:
            return [False], []

    def build_query(self, session: Session):
        query = (session.query(
            CaseFile.serial_number,
            CaseFile.registration_number,
            CaseFileHeader.mark_identification,
            CaseFileHeader.status_code,
            CaseFileHeader.filing_date,
            CaseFileHeader.registration_date,
            CaseFileHeader.attorney_name,
            DesignSearch.design_search_code
        )
        .join(CaseFileHeader)
        .join(DesignSearch))
        
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
            
        return query

class DisclaimerStatementsSearchStrategy(BaseSearchStrategy):
    """
    Implements a 'Disclaimer Statements' filter:
     - For rows where type_code = 'D00000', only compare the substring inside double quotes.
     - For rows where type_code = 'D10000', compare the entire statement_text.
     - In both cases, we do similarity(...) and a LIKE check.
    """
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        # Extract text inside double quotes for D00000
        extracted_text = func.substring(
            CaseFileStatement.statement_text,
            text("'\"([^\"]+)\"'")  # Properly quoted pattern for Postgres
        )

        # D00000 condition: use extracted text
        d00000_similarity = (func.similarity(
            func.coalesce(extracted_text, ''),
            self.query_str
        ) * 100)  # Multiply by 100 to get percentage

        d00000_condition = and_(
            CaseFileStatement.type_code == 'D00000',
            or_(
                d00000_similarity > 30,  # Changed from 0.3 to 30 since we're using percentage now
                func.lower(func.coalesce(extracted_text, '')).like(func.lower(f"%{self.query_str}%"))
            )
        )

        # D10000 condition: use entire statement_text
        d10000_similarity = (func.similarity(
            func.coalesce(CaseFileStatement.statement_text, ''),
            self.query_str
        ) * 100)  # Multiply by 100 to get percentage

        d10000_condition = and_(
            CaseFileStatement.type_code == 'D10000',
            or_(
                d10000_similarity > 30,  # Changed from 0.3 to 30 since we're using percentage now
                func.lower(func.coalesce(CaseFileStatement.statement_text, '')).like(func.lower(f"%{self.query_str}%"))
            )
        )

        # Combine conditions
        filters = [or_(d00000_condition, d10000_condition)]

        # Combined similarity score for ordering
        combined_similarity = func.greatest(d00000_similarity, d10000_similarity).label('similarity_score')

        match_quality = case(
            (combined_similarity >= 80, 'Very High'),  # Changed thresholds to match percentage scale
            (combined_similarity >= 60, 'High'),
            (combined_similarity >= 40, 'Medium'),
            else_='Low'
        ).label('match_quality')

        return filters, [combined_similarity, match_quality]

    def build_query(self, session: Session):
        filters, scoring = self.get_filters_and_scoring()

        query = (
            session.query(
                CaseFile.serial_number,
                CaseFile.registration_number,
                CaseFileHeader.mark_identification,
                CaseFileHeader.status_code,
                CaseFileHeader.filing_date,
                CaseFileHeader.registration_date,
                CaseFileHeader.attorney_name,
                CaseFileStatement.type_code,
                CaseFileStatement.statement_text
            )
            .join(CaseFileHeader)
            .join(CaseFileStatement)
        )

        if filters:
            query = query.filter(*filters)
        
        for score_col in scoring:
            query = query.add_columns(score_col)

        similarity_score = scoring[0]
        return query

    def count_query(self, session: Session):
        filters, _ = self.get_filters_and_scoring()
        return (
            session.query(func.count(func.distinct(CaseFile.serial_number)))
            .join(CaseFileHeader)
            .join(CaseFileStatement)
            .filter(*filters)
        )

class DescriptionOfMarkSearchStrategy(BaseSearchStrategy):
    """
    Implements a 'Description of Mark' filter:
     - Searches statements where type_code = 'DM0000'
     - Uses similarity scoring on the entire statement_text
    """
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        # Calculate similarity score for the entire statement text
        similarity_score = (func.similarity(
            func.coalesce(CaseFileStatement.statement_text, ''),
            self.query_str
        ) * 100).label('similarity_score')  # Multiply by 100 for percentage

        # Create the filter condition
        filters = [
            and_(
                CaseFileStatement.type_code == 'DM0000',
                or_(
                    similarity_score > 30,  # 30% similarity threshold
                    func.lower(CaseFileStatement.statement_text).like(func.lower(f"%{self.query_str}%"))
                )
            )
        ]

        # Define match quality based on similarity score
        match_quality = case(
            (similarity_score >= 80, 'Very High'),
            (similarity_score >= 60, 'High'),
            (similarity_score >= 40, 'Medium'),
            else_='Low'
        ).label('match_quality')

        return filters, [similarity_score, match_quality]

    def build_query(self, session: Session):
        filters, scoring = self.get_filters_and_scoring()

        query = (
            session.query(
                CaseFile.serial_number,
                CaseFile.registration_number,
                CaseFileHeader.mark_identification,
                CaseFileHeader.status_code,
                CaseFileHeader.filing_date,
                CaseFileHeader.registration_date,
                CaseFileHeader.attorney_name,
                CaseFileStatement.type_code,
                CaseFileStatement.statement_text
            )
            .join(CaseFileHeader)
            .join(CaseFileStatement)
        )

        if filters:
            query = query.filter(*filters)
        
        for score_col in scoring:
            query = query.add_columns(score_col)

        similarity_score = scoring[0]
        return query

    def count_query(self, session: Session):
        filters, _ = self.get_filters_and_scoring()
        return (
            session.query(func.count(func.distinct(CaseFile.serial_number)))
            .join(CaseFileHeader)
            .join(CaseFileStatement)
            .filter(*filters)
        )

class OwnerNameSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        # Handle potential special characters in the query
        escaped_query = self.query_str.replace("'", "''")
        
        filters = [
            Owner.party_name.isnot(None),  # Ensure party_name is not null
            or_(
                func.similarity(func.coalesce(Owner.party_name, ''), escaped_query) > 0.3,
                func.lower(func.coalesce(Owner.party_name, '')).like(func.lower(f"%{escaped_query}%"))
            )
        ]
        
        # Calculate similarity score for owner name matches
        similarity_score = (func.similarity(func.coalesce(Owner.party_name, ''), escaped_query) * 100).label('similarity_score')
        
        match_quality = case(
            (func.similarity(func.coalesce(Owner.party_name, ''), escaped_query) >= 0.8, 'Very High'),
            (func.similarity(func.coalesce(Owner.party_name, ''), escaped_query) >= 0.6, 'High'),
            (func.similarity(func.coalesce(Owner.party_name, ''), escaped_query) >= 0.4, 'Medium'),
            else_='Low'
        ).label('match_quality')
        
        return filters, [similarity_score, match_quality]

    def build_query(self, session: Session):
        query = (session.query(
            CaseFile.serial_number,
            CaseFile.registration_number,
            CaseFileHeader.mark_identification,
            CaseFileHeader.status_code,
            CaseFileHeader.filing_date,
            CaseFileHeader.registration_date,
            CaseFileHeader.attorney_name,
            Owner.party_name
        )
        .join(CaseFileHeader)
        .join(Owner))
        
        filters, scoring = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
            
        for score_col in scoring:
            query = query.add_columns(score_col)
            
        return query

class DBASearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        # Handle potential special characters in the query
        escaped_query = self.query_str.replace("'", "''")
        
        filters = [
            Owner.dba_aka_text.isnot(None),  # Ensure dba_aka_text is not null
            or_(
                func.similarity(func.coalesce(Owner.dba_aka_text, ''), escaped_query) > 0.3,
                func.lower(func.coalesce(Owner.dba_aka_text, '')).like(func.lower(f"%{escaped_query}%"))
            )
        ]
        
        # Calculate similarity score for DBA matches
        similarity_score = (func.similarity(func.coalesce(Owner.dba_aka_text, ''), escaped_query) * 100).label('similarity_score')
        
        match_quality = case(
            (func.similarity(func.coalesce(Owner.dba_aka_text, ''), escaped_query) >= 0.8, 'Very High'),
            (func.similarity(func.coalesce(Owner.dba_aka_text, ''), escaped_query) >= 0.6, 'High'),
            (func.similarity(func.coalesce(Owner.dba_aka_text, ''), escaped_query) >= 0.4, 'Medium'),
            else_='Low'
        ).label('match_quality')
        
        return filters, [similarity_score, match_quality]

    def build_query(self, session: Session):
        query = (session.query(
            CaseFile.serial_number,
            CaseFile.registration_number,
            CaseFileHeader.mark_identification,
            CaseFileHeader.status_code,
            CaseFileHeader.filing_date,
            CaseFileHeader.registration_date,
            CaseFileHeader.attorney_name,
            Owner.party_name,
            Owner.dba_aka_text
        )
        .join(CaseFileHeader)
        .join(Owner))
        
        filters, scoring = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
            
        for score_col in scoring:
            query = query.add_columns(score_col)
            
        return query

class NameChangeSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [
            Owner.name_change_explanation.isnot(None),
            Owner.name_change_explanation != ''
        ]
        return filters, []

    def build_query(self, session: Session):
        query = (session.query(
            CaseFile.serial_number,
            CaseFile.registration_number,
            CaseFileHeader.mark_identification,
            CaseFileHeader.status_code,
            CaseFileHeader.filing_date,
            CaseFileHeader.registration_date,
            CaseFileHeader.attorney_name,
            Owner.party_name,
            Owner.name_change_explanation
        )
        .join(CaseFileHeader)
        .join(Owner))
        
        filters, scoring = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
            
        return query

class FilingDateSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            # Convert string date to datetime
            search_date = datetime.strptime(self.query_str, '%Y-%m-%d').date()
            filters = [CaseFileHeader.filing_date == search_date]
            return filters, []  # No scoring needed for exact date match
        except ValueError:
            # Return no results if date format is invalid
            return [False], []

    def build_query(self, session: Session):
        query = base_query(session)
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
        return query

class ForeignFilingDateSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            # Convert string date to datetime
            search_date = datetime.strptime(self.query_str, '%Y-%m-%d').date()
            filters = [ForeignApplication.foreign_filing_date == search_date]
            return filters, []  # No scoring needed for exact date match
        except ValueError:
            # Return no results if date format is invalid
            return [False], []

    def build_query(self, session: Session):
        query = (session.query(
            CaseFile.serial_number,
            CaseFile.registration_number,
            CaseFileHeader.mark_identification,
            CaseFileHeader.status_code,
            CaseFileHeader.filing_date,
            CaseFileHeader.registration_date,
            CaseFileHeader.attorney_name,
            ForeignApplication.foreign_filing_date
        )
        .join(CaseFileHeader)
        .join(ForeignApplication))
        
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
        return query

class InternationalRegistrationNumberSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            # Convert to integer for exact match
            reg_number = int(self.query_str)
            filters = [InternationalRegistration.international_registration_number == reg_number]
            return filters, []
        except ValueError:
            # Return no results if number format is invalid
            return [False], []

    def build_query(self, session: Session):
        query = (session.query(
            CaseFile.serial_number,
            CaseFile.registration_number,
            CaseFileHeader.mark_identification,
            CaseFileHeader.status_code,
            CaseFileHeader.filing_date,
            CaseFileHeader.registration_date,
            CaseFileHeader.attorney_name,
            InternationalRegistration.international_registration_number
        )
        .join(CaseFileHeader)
        .join(InternationalRegistration))
        
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
        return query

class InternationalRegistrationDateSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            # Convert string date to datetime
            search_date = datetime.strptime(self.query_str, '%Y-%m-%d').date()
            filters = [InternationalRegistration.international_registration_date == search_date]
            return filters, []
        except ValueError:
            # Return no results if date format is invalid
            return [False], []

    def build_query(self, session: Session):
        query = (session.query(
            CaseFile.serial_number,
            CaseFile.registration_number,
            CaseFileHeader.mark_identification,
            CaseFileHeader.status_code,
            CaseFileHeader.filing_date,
            CaseFileHeader.registration_date,
            CaseFileHeader.attorney_name,
            InternationalRegistration.international_registration_date
        )
        .join(CaseFileHeader)
        .join(InternationalRegistration))
        
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
        return query

class InternationalPublicationDateSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            # Convert string date to datetime
            search_date = datetime.strptime(self.query_str, '%Y-%m-%d').date()
            filters = [InternationalRegistration.international_publication_date == search_date]
            return filters, []
        except ValueError:
            # Return no results if date format is invalid
            return [False], []

    def build_query(self, session: Session):
        query = (session.query(
            CaseFile.serial_number,
            CaseFile.registration_number,
            CaseFileHeader.mark_identification,
            CaseFileHeader.status_code,
            CaseFileHeader.filing_date,
            CaseFileHeader.registration_date,
            CaseFileHeader.attorney_name,
            InternationalRegistration.international_publication_date
        )
        .join(CaseFileHeader)
        .join(InternationalRegistration))
        
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
        return query

class AutoProtectionDateSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            # Convert string date to datetime
            search_date = datetime.strptime(self.query_str, '%Y-%m-%d').date()
            filters = [InternationalRegistration.auto_protection_date == search_date]
            return filters, []
        except ValueError:
            # Return no results if date format is invalid
            return [False], []

    def build_query(self, session: Session):
        query = (session.query(
            CaseFile.serial_number,
            CaseFile.registration_number,
            CaseFileHeader.mark_identification,
            CaseFileHeader.status_code,
            CaseFileHeader.filing_date,
            CaseFileHeader.registration_date,
            CaseFileHeader.attorney_name,
            InternationalRegistration.auto_protection_date
        )
        .join(CaseFileHeader)
        .join(InternationalRegistration))
        
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
        return query

class InternationalStatusCodeSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            # Convert to integer for exact match
            status_code = int(self.query_str)
            filters = [InternationalRegistration.international_status_code == status_code]
            return filters, []
        except ValueError:
            # Return no results if code format is invalid
            return [False], []

    def build_query(self, session: Session):
        query = (session.query(
            CaseFile.serial_number,
            CaseFile.registration_number,
            CaseFileHeader.mark_identification,
            CaseFileHeader.status_code,
            CaseFileHeader.filing_date,
            CaseFileHeader.registration_date,
            CaseFileHeader.attorney_name,
            InternationalRegistration.international_status_code
        )
        .join(CaseFileHeader)
        .join(InternationalRegistration))
        
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
        return query

class PriorityClaimedSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [InternationalRegistration.priority_claimed_in == True]
        return filters, []

    def build_query(self, session: Session):
        query = (session.query(
            CaseFile.serial_number,
            CaseFile.registration_number,
            CaseFileHeader.mark_identification,
            CaseFileHeader.status_code,
            CaseFileHeader.filing_date,
            CaseFileHeader.registration_date,
            CaseFileHeader.attorney_name,
            InternationalRegistration.priority_claimed_in
        )
        .join(CaseFileHeader)
        .join(InternationalRegistration))
        
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
        return query

class FirstRefusalSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [InternationalRegistration.first_refusal_in == True]
        return filters, []

    def build_query(self, session: Session):
        query = (session.query(
            CaseFile.serial_number,
            CaseFile.registration_number,
            CaseFileHeader.mark_identification,
            CaseFileHeader.status_code,
            CaseFileHeader.filing_date,
            CaseFileHeader.registration_date,
            CaseFileHeader.attorney_name,
            InternationalRegistration.first_refusal_in
        )
        .join(CaseFileHeader)
        .join(InternationalRegistration))
        
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
        return query

class DrawingCodeTypeSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            drawing_code_type = int(self.query_str)
            if drawing_code_type not in range(7):
                return [False], []
                
            filters = [
                func.substr(cast(CaseFileHeader.mark_drawing_code, String), 1, 1) == str(drawing_code_type)
            ]
            return filters, []
        except ValueError:
            return [False], []

    def build_query(self, session: Session):
        query = base_query(session)
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
        return query

class ColorDrawingSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.color_drawing_current_in == True]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class ThreeDDrawingSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.drawing_3d_current_in == True]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class PublishedOppositionDateSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            # Query string should be in format "YYYY-MM-DD,YYYY-MM-DD"
            start_date_str, end_date_str = self.query_str.split(',')
            
            # Convert dates from YYYY-MM-DD to datetime objects
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            
            filters = [
                CaseFileHeader.published_for_opposition_date.between(start_date, end_date)
            ]
            return filters, []  # No scoring needed for date range
        except (ValueError, AttributeError):
            return [False], []  # Return no results if date format is invalid

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class PriorRegistrationPresentSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFile.prior_registrations.any()]  # Using the relationship to check existence
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = base_query(session)  # Using the standard base query
        
        # Add the prior registrations via the relationship
        query = query.join(CaseFile.prior_registrations)
        
        filters, scoring = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
            
        # Add the prior registration number to the results
        query = query.add_columns(PriorRegistrationApplication.number.label('prior_reg_number'))
            
        for score_col in scoring:
            query = query.add_columns(score_col)
            
        return query

class RegistrationDateSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            # Convert string date to datetime
            search_date = datetime.strptime(self.query_str, '%Y-%m-%d').date()
            filters = [CaseFileHeader.registration_date == search_date]
            return filters, []  # No scoring needed for exact date match
        except ValueError:
            # Return no results if date format is invalid
            return [False], []

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class ForeignRegistrationDateSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            # Convert string date to datetime
            search_date = datetime.strptime(self.query_str, '%Y-%m-%d').date()
            filters = [ForeignApplication.foreign_registration_date == search_date]
            return filters, []  # No scoring needed for exact date match
        except ValueError:
            # Return no results if date format is invalid
            return [False], []

    def build_query(self, session: Session):
        query = (session.query(
            CaseFile.serial_number,
            CaseFile.registration_number,
            CaseFileHeader.mark_identification,
            CaseFileHeader.status_code,
            CaseFileHeader.filing_date,
            CaseFileHeader.registration_date,
            CaseFileHeader.attorney_name,
            ForeignApplication.foreign_registration_date
        )
        .join(CaseFileHeader)
        .join(ForeignApplication))
        
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
            
        return query

class RenewalDateSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            search_date = datetime.strptime(self.query_str, '%Y-%m-%d').date()
            filters = [CaseFileHeader.renewal_date == search_date]
            return filters, []  # No scoring needed for exact date match
        except ValueError:
            return [False], []

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class InternationalRenewalDateSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            search_date = datetime.strptime(self.query_str, '%Y-%m-%d').date()
            filters = [CaseFile.international_registrations.any(
                InternationalRegistration.international_renewal_date == search_date
            )]
            return filters, []
        except ValueError:
            return [False], []

    def build_query(self, session: Session):
        query = base_query(session)
        query = query.join(CaseFile.international_registrations)
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
        return query

class ForeignRenewalDateSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            search_date = datetime.strptime(self.query_str, '%Y-%m-%d').date()
            filters = [CaseFile.foreign_applications.any(
                ForeignApplication.registration_renewal_date == search_date
            )]
            return filters, []
        except ValueError:
            return [False], []

    def build_query(self, session: Session):
        query = base_query(session)
        query = query.join(CaseFile.foreign_applications)
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
        return query

class StandardCharacterClaimSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.standard_characters_claimed_in == True]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class AcquiredDistinctivenessWholeSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.section_2f_in == True]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class AcquiredDistinctivenessPartSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.section_2f_in_part_in == True]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class SerialNumberSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFile.serial_number == self.query_str]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class RegistrationNumberSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFile.registration_number == self.query_str]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        return query

class AssignmentRecordedSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFile.statements.any(CaseFileStatement.type_code == '601')]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = base_query(session)
        query = query.join(CaseFile.statements)
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
        return query

class OwnerLegalEntitySearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        if len(self.query_str) != 2:  # Legal entity type code is always 2 digits
            return [False], []
            
        filters = [CaseFile.owners.any(Owner.legal_entity_type_code == self.query_str)]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = base_query(session)
        query = query.join(CaseFile.owners)
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
        return query

class OwnerPartyTypeSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFile.owners.any(Owner.party_type == self.query_str)]
        match_score = literal(100).label('match_score')
        match_quality = literal('High').label('match_quality')
        return filters, [match_score, match_quality]

    def build_query(self, session: Session):
        query = base_query(session)
        query = query.join(CaseFile.owners)
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
        return query

class PriorityDateRangeSearchStrategy(BaseSearchStrategy):
    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            # Query string should be in format "YYYY-MM-DD,YYYY-MM-DD"
            start_date_str, end_date_str = self.query_str.split(',')
            
            # Convert dates from YYYY-MM-DD to datetime objects
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            
            filters = [CaseFile.foreign_applications.any(and_(
                ForeignApplication.foreign_priority_claim_in == True,
                ForeignApplication.foreign_filing_date.between(start_date, end_date)
            ))]
            return filters, []
        except (ValueError, AttributeError):
            return [False], []

    def build_query(self, session: Session):
        query = base_query(session)
        query = query.join(CaseFile.foreign_applications)
        filters, _ = self.get_filters_and_scoring()
        if filters:
            query = query.filter(*filters)
        return query
