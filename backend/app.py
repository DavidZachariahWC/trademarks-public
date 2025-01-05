# app.py
from flask import Flask, request, jsonify
from search_engine import SearchEngine
from db_utils import get_autocomplete_suggestions, get_db_session
from models import CaseFile, CaseFileHeader
import logging
import json
from flask_cors import CORS  # Add CORS support

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Remove the home route since it will be handled by Next.js frontend
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
        logging.exception(f"Search API error:")
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
        logging.error(f"Autocomplete API error: {str(e)}")
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
            
        return jsonify({
            "serial_number": case.serial_number,
            "mark_identification": case.mark_identification,
            "registration_number": case.registration_number,
            "status_code": case.status_code,
            "filing_date": case.filing_date.isoformat() if case.filing_date else None,
            "registration_date": case.registration_date.isoformat() if case.registration_date else None,
            "attorney_name": case.attorney_name,
            # Add other case details as needed
        })
        
    except Exception as e:
        logging.error(f"Case details error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        session.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Specify port 5000 explicitly 