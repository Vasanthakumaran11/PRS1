"""
routes/product.py - Product listing and search routes.

GET /products                       - All products
GET /products/top-rated             - Top rated products
GET /products/category/{category}   - Products by category
GET /product/{productId}            - Single product details
GET /search                         - Search by query string
"""
from fastapi import APIRouter, HTTPException, Query, status
from database import products_col
from typing import List, Optional


router = APIRouter(tags=["Products"])


def serialize_product(doc: dict) -> dict:
    """Convert MongoDB document to clean JSON-serializable dict."""
    doc.pop("_id", None)
    return doc


# ---------------------------------------------------------------------------
# GET /products
# ---------------------------------------------------------------------------
@router.get("/products")
def get_all_products():
    products = list(products_col().find({}))
    return [serialize_product(p) for p in products]


# ---------------------------------------------------------------------------
# GET /products/top-rated   (must come BEFORE /products/category/{category})
# ---------------------------------------------------------------------------
@router.get("/products/top-rated")
def get_top_rated(limit: int = Query(default=10, ge=1, le=50)):
    products = list(
        products_col()
        .find({})
        .sort("avgRating", -1)
        .limit(limit)
    )
    return [serialize_product(p) for p in products]


# ---------------------------------------------------------------------------
# GET /products/category/{category}
# ---------------------------------------------------------------------------
@router.get("/products/category/{category}")
def get_products_by_category(category: str):
    products = list(products_col().find({"category": category.lower()}))
    if not products:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No products found in category '{category}'"
        )
    return [serialize_product(p) for p in products]


# ---------------------------------------------------------------------------
# GET /search?query=
# ---------------------------------------------------------------------------
@router.get("/search")
def search_products(query: str = Query(..., min_length=1)):
    q = query.lower()
    products = list(products_col().find({
        "$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"category": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
        ]
    }))
    return [serialize_product(p) for p in products]


# ---------------------------------------------------------------------------
# GET /product/{productId}
# ---------------------------------------------------------------------------
@router.get("/product/{productId}")
def get_product(productId: str):
    product = products_col().find_one({"productId": productId})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{productId}' not found."
        )
    return serialize_product(product)
