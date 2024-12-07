# db_utils.py
import psycopg2
from psycopg2.extras import RealDictCursor
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s: %(message)s'
)

DB_PARAMS = {
    'host': 'localhost',  # Using localhost because of SSH tunnel
    'port': 15432,       # The local forwarded port from your SSH tunnel
    'database': 'trademarks',
    'user': 'rocketdito',
    'password': 'Alowicios!123'
}

def get_db_connection():
    """Create and return a database connection"""
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        return conn
    except Exception as e:
        logging.error(f"Database connection error: {str(e)}")
        raise

def create_soundex_array(text):
    """Create an array of Soundex values for each word in the text"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Split text into words and get Soundex for each
        query = """
            SELECT ARRAY(
                SELECT DISTINCT SOUNDEX(word)
                FROM unnest(regexp_split_to_array(trim(%s), '\s+')) AS word
                WHERE length(word) > 0
            )
        """
        cur.execute(query, (text,))
        result = cur.fetchone()[0]
        
        cur.close()
        conn.close()
        
        return result
    except Exception as e:
        logging.error(f"Error creating Soundex array: {str(e)}")
        raise

def search_mark_identification(query, search_type='wordmark', page=1, per_page=10):
    """
    Search for trademarks based on mark identification
    Returns paginated results sorted by similarity score
    search_type can be 'wordmark', 'phonetic', or 'combined'
    """
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        offset = (page - 1) * per_page
        
        if search_type == 'phonetic':
            # Get Soundex values for query words
            query_soundex = create_soundex_array(query)
            
            search_query = """
                WITH PhoneticMatch AS (
                    SELECT 
                        cf.serial_number,
                        cf.registration_number,
                        cfh.mark_identification,
                        cfh.status_code,
                        cfh.filing_date,
                        cfh.registration_date,
                        -- Calculate how many Soundex values match
                        (SELECT COUNT(*)
                         FROM unnest(%s) q_soundex
                         WHERE q_soundex = ANY(cfh.mark_identification_soundex)
                        )::float / 
                        -- Divide by the larger of the two arrays for normalized score
                        GREATEST(array_length(%s, 1), array_length(cfh.mark_identification_soundex, 1))
                        as soundex_match_score
                    FROM 
                        CaseFile cf
                        JOIN CaseFileHeader cfh ON cf.serial_number = cfh.serial_number
                    WHERE 
                        cfh.mark_identification_soundex && %s  -- Array overlap operator
                )
                SELECT 
                    *,
                    soundex_match_score * 100 as phonetic_score,
                    CASE 
                        WHEN soundex_match_score >= 0.8 THEN 'Very High'
                        WHEN soundex_match_score >= 0.6 THEN 'High'
                        WHEN soundex_match_score >= 0.4 THEN 'Medium'
                        ELSE 'Low'
                    END as match_quality
                FROM PhoneticMatch
                WHERE soundex_match_score > 0.35
                ORDER BY phonetic_score DESC
                LIMIT %s OFFSET %s
            """
            
            count_query = """
                SELECT COUNT(*) 
                FROM CaseFile cf
                JOIN CaseFileHeader cfh ON cf.serial_number = cfh.serial_number
                WHERE 
                    cfh.mark_identification_soundex && %s
                    AND (
                        SELECT COUNT(*)
                        FROM unnest(%s) q_soundex
                        WHERE q_soundex = ANY(cfh.mark_identification_soundex)
                    )::float / 
                    GREATEST(array_length(%s, 1), array_length(cfh.mark_identification_soundex, 1)) > 0.35
            """
            
            cur.execute(count_query, (query_soundex, query_soundex, query_soundex))
            total_count = cur.fetchone()['count']
            
            cur.execute(search_query, (
                query_soundex, query_soundex, query_soundex,
                per_page, offset
            ))
            
        elif search_type == 'combined':
            query_soundex = create_soundex_array(query)
            
            search_query = """
                WITH CombinedMatch AS (
                    SELECT 
                        cf.serial_number,
                        cf.registration_number,
                        cfh.mark_identification,
                        cfh.status_code,
                        cfh.filing_date,
                        cfh.registration_date,
                        SIMILARITY(cfh.mark_identification, %s) as similarity_score,
                        (SELECT COUNT(*)
                         FROM unnest(%s) q_soundex
                         WHERE q_soundex = ANY(cfh.mark_identification_soundex)
                        )::float / 
                        GREATEST(array_length(%s, 1), array_length(cfh.mark_identification_soundex, 1))
                        as soundex_match_score
                    FROM 
                        CaseFile cf
                        JOIN CaseFileHeader cfh ON cf.serial_number = cfh.serial_number
                    WHERE 
                        (cfh.mark_identification %% %s OR cfh.mark_identification_soundex && %s)
                )
                SELECT 
                    *,
                    similarity_score * 100 as similarity_percent,
                    soundex_match_score * 100 as phonetic_score,
                    (similarity_score * 0.5 + soundex_match_score * 0.5) * 100 as combined_score,
                    CASE 
                        WHEN soundex_match_score >= 0.8 OR similarity_score >= 0.8 THEN 'Very High'
                        WHEN soundex_match_score >= 0.6 OR similarity_score >= 0.6 THEN 'High'
                        WHEN soundex_match_score >= 0.4 OR similarity_score >= 0.4 THEN 'Medium'
                        ELSE 'Low'
                    END as match_quality
                FROM CombinedMatch
                WHERE similarity_score > 0.35 OR soundex_match_score > 0.35
                ORDER BY combined_score DESC
                LIMIT %s OFFSET %s
            """
            
            count_query = """
                SELECT COUNT(*) 
                FROM CaseFile cf
                JOIN CaseFileHeader cfh ON cf.serial_number = cfh.serial_number
                WHERE 
                    (
                        SIMILARITY(cfh.mark_identification, %s) > 0.35
                        OR (
                            SELECT COUNT(*)
                            FROM unnest(%s) q_soundex
                            WHERE q_soundex = ANY(cfh.mark_identification_soundex)
                        )::float / 
                        GREATEST(array_length(%s, 1), array_length(cfh.mark_identification_soundex, 1)) > 0.35
                    )
                    AND (cfh.mark_identification %% %s OR cfh.mark_identification_soundex && %s)
            """
            
            cur.execute(count_query, (query, query_soundex, query_soundex, query, query_soundex))
            total_count = cur.fetchone()['count']
            
            cur.execute(search_query, (
                query, query_soundex, query_soundex, query, query_soundex,
                per_page, offset
            ))
            
        else:  # wordmark search
            search_query = """
                SELECT 
                    cf.serial_number,
                    cf.registration_number,
                    cfh.mark_identification,
                    cfh.status_code,
                    cfh.filing_date,
                    cfh.registration_date,
                    SIMILARITY(cfh.mark_identification, %s) * 100 as similarity_score,
                    CASE 
                        WHEN SIMILARITY(cfh.mark_identification, %s) >= 0.8 THEN 'Very High'
                        WHEN SIMILARITY(cfh.mark_identification, %s) >= 0.6 THEN 'High'
                        WHEN SIMILARITY(cfh.mark_identification, %s) >= 0.4 THEN 'Medium'
                        ELSE 'Low'
                    END as match_quality
                FROM 
                    CaseFile cf
                    JOIN CaseFileHeader cfh ON cf.serial_number = cfh.serial_number
                WHERE 
                    cfh.mark_identification %% %s
                    OR LOWER(cfh.mark_identification) LIKE LOWER(%s)
                ORDER BY 
                    similarity_score DESC
                LIMIT %s OFFSET %s
            """
            
            count_query = """
                SELECT COUNT(*) 
                FROM CaseFile cf
                JOIN CaseFileHeader cfh ON cf.serial_number = cfh.serial_number
                WHERE 
                    cfh.mark_identification %% %s
                    OR LOWER(cfh.mark_identification) LIKE LOWER(%s)
            """
            
            cur.execute(count_query, (query, f"%{query}%"))
            total_count = cur.fetchone()['count']
            
            cur.execute(search_query, (
                query, query, query, query, query, f"%{query}%",
                per_page, offset
            ))
        
        results = cur.fetchall()
        
        # Calculate pagination info
        total_pages = (total_count + per_page - 1) // per_page
        
        response = {
            'results': results,
            'pagination': {
                'current_page': page,
                'total_pages': total_pages,
                'total_results': total_count,
                'per_page': per_page
            }
        }
        
        cur.close()
        conn.close()
        
        return response
        
    except Exception as e:
        logging.error(f"Search error: {str(e)}")
        raise

def get_autocomplete_suggestions(prefix, limit=5):
    """Get autocomplete suggestions based on prefix"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT DISTINCT mark_identification
            FROM CaseFileHeader
            WHERE LOWER(mark_identification) LIKE LOWER(%s)
            ORDER BY mark_identification
            LIMIT %s
        """
        
        cur.execute(query, (f"{prefix}%", limit))
        suggestions = [row['mark_identification'] for row in cur.fetchall()]
        
        cur.close()
        conn.close()
        
        return suggestions
        
    except Exception as e:
        logging.error(f"Autocomplete error: {str(e)}")
        raise 