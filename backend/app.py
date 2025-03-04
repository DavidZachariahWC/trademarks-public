# app.py
from flask import Flask, request, jsonify, json, send_file
from search_engine import SearchEngine
from db_utils import get_autocomplete_suggestions, get_db_session, USPTO_API_KEY, GEMINI_API_KEY
from models import (
    CaseFile, CaseFileHeader, Owner, Classification, 
    InternationalRegistration, PriorRegistrationApplication,
    CaseFileStatement, DesignSearch, CaseFileEventStatement,
    Correspondent, MadridInternationalFilingRequest
)
from flask_cors import CORS  
from multi_filter_search import multi_filter_search
import logging
import datetime
from flask.json import dumps
import pandas as pd
from io import BytesIO
import openpyxl
from sqlalchemy import func
from sqlalchemy.sql import text
import httpx
import base64
import redis
import os
import io
import time
from typing import Optional, Tuple
import google.generativeai as genai
#
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)   
app.config['ENV'] = 'production'
app.config['DEBUG'] = False

# AI Configuration
genai.configure(api_key=GEMINI_API_KEY)
#
redis_client = redis.Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379/0"))
#
CACHE_TTL = 172800

def fetch_uspto_pdf(registration_number: str, retries: int = 2, timeout: int = 30) -> Tuple[Optional[bytes], Optional[str]]:
    """
    Fetch PDF from USPTO API with two API keys and retries.
    Returns (pdf_data, None) on success, or (None, error_message) on failure.
    """
    uspto_url = f"https://tsdrapi.uspto.gov/ts/cd/casedocs/bundle.pdf?rn={registration_number}"
    logger.info(f"Attempting to fetch PDF from USPTO: {uspto_url}")

    api_keys = [USPTO_API_KEY]
    
    for key_index, api_key in enumerate(api_keys, 1):
        try:
            logger.info(f"Trying USPTO API key {key_index}")
            uspto_response = httpx.get(
                uspto_url,
                headers={'USPTO-API-KEY': api_key},
                timeout=timeout
            )
            uspto_response.raise_for_status()
            pdf_data = uspto_response.content
            pdf_size = len(pdf_data)
            logger.info(f"Successfully fetched PDF using API key {key_index}. Size: {pdf_size} bytes")
            
            if pdf_size == 0:
                logger.error("Received empty PDF from USPTO API")
                continue  
                
            return pdf_data, None
            
        except (httpx.TimeoutException, httpx.HTTPStatusError) as e:
            logger.warning(f"Failed with API key {key_index}: {str(e)}")
            continue  
        except Exception as e:
            logger.error(f"Unexpected error with API key {key_index}: {str(e)}", exc_info=True)
            continue  
    
    
    logger.warning("Both API keys failed, attempting exponential backoff with primary key")
    for attempt in range(retries + 1):
        try:
            if attempt > 0:
                backoff_time = 2 * attempt
                logger.info(f"Retry attempt {attempt}/{retries} with {backoff_time}s backoff")
                time.sleep(backoff_time)
            
            uspto_response = httpx.get(
                uspto_url,
                headers={'USPTO-API-KEY': USPTO_API_KEY},
                timeout=timeout
            )
            uspto_response.raise_for_status()
            pdf_data = uspto_response.content
            pdf_size = len(pdf_data)
            logger.info(f"Successfully fetched PDF on backoff attempt {attempt + 1}. Size: {pdf_size} bytes")
            
            if pdf_size == 0:
                logger.error("Received empty PDF from USPTO API")
                return None, "Received empty PDF from USPTO API"
                
            return pdf_data, None
            
        except httpx.TimeoutException as e:
            logger.warning(f"Timeout on backoff attempt {attempt + 1}/{retries + 1}: {str(e)}")
            if attempt == retries:
                logger.error(f"All retry attempts failed for registration {registration_number}: {str(e)}")
                return None, f"USPTO API request timed out after all attempts"
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
            return None, f"USPTO API returned error: {e.response.status_code}"
        except Exception as e:
            logger.error(f"Unexpected error fetching PDF: {str(e)}", exc_info=True)
            return None, f"Unexpected error: {str(e)}"
    
    return None, "Failed to fetch PDF after all attempts"

