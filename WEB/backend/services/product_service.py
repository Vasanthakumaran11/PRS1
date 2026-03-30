"""
services/product_service.py - Product data integration service.

Fetches real product data from Fake Store API and enriches it with:
- Platform comparison data (Amazon vs Flipkart)
- Price variations per platform
- Delivery information
- Platform ratings

Stores data in MongoDB using upsert pattern.
"""
import requests
import random
from datetime import datetime
import logging
from database import products_col
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

FAKE_STORE_API = "https://fakestoreapi.com/products"


def generate_platform_price(base_price: float, platform: str) -> float:
    """
    Generate platform-specific price with variation.
    
    - Amazon: base_price + random variation (0-15%)
    - Flipkart: base_price - random variation (0-10%)
    """
    if platform == "amazon":
        variation = random.uniform(0, base_price * 0.15)
        return round(base_price + variation, 2)
    elif platform == "flipkart":
        variation = random.uniform(0, base_price * 0.10)
        return round(base_price - variation, 2)
    return base_price


def generate_platform_rating(base_rating: float) -> float:
    """Generate platform-specific rating with slight variation."""
    variation = random.uniform(-0.3, 0.5)
    rating = base_rating + variation
    return round(max(0, min(5.0, rating)), 2)  # Clamp between 0-5


def generate_delivery_days(platform: str) -> int:
    """Generate delivery days based on platform."""
    if platform == "amazon":
        return random.randint(1, 2)  # 1-2 days
    elif platform == "flipkart":
        return random.randint(2, 3)  # 2-3 days
    return 2


def fetch_products_from_api() -> List[Dict[str, Any]]:
    """
    Fetch products from Fake Store API.
    
    Returns:
        List of products from API or empty list if fetch fails.
    """
    try:
        logger.info(f"Fetching products from {FAKE_STORE_API}")
        response = requests.get(FAKE_STORE_API, timeout=10)
        response.raise_for_status()
        products = response.json()
        logger.info(f"✓ Fetched {len(products)} products from Fake Store API")
        return products
    except Exception as e:
        logger.error(f"✗ Failed to fetch from Fake Store API: {e}")
        return []


def transform_product(api_product: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform Fake Store API product to our enriched schema.
    
    Adds:
    - Platform-specific prices
    - Platform ratings
    - Delivery information
    - Timestamp
    
    Args:
        api_product: Product from Fake Store API
        
    Returns:
        Transformed product for MongoDB storage
    """
    base_price = float(api_product.get("price", 10.0))
    base_rating = float(api_product.get("rating", {}).get("rate", 3.0))
    
    return {
        "productId": str(api_product["id"]),
        "name": api_product.get("title", ""),
        "description": api_product.get("description", ""),
        "category": api_product.get("category", "").lower(),
        "image": api_product.get("image", ""),
        "base_price": base_price,
        "rating": base_rating,
        "platforms": {
            "amazon": {
                "price": generate_platform_price(base_price, "amazon"),
                "delivery": generate_delivery_days("amazon"),
                "rating": generate_platform_rating(base_rating),
            },
            "flipkart": {
                "price": generate_platform_price(base_price, "flipkart"),
                "delivery": generate_delivery_days("flipkart"),
                "rating": generate_platform_rating(base_rating),
            }
        },
        "lastUpdated": datetime.utcnow(),
        # For backward compatibility with existing code
        "avgRating": base_rating,
        "reviewCount": int(api_product.get("rating", {}).get("count", 0)),
        "price_amazon": generate_platform_price(base_price, "amazon"),
        "price_flipkart": generate_platform_price(base_price, "flipkart"),
    }


def load_products_to_db() -> Dict[str, Any]:
    """
    Fetch products from Fake Store API and store/update in MongoDB.
    
    Uses upsert pattern: update if exists, insert if new.
    
    Returns:
        Dict with operation results and statistics.
    """
    try:
        # Fetch from API
        api_products = fetch_products_from_api()
        
        if not api_products:
            return {
                "success": False,
                "message": "Failed to fetch products from Fake Store API",
                "productsLoaded": 0,
                "productsInserted": 0,
                "productsUpdated": 0,
            }
        
        # Transform products
        products_to_load = [transform_product(p) for p in api_products]
        
        # Upsert to MongoDB
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
        
        logger.info(
            f"✓ Product load complete: "
            f"{len(products_to_load)} total, "
            f"{inserted_count} inserted, "
            f"{updated_count} updated"
        )
        
        return {
            "success": True,
            "message": f"Successfully loaded {len(products_to_load)} products",
            "productsLoaded": len(products_to_load),
            "productsInserted": inserted_count,
            "productsUpdated": updated_count,
        }
        
    except Exception as e:
        logger.error(f"✗ Error loading products: {e}")
        return {
            "success": False,
            "message": f"Error loading products: {str(e)}",
            "productsLoaded": 0,
            "productsInserted": 0,
            "productsUpdated": 0,
            "error": str(e),
        }
