# app.py
from flask import Flask, request, jsonify, render_template
from search_engine import SearchEngine
from db_utils import get_autocomplete_suggestions, get_db_session
from models import CaseFile, CaseFileHeader
import logging
import json

app = Flask(__name__)

@app.route('/')
def home():
    """Render the search interface"""
    return render_template('index.html')

@app.route('/api/search')
def search():
    """API endpoint for trademark search"""
    try:
        query = request.args.get('query', '')
        search_types = request.args.getlist('type[]') or [request.args.get('type', 'wordmark')]
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        logging.info(f"Search request - Type: {search_types}, Query: '{query}'")
        
        # Only allow one search type for now
        if len(search_types) > 1:
            return jsonify({"error": "Multiple search types not supported yet"}), 400
        
        search_type = search_types[0]
        
        # Check if we need a query (for text-based searches)
        text_search_types = {'wordmark', 'phonetic', 'attorney'}
        requires_query = search_type in text_search_types
        
        if requires_query and not query:
            return jsonify({"error": "Search query required for text-based searches"}), 400

        # Execute single search type
        logging.info(f"Executing search with type: {search_type}, query: '{query}'")
        results = SearchEngine.search(query, search_type, page, per_page)
        
        logging.info(f"Search results - Count: {len(results.get('results', []))}")
        
        return jsonify(results)
        
    except Exception as e:
        logging.exception(f"Search API error for query '{query}' with type '{search_types}':")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/autocomplete')
def autocomplete():
    """API endpoint for autocomplete suggestions"""
    try:
        prefix = request.args.get('prefix', '')
        if not prefix:
            return jsonify([])
            
        suggestions = get_autocomplete_suggestions(prefix)
        return jsonify(suggestions)
        
    except Exception as e:
        logging.error(f"Autocomplete API error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/case/<int:serial_number>')
def case_details(serial_number):
    """Display detailed information for a specific trademark case"""
    try:
        session = get_db_session()
        case = (session.query(CaseFile)
               .join(CaseFileHeader)
               .filter(CaseFile.serial_number == serial_number)
               .first())
               
        if not case:
            return "Case not found", 404
            
        return render_template('case_details.html', case=case)
        
    except Exception as e:
        logging.error(f"Case details error: {str(e)}")
        return "Error loading case details", 500
    finally:
        session.close()

if __name__ == '__main__':
    app.run(debug=True) 