# db_utils.py
from sqlalchemy import create_engine, func, text
from sqlalchemy.orm import sessionmaker
import logging
from models import CaseFile, CaseFileHeader
from typing import List, Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s: %(message)s'
)

# Database connection parameters
DB_PARAMS = {
    'host': 'localhost',
    'port': 15432,
    'database': 'trademarks',
    'user': 'rocketdito',
    'password': 'Alowicios!123'
}

# Create SQLAlchemy engine and session factory
DATABASE_URL = f"postgresql://{DB_PARAMS['user']}:{DB_PARAMS['password']}@{DB_PARAMS['host']}:{DB_PARAMS['port']}/{DB_PARAMS['database']}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def get_db_session():
    """Create and return a new database session"""
    return SessionLocal()

def create_soundex_array(input_str: str) -> List[str]:
    """Create an array of Soundex values for each word in the text"""
    try:
        session = get_db_session()
        result = session.execute(
            text("""
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
        logging.error(f"Error creating Soundex array: {str(e)}")
        raise

def get_autocomplete_suggestions(prefix: str, limit: int = 5) -> List[str]:
    """Get autocomplete suggestions based on prefix"""
    try:
        session = get_db_session()
        suggestions = (
            session.query(CaseFileHeader.mark_identification)
            .filter(func.lower(CaseFileHeader.mark_identification).like(func.lower(f"{prefix}%")))
            .distinct()
            .order_by(CaseFileHeader.mark_identification)
            .limit(limit)
            .all()
        )
        session.close()
        return [row[0] for row in suggestions]
    except Exception as e:
        logging.error(f"Autocomplete error: {str(e)}")
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
            CaseFileHeader.registration_date
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
        logging.error(f"Search execution error: {str(e)}")
        raise 