@app.route('/api/ai_chat_eb', methods=['POST'])
def ai_chat_eb():
    try:
        data = request.get_json()
        logger.info(f"Received request with data: {data}")

        
        case_data = data.get('caseData')
        user_message = data.get('message')
        context = data.get('context', [])

        if not case_data or not user_message:
            logger.warning("Missing required fields: caseData and message.")
            return jsonify({'error': 'Missing required fields: caseData and message are required.'}), 400

        
        if isinstance(case_data, str):
            trimmed_case_data = case_data.strip()
            prefix = "Full Case Data:"
            if trimmed_case_data.startswith(prefix):
                json_part = trimmed_case_data[len(prefix):].strip()
                try:
                    case_data = json.loads(json_part)
                except Exception as e:
                    logger.error("Failed to parse caseData JSON from formatted string", exc_info=True)
                    return jsonify({'error': 'Invalid caseData format'}), 400
            else:
                logger.error("Unexpected caseData format: missing expected prefix")
                return jsonify({'error': 'Invalid caseData format'}), 400

        
        registration_number = case_data.get('registration_number')
        if not registration_number:
            logger.warning("Missing registration_number in caseData.")
            return jsonify({'error': 'Missing registration_number in caseData.'}), 400

        
        redis_key = f"pdf:{registration_number}"
        cached_file_ref = redis_client.get(redis_key)
        file_obj = None
        
        if cached_file_ref:
            file_reference = cached_file_ref.decode('utf-8')
            logger.info(f"Found cached file reference for registration number {registration_number}")
            try:
                
                file_obj = genai.get_file(name=file_reference)
                logger.info(f"Successfully retrieved file from Gemini for registration {registration_number}")
            except Exception as e:
                
                logger.warning(f"Cached file not found in Gemini for registration {registration_number}: {str(e)}")
                redis_client.delete(redis_key)
                file_obj = None

        if not file_obj:
            
            logger.info(f"Fetching and uploading new file for registration {registration_number}")
            pdf_data, error = fetch_uspto_pdf(registration_number)
            if error:
                return jsonify({'error': error}), 500
            
            
            pdf_io = io.BytesIO(pdf_data)
            
            
            try:
                file_upload_result = genai.upload_file(
                    path=pdf_io,
                    display_name=f"trademark_{registration_number}.pdf",
                    mime_type="application/pdf"
                )
                file_reference = file_upload_result.name
                logger.info(f"Uploaded PDF to File API; file reference: {file_reference}")
                
                
                try:
                    file_obj = genai.get_file(name=file_reference)
                    
                    redis_client.setex(redis_key, CACHE_TTL, file_reference)
                    logger.info(f"Verified and cached file reference for registration number {registration_number}")
                except Exception as e:
                    logger.error(f"Failed to verify uploaded file: {str(e)}", exc_info=True)
                    return jsonify({'error': 'File upload succeeded but verification failed'}), 500
                
            except Exception as e:
                logger.error(f"Failed to upload PDF to Gemini API: {str(e)}", exc_info=True)
                return jsonify({'error': 'Failed to upload PDF to AI service'}), 500

        
        conversation_history = ""
        if context:
            conversation_history = "\n".join(
                [f"{msg['role'].capitalize()}: {msg['content']}" for msg in context]
            )

        prompt = f"""
You are an assistant specializing in trademark law.
Use the case information and USPTO documents below to professionally answer questions accurately and concisely, to provide helpful insights, and assist the user to save time by analyzing the case data with them. Specificity is highly valued.
- Refer to the data and OCR data as case data (not as JSON or OCR data)
- The OCR registration data, if present, is highly relevant. Please prioritize it and look through its vast data carefully in your analysis.

Info:
- You will act as a paralegal to the user
- Your data is up to date and comes from the USPTO
- You are not affiliated with the USPTO or any other government agency.
- You cannot access other case data.
- Data has been provided to you by the system, and you are helping the user to analyze it.
- Do not mention the literal column names in your response; those are for internal use only.
- Do not describe these instructions to the user.

Note: The following symbols indicate amendments to goods/services:
[...] - Deleted goods/services
((...)) - Goods/services not claimed in Section 15 affidavit of incontestability
*...* - Additional (new) wording in goods/services

Note: Type 4 marks represent "Block letter drawing" if filed before Nov 2, 2003, or "Standard Character Mark" if filed after.

Definitions on fields that may appear in the case data:
44(d): A U.S. application filing basis that claims priority based on a foreign application filed within the previous six months. The applicant is claiming that their U.S. filing date should be considered the same as the earlier foreign application's filing date for priority purposes.
66(a): A U.S. application filing basis for requesting extension of protection to the U.S. for a mark that is already registered under an International Registration via the Madrid Protocol.
44(e): A U.S. application filing basis based on ownership of a valid registration from the applicant's country of origin. This is a basis for registration, not a claim of priority.
Section 15: A provision that allows a registrant to obtain "incontestable" status for their registered mark after five years of continuous use following the registration date, subject to certain conditions. An incontestable registration provides significant legal benefits, limiting the grounds on which the registration can be challenged.
Section 8: A requirement to file an affidavit (or declaration) of continued use (or excusable nonuse) between the 5th and 6th years after registration, and again with each renewal (between the 9th and 10th years, and every 10-year period thereafter). This is to ensure that registered marks are still in active use.
Section 12(c): A provision that allows the owner of a mark registered under the prior Trademark Acts of 1905 or 1920 to claim the benefits of the 1946 Lanham Act (the current Act) by publishing the mark in the Official Gazette and filing an affidavit. This is a way to "upgrade" older registrations to take advantage of the current law.

Formatting:
- Structured responses are preferred to blocks of freeform text
- Use bullet points, lists, headers, and other formatting to make the response more readable

----------------------------------------------------------------------------------------------------
Case Data:
{case_data}
----------------------------------------------------------------------------------------------------
{f"Conversation History:\n{conversation_history}\n----------------------------------------------------------------------------------------------------" if conversation_history else ""}
User: {user_message}
"""
        logger.info(f"Constructed prompt. Length: {len(prompt)} characters")

        
        model = genai.GenerativeModel(model_name="gemini-1.5-pro") 
        response = model.generate_content([
            prompt,  
            file_obj
        ])
        logger.info(f"Received Gemini API response: {response.text}")

        return jsonify({'response': response.text})

    except Exception as e:
        logger.exception(f"Error in /api/ai_chat_eb: {e}")
        return jsonify({'error': 'An internal server error occurred', 'details': str(e)}), 500

