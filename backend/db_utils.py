# db_utils.py
import os
from sqlalchemy import create_engine, func, text
from sqlalchemy.orm import sessionmaker
from models import CaseFile, CaseFileHeader
from typing import List, Dict, Any

# Database connection parameters from environment variables
DB_PARAMS = {
    'host': os.getenv('DB_HOST'),
    'port': int(os.getenv('DB_PORT', '5432')),
    'database': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}

# API Keys from environment variables
USPTO_API_KEY = os.getenv('USPTO_API_KEY')
USPTO_API_KEY_2 = os.getenv('USPTO_API_KEY_2')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# Create SQLAlchemy engine
DATABASE_URL = f"postgresql://{DB_PARAMS['user']}:{DB_PARAMS['password']}@{DB_PARAMS['host']}:{DB_PARAMS['port']}/{DB_PARAMS['database']}"
engine = create_engine(DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(bind=engine)

def get_db_session():
    """Create and return a new database session"""
    return SessionLocal()

def create_soundex_array(input_str: str) -> List[str]:
    """Create an array of Soundex values for each word in the text"""
    try:
        session = get_db_session()
        result = session.execute(
            text(r"""
                SELECT ARRAY(
                    SELECT DISTINCT SOUNDEX(word)
                    FROM unnest(regexp_split_to_array(trim(:input_str), '\s+')) AS word
                    WHERE length(word) > 0
                )
            """),
            {"input_str": input_str}
        ).scalar()
        session.close()
        return result
    except Exception as e:
        raise

def get_autocomplete_suggestions(prefix: str, search_type: str = 'mark', limit: int = 5) -> List[str]:
    """Get autocomplete suggestions based on prefix and search type"""
    try:
        session = get_db_session()
        combined_results = []

        if search_type == 'mark':
            mark_suggestions = (
                session.query(
                    CaseFileHeader.mark_identification.label('mark_id'),
                    func.similarity(CaseFileHeader.mark_identification, prefix).label('sim'),
                    func.lower(CaseFileHeader.mark_identification).label('mark_lower')
                )
                .filter(
                    CaseFileHeader.mark_identification.isnot(None),
                    func.lower(CaseFileHeader.mark_identification).like(func.lower(f"%{prefix}%"))
                )
                .distinct()
                .order_by(
                    text("sim DESC"),
                    text("mark_lower ASC")
                )
            ).all()
            
            combined_results.extend([
                (result[0], result[1], 'mark') 
                for result in mark_suggestions 
                if result[0]
            ])

        elif search_type == 'attorney':
            attorney_suggestions = (
                session.query(
                    CaseFileHeader.attorney_name.label('attorney_name'),
                    func.similarity(CaseFileHeader.attorney_name, prefix).label('sim'),
                    func.lower(CaseFileHeader.attorney_name).label('attorney_lower')
                )
                .filter(
                    CaseFileHeader.attorney_name.isnot(None),
                    func.lower(CaseFileHeader.attorney_name).like(func.lower(f"%{prefix}%"))
                )
                .distinct()
                .order_by(
                    text("sim DESC"),
                    text("attorney_lower ASC")
                )
            ).all()

            combined_results.extend([
                (result[0], result[1], 'attorney') 
                for result in attorney_suggestions 
                if result[0]
            ])

        # Sort by similarity score and then alphabetically by text
        #combined_results.sort(key=lambda x: (-x[1], x[0].lower()))
        
        # Now apply the final limit after sorting all results
        combined_results = combined_results[:limit]
        
        session.close()
        return [result[0] for result in combined_results]
    except Exception as e:
        raise

def base_query(session):
    """Create a base query with common joins and selections"""
    return (
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
    )

def execute_search_query(query, params: Dict[str, Any] = None) -> Dict:
    """Execute a search query and return results with pagination"""
    try:
        session = get_db_session()
        if params is None:
            params = {}
            
        # Execute the query
        results = session.execute(text(query), params).fetchall()
        
        # Convert results to dictionaries
        result_dicts = [dict(row) for row in results]
        
        session.close()
        return result_dicts
    except Exception as e:
        raise 