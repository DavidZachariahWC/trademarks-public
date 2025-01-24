# app.py
from flask import Flask, request, jsonify, json, send_file
from search_engine import SearchEngine
from db_utils import get_autocomplete_suggestions, get_db_session
from models import (
    CaseFile, CaseFileHeader, Owner, Classification, 
    InternationalRegistration, PriorRegistrationApplication,
    CaseFileStatement, DesignSearch, CaseFileEventStatement,
    Correspondent, MadridInternationalFilingRequest
)
from flask_cors import CORS  # Add CORS support
from multi_filter_search import multi_filter_search
import logging
import datetime
from flask.json import dumps
import pandas as pd
from io import BytesIO
import openpyxl
from sqlalchemy import func

# Configure logging
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
CORS(app)  # Enable CORS for all routes

@app.route('/api/search')
def search():
    """API endpoint for trademark search"""
    try:
        query = request.args.get('query', '')
        search_types = request.args.getlist('type[]') or [request.args.get('type', 'wordmark')]
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # Only allow one search type for now
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
        search_type = request.args.get('type', 'mark')  # default to 'mark' if not specified
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

        # Construct response
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

        # Fetch and append related data
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
        # First convert to JSON string with our custom serializer
        json_str = dumps(response, default=custom_serializer)
        # Then return as response
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

        # Get the filter tree from the request body
        filter_tree = data.get('filter_tree')

        # Handle empty filter tree case
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

        # Get optional parameters
        page = int(data.get('page', 1))
        per_page = int(data.get('per_page', 10))

        # Execute multi-filter search
        results = multi_filter_search(
            filter_tree=filter_tree,  # Pass the filter tree
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
        export_type = data.get('export_type')  # 'current_page' or 'full'
        
        if not filter_tree:
            return jsonify({"error": "No filter tree provided"}), 400

        if export_type == 'current_page':
            page = int(data.get('page', 1))
            per_page = int(data.get('per_page', 60))
            results = multi_filter_search(filter_tree=filter_tree, page=page, per_page=per_page)
        else:  # 'full' export
            results = multi_filter_search(filter_tree=filter_tree, page=1, per_page=500)

        # Convert results to DataFrame
        df = pd.DataFrame(results['results'])
        
        # Get additional data from database for these serial numbers
        session = get_db_session()
        serial_numbers = df['serial_number'].tolist()
        
        # Query additional data
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
        
        # Convert to DataFrame and merge
        additional_df = pd.DataFrame(additional_data)
        if not additional_df.empty:
            # Group by serial_number and aggregate the additional fields
            additional_df = additional_df.groupby('serial_number').agg({
                'owner_name': lambda x: '; '.join(filter(None, set(x))),
                'international_code': lambda x: '; '.join(filter(None, set(x))),
                'classification_status_code': lambda x: '; '.join(filter(None, set(x))),
                'prior_registration': lambda x: '; '.join(filter(None, set(x)))
            }).reset_index()
            
            # Merge with main DataFrame
            df = df.merge(additional_df, on='serial_number', how='left')
        
        # Map the columns to their display names and set the order
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
        
        # Rename columns for better readability in Excel
        column_mapping = {old: new for old, new in columns if old in df.columns}
        df = df.rename(columns=column_mapping)
        
        # Select columns in the specified order
        final_columns = [new for _, new in columns]
        df = df[final_columns]
        
        # Create Excel file in memory
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False)
            
            # Get the worksheet to adjust column widths
            worksheet = writer.sheets['Sheet1']
            
            # Set fixed column widths for better readability
            for idx, col in enumerate(df.columns):
                # Set a reasonable fixed width for each column type
                if col in ['Mark', 'Owner', 'Prior Registrations']:
                    width = 40  # Extra wide for text fields
                elif col in ['Attorney']:
                    width = 30  # Wide for names
                elif col in ['Serial Number', 'Registration Number']:
                    width = 15  # Medium for numbers
                elif col in ['Registration Date', 'Filing Date']:
                    width = 15  # Medium for dates
                else:
                    width = 20  # Default width for other columns
                
                worksheet.column_dimensions[chr(65 + idx)].width = width
                
                # Center-align all columns
                for cell in worksheet[chr(65 + idx)]:
                    cell.alignment = openpyxl.styles.Alignment(horizontal='center')
            
            # Make the header row bold
            for cell in worksheet[1]:
                cell.font = openpyxl.styles.Font(bold=True)
        
        output.seek(0)
        
        # Return the Excel file
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=f'trademark_search_results_{datetime.datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx'
        )

    except Exception as e:
        logger.error(f"Error in export_search: {e}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Changed port to 5001 to avoid conflict with AirPlay