@app.route('/api/ai_files', methods=['GET'])
def list_ai_files():
    """List all files currently stored in the Gemini API."""
    try:
        
        files = genai.list_files()
        
        
        file_list = [{"name": f.name, "display_name": f.display_name} for f in files]
        
        logger.info(f"Retrieved {len(file_list)} files from Gemini API")
        return jsonify({'files': file_list})
        
    except Exception as e:
        logger.exception(f"Error in /api/ai_files: {e}")
        return jsonify({'error': 'An internal server error occurred', 'details': str(e)}), 500

@app.route('/api/search')
def search():
    """API endpoint for trademark search"""
    try:
        query = request.args.get('query', '')
        search_types = request.args.getlist('type[]') or [request.args.get('type', 'wordmark')]
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        
        if len(search_types) > 1:
            return jsonify({"error": "Multiple search types not supported yet"}), 400
        
        search_type = search_types[0]
        results = SearchEngine.search(query, search_type, page, per_page)
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Error in /api/search: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/autocomplete')
def autocomplete():
    """API endpoint for autocomplete suggestions"""
    try:
        prefix = request.args.get('prefix', '')
        search_type = request.args.get('type', 'mark')  
        if not prefix:
            return jsonify([])
            
        suggestions = get_autocomplete_suggestions(prefix, search_type)
        return jsonify(suggestions)
        
    except Exception as e:
        logger.error(f"Error in /api/autocomplete: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

def custom_serializer(obj):
  """JSON serializer for objects not serializable by default json code"""
  if isinstance(obj, datetime.date):
    return obj.isoformat()
  raise TypeError ("Type %s not serializable" % type(obj))

@app.route('/api/case/<int:serial_number>')
def case_details(serial_number):
    """API endpoint for case details"""
    logger.info(f"Fetching details for case: {serial_number}")
    try:
        session = get_db_session()
        logger.info("Database session established.")

        case = session.query(CaseFile).filter(CaseFile.serial_number == serial_number).first()
        logger.info(f"Case query executed. Case found: {case is not None}")

        if not case:
            logger.warning(f"Case not found: {serial_number}")
            return jsonify({"error": "Case not found"}), 404

        header = session.query(CaseFileHeader).filter(CaseFileHeader.serial_number == case.serial_number).first()
        logger.info(f"Header query executed. Header found: {header is not None}")
        
        if not header:
            logger.warning(f"Header not found for case: {serial_number}")
            return jsonify({"error": "Header not found for case"}), 404

        
        response = {
            'serial_number': case.serial_number,
            'registration_number': case.registration_number,
            'transaction_date': case.transaction_date,
            'header': {
                'serial_number': header.serial_number,
                'case_file_header_id': header.case_file_header_id,
                'filing_date': header.filing_date,
                'registration_date': header.registration_date,
                'status_code': header.status_code,
                'status_date': header.status_date,
                'mark_identification': header.mark_identification,
                'mark_drawing_code': header.mark_drawing_code,
                'published_for_opposition_date': header.published_for_opposition_date,
                'abandonment_date': header.abandonment_date,
                'cancellation_code': header.cancellation_code,
                'cancellation_date': header.cancellation_date,
                'republished_12c_date': header.republished_12c_date,
                'attorney_docket_number': header.attorney_docket_number,
                'attorney_name': header.attorney_name,
                'amend_to_register_date': header.amend_to_register_date,
                'domestic_representative_name': header.domestic_representative_name,
                'trademark_in': header.trademark_in,
                'service_mark_in': header.service_mark_in,
                'collective_membership_mark_in': header.collective_membership_mark_in,
                'collective_trademark_in': header.collective_trademark_in,
                'collective_service_mark_in': header.collective_service_mark_in,
                'certification_mark_in': header.certification_mark_in,
                'principal_register_amended_in': header.principal_register_amended_in,
                'supplemental_register_amended_in': header.supplemental_register_amended_in,
                'cancellation_pending_in': header.cancellation_pending_in,
                'published_concurrent_in': header.published_concurrent_in,
                'concurrent_use_in': header.concurrent_use_in,
                'concurrent_use_proceeding_in': header.concurrent_use_proceeding_in,
                'interference_pending_in': header.interference_pending_in,
                'opposition_pending_in': header.opposition_pending_in,
                'section_12c_in': header.section_12c_in,
                'section_2f_in': header.section_2f_in,
                'section_2f_in_part_in': header.section_2f_in_part_in,
                'section_8_filed_in': header.section_8_filed_in,
                'section_8_partial_accept_in': header.section_8_partial_accept_in,
                'section_8_accepted_in': header.section_8_accepted_in,
                'section_15_acknowledged_in': header.section_15_acknowledged_in,
                'section_15_filed_in': header.section_15_filed_in,
                'supplemental_register_in': header.supplemental_register_in,
                'foreign_priority_in': header.foreign_priority_in,
                'change_registration_in': header.change_registration_in,
                'intent_to_use_in': header.intent_to_use_in,
                'intent_to_use_current_in': header.intent_to_use_current_in,
                'filed_as_use_application_in': header.filed_as_use_application_in,
                'amended_to_use_application_in': header.amended_to_use_application_in,
                'use_application_currently_in': header.use_application_currently_in,
                'amended_to_itu_application_in': header.amended_to_itu_application_in,
                'filing_basis_filed_as_44d_in': header.filing_basis_filed_as_44d_in,
                'amended_to_44d_application_in': header.amended_to_44d_application_in,
                'filing_basis_current_44d_in': header.filing_basis_current_44d_in,
                'filing_basis_filed_as_44e_in': header.filing_basis_filed_as_44e_in,
                'amended_to_44e_application_in': header.amended_to_44e_application_in,
                'filing_basis_current_44e_in': header.filing_basis_current_44e_in,
                'without_basis_currently_in': header.without_basis_currently_in,
                'filing_current_no_basis_in': header.filing_current_no_basis_in,
                'standard_characters_claimed_in': header.standard_characters_claimed_in,
                'color_drawing_filed_in': header.color_drawing_filed_in,
                'color_drawing_current_in': header.color_drawing_current_in,
                'drawing_3d_filed_in': header.drawing_3d_filed_in,
                'drawing_3d_current_in': header.drawing_3d_current_in,
                'filing_basis_filed_as_66a_in': header.filing_basis_filed_as_66a_in,
                'filing_basis_current_66a_in': header.filing_basis_current_66a_in,
                'renewal_filed_in': header.renewal_filed_in,
                'renewal_date': header.renewal_date,
                'law_office_assigned_location_code': header.law_office_assigned_location_code,
                'current_location': header.current_location,
                'location_date': header.location_date,
                'employee_name': header.employee_name,
                'mark_identification_soundex': header.mark_identification_soundex
            },
            'owners': [],
            'classifications': [],
            'prior_registrations': [],
            'statements': [],
            'design_searches': [],
            'event_statements': [],
            'correspondents': [],
            'international_registrations': [],
            'madrid_filings': []
        }

        
        owners = session.query(Owner).filter(Owner.serial_number == case.serial_number).all()
        logger.info(f"Owners query executed. Owners found: {len(owners)}")
        for owner in owners:
            response['owners'].append({
                'owner_entry_number': owner.owner_entry_number,
                'party_type': owner.party_type,
                'party_name': owner.party_name,
                'owner_address_1': owner.owner_address_1,
                'owner_address_2': owner.owner_address_2,
                'city': owner.city,
                'owner_state': owner.owner_state,
                'postcode': owner.postcode,
                'owner_country': owner.owner_country,
                'owner_other': owner.owner_other,
                'dba_aka_text': owner.dba_aka_text,
                'entity_statement': owner.entity_statement,
                'composed_of_statement': owner.composed_of_statement,
                'name_change_explanation': owner.name_change_explanation,
                'nationality_country': owner.nationality_country,
                'nationality_state': owner.nationality_state,
                'nationality_other': owner.nationality_other,
                'legal_entity_type_code': owner.legal_entity_type_code
            })

        classifications = session.query(Classification).filter(Classification.serial_number == case.serial_number).all()
        logger.info(f"Classifications query executed. Classifications found: {len(classifications)}")
        for classification in classifications:
            response['classifications'].append({
                'classification_id': classification.classification_id,
                'international_code': classification.international_code,
                'us_code': classification.us_code,
                'primary_code': classification.primary_code,
                'classification_status_code': classification.classification_status_code,
                'classification_status_date': classification.classification_status_date,
                'first_use_anywhere_date': classification.first_use_anywhere_date,
                'first_use_in_commerce_date': classification.first_use_in_commerce_date,
                'international_code_total_no': classification.international_code_total_no,
                'us_code_total_no': classification.us_code_total_no
            })

        prior_registrations = session.query(PriorRegistrationApplication).filter(PriorRegistrationApplication.serial_number == case.serial_number).all()
        logger.info(f"Prior Registrations query executed. Prior Registrations found: {len(prior_registrations)}")
        for prior_reg in prior_registrations:
            response['prior_registrations'].append({
                'prior_registration_application_id': prior_reg.prior_registration_application_id,
                'relationship_type': prior_reg.relationship_type,
                'number': prior_reg.number,
                'other_related_in': prior_reg.other_related_in
            })

        statements = session.query(CaseFileStatement).filter(CaseFileStatement.serial_number == case.serial_number).all()
        logger.info(f"Statements query executed. Statements found: {len(statements)}")
        for statement in statements:
            response['statements'].append({
                'case_file_statement_id': statement.case_file_statement_id,
                'type_code': statement.type_code,
                'statement_text': statement.statement_text
            })

        design_searches = session.query(DesignSearch).filter(DesignSearch.serial_number == case.serial_number).all()
        logger.info(f"Design Searches query executed. Design Searches found: {len(design_searches)}")
        for design_search in design_searches:
            response['design_searches'].append({
                'design_search_code': design_search.design_search_code
            })

        event_statements = session.query(CaseFileEventStatement).filter(CaseFileEventStatement.serial_number == case.serial_number).all()
        logger.info(f"Event Statements query executed. Event Statements found: {len(event_statements)}")
        for event_statement in event_statements:
            response['event_statements'].append({
                'case_file_event_statement_id': event_statement.case_file_event_statement_id,
                'event_code': event_statement.event_code,
                'event_type': event_statement.event_type,
                'description_text': event_statement.description_text,
                'event_date': event_statement.event_date,
                'event_number': event_statement.event_number
            })

        correspondents = session.query(Correspondent).filter(Correspondent.serial_number == case.serial_number).all()
        logger.info(f"Correspondents query executed. Correspondents found: {len(correspondents)}")
        for correspondent in correspondents:
            response['correspondents'].append({
                'address_1': correspondent.address_1,
                'address_2': correspondent.address_2,
                'address_3': correspondent.address_3,
                'address_4': correspondent.address_4,
                'address_5': correspondent.address_5
            })

        international_registrations = session.query(InternationalRegistration).filter(InternationalRegistration.serial_number == case.serial_number).all()
        logger.info(f"International Registrations query executed. International Registrations found: {len(international_registrations)}")
        for intl_reg in international_registrations:
            response['international_registrations'].append({
                'international_registration_number': intl_reg.international_registration_number,
                'international_registration_date': intl_reg.international_registration_date,
                'international_publication_date': intl_reg.international_publication_date,
                'international_renewal_date': intl_reg.international_renewal_date,
                'auto_protection_date': intl_reg.auto_protection_date,
                'international_death_date': intl_reg.international_death_date,
                'international_status_code': intl_reg.international_status_code,
                'international_status_date': intl_reg.international_status_date,
                'priority_claimed_in': intl_reg.priority_claimed_in,
                'priority_claimed_date': intl_reg.priority_claimed_date,
                'first_refusal_in': intl_reg.first_refusal_in,
                'notification_date': intl_reg.notification_date
            })

        madrid_filings = session.query(MadridInternationalFilingRequest).filter(MadridInternationalFilingRequest.serial_number == case.serial_number).all()
        logger.info(f"Madrid Filings query executed. Madrid Filings found: {len(madrid_filings)}")
        for madrid_filing in madrid_filings:
            response['madrid_filings'].append({
                'madrid_filing_entry_number': madrid_filing.madrid_filing_entry_number,
                'reference_number': madrid_filing.reference_number,
                'original_filing_date_uspto': madrid_filing.original_filing_date_uspto,
                'madrid_international_registration_number': madrid_filing.madrid_international_registration_number,
                'madrid_international_registration_date': madrid_filing.madrid_international_registration_date,
                'madrid_international_filing_status_code': madrid_filing.madrid_international_filing_status_code,
                'madrid_international_filing_status_date': madrid_filing.madrid_international_filing_status_date,
                'irregularity_reply_by_date': madrid_filing.irregularity_reply_by_date,
                'madrid_international_filing_renewal_date': madrid_filing.madrid_international_filing_renewal_date
            })

        logger.info("Case details retrieval and formatting complete.")
        
        json_str = dumps(response, default=custom_serializer)
        
        return app.response_class(
            response=json_str,
            status=200,
            mimetype='application/json'
        )

    except Exception as e:
        logger.error(f"Error fetching case details for serial number {serial_number}: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

    finally:
        session.close()
        logger.info("Database session closed.")

@app.route('/api/combined_search', methods=['POST'])
def combined_search():
    """API endpoint for combined search using multiple filters"""
    try:
        data = request.get_json()
        logger.info(f"Received combined_search request: {data}")

        
        filter_tree = data.get('filter_tree')

        
        if not filter_tree:
            logger.warning("Received empty filter tree.")
            return jsonify({
                'results': [],
                'pagination': {
                    'current_page': 1,
                    'total_pages': 0,
                    'total_results': 0,
                    'per_page': 10
                }
            })

        
        page = int(data.get('page', 1))
        per_page = int(data.get('per_page', 10))

        
        results = multi_filter_search(
            filter_tree=filter_tree,  
            page=page,
            per_page=per_page
        )

        return jsonify(results)

    except ValueError as e:
        logger.error(f"Invalid parameter in combined_search: {e}", exc_info=True)
        return jsonify({"error": f"Invalid parameter: {str(e)}"}), 400
    except Exception as e:
        logger.error(f"Error in combined_search: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/export_search', methods=['POST'])
def export_search():
    """API endpoint for exporting search results to Excel"""
    try:
        data = request.get_json()
        logger.info(f"Received export_search request: {data}")

        filter_tree = data.get('filter_tree')
        export_type = data.get('export_type')  
        
        if not filter_tree:
            return jsonify({"error": "No filter tree provided"}), 400

        if export_type == 'current_page':
            page = int(data.get('page', 1))
            per_page = int(data.get('per_page', 60))
            results = multi_filter_search(filter_tree=filter_tree, page=page, per_page=per_page)
        else:  
            results = multi_filter_search(filter_tree=filter_tree, page=1, per_page=150)

        
        df = pd.DataFrame(results['results'])
        
        
        session = get_db_session()
        serial_numbers = df['serial_number'].tolist()
        
        
        additional_data = (
            session.query(
                CaseFile.serial_number,
                Owner.party_name.label('owner_name'),
                Classification.international_code,
                Classification.classification_status_code,
                PriorRegistrationApplication.number.label('prior_registration')
            )
            .select_from(CaseFile)
            .outerjoin(Owner, CaseFile.serial_number == Owner.serial_number)
            .outerjoin(Classification, CaseFile.serial_number == Classification.serial_number)
            .outerjoin(PriorRegistrationApplication, CaseFile.serial_number == PriorRegistrationApplication.serial_number)
            .filter(CaseFile.serial_number.in_(serial_numbers))
            .group_by(
                CaseFile.serial_number,
                Owner.party_name,
                Classification.international_code,
                Classification.classification_status_code,
                PriorRegistrationApplication.number
            )
        ).all()
        
        
        additional_df = pd.DataFrame(additional_data)
        if not additional_df.empty:
            
            additional_df = additional_df.groupby('serial_number').agg({
                'owner_name': lambda x: '; '.join(filter(None, set(x))),
                'international_code': lambda x: '; '.join(filter(None, set(x))),
                'classification_status_code': lambda x: '; '.join(filter(None, set(x))),
                'prior_registration': lambda x: '; '.join(filter(None, set(x)))
            }).reset_index()
            
            
            df = df.merge(additional_df, on='serial_number', how='left')
        
        
        columns = [
            ('mark_identification', 'Mark'),
            ('serial_number', 'Serial Number'),
            ('registration_number', 'Registration Number'),
            ('registration_date', 'Registration Date'),
            ('international_code', 'International Class'),
            ('owner_name', 'Owner'),
            ('prior_registration', 'Prior Registrations'),
            ('attorney_name', 'Attorney'),
            ('filing_date', 'Filing Date'),
            ('status_code', 'Status'),
            ('classification_status_code', 'Classification Status'),
            ('combined_score', 'Match Score')
        ]
        
        
        column_mapping = {old: new for old, new in columns if old in df.columns}
        df = df.rename(columns=column_mapping)
        
        
        final_columns = [new for _, new in columns]
        df = df[final_columns]
        
        
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False)
            
            
            worksheet = writer.sheets['Sheet1']
            
            
            for idx, col in enumerate(df.columns):
                
                if col in ['Mark', 'Owner', 'Prior Registrations']:
                    width = 40  
                elif col in ['Attorney']:
                    width = 30  
                elif col in ['Serial Number', 'Registration Number']:
                    width = 15  
                elif col in ['Registration Date', 'Filing Date']:
                    width = 15  
                else:
                    width = 20  
                
                worksheet.column_dimensions[chr(65 + idx)].width = width
                
                
                for cell in worksheet[chr(65 + idx)]:
                    cell.alignment = openpyxl.styles.Alignment(horizontal='center')
            
                for cell in worksheet[1]:
                    cell.font = openpyxl.styles.Font(bold=True)
        
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=f'trademark_search_results_{datetime.datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx'
        )

    except Exception as e:
        logger.error(f"Error in export_search: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/health')
def health_check():
    """Health check endpoint for AWS ELB"""
    try:
        return jsonify({"status": "healthy"}), 200
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({"status": "unhealthy"}), 500

if __name__ == '__main__':
        app.run(host='0.0.0.0', port=5001)