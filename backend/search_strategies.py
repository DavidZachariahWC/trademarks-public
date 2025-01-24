# search_strategies.py
from enum import Enum
from typing import List, Tuple, Optional, Dict, Any, Type
from sqlalchemy import func, case, and_, or_, text, cast, Boolean, literal, String, Text, select
from sqlalchemy.orm import Session
from models import CaseFile, CaseFileHeader, Classification, DesignSearch, CaseFileStatement, Owner, ForeignApplication, InternationalRegistration, PriorRegistrationApplication
from db_utils import get_db_session, create_soundex_array, base_query
from sqlalchemy.dialects.postgresql import ARRAY, TEXT as PgText
from coordinated_class_config import COORDINATED_CLASS_CONFIG
from datetime import datetime
from sqlalchemy.sql.elements import TextClause
from sqlalchemy.sql import text, and_, or_, select, case # redundant imports?

class LogicOperator(Enum):
    AND = 'AND'
    OR = 'OR'

class SearchCondition:
    def __init__(self, strategy: 'BaseSearchStrategy', operator: Optional[LogicOperator] = None):
        self.strategy = strategy
        self.operator = operator

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        """Get filters and scoring expressions for this condition."""
        return self.strategy.get_filters_and_scoring()

class BaseSearchStrategy:
    """
    Base class for all search strategies.
    - `get_filters_and_scoring` must return (filters, [score_column]) 
      where `filters` is a list of WHERE conditions, and `score_column` is
      either empty or a single ColumnElement representing a 0-100 score.
    - If no scoring is intended (presence/absence strategy), return an empty list for scoring.
    """
    is_scoring_strategy = False  # By default, assume no scoring

    def __init__(self, query: str, page: int = 1, per_page: int = 10):
        self.query_str = query.strip()
        self.page = page
        self.per_page = per_page

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        raise NotImplementedError

    def build_query(self, session: Session):
        """
        By default, build_query just applies the filter conditions. 
        **Do not** add the score columns here; we'll unify them in multi_filter_search.
        """
        filters, _scoring = self.get_filters_and_scoring()
        query = base_query(session)

        if filters:
            query = query.filter(*filters)

        return query

    def count_query(self, session: Session):
        """
        Counting how many rows match. No scoring columns needed here, just filters.
        """
        filters, _scoring = self.get_filters_and_scoring()
        return session.query(func.count(CaseFile.serial_number)).join(CaseFileHeader).filter(*filters)

    def execute(self) -> Dict[str, Any]:
        """Simple helper if someone wants to run a single strategy. Not changed."""
        session = get_db_session()
        try:
            total_count = self.count_query(session).scalar()
            query = self.build_query(session)
            offset = (self.page - 1) * self.per_page
            results = query.limit(self.per_page).offset(offset).all()

            total_pages = (total_count + self.per_page - 1) // self.per_page
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

#
# Scoring Strategies
#
class WordmarkSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = True  # This strategy produces a 0-100 similarity score

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [
            or_(
                func.similarity(CaseFileHeader.mark_identification, self.query_str) > 0.3,
                func.lower(CaseFileHeader.mark_identification).like(
                    func.lower(f"%{self.query_str}%")
                )
            )
        ]
        score = (func.similarity(CaseFileHeader.mark_identification, self.query_str) * 100).label('score')
        # "match_quality" is no longer used to unify scoring, so skip or keep it as a secondary column.
        return filters, [score]

class PhoneticSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = True  # This strategy produces a 0-100 phonetic score

    def __init__(self, query: str, page: int = 1, per_page: int = 10):
        super().__init__(query, page, per_page)
        # For example, create_soundex_array might produce the tokens
        self.query_soundex = create_soundex_array(self.query_str)

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        overlap_condition = CaseFileHeader.mark_identification_soundex.overlap(self.query_soundex)
        subq = text("""
            (SELECT CAST(COUNT(*) AS FLOAT) 
               FROM unnest(:query_soundex) q_soundex 
              WHERE q_soundex = ANY(mark_identification_soundex)) / 
            GREATEST(array_length(:query_soundex, 1), 
                     array_length(mark_identification_soundex, 1))
        """).bindparams(query_soundex=self.query_soundex)

        phonetic_score = (func.coalesce(subq, 0.0) * 100.0).label('score')

        # Filter out items with no overlap at all
        filters = [overlap_condition]

        return filters, [phonetic_score]

    def build_query(self, session: Session):
        # We still filter results that would yield a score <= 35
        query = super().build_query(session)
        # Because we want to enforce a minimum threshold for "relevance"
        # We'll re-create the same subq for the "score"
        subq = text("""
            (SELECT CAST(COUNT(*) AS FLOAT) 
               FROM unnest(:query_soundex) q_soundex 
              WHERE q_soundex = ANY(mark_identification_soundex)) / 
            GREATEST(array_length(:query_soundex, 1), 
                     array_length(mark_identification_soundex, 1))
        """).bindparams(query_soundex=self.query_soundex)
        phonetic_score = func.coalesce(subq, 0.0) * 100.0

        # Enforce a minimum 35% match
        query = query.filter(phonetic_score > 35)
        return query


