"""
services/product_service.py - Product data integration service.

Fetches product data from local CSV files (extracted from Amazon, Reliance Digital, and Myntra Fashion)
and enriches it with platform comparison details, handling missing ratings and reviews
with worthiness-based and random defaults, and populating rich metadata fields.

Stores data in MongoDB using upsert pattern.
"""
import csv
import re
import os
import random
from datetime import datetime
import logging
from database import products_col
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

SERVICES_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(SERVICES_DIR)
WEB_DIR = os.path.dirname(BACKEND_DIR)
DATA_DIR = os.path.join(WEB_DIR, "Data")

AMAZON_CSV_PATH = os.path.join(DATA_DIR, "amazon_data_with_images.csv")
RELIANCE_CSV_PATH = os.path.join(DATA_DIR, "reliance_digital_mobiles.csv")
FASHION_CSV_PATH = os.path.join(DATA_DIR, "fashion_data.csv")
FURNITURE_CSV_PATH = os.path.join(DATA_DIR, "furniture_data.csv")
HOUSEHOLD_CSV_PATH = os.path.join(DATA_DIR, "household_data.csv")


def clean_price(price_str: str) -> float:
    """Clean and parse price string to float."""
    if not price_str:
        return None
    # Remove currency symbols, commas, trailing dots/spaces
    price_str = price_str.replace('₹', '').replace('$', '').replace(',', '').strip()
    if price_str.endswith('.'):
        price_str = price_str[:-1]
    if not price_str:
        return None
    try:
        return float(price_str)
    except ValueError:
        return None


def clean_fashion_price(price_str: str) -> float:
    """Clean Myntra-specific double-price format (e.g. Rs. 1209Rs. 1799)."""
    if not price_str:
        return None
    price_str = price_str.strip()
    # Find the first Rs. followed by digits (ignores trailing MRP duplicate)
    match = re.search(r'Rs\.\s*([\d,]+)', price_str)
    if match:
        val_str = match.group(1).replace(',', '').strip()
        try:
            return float(val_str)
        except ValueError:
            pass
    return clean_price(price_str)


def clean_rating(rating_val: str) -> float:
    """Clean and parse rating value to float. Returns None if invalid/missing."""
    if not rating_val:
        return None
    rating_val = str(rating_val).strip()
    if rating_val.lower() == 'n/a' or not rating_val:
        return None
    match = re.match(r'^([0-9.]+)', rating_val)
    if match:
        try:
            val = float(match.group(1))
            return round(max(0.0, min(5.0, val)), 2)
        except ValueError:
            pass
    return None


def generate_worthiness_rating(brand: str, price: float) -> float:
    """
    Generate product rating dynamically based on price tier and brand prestige.
    Returns a realistic rating between 3.6 and 4.9.
    """
    rating = 3.8
    brand_lower = brand.lower() if brand else ""
    
    premium_brands = ["apple", "samsung", "google", "oneplus", "damensch", "peter england", "varanga", "sangria", "urban ladder", "fresho"]
    average_brands = ["motorola", "realme", "roadster", "highlander", "mast & harbour", "bigbasket"]
    
    if any(pb in brand_lower for pb in premium_brands):
        rating += 0.5
    elif any(ab in brand_lower for ab in average_brands):
        rating += 0.2
        
    # Price worthiness weights
    if price > 50000:
        rating += 0.4
    elif price > 10000:
        rating += 0.2
    elif price > 1000:
        rating += 0.1
        
    # Inject slight controlled randomness
    variation = random.uniform(-0.3, 0.2)
    final_rating = round(rating + variation, 1)
    return max(3.6, min(4.9, final_rating))


def extract_brand(title: str, default_brand: str = "Generic") -> str:
    """Extract known brand from product titles."""
    title_lower = title.lower()
    brands = ["samsung", "google", "oneplus", "apple", "motorola", "realme", "itel", "micromax", "jio", "karbonn", "suritch", "dexnor"]
    for b in brands:
        if b in title_lower:
            return b.capitalize() if b != "jio" else "Jio"
    return default_brand


