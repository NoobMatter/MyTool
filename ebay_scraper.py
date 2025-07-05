"""
eBay Scraper Module
Handles web scraping of eBay sold listings
"""

import requests
from bs4 import BeautifulSoup
import time
import re
import logging
from typing import List, Dict, Optional

class EbayScraper:
    """Scraper for eBay sold listings"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        })
        self.delay = 2  # Delay between requests in seconds
        
    def scrape_sold_listings(self, url: str, max_pages: int = 5) -> List[Dict]:
        """
        Scrape sold listings from eBay
        
        Args:
            url (str): eBay search URL
            max_pages (int): Maximum number of pages to scrape
            
        Returns:
            List[Dict]: List of listing dictionaries
        """
        all_listings = []
        
        try:
            for page in range(1, max_pages + 1):
                logging.info(f"Scraping page {page}")
                
                # Modify URL for pagination
                page_url = self._add_page_parameter(url, page)
                
                # Fetch page
                response = self._fetch_page(page_url)
                if not response:
                    break
                    
                # Parse listings from page
                listings = self._parse_listings(response.text)
                
                if not listings:
                    logging.info(f"No listings found on page {page}, stopping")
                    break
                    
                all_listings.extend(listings)
                logging.info(f"Found {len(listings)} listings on page {page}")
                
                # Respectful delay
                time.sleep(self.delay)
                
        except Exception as e:
            logging.error(f"Error during scraping: {e}")
            
        logging.info(f"Total listings scraped: {len(all_listings)}")
        return all_listings
    
    def _fetch_page(self, url: str) -> Optional[requests.Response]:
        """Fetch a single page with error handling"""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return response
            
        except requests.RequestException as e:
            logging.error(f"Error fetching page: {e}")
            return None
    
    def _add_page_parameter(self, url: str, page: int) -> str:
        """Add pagination parameter to URL"""
        if page == 1:
            return url
        
        # Add page parameter
        separator = "&" if "?" in url else "?"
        return f"{url}{separator}_pgn={page}"
    
    def _parse_listings(self, html: str) -> List[Dict]:
        """Parse listings from HTML"""
        soup = BeautifulSoup(html, 'html.parser')
        listings = []
        
        # Find listing items - eBay uses various selectors
        item_selectors = [
            '.s-item',
            '.srp-results .s-item',
            '[data-view="mi:1686|iid:1"]'
        ]
        
        items = []
        for selector in item_selectors:
            items = soup.select(selector)
            if items:
                break
                
        if not items:
            logging.warning("No items found with any selector")
            return listings
        
        for item in items:
            try:
                listing_data = self._extract_listing_data(item)
                if listing_data:
                    listings.append(listing_data)
            except Exception as e:
                logging.debug(f"Error parsing item: {e}")
                continue
                
        return listings
    
    def _extract_listing_data(self, item) -> Optional[Dict]:
        """Extract data from a single listing item"""
        try:
            # Extract title
            title_elem = item.select_one('.s-item__title, .it-ttl')
            title = title_elem.get_text(strip=True) if title_elem else "Unknown"
            
            # Skip if this is a promotional item
            if "shop on ebay" in title.lower() or not title or title == "Unknown":
                return None
            
            # Extract price
            price_elem = item.select_one('.s-item__price, .notranslate')
            if not price_elem:
                return None
                
            price_text = price_elem.get_text(strip=True)
            price = self._parse_price(price_text)
            
            if price is None:
                return None
            
            # Extract condition
            condition_elem = item.select_one('.s-item__subtitle, .s-item__condition')
            condition = condition_elem.get_text(strip=True) if condition_elem else "Unknown"
            
            # Extract link
            link_elem = item.select_one('.s-item__link, .it-ttl a')
            link = link_elem.get('href') if link_elem else ""
            
            # Extract shipping info
            shipping_elem = item.select_one('.s-item__shipping, .s-item__logisticsCost')
            shipping = shipping_elem.get_text(strip=True) if shipping_elem else "Unknown"
            
            return {
                'title': title,
                'price': price,
                'condition': condition,
                'shipping': shipping,
                'link': link
            }
            
        except Exception as e:
            logging.debug(f"Error extracting listing data: {e}")
            return None
    
    def _parse_price(self, price_text: str) -> Optional[float]:
        """Parse price from text"""
        if not price_text:
            return None
            
        # Remove common price prefixes and suffixes
        price_text = price_text.replace('$', '').replace(',', '').strip()
        
        # Handle price ranges (take the first price)
        if ' to ' in price_text:
            price_text = price_text.split(' to ')[0].strip()
        
        # Extract numeric price using regex
        price_match = re.search(r'(\d+\.?\d*)', price_text)
        if price_match:
            try:
                price = float(price_match.group(1))
                # Filter out obviously invalid prices
                if 10 <= price <= 5000:  # Reasonable range for iPhone prices
                    return price
            except ValueError:
                pass
                
        return None
