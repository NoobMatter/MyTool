"""
Price Analyzer Module
Handles statistical analysis of scraped price data
"""

import statistics
from typing import List, Dict, Optional
import logging

class PriceAnalyzer:
    """Analyzer for price statistics"""
    
    def __init__(self, listings: List[Dict]):
        self.listings = listings
        self.prices = self._extract_valid_prices()
        
    def _extract_valid_prices(self) -> List[float]:
        """Extract valid prices from listings"""
        prices = []
        
        for listing in self.listings:
            price = listing.get('price')
            if price is not None and isinstance(price, (int, float)):
                prices.append(float(price))
        
        # Remove obvious outliers (prices that are too high or too low)
        if prices:
            prices = self._remove_outliers(prices)
        
        logging.info(f"Extracted {len(prices)} valid prices from {len(self.listings)} listings")
        return prices
    
    def _remove_outliers(self, prices: List[float]) -> List[float]:
        """Remove statistical outliers from price data"""
        if len(prices) < 3:
            return prices
        
        # Calculate quartiles
        q1 = statistics.quantiles(prices, n=4)[0]
        q3 = statistics.quantiles(prices, n=4)[2]
        iqr = q3 - q1
        
        # Define outlier bounds
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        
        # Filter outliers
        filtered_prices = [p for p in prices if lower_bound <= p <= upper_bound]
        
        outliers_removed = len(prices) - len(filtered_prices)
        if outliers_removed > 0:
            logging.info(f"Removed {outliers_removed} outliers from price data")
        
        return filtered_prices
    
    def calculate_statistics(self) -> Optional[Dict]:
        """Calculate comprehensive price statistics"""
        if not self.prices:
            return None
        
        try:
            stats = {
                'count': len(self.prices),
                'average': statistics.mean(self.prices),
                'median': statistics.median(self.prices),
                'min': min(self.prices),
                'max': max(self.prices),
                'range': max(self.prices) - min(self.prices),
                'std_dev': statistics.stdev(self.prices) if len(self.prices) > 1 else 0,
                'distribution': self._calculate_distribution()
            }
            
            return stats
            
        except Exception as e:
            logging.error(f"Error calculating statistics: {e}")
            return None
    
    def _calculate_distribution(self) -> Dict[str, int]:
        """Calculate price distribution in ranges"""
        if not self.prices:
            return {}
        
        min_price = min(self.prices)
        max_price = max(self.prices)
        
        # Create 5 equal ranges
        range_size = (max_price - min_price) / 5
        
        ranges = {}
        for i in range(5):
            range_start = min_price + (i * range_size)
            range_end = min_price + ((i + 1) * range_size)
            
            if i == 4:  # Last range includes max value
                count = sum(1 for p in self.prices if range_start <= p <= range_end)
            else:
                count = sum(1 for p in self.prices if range_start <= p < range_end)
            
            range_key = f"${range_start:.0f} - ${range_end:.0f}"
            ranges[range_key] = count
        
        return ranges
    
    def get_price_summary(self) -> str:
        """Get a formatted summary of the price analysis"""
        stats = self.calculate_statistics()
        
        if not stats:
            return "No valid price data available for analysis."
        
        summary = f"""
Price Analysis Summary
======================
Total Listings: {stats['count']}
Average Price: ${stats['average']:.2f}
Median Price: ${stats['median']:.2f}
Price Range: ${stats['min']:.2f} - ${stats['max']:.2f}
Standard Deviation: ${stats['std_dev']:.2f}

Price Distribution:
"""
        
        for range_str, count in stats['distribution'].items():
            percentage = (count / stats['count']) * 100
            summary += f"  {range_str}: {count} listings ({percentage:.1f}%)\n"
        
        return summary
    
    def get_listings_by_price_range(self, min_price: float, max_price: float) -> List[Dict]:
        """Get listings within a specific price range"""
        filtered_listings = []
        
        for listing in self.listings:
            price = listing.get('price')
            if price is not None and min_price <= price <= max_price:
                filtered_listings.append(listing)
        
        return filtered_listings
