#!/usr/bin/env python3
"""
eBay Price Scraper
Main entry point for the application
"""

import sys
import logging
import json
from ebay_scraper import EbayScraper
from price_analyzer import PriceAnalyzer

# Configure logging to only file (no console output)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper.log')
    ]
)

def main():
    """Main function to run the eBay price scraper"""
    
    print("eBay Price Scraper")
    print("=" * 30)
    
    try:
        # Try to read URL from config.json first
        url = None
        try:
            with open('config.json', 'r') as f:
                config = json.load(f)
                url = config.get('ebay_url', '').strip()
        except FileNotFoundError:
            print("Config file not found. Please create config.json with your eBay URL.")
            return
        except json.JSONDecodeError:
            print("Error reading config.json. Please check the file format.")
            return
        
        # Check if URL is provided as command line argument (override config)
        if len(sys.argv) > 1:
            url = sys.argv[1]
        
        if not url:
            print("Please add an eBay URL to config.json")
            print("Example: {\"ebay_url\": \"your-ebay-url-here\"}")
            return
        
        print(f"Using URL from config: {url[:50]}...")
        print("Scraping data...")
        
        # Initialize scraper
        scraper = EbayScraper()
        
        # Scrape the data
        listings = scraper.scrape_sold_listings(url)
        
        if not listings:
            print("No listings found. Please check the URL or try again later.")
            return
        
        # Analyze prices
        analyzer = PriceAnalyzer(listings)
        stats = analyzer.calculate_statistics()
        
        if stats:
            average_price = round(stats['average'], 2)
            
            # Save to JSON file
            result = {"average_price": average_price}
            
            with open('average_price.json', 'w') as f:
                json.dump(result, f, indent=2)
            
            print(f"Average price: ${average_price}")
            print("Result saved to average_price.json")
        else:
            print("No valid price data found for analysis.")
            
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        print(f"An error occurred: {e}")
        print("Check scraper.log for more details.")

if __name__ == "__main__":
    main()
