from flask import Flask, request, jsonify, render_template
from db_utils import search_mark_identification, get_autocomplete_suggestions
import logging

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
        search_type = request.args.get('type', 'wordmark')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        if not query:
            return jsonify({"error": "No search query provided"}), 400
            
        results = search_mark_identification(query, search_type, page, per_page)
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