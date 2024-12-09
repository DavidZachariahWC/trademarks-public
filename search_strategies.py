# search_strategies.py
from enum import Enum
from typing import List, Tuple, Optional, Dict, Any
from sqlalchemy import func, case, and_, or_, text, cast, Boolean, literal
from sqlalchemy.orm import Session
from models import CaseFile, CaseFileHeader
from db_utils import get_db_session, create_soundex_array, base_query
from sqlalchemy.dialects.postgresql import ARRAY, TEXT as PgText

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
        return query.order_by(similarity_score.desc())

class PhoneticSearchStrategy(BaseSearchStrategy):
    def __init__(self, query: str, page: int = 1, per_page: int = 10):
        super().__init__(query, page, per_page)
        self.query_soundex = create_soundex_array(self.query_str)

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        # Create a properly typed array expression for the overlap condition
        soundex_array_expr = cast(literal(self.query_soundex), ARRAY(PgText))
        
        # Create the overlap condition that SQLAlchemy can understand
        filters = [
            (CaseFileHeader.mark_identification_soundex.op('&&')(soundex_array_expr) == True)
        ]
        
        # Create scoring expressions
        phonetic_score = func.calculate_phonetic_score(
            self.query_soundex,
            CaseFileHeader.mark_identification_soundex
        ).label('phonetic_score')
        
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
        
        query = query.filter(phonetic_score > 35)
        return query.order_by(phonetic_score.desc())

class CombinedSearchStrategy(BaseSearchStrategy):
    def __init__(self, query: str, page: int = 1, per_page: int = 10):
        super().__init__(query, page, per_page)
        self.query_soundex = create_soundex_array(self.query_str)

    def get_filters_and_scoring(self) -> Tuple[List, List]:
        # Get individual strategy scores
        word_filters, word_scoring = WordmarkSearchStrategy(self.query_str).get_filters_and_scoring()
        phon_filters, phon_scoring = PhoneticSearchStrategy(self.query_str).get_filters_and_scoring()
        
        # Combine filters with OR
        filters = [or_(*word_filters, *phon_filters)]
        
        # Calculate combined score
        similarity_score = word_scoring[0]
        phonetic_score = phon_scoring[0]
        
        combined_score = ((func.coalesce(similarity_score, 0) + 
                          func.coalesce(phonetic_score, 0)) / 2).label('combined_score')
        
        match_quality = case(
            (combined_score >= 80, 'Very High'),
            (combined_score >= 60, 'High'),
            (combined_score >= 40, 'Medium'),
            else_='Low'
        ).label('match_quality')
        
        return filters, [similarity_score, phonetic_score, combined_score, match_quality]

    def build_query(self, session: Session):
        query = super().build_query(session)
        _, scoring = self.get_filters_and_scoring()
        combined_score = scoring[2]  # Third scoring expression is combined_score
        return query.order_by(combined_score.desc())

class LogicBuilder:
    def __init__(self):
        self.conditions: List[SearchCondition] = []

    def add_condition(self, strategy: BaseSearchStrategy, operator: Optional[LogicOperator] = None) -> 'LogicBuilder':
        self.conditions.append(SearchCondition(strategy, operator))
        return self

    def build_query(self, session: Session, page: int = 1, per_page: int = 10):
        if not self.conditions:
            raise ValueError("No search conditions provided")

        query = base_query(session)
        final_filters = []
        all_scoring = []

        # Build combined filters and scoring
        for i, condition in enumerate(self.conditions):
            filters, scoring = condition.get_filters_and_scoring()
            
            if i == 0:
                # For the first condition, add filters directly
                final_filters.extend(filters)
            else:
                # For subsequent conditions, combine with OR
                op = condition.operator or LogicOperator.AND
                if op == LogicOperator.OR:
                    # Combine previous filters with new filters using OR
                    if final_filters:
                        combined_filter = or_(*final_filters, *filters)
                        final_filters = [combined_filter]
                    else:
                        final_filters.extend(filters)
                else:  # AND
                    final_filters.extend(filters)
            
            all_scoring.extend(scoring)

        # Apply filters and scoring
        if final_filters:
            query = query.filter(*final_filters)
        
        # Add all scoring columns
        for score in all_scoring:
            query = query.add_columns(score)

        # Determine the appropriate ordering
        order_by_column = None
        for score in all_scoring:
            if score.name == 'combined_score':
                order_by_column = score
                break
            elif score.name == 'similarity_score' and not order_by_column:
                order_by_column = score
            elif score.name == 'phonetic_score' and not order_by_column:
                order_by_column = score

        if order_by_column:
            query = query.order_by(order_by_column.desc())
        
        # Add pagination
        offset = (page - 1) * per_page
        return query.limit(per_page).offset(offset)

    def count_query(self, session: Session):
        if not self.conditions:
            raise ValueError("No search conditions provided")

        final_filters = []
        for i, condition in enumerate(self.conditions):
            filters, _ = condition.get_filters_and_scoring()
            
            if i == 0:
                final_filters.extend(filters)
            else:
                op = condition.operator or LogicOperator.AND
                if op == LogicOperator.OR:
                    final_filters.append(or_(*filters))
                else:
                    final_filters.extend(filters)

        return session.query(func.count(CaseFile.serial_number)).join(CaseFileHeader).filter(*final_filters)