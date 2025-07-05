# eBay iPhone Price Scraper

## Overview

This is a Python-based web scraping application designed to analyze eBay sold listings for iPhone prices. The system scrapes eBay's sold listings, extracts price data, and performs statistical analysis to provide insights into market pricing trends. The application is specifically configured for iPhone 13 Pro Max 256GB but can be adapted for other products.

## System Architecture

The application follows a modular architecture with clear separation of concerns:

- **Web Scraping Layer**: Handles data extraction from eBay using HTTP requests and HTML parsing
- **Data Processing Layer**: Processes and validates scraped data
- **Analysis Layer**: Performs statistical analysis on price data
- **Presentation Layer**: Displays results to the user via command-line interface

## Key Components

### 1. EbayScraper (`ebay_scraper.py`)
- **Purpose**: Handles web scraping of eBay sold listings
- **Key Features**:
  - HTTP session management with realistic browser headers
  - Rate limiting with configurable delays
  - Multi-page scraping capability
  - Error handling and logging
- **Architecture Decision**: Uses requests + BeautifulSoup for reliability and maintainability over more complex frameworks like Selenium

### 2. PriceAnalyzer (`price_analyzer.py`)
- **Purpose**: Performs statistical analysis on scraped price data
- **Key Features**:
  - Price validation and filtering
  - Outlier detection using IQR method
  - Statistical calculations (mean, median, mode, etc.)
  - Data quality assessment
- **Architecture Decision**: Uses built-in statistics module for lightweight analysis without heavy dependencies

### 3. Main Application (`main.py`)
- **Purpose**: Entry point and orchestration of the scraping and analysis process
- **Key Features**:
  - User interaction for URL input
  - Logging configuration
  - Error handling and user feedback
  - Results presentation

## Data Flow

1. **Input**: User provides eBay URL or uses default iPhone 13 Pro Max search
2. **Scraping**: EbayScraper fetches and parses HTML from multiple pages
3. **Processing**: Raw HTML is parsed to extract listing data (price, title, condition, etc.)
4. **Analysis**: PriceAnalyzer validates prices, removes outliers, and calculates statistics
5. **Output**: Results are displayed to user via command-line interface

## External Dependencies

### Core Libraries
- **requests**: HTTP client for web scraping
- **BeautifulSoup4**: HTML parsing and data extraction
- **logging**: Built-in logging for debugging and monitoring

### Rationale for Technology Choices
- **requests over urllib**: Better API and session management
- **BeautifulSoup over lxml**: More forgiving HTML parsing for inconsistent web content
- **No database**: Simple file-based approach for lightweight deployment
- **Command-line interface**: Minimal dependencies and easy automation

## Deployment Strategy

The application is designed for simple deployment:
- **Environment**: Python 3.7+ required
- **Dependencies**: Minimal external dependencies for easy setup
- **Execution**: Single-file execution via `python main.py`
- **Logging**: File-based logging (`scraper.log`) for debugging
- **Configuration**: Hard-coded defaults with runtime customization options

## Changelog

- July 05, 2025. Initial setup
- July 05, 2025. Updated to accept any eBay URL and output only average price to JSON file
- July 05, 2025. Integrated with iPhone price app to show real-time eBay averages
- July 05, 2025. Enhanced eBay URLs with better filters to exclude broken/parts-only listings

## User Preferences

Preferred communication style: Simple, everyday language.
- Wants clean output with only average price in JSON format
- Prefers to input custom eBay URLs rather than default searches
- Wants filtered eBay results excluding broken/parts-only phones for accurate pricing