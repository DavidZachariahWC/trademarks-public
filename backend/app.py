# app.py
from flask import Flask, request, jsonify
from search_engine import SearchEngine
from db_utils import get_autocomplete_suggestions, get_db_session
from models import CaseFile, CaseFileHeader
from flask_cors import CORS  # Add CORS support

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
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/case/<int:serial_number>')
def case_details(serial_number):
    """API endpoint for case details"""
    try:
        session = get_db_session()
        case = (session.query(CaseFile)
               .join(CaseFileHeader)
               .filter(CaseFile.serial_number == serial_number)
               .first())
               
        if not case:
            return jsonify({"error": "Case not found"}), 404

        def format_date(date):
            """Format date as YYYY-MM-DD without timezone conversion"""
            return date.strftime('%Y-%m-%d') if date else None
            
        response = {
            "serial_number": case.serial_number,
            "registration_number": case.registration_number,
            "header": {
                "mark_identification": case.header.mark_identification,
                "status_code": case.header.status_code,
                "filing_date": format_date(case.header.filing_date),
                "registration_date": format_date(case.header.registration_date),
                "cancellation_date": format_date(case.header.cancellation_date),
                "published_for_opposition_date": format_date(case.header.published_for_opposition_date),
                "attorney_name": case.header.attorney_name,
                "republished_12c_date": format_date(case.header.republished_12c_date),
                "section_8_partial_accept_in": case.header.section_8_partial_accept_in or False,
                "section_8_accepted_in": case.header.section_8_accepted_in or False,
                "section_15_filed_in": case.header.section_15_filed_in or False,
                "section_15_acknowledged_in": case.header.section_15_acknowledged_in or False,
                "change_registration_in": case.header.change_registration_in or False,
                "concurrent_use_in": case.header.concurrent_use_in or False,
                "concurrent_use_proceeding_in": case.header.concurrent_use_proceeding_in or False,
                "published_concurrent_in": case.header.published_concurrent_in or False,
                "filing_basis_filed_as_44d_in": case.header.filing_basis_filed_as_44d_in or False,
                "amended_to_44d_application_in": case.header.amended_to_44d_application_in or False,
                "filing_basis_current_44d_in": case.header.filing_basis_current_44d_in or False,
                "filing_basis_filed_as_44e_in": case.header.filing_basis_filed_as_44e_in or False,
                "amended_to_44e_application_in": case.header.amended_to_44e_application_in or False,
                "filing_basis_current_44e_in": case.header.filing_basis_current_44e_in or False,
                "filing_basis_filed_as_66a_in": case.header.filing_basis_filed_as_66a_in or False,
                "filing_basis_current_66a_in": case.header.filing_basis_current_66a_in or False,
                "filing_current_no_basis_in": case.header.filing_current_no_basis_in or False,
                "without_basis_currently_in": case.header.without_basis_currently_in or False,
                "standard_characters_claimed_in": case.header.standard_characters_claimed_in or False,
                "mark_drawing_code": case.header.mark_drawing_code,
                "color_drawing_current_in": case.header.color_drawing_current_in or False,
                "color_drawing_filed_in": case.header.color_drawing_filed_in or False,
                "drawing_3d_current_in": case.header.drawing_3d_current_in or False,
                "drawing_3d_filed_in": case.header.drawing_3d_filed_in or False,
                "section_2f_in": case.header.section_2f_in or False,
                "section_2f_in_part_in": case.header.section_2f_in_part_in or False
            },
            "statements": [{
                "type_code": stmt.type_code,
                "statement_text": stmt.statement_text
            } for stmt in case.statements] if case.statements else None,
            "event_statements": [{
                "event_code": stmt.event_code,
                "event_type": stmt.event_type,
                "description_text": stmt.description_text,
                "event_date": format_date(stmt.event_date),
                "event_number": stmt.event_number
            } for stmt in case.event_statements] if case.event_statements else None,
            "design_searches": [{
                "design_search_code": str(ds.design_search_code)
            } for ds in case.design_searches] if case.design_searches else None,
            "owners": [{
                "party_name": owner.party_name,
                "owner_address_1": owner.owner_address_1,
                "owner_address_2": owner.owner_address_2,
                "city": owner.city,
                "owner_state": owner.owner_state,
                "postcode": owner.postcode,
                "owner_country": owner.owner_country,
                "dba_aka_text": owner.dba_aka_text,
                "entity_statement": owner.entity_statement,
                "composed_of_statement": owner.composed_of_statement,
                "name_change_explanation": owner.name_change_explanation,
                "nationality_country": owner.nationality_country,
                "nationality_state": owner.nationality_state,
                "nationality_other": owner.nationality_other,
                "legal_entity_type_code": str(owner.legal_entity_type_code) if owner.legal_entity_type_code else None,
                "party_type": str(owner.party_type) if owner.party_type else None
            } for owner in case.owners] if case.owners else None,
            "correspondents": [{
                "address_1": corr.address_1,
                "address_2": corr.address_2,
                "address_3": corr.address_3,
                "address_4": corr.address_4,
                "address_5": corr.address_5
            } for corr in case.correspondents] if case.correspondents else None,
            "foreign_applications": [{
                "foreign_country": app.foreign_country,
                "foreign_other": app.foreign_other,
                "application_number": app.application_number,
                "foreign_registration_number": app.foreign_registration_number,
                "foreign_filing_date": format_date(app.foreign_filing_date),
                "foreign_registration_date": format_date(app.foreign_registration_date),
                "registration_expiration_date": format_date(app.registration_expiration_date),
                "registration_renewal_date": format_date(app.registration_renewal_date),
                "renewal_number": app.renewal_number,
                "registration_renewal_expiration_date": format_date(app.registration_renewal_expiration_date),
                "foreign_priority_claim_in": app.foreign_priority_claim_in or False
            } for app in case.foreign_applications] if case.foreign_applications else None,
            "international_registrations": [{
                "international_registration_number": str(reg.international_registration_number) if reg.international_registration_number else None,
                "international_registration_date": format_date(reg.international_registration_date),
                "international_publication_date": format_date(reg.international_publication_date),
                "auto_protection_date": format_date(reg.auto_protection_date),
                "international_status_code": str(reg.international_status_code) if reg.international_status_code else None,
                "international_status_date": format_date(reg.international_status_date),
                "international_renewal_date": format_date(reg.international_renewal_date),
                "international_death_date": format_date(reg.international_death_date),
                "priority_claimed_in": reg.priority_claimed_in or False,
                "priority_claimed_date": format_date(reg.priority_claimed_date),
                "first_refusal_in": reg.first_refusal_in or False,
                "notification_date": format_date(reg.notification_date)
            } for reg in case.international_registrations] if case.international_registrations else None,
            "prior_registrations": [{
                "number": reg.number,
                "other_related_in": reg.other_related_in or False,
                "relationship_type": reg.relationship_type
            } for reg in case.prior_registrations] if case.prior_registrations else None,
            "classifications": [{
                "international_code": cls.international_code,
                "us_code": cls.us_code,
                "primary_code": cls.primary_code,
                "classification_status_code": cls.classification_status_code,
                "classification_status_date": format_date(cls.classification_status_date),
                "first_use_anywhere_date": format_date(cls.first_use_anywhere_date),
                "first_use_in_commerce_date": format_date(cls.first_use_in_commerce_date)
            } for cls in case.classifications] if case.classifications else None
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500
    finally:
        session.close()

@app.route('/api/combined_search', methods=['POST'])
def combined_search():
    """API endpoint for multi-filter trademark search"""
    try:
        data = request.get_json(force=True)
        
        # Validate required fields
        conditions = data.get('conditions', [])
        if not conditions:
            return jsonify({"error": "No search conditions provided"}), 400
            
        # Get optional parameters
        page = int(data.get('page', 1))
        per_page = int(data.get('per_page', 10))
        logic_operator = data.get('logic_operator', 'OR').upper()
        
        # Validate logic operator
        if logic_operator not in ['AND', 'OR']:
            return jsonify({"error": "Invalid logic operator. Must be 'AND' or 'OR'"}), 400
            
        # Execute multi-filter search
        from multi_filter_search import multi_filter_search
        results = multi_filter_search(
            conditions=conditions,
            page=page,
            per_page=per_page,
            logic_operator=logic_operator
        )
        
        return jsonify(results)
        
    except ValueError as e:
        return jsonify({"error": f"Invalid parameter: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Specify port 5000 explicitly 