from fastapi import APIRouter, HTTPException
from database import products_collection, reviews_collection
from schemas.product_schema import product_schema, products_schema
from schemas.review_schema import reviews_schema

router = APIRouter()

@router.get("/product/{productId}")
async def get_product(productId: str):
    product = products_collection.find_one({"productId": productId})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    raw_reviews = reviews_collection.find({"productId": productId})
    return {"product": product_schema(product), "reviews": reviews_schema(raw_reviews)}

@router.get("/top-products")
async def get_top_products(n: int = 5):
    raw_products = products_collection.find().sort("avgRating", -1).limit(n)
    return {"topProducts": products_schema(raw_products)}