#
# Presence/Absence Strategies (no scoring).
#
class Section12cSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False  # purely filter, no numeric score

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.section_12c_in == True]
        # No numeric score. Return empty list for scoring columns.
        return filters, []

class Section8FiledSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.section_8_filed_in == True]
        return filters, []

class Section8PartialAcceptSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.section_8_partial_accept_in == True]
        return filters, []

class Section8AcceptedSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self):
        filters = [CaseFileHeader.section_8_accepted_in == True]
        return filters, []

class Section15FiledSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self):
        filters = [CaseFileHeader.section_15_filed_in == True]
        return filters, []

class Section15AcknowledgedSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self):
        filters = [CaseFileHeader.section_15_acknowledged_in == True]
        return filters, []

class AttorneySearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = True  # text-based relevance => includes numeric score

    def get_filters_and_scoring(self):
        # Filter by similarity or LIKE on attorney_name
        filters = [
            or_(
                func.similarity(CaseFileHeader.attorney_name, self.query_str) > 0.3,
                func.lower(CaseFileHeader.attorney_name).like(func.lower(f"%{self.query_str}%"))
            )
        ]
        # Return a single unified score column
        score_col = (func.similarity(CaseFileHeader.attorney_name, self.query_str) * 100).label('score')

        return filters, [score_col]

#
# 1) Presence/Absence Strategies
#    They filter on certain columns == True, no numeric score.
#
class ForeignPriorityClaimSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self):
        # "Any of these columns == True" => pass
        filters = [
            or_(
                CaseFileHeader.filing_basis_current_44d_in == True,
                CaseFileHeader.amended_to_44d_application_in == True,
                CaseFileHeader.filing_basis_filed_as_44d_in == True
            )
        ]
        return filters, []


class ForeignRegistrationSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self):
        filters = [
            or_(
                CaseFileHeader.filing_basis_filed_as_44e_in == True,
                CaseFileHeader.amended_to_44e_application_in == True,
                CaseFileHeader.filing_basis_current_44e_in == True
            )
        ]
        return filters, []


class ExtensionProtectionSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self):
        filters = [
            or_(
                CaseFileHeader.filing_basis_filed_as_66a_in == True,
                CaseFileHeader.filing_basis_current_66a_in == True
            )
        ]
        return filters, []


class NoCurrentBasisSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self):
        filters = [CaseFileHeader.filing_current_no_basis_in == True]
        return filters, []


class NoInitialBasisSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self):
        filters = [CaseFileHeader.without_basis_currently_in == True]
        return filters, []


#
# 2) Classification-based Filters (no scoring).
#    Use subquery on Classification to filter CaseFile.serial_number.
#
class InternationalClassSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self):
        # We want all CaseFiles whose Classification.international_code == self.query_str
        subq = select(Classification.serial_number).where(Classification.international_code == self.query_str)
        filters = [CaseFile.serial_number.in_(subq)]
        return filters, []


class USClassSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self):
        # We want all CaseFiles whose Classification.us_code == self.query_str
        subq = select(Classification.serial_number).where(Classification.us_code == self.query_str)
        filters = [CaseFile.serial_number.in_(subq)]
        return filters, []


class CoordinatedClassSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False  # purely filters

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        config = COORDINATED_CLASS_CONFIG.get(self.query_str)
        if not config:
            return [False], []

        subq = select(Classification.serial_number).where(
            Classification.international_code.in_(config['intl_classes'])
        )
        filters = [CaseFile.serial_number.in_(subq)]
        return filters, []

##################################################
# 2) CancellationDateSearchStrategy
##################################################

class CancellationDateSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            start_date_str, end_date_str = self.query_str.split(' - ')
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            filters = [CaseFileHeader.cancellation_date.between(start_date, end_date)]
            return filters, []
        except (ValueError, IndexError):
            return [False], []

##################################################
# 3) ChangeRegistrationSearchStrategy
##################################################

class ChangeRegistrationSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.change_registration_in == True]
        return filters, []

##################################################
# 4) ConcurrentUseSearchStrategy
##################################################

class ConcurrentUseSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.concurrent_use_in == True]
        return filters, []

##################################################
# 5) ConcurrentUseProceedingSearchStrategy
##################################################

class ConcurrentUseProceedingSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.concurrent_use_proceeding_in == True]
        return filters, []

##################################################
# 6) DesignSearchCodeStrategy
##################################################

class DesignSearchCodeStrategy(BaseSearchStrategy):
    is_scoring_strategy = False  # treat as presence filter, not reordering

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        if len(self.query_str) != 6:
            return [False], []

        is_wildcard = self.query_str.endswith('XX')
        if is_wildcard:
            pattern_prefix = self.query_str[:4]
            subq = select(DesignSearch.serial_number).where(
                text("LPAD(CAST(design_search_code AS TEXT), 6, '0') LIKE :pattern")
            ).bindparams(pattern=f"{pattern_prefix}%")

            filters = [CaseFile.serial_number.in_(subq)]
            return filters, []
        else:
            subq = select(DesignSearch.serial_number).where(
                text("LPAD(CAST(design_search_code AS TEXT), 6, '0') = :code")
            ).bindparams(code=self.query_str)

            filters = [CaseFile.serial_number.in_(subq)]
            return filters, []

##################################################
# 7) DisclaimerStatementsSearchStrategy
##################################################

class DisclaimerStatementsSearchStrategy(BaseSearchStrategy):
    """
    Produces a filter that matches any CaseFileStatement with type_code 
    starting 'D0' (use substring-inside-quotes logic) or 'D1' (entire text logic),
    with a similarity > 30% or a LIKE match. 
    Returns a 0-100 "score" for ranking.
    """
    is_scoring_strategy = True  # we do text similarity => reordering

    def get_filters_and_scoring(self):

        # First 2 chars of type_code
        type_prefix = func.substr(CaseFileStatement.type_code, 1, 2)
        
        # 'D0' => treat like old "D00000"
        d0_similarity = (
            func.similarity(
                func.coalesce(
                    func.substring(CaseFileStatement.statement_text, text("'\"([^\"]+)\"'")),
                    ''
                ),
                self.query_str
            ) * 100
        )
        d0_condition = and_(
            type_prefix == 'D0',
            or_(
                d0_similarity > 30,
                func.lower(
                    func.coalesce(
                        func.substring(CaseFileStatement.statement_text, text("'\"([^\"]+)\"'")),
                        ''
                    )
                ).like(func.lower(f"%{self.query_str}%"))
            )
        )

        # 'D1' => treat like old "D10000"
        d1_similarity = (
            func.similarity(
                func.coalesce(CaseFileStatement.statement_text, ''),
                self.query_str
            ) * 100
        )
        d1_condition = and_(
            type_prefix == 'D1',
            or_(
                d1_similarity > 30,
                func.lower(
                    func.coalesce(CaseFileStatement.statement_text, '')
                ).like(func.lower(f"%{self.query_str}%"))
            )
        )

        # Combine them: any row with prefix 'D0' meeting the d0_condition 
        # OR prefix 'D1' meeting the d1_condition
        statement_filter = or_(d0_condition, d1_condition)

        # We'll build a subquery returning (serial_number, greatest(d0_similarity, d1_similarity))
        # so we don't cause a cartesian product in the main query.
        # We just choose the maximum of both similarities for the final "score".
        combined_similarity = func.greatest(d0_similarity, d1_similarity).label('score')

        subq = (
            select(
                CaseFileStatement.serial_number.label('sn'),
                combined_similarity
            )
            .where(statement_filter)
        ).subquery()

        # Final filter: any CaseFile whose serial_number is in the subquery
        filters = [CaseFile.serial_number.in_(select(subq.c.sn))]

        # The aggregator logic in multi_filter_search needs a numeric "score" column.
        score_col = subq.c.score  # subquery column

        # Optionally define a textual match_quality for display
        match_quality = case(
            (subq.c.score >= 80, 'Very High'),
            (subq.c.score >= 60, 'High'),
            (subq.c.score >= 40, 'Medium'),
            else_='Low'
        ).label('match_quality')

        return filters, [score_col, match_quality]

