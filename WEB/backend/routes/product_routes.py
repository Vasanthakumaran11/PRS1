from fastapi import APIRouter, Depends, HTTPException
from models.product_model import ProductCreate
from schemas.product_schema import product_serializer, product_list_serializer
from schemas.review_schema import review_list_serializer
from database import products_collection, reviews_collection
from auth import get_current_user

router = APIRouter()

@router.post("/add-product")
def add_product(product: ProductCreate, current_user: dict = Depends(get_current_user)):
    existing_product = products_collection.find_one({"productId": product.productId})
    if existing_product:
        raise HTTPException(status_code=400, detail="Product ID already exists")
    
    new_product = {
        "productId": product.productId,
        "name": product.name,
        "avgRating": 0.0,
        "reviewCount": 0
    }
    products_collection.insert_one(new_product)
    
    # Exclude _id before returning (or use schema to serialize)
    return {
        "success": True,
        "message": "Product added successfully",
        "data": product_serializer(products_collection.find_one({"productId": product.productId}))
    }

@router.get("/product/{productId}")
def get_product(productId: str, current_user: dict = Depends(get_current_user)):
    product = products_collection.find_one({"productId": productId})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    reviews_cursor = reviews_collection.find({"productId": productId}).sort("timestamp", -1)
    reviews = list(reviews_cursor)
    
    product_data = product_serializer(product)
    reviews_data = review_list_serializer(reviews)
    
    return {
        "success": True,
        "message": "Product details fetched",
        "data": {
            "product": product_data,
            "reviews": reviews_data
        }
    }

@router.get("/top-products")
def get_top_products(n: int = 5, current_user: dict = Depends(get_current_user)):
    if n <= 0:
        raise HTTPException(status_code=422, detail="n must be a positive integer")
        
    products_cursor = products_collection.find().sort("avgRating", -1).limit(n)
    products = list(products_cursor)
    products_data = product_list_serializer(products)
    
    return {
        "success": True,
        "message": "Top products fetched",
        "data": products_data
    }
