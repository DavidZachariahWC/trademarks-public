# app.py
from flask import Flask, request, jsonify, render_template
from search_engine import SearchEngine, LogicOperator
from db_utils import get_autocomplete_suggestions
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
        
        if not query:
            return jsonify({"error": "No search query provided"}), 400

        # If only one search type, use simple search
        if len(search_types) == 1:
            results = SearchEngine.search(query, search_types[0], page, per_page)
        else:
            # Build complex search with multiple types
            builder = SearchEngine.build_search()
            
            # Add first condition
            builder.add_condition(
                SearchEngine.create_strategy(search_types[0], query)
            )
            
            # Add remaining conditions with OR operator
            for search_type in search_types[1:]:
                builder.add_condition(
                    SearchEngine.create_strategy(search_type, query),
                    LogicOperator.OR
                )
            
            results = SearchEngine.execute_complex_search(builder, page, per_page)
            
        return jsonify(results)
        
    except Exception as e:
        logging.error(f"Search API error: {str(e)}")
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

if __name__ == '__main__':
    app.run(debug=True) 