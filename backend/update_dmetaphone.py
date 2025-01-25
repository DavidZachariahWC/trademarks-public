"""Script to update existing records with Double Metaphone codes"""
from db_utils import get_db_session
from models import CaseFileHeader
from sqlalchemy import text
import logging
from tqdm import tqdm

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def update_dmetaphone_codes():
    """Update all existing records with Double Metaphone codes"""
    session = get_db_session()
    try:
        # Get total count for progress bar
        total = session.query(CaseFileHeader).count()
        logger.info(f"Found {total} records to update")

        # Process in batches to avoid memory issues
        batch_size = 1000
        for offset in tqdm(range(0, total, batch_size)):
            # Get batch of records
            records = session.query(CaseFileHeader).offset(offset).limit(batch_size).all()
            
            for record in records:
                if record.mark_identification:
                    # Generate Double Metaphone codes
                    dmetaphone_codes = session.execute(
                        text(r"""
                            SELECT ARRAY(
                                SELECT DISTINCT dmetaphone(word)
                                FROM unnest(regexp_split_to_array(trim(:mark), '\s+')) AS word
                                WHERE length(word) > 0
                            )
                        """),
                        {"mark": record.mark_identification}
                    ).scalar()
                    
                    # Update record
                    record.mark_identification_dmetaphone = dmetaphone_codes
            
            # Commit batch
            session.commit()
            logger.info(f"Processed {min(offset + batch_size, total)} records")

        logger.info("Finished updating Double Metaphone codes")

    except Exception as e:
        logger.error(f"Error updating Double Metaphone codes: {e}")
        session.rollback()
        raise
    finally:
        session.close()

if __name__ == "__main__":
    update_dmetaphone_codes() 