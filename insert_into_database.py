import psycopg2
import psycopg2.extras
import xml.sax
import sys
from datetime import datetime
import logging
import traceback
import xml.sax.handler
from psycopg2 import errors

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s: %(message)s',
    handlers=[
        logging.FileHandler('trademark_parser.log'),
        logging.StreamHandler()
    ]
)

# Database connection parameters
DB_PARAMS = {
    'host': 'trademarks.cp8g8oucmbr9.us-west-1.rds.amazonaws.com',
    'database': 'trademarks',
    'user': 'rocketdito',
    'password': 'Alowicios!123'  
}

# Utility functions
def parse_date(date_str):
    """
    Parse a date in 'YYYYMMDD', 'YYYYMM', or 'YYYY' format. 
    If the month is '00', fallback to '01' (January).
    If the day is '00', fallback to '01' (1st day of the month).
    If only 'YYYYMM', fallback day to '01'.
    If only 'YYYY', fallback to '0101'.
    Return a datetime.date or None if parsing fails.
    """
    if not date_str or not date_str.strip():
        return None

    date_str = date_str.strip()

    # Handle just the year (YYYY)
    if len(date_str) == 4:
        date_str += '0101'  # e.g. 1855 -> 18550101
    # Handle year+month (YYYYMM)
    elif len(date_str) == 6:
        date_str += '01'    # e.g. 185501 -> 18550101
    # If not 4, 6, or 8 digits, give up
    elif len(date_str) != 8:
        return None

    # Now we have YYYYMMDD. Fix invalid '00' parts:
    # Month=00 -> fallback to 01
    if date_str[4:6] == '00':
        date_str = date_str[:4] + '01' + date_str[6:]

    # Day=00 -> fallback to 01
    if date_str[6:8] == '00':
        date_str = date_str[:6] + '01'

    # Attempt to parse
    try:
        return datetime.strptime(date_str, '%Y%m%d').date()
    except ValueError:
        return None

def parse_boolean(bool_str):
    if bool_str is None:
        return None
    bool_str = bool_str.strip().upper()
    if bool_str == 'T':
        return True
    elif bool_str == 'F':
        return False
    else:
        return None

[... rest of the file remains unchanged ...]
