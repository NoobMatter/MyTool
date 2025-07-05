#!/usr/bin/env python3
"""
Flask API for eBay iPhone Price Scraper
Serves the web app and handles eBay scraping requests
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import logging
import os
from ebay_scraper import EbayScraper
from price_analyzer import PriceAnalyzer

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper.log')
    ]
)

app = Flask(__name__)
CORS(app)

# Initialize scraper once
scraper = EbayScraper()

@app.route('/')
def index():
    """Serve the main HTML page"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    """Serve static files"""
    return send_from_directory('.', filename)

@app.route('/api/ebay-average', methods=['POST'])
def get_ebay_average():
    """Get average eBay price for a given URL"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        logging.info(f"Fetching eBay average for: {url[:50]}...")
        
        # Scrape the data (limit to 2 pages for faster response)
        listings = scraper.scrape_sold_listings(url, max_pages=2)
        
        if not listings:
            return jsonify({'error': 'No listings found'}), 404
        
        # Analyze prices
        analyzer = PriceAnalyzer(listings)
        stats = analyzer.calculate_statistics()
        
        if not stats:
            return jsonify({'error': 'No valid price data found'}), 404
        
        average_price = round(stats['average'], 2)
        
        return jsonify({
            'average_price': average_price,
            'listings_count': stats['count']
        })
        
    except Exception as e:
        logging.error(f"Error in get_ebay_average: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)