class DescriptionOfMarkSearchStrategy(BaseSearchStrategy):
    """
    'Description of Mark' filter:
      - Table: CaseFileStatement
      - type_code = 'DM0000'
      - Similarity-based 0-100 score on statement_text
    """
    is_scoring_strategy = True  # we produce a numeric score

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        # Local similarity expression (no .label yet)
        similarity_value = func.similarity(
            func.coalesce(CaseFileStatement.statement_text, ''),
            self.query_str
        ) * 100

        # The condition: type_code == 'DM0000' and (similarity>30 or LIKE)
        subq_for_filter = (
            select(CaseFileStatement.serial_number)
            .where(CaseFileStatement.type_code == 'DM0000')
            .where(
                or_(
                    similarity_value > 30,
                    func.lower(CaseFileStatement.statement_text).like(func.lower(f"%{self.query_str}%"))
                )
            )
        )

        # The filter references CaseFile via .in_(subq)
        filters = [CaseFile.serial_number.in_(subq_for_filter)]

        # Score column: label it 'score'
        score_col = similarity_value.label('score')

        # Optional debugging column for "High"/"Low"
        match_quality = case(
            (similarity_value >= 80, 'Very High'),
            (similarity_value >= 60, 'High'),
            (similarity_value >= 40, 'Medium'),
            else_='Low'
        ).label('match_quality')

        return filters, [score_col, match_quality]


class OwnerNameSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = True

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        escaped_query = self.query_str.replace("'", "''")

        # The local similarity expression:
        similarity_value = (
            func.similarity(
                func.coalesce(Owner.party_name, ''),
                escaped_query
            ) * 100
        )

        # 1) Build a subquery referencing only the "owner" table. 
        #    No mention of CaseFile => no cartesian product with CaseFileHeader.
        subq = (
            select(
                Owner.serial_number.label('sn'),
                similarity_value.label('score')
            )
            .where(Owner.party_name.isnot(None))
            .where(
                or_(
                    similarity_value > 30,
                    func.lower(func.coalesce(Owner.party_name, ''))
                       .like(func.lower(f"%{escaped_query}%"))
                )
            )
        ).subquery()

        # 2) The main filter: Only include CaseFiles whose serial_number is in subq
        filters = [CaseFile.serial_number.in_(select(subq.c.sn))]

        # 3) Return a single numeric score column from subq
        score_col = subq.c.score

        # Optional match_quality label for display (not used for ranking)
        match_quality = case(
            (subq.c.score >= 80, 'Very High'),
            (subq.c.score >= 60, 'High'),
            (subq.c.score >= 40, 'Medium'),
            else_='Low'
        ).label('match_quality')

        return filters, [score_col, match_quality]



class DBASearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = True

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        escaped_query = self.query_str.replace("'", "''")

        similarity_value = func.similarity(func.coalesce(Owner.dba_aka_text, ''), escaped_query) * 100

        # Subquery for filter
        subq_for_filter = (
            select(Owner.serial_number)
            .where(Owner.dba_aka_text.isnot(None))
            .where(
                or_(
                    similarity_value > 30,
                    func.lower(func.coalesce(Owner.dba_aka_text, '')).like(func.lower(f"%{escaped_query}%"))
                )
            )
        )

        filters = [CaseFile.serial_number.in_(subq_for_filter)]
        score_col = similarity_value.label("score")

        match_quality = case(
            (similarity_value >= 80, 'Very High'),
            (similarity_value >= 60, 'High'),
            (similarity_value >= 40, 'Medium'),
            else_='Low'
        ).label('match_quality')

        return filters, [score_col, match_quality]


class NameChangeSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False  # purely presence/absence

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        # We want owners whose name_change_explanation is not null/empty
        subq_for_filter = (
            select(Owner.serial_number)
            .where(Owner.name_change_explanation.isnot(None))
            .where(Owner.name_change_explanation != '')
        )

        filters = [CaseFile.serial_number.in_(subq_for_filter)]
        return filters, []


class FilingDateSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False  # purely date-range filter => no numeric ranking

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            # Expect the query string to look like: "YYYY-MM-DD - YYYY-MM-DD"
            start_date_str, end_date_str = self.query_str.split(' - ')
            
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            
            # Filter for filing_date between start_date and end_date (inclusive)
            filters = [CaseFileHeader.filing_date.between(start_date, end_date)]
            return filters, []
        except (ValueError, IndexError):
            # If the string isn't formatted correctly or parsing fails,
            # just return [False], meaning no matches
            return [False], []



class ForeignFilingDateSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False  # date match => no numeric ranking

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            start_date_str, end_date_str = self.query_str.split(' - ')
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            subq_for_filter = (
                select(ForeignApplication.serial_number)
                .where(ForeignApplication.foreign_filing_date.between(start_date, end_date))
            )
            filters = [CaseFile.serial_number.in_(subq_for_filter)]
            return filters, []
        except (ValueError, IndexError):
            return [False], []


class InternationalRegistrationNumberSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False  # presence/absence, no numeric score

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            reg_number = int(self.query_str)
            # Create a subquery selecting the serial_number from IR table
            subq_for_filter = (
                select(InternationalRegistration.serial_number)
                .where(InternationalRegistration.international_registration_number == reg_number)
            )
            filters = [CaseFile.serial_number.in_(subq_for_filter)]
            return filters, []
        except ValueError:
            # If query_str is not an integer => [False] => no results
            return [False], []


class InternationalRegistrationDateSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            start_date_str, end_date_str = self.query_str.split(' - ')
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            subq_for_filter = (
                select(InternationalRegistration.serial_number)
                .where(InternationalRegistration.international_registration_date.between(start_date, end_date))
            )
            filters = [CaseFile.serial_number.in_(subq_for_filter)]
            return filters, []
        except (ValueError, IndexError):
            return [False], []


class InternationalPublicationDateSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            start_date_str, end_date_str = self.query_str.split(' - ')
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            subq_for_filter = (
                select(InternationalRegistration.serial_number)
                .where(InternationalRegistration.international_publication_date.between(start_date, end_date))
            )
            filters = [CaseFile.serial_number.in_(subq_for_filter)]
            return filters, []
        except (ValueError, IndexError):
            return [False], []


class AutoProtectionDateSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            start_date_str, end_date_str = self.query_str.split(' - ')
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            subq_for_filter = (
                select(InternationalRegistration.serial_number)
                .where(InternationalRegistration.auto_protection_date.between(start_date, end_date))
            )
            filters = [CaseFile.serial_number.in_(subq_for_filter)]
            return filters, []
        except (ValueError, IndexError):
            return [False], []


class InternationalStatusCodeSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            status_code = int(self.query_str)
            subq_for_filter = (
                select(InternationalRegistration.serial_number)
                .where(InternationalRegistration.international_status_code == status_code)
            )
            filters = [CaseFile.serial_number.in_(subq_for_filter)]
            return filters, []
        except ValueError:
            return [False], []


class PriorityClaimedSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        # Simply check for IR rows with priority_claimed_in == True
        subq_for_filter = (
            select(InternationalRegistration.serial_number)
            .where(InternationalRegistration.priority_claimed_in == True)
        )
        filters = [CaseFile.serial_number.in_(subq_for_filter)]
        return filters, []


class PriorityClaimedSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        # Simply check for IR rows with priority_claimed_in == True
        subq_for_filter = (
            select(InternationalRegistration.serial_number)
            .where(InternationalRegistration.priority_claimed_in == True)
        )
        filters = [CaseFile.serial_number.in_(subq_for_filter)]
        return filters, []
    
class FirstRefusalSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        subq_for_filter = (
            select(InternationalRegistration.serial_number)
            .where(InternationalRegistration.first_refusal_in == True)
        )
        filters = [CaseFile.serial_number.in_(subq_for_filter)]
        return filters, []


class DrawingCodeTypeSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            drawing_code_type = int(self.query_str)
            # valid range 0..6
            if drawing_code_type not in range(7):
                return [False], []

            # We can reference mark_drawing_code directly since it's in base_query
            filters = [
                func.substr(
                    cast(CaseFileHeader.mark_drawing_code, String), 1, 1
                ) == str(drawing_code_type)
            ]
            return filters, []
        except ValueError:
            return [False], []

class ColorDrawingSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False  # presence check, no numeric ranking

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.color_drawing_current_in == True]
        return filters, []

class ThreeDDrawingSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.drawing_3d_current_in == True]
        return filters, []

class PublishedOppositionDateSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            start_date_str, end_date_str = self.query_str.split(' - ')
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            filters = [
                CaseFileHeader.published_for_opposition_date.between(start_date, end_date)
            ]
            return filters, []
        except (ValueError, IndexError):
            return [False], []


class PriorRegistrationPresentSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False  # presence only, no numeric score

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        # Suppose PriorRegistrationApplication links to CaseFile by serial_number
        # or some foreign key. We'll assume there's a column: .serial_number
        subq_for_filter = (
            select(PriorRegistrationApplication.serial_number).distinct()
        )
        # Means any CaseFile whose serial_number appears in PriorRegistrationApplication
        filters = [CaseFile.serial_number.in_(subq_for_filter)]
        return filters, []


class RegistrationDateSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            start_date_str, end_date_str = self.query_str.split(' - ')
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            filters = [CaseFileHeader.registration_date.between(start_date, end_date)]
            return filters, []
        except (ValueError, IndexError):
            return [False], []


class ForeignRegistrationDateSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            start_date_str, end_date_str = self.query_str.split(' - ')
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            subq_for_filter = (
                select(ForeignApplication.serial_number)
                .where(ForeignApplication.foreign_registration_date.between(start_date, end_date))
            )
            filters = [CaseFile.serial_number.in_(subq_for_filter)]
            return filters, []
        except (ValueError, IndexError):
            return [False], []


class RenewalDateSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            start_date_str, end_date_str = self.query_str.split(' - ')
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            filters = [CaseFileHeader.renewal_date.between(start_date, end_date)]
            return filters, []
        except (ValueError, IndexError):
            return [False], []


class InternationalRenewalDateSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            start_date_str, end_date_str = self.query_str.split(' - ')
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            subq_for_filter = (
                select(InternationalRegistration.serial_number)
                .where(InternationalRegistration.international_renewal_date.between(start_date, end_date))
            )
            filters = [CaseFile.serial_number.in_(subq_for_filter)]
            return filters, []
        except (ValueError, IndexError):
            return [False], []


class ForeignRenewalDateSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            start_date_str, end_date_str = self.query_str.split(' - ')
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            subq_for_filter = (
                select(ForeignApplication.serial_number)
                .where(ForeignApplication.registration_renewal_date.between(start_date, end_date))
            )
            filters = [CaseFile.serial_number.in_(subq_for_filter)]
            return filters, []
        except (ValueError, IndexError):
            return [False], []


class StandardCharacterClaimSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False  # presence check, no numeric scoring

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.standard_characters_claimed_in == True]
        return filters, []


class AcquiredDistinctivenessWholeSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.section_2f_in == True]
        return filters, []


class AcquiredDistinctivenessPartSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFileHeader.section_2f_in_part_in == True]
        return filters, []


class SerialNumberSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFile.serial_number == self.query_str]
        return filters, []


class RegistrationNumberSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        filters = [CaseFile.registration_number == self.query_str]
        return filters, []


class AssignmentRecordedSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False  # presence check, no numeric scoring

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        # If type_code = '601' => an assignment is recorded
        subq_for_filter = (
            select(CaseFileStatement.serial_number)
            .where(CaseFileStatement.type_code == '601')
        )
        filters = [CaseFile.serial_number.in_(subq_for_filter)]
        return filters, []


class OwnerLegalEntitySearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        if len(self.query_str) != 2:
            return [False], []

        subq_for_filter = (
            select(Owner.serial_number)
            .where(Owner.legal_entity_type_code == self.query_str)
        )
        filters = [CaseFile.serial_number.in_(subq_for_filter)]
        return filters, []


class OwnerPartyTypeSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        subq_for_filter = (
            select(Owner.serial_number)
            .where(Owner.party_type == self.query_str)
        )
        filters = [CaseFile.serial_number.in_(subq_for_filter)]
        return filters, []


class PriorityDateRangeSearchStrategy(BaseSearchStrategy):
    is_scoring_strategy = False

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        try:
            start_date_str, end_date_str = self.query_str.split(' - ')
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()

            subq_for_filter = (
                select(ForeignApplication.serial_number)
                .where(ForeignApplication.foreign_priority_claim_in == True)
                .where(ForeignApplication.foreign_filing_date.between(start_date, end_date))
            )
            filters = [CaseFile.serial_number.in_(subq_for_filter)]
            return filters, []
        except (ValueError, AttributeError):
            return [False], []