def load_products_from_csv() -> List[Dict[str, Any]]:
    """
    Read and parse Amazon, Reliance Digital, and Fashion CSV files.
    """
    products = []
    
    # 1. Parse Amazon CSV (Electronics/Accessories)
    if os.path.exists(AMAZON_CSV_PATH):
        try:
            logger.info(f"Loading Amazon CSV from {AMAZON_CSV_PATH}")
            with open(AMAZON_CSV_PATH, mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for idx, row in enumerate(reader, 1):
                    title = row.get('title', '').strip()
                    if not title:
                        continue
                    
                    price = clean_price(row.get('price'))
                    if price is None:
                        if any(k in title.lower() for k in ["case", "kickstand", "cover", "protector", "stand"]):
                            price = 499.0
                        else:
                            price = 9999.0
                            
                    brand = extract_brand(title)
                    
                    # Worthiness-based ratings and random reviews count
                    rating = clean_rating(row.get('rating'))
                    if rating is None:
                        rating = generate_worthiness_rating(brand, price)
                    reviews = random.randint(50, 1500)
                    
                    image = row.get('image', '').strip()
                    availability = row.get('availability', 'In Stock').strip()
                    mrp = round(price * random.uniform(1.1, 1.25), 2)
                    detail_link = f"https://www.amazon.in/s?k={title.replace(' ', '+')}"
                    
                    comparison_price = round(price * random.uniform(0.95, 1.1), 2)
                    comparison_rating = round(max(1.0, min(5.0, rating + random.uniform(-0.3, 0.4))), 2)
                    
                    product_id = f"amz_{idx}"
                    prod_doc = {
                        "productId": product_id,
                        "name": title,
                        "description": f"Availability: {availability}. High-quality product available on Amazon.",
                        "category": "electronics",
                        "image": image,
                        "base_price": price,
                        "rating": rating,
                        "avgRating": rating,
                        "reviewCount": reviews,
                        # Dynamic Rich Metadata
                        "brand": brand,
                        "mrp": mrp,
                        "availability": availability,
                        "available_sizes": None,
                        "detail_link": detail_link,
                        "source_url": "https://www.amazon.in",
                        "platforms": {
                            "amazon": {
                                "price": price,
                                "delivery": random.randint(1, 2),
                                "rating": rating,
                            },
                            "flipkart": {
                                "price": comparison_price,
                                "delivery": random.randint(2, 3),
                                "rating": comparison_rating,
                            }
                        },
                        "price_amazon": price,
                        "price_flipkart": comparison_price,
                        "lastUpdated": datetime.utcnow()
                    }
                    products.append(prod_doc)
            logger.info(f"✓ Loaded {len(products)} products from Amazon CSV")
        except Exception as e:
            logger.error(f"✗ Error reading Amazon CSV: {e}")
    else:
        logger.warning(f"Amazon CSV not found at {AMAZON_CSV_PATH}")

    # 2. Parse Reliance Digital CSV (Mobiles)
    if os.path.exists(RELIANCE_CSV_PATH):
        try:
            logger.info(f"Loading Reliance Digital CSV from {RELIANCE_CSV_PATH}")
            reliance_count = 0
            with open(RELIANCE_CSV_PATH, mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for idx, row in enumerate(reader, 1):
                    title = row.get('Product Title', '').strip()
                    if not title:
                        continue
                    
                    price = clean_price(row.get('Price'))
                    if price is None:
                        price = 14999.0
                        
                    brand = extract_brand(title)
                    rating = clean_rating(row.get('Rating'))
                    if rating is None:
                        rating = generate_worthiness_rating(brand, price)
                    reviews = random.randint(50, 1500)
                    
                    image = row.get('Product Image URL', '').strip()
                    product_link = row.get('Product Link', '').strip()
                    mrp = round(price * random.uniform(1.1, 1.25), 2)
                    
                    comparison_price = round(price * random.uniform(0.9, 1.05), 2)
                    comparison_rating = round(max(1.0, min(5.0, rating + random.uniform(-0.3, 0.4))), 2)
                    
                    product_id = f"rel_{idx}"
                    prod_doc = {
                        "productId": product_id,
                        "name": title,
                        "description": f"Featured mobile phone on Reliance Digital. View detail link for checkout.",
                        "category": "electronics",
                        "image": image,
                        "base_price": price,
                        "rating": rating,
                        "avgRating": rating,
                        "reviewCount": reviews,
                        # Dynamic Rich Metadata
                        "brand": brand,
                        "mrp": mrp,
                        "availability": "In Stock",
                        "available_sizes": None,
                        "detail_link": product_link,
                        "source_url": "https://www.reliancedigital.in",
                        "platforms": {
                            "amazon": {
                                "price": comparison_price,
                                "delivery": random.randint(1, 2),
                                "rating": comparison_rating,
                            },
                            "flipkart": {
                                "price": price,
                                "delivery": random.randint(2, 3),
                                "rating": rating,
                            }
                        },
                        "price_amazon": comparison_price,
                        "price_flipkart": price,
                        "lastUpdated": datetime.utcnow()
                    }
                    products.append(prod_doc)
                    reliance_count += 1
            logger.info(f"✓ Loaded {reliance_count} products from Reliance Digital CSV")
        except Exception as e:
            logger.error(f"✗ Error reading Reliance Digital CSV: {e}")
    else:
        logger.warning(f"Reliance Digital CSV not found at {RELIANCE_CSV_PATH}")

    # 3. Parse Myntra Fashion CSV (Clothing/Kurtas/Blazers)
    if os.path.exists(FASHION_CSV_PATH):
        try:
            logger.info(f"Loading Myntra Fashion CSV from {FASHION_CSV_PATH}")
            fashion_count = 0
            with open(FASHION_CSV_PATH, mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for idx, row in enumerate(reader, 1):
                    title = row.get('product_title', '').strip()
                    image = row.get('image_url', '').strip()
                    
                    # CRITICAL UI RULE: Skip rows that lack image or title to preserve visual appeal
                    if not title or not image or image.lower() in ['n/a', '']:
                        continue
                    
                    price = clean_fashion_price(row.get('price_discounted'))
                    if price is None:
                        price = 799.0  # Safe fallback price for clothing items
                        
                    mrp = clean_fashion_price(row.get('mrp'))
                    if mrp is None or mrp < price:
                        mrp = round(price * random.uniform(1.2, 1.4), 2)
                        
                    brand = row.get('brand', '').strip()
                    if not brand:
                        brand = "Generic Clothing"
                        
                    rating = generate_worthiness_rating(brand, price)
                    reviews = random.randint(30, 800)
                    
                    sizes = row.get('available_sizes', '').strip()
                    if not sizes or sizes.lower() in ['n/a', '']:
                        sizes = "S, M, L, XL, XXL"
                        
                    detail_link = row.get('detail_link', '').strip()
                    if detail_link and not detail_link.startswith('http'):
                        detail_link = f"https://www.myntra.com/{detail_link}"
                    
                    source_url = row.get('source_url', 'https://www.myntra.com').strip()
                    
                    comparison_price = round(price * random.uniform(0.92, 1.08), 2)
                    comparison_rating = round(max(1.0, min(5.0, rating + random.uniform(-0.3, 0.3))), 2)
                    
                    product_id = f"fash_{idx}"
                    prod_doc = {
                        "productId": product_id,
                        "name": title,
                        "description": f"Elegant clothing and lifestyle design by {brand}. Premium wear for modern wardrobes.",
                        "category": "fashion",
                        "image": image,
                        "base_price": price,
                        "rating": rating,
                        "avgRating": rating,
                        "reviewCount": reviews,
                        # Dynamic Rich Metadata
                        "brand": brand,
                        "mrp": mrp,
                        "availability": "In Stock",
                        "available_sizes": sizes,
                        "detail_link": detail_link,
                        "source_url": source_url,
                        "platforms": {
                            "amazon": {
                                "price": comparison_price,
                                "delivery": random.randint(1, 2),
                                "rating": comparison_rating,
                            },
                            "flipkart": {
                                "price": price,
                                "delivery": random.randint(2, 3),
                                "rating": rating,
                            }
                        },
                        "price_amazon": comparison_price,
                        "price_flipkart": price,
                        "lastUpdated": datetime.utcnow()
                    }
                    products.append(prod_doc)
                    fashion_count += 1
            logger.info(f"✓ Loaded {fashion_count} products from Myntra Fashion CSV (Skipped rows without images)")
        except Exception as e:
            logger.error(f"✗ Error reading Myntra Fashion CSV: {e}")
    # 4. Parse Furniture CSV (Home & Furniture)
    if os.path.exists(FURNITURE_CSV_PATH):
        try:
            logger.info(f"Loading Furniture CSV from {FURNITURE_CSV_PATH}")
            furniture_count = 0
            with open(FURNITURE_CSV_PATH, mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for idx, row in enumerate(reader, 1):
                    title = row.get('Product Title', '').strip()
                    image = row.get('High-Resolution Image URL', '').strip()
                    
                    if not title or not image or image.lower() in ['n/a', '']:
                        continue
                    
                    price = clean_price(row.get('Price'))
                    if price is None:
                        price = 9999.0
                        
                    brand = row.get('Brand / Seller', '').strip()
                    if not brand or brand.lower() == 'n/a':
                        brand = "Urban Ladder"
                        
                    material = row.get('Primary Material', '').strip()
                    if not material or material.lower() == 'n/a':
                        material = "Wood"
                        
                    rating = generate_worthiness_rating(brand, price)
                    reviews = random.randint(30, 800)
                    
                    detail_link = row.get('Product Link', '').strip()
                    if not detail_link:
                        detail_link = f"https://www.urbanladder.com/s?q={title.replace(' ', '+')}"
                    
                    source_url = "https://www.urbanladder.com"
                    
                    comparison_price = round(price * random.uniform(0.92, 1.08), 2)
                    comparison_rating = round(max(1.0, min(5.0, rating + random.uniform(-0.3, 0.3))), 2)
                    
                    product_id = f"furn_{idx}"
                    prod_doc = {
                        "productId": product_id,
                        "name": title,
                        "description": f"High-quality {material} furniture by {brand}. Premium addition to modern homes.",
                        "category": "home",
                        "image": image,
                        "base_price": price,
                        "rating": rating,
                        "avgRating": rating,
                        "reviewCount": reviews,
                        "brand": brand,
                        "mrp": round(price * random.uniform(1.2, 1.4), 2),
                        "availability": "In Stock",
                        "available_sizes": None,
                        "detail_link": detail_link,
                        "source_url": source_url,
                        "platforms": {
                            "amazon": {
                                "price": comparison_price,
                                "delivery": random.randint(1, 2),
                                "rating": comparison_rating,
                            },
                            "flipkart": {
                                "price": price,
                                "delivery": random.randint(2, 3),
                                "rating": rating,
                            }
                        },
                        "price_amazon": comparison_price,
                        "price_flipkart": price,
                        "lastUpdated": datetime.utcnow()
                    }
                    products.append(prod_doc)
                    furniture_count += 1
            logger.info(f"✓ Loaded {furniture_count} products from Furniture CSV")
        except Exception as e:
            logger.error(f"✗ Error reading Furniture CSV: {e}")
    else:
        logger.warning(f"Furniture CSV not found at {FURNITURE_CSV_PATH}")

    # 5. Parse Household CSV (Groceries & Essentials)
    if os.path.exists(HOUSEHOLD_CSV_PATH):
        try:
            logger.info(f"Loading Household CSV from {HOUSEHOLD_CSV_PATH}")
            household_count = 0
            with open(HOUSEHOLD_CSV_PATH, mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for idx, row in enumerate(reader, 1):
                    title = row.get('Product Name', '').strip()
                    image = row.get('Product Image URL', '').strip()
                    
                    if not title or not image or image.lower() in ['n/a', '']:
                        continue
                    
                    price = clean_price(row.get('Current Price'))
                    if price is None:
                        price = 99.0
                        
                    qty = row.get('Quantity / Weight / Volume', '').strip()
                    status_avail = row.get('Stock Availability Status', 'In Stock').strip()
                    
                    brand = "BigBasket"
                    if title.startswith("fresho!"):
                        brand = "Fresho"
                        
                    rating = generate_worthiness_rating(brand, price)
                    reviews = random.randint(10, 500)
                    
                    detail_link = row.get('Product Link', '').strip()
                    if not detail_link:
                        detail_link = f"https://www.bigbasket.com/s?q={title.replace(' ', '+')}"
                        
                    source_url = "https://www.bigbasket.com"
                    
                    comparison_price = round(price * random.uniform(0.92, 1.08), 2)
                    comparison_rating = round(max(1.0, min(5.0, rating + random.uniform(-0.3, 0.3))), 2)
                    
                    product_id = f"house_{idx}"
                    prod_doc = {
                        "productId": product_id,
                        "name": title,
                        "description": f"Fresh and healthy {title} ({qty}). Quality essentials delivered straight to your home.",
                        "category": "household",
                        "image": image,
                        "base_price": price,
                        "rating": rating,
                        "avgRating": rating,
                        "reviewCount": reviews,
                        "brand": brand,
                        "mrp": round(price * random.uniform(1.1, 1.2), 2),
                        "availability": status_avail,
                        "available_sizes": qty,
                        "detail_link": detail_link,
                        "source_url": source_url,
                        "platforms": {
                            "amazon": {
                                "price": comparison_price,
                                "delivery": random.randint(1, 2),
                                "rating": comparison_rating,
                            },
                            "flipkart": {
                                "price": price,
                                "delivery": random.randint(1, 2),
                                "rating": rating,
                            }
                        },
                        "price_amazon": comparison_price,
                        "price_flipkart": price,
                        "lastUpdated": datetime.utcnow()
                    }
                    products.append(prod_doc)
                    household_count += 1
            logger.info(f"✓ Loaded {household_count} products from Household CSV")
        except Exception as e:
            logger.error(f"✗ Error reading Household CSV: {e}")
    else:
        logger.warning(f"Household CSV not found at {HOUSEHOLD_CSV_PATH}")

    return products


def load_products_to_db() -> Dict[str, Any]:
    """
    Load products from all local CSV files and store/update in MongoDB.
    """
    try:
        products_to_load = load_products_from_csv()
        
        if not products_to_load:
            return {
                "success": False,
                "message": "No products found in CSV files to load",
                "productsLoaded": 0,
                "productsInserted": 0,
                "productsUpdated": 0,
            }
        
        col = products_col()
        inserted_count = 0
        updated_count = 0
        
        for product in products_to_load:
            result = col.update_one(
                {"productId": product["productId"]},
                {"$set": product},
                upsert=True
            )
            
            if result.upserted_id:
                inserted_count += 1
            elif result.modified_count > 0:
                updated_count += 1
            else:
                updated_count += 1
        
        logger.info(
            f"✓ CSV Product load complete: "
            f"{len(products_to_load)} total, "
            f"{inserted_count} inserted, "
            f"{updated_count} updated"
        )
        
        return {
            "success": True,
            "message": f"Successfully loaded {len(products_to_load)} products from all CSV datasets",
            "productsLoaded": len(products_to_load),
            "productsInserted": inserted_count,
            "productsUpdated": updated_count,
        }
        
    except Exception as e:
        logger.error(f"✗ Error loading products from CSV: {e}")
        return {
            "success": False,
            "message": f"Error loading products from CSV: {str(e)}",
            "productsLoaded": 0,
            "productsInserted": 0,
            "productsUpdated": 0,
            "error": str(e),
        }
