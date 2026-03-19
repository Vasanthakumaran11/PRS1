from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pymongo.errors import DuplicateKeyError

from models.review_model import ReviewCreate
from schemas.product_schema import product_serializer
from database import products_collection, reviews_collection
from auth import get_current_user

router = APIRouter()

@router.post("/add-review")
def add_review(review: ReviewCreate, current_user: dict = Depends(get_current_user)):
    customer_id = current_user.get("customerId")
    
    product = products_collection.find_one({"productId": review.productId})
    if not product:
        new_product = {
            "productId": review.productId,
            "name": review.productName,
            "avgRating": 0.0,
            "reviewCount": 0
        }
        products_collection.insert_one(new_product)
        product = products_collection.find_one({"productId": review.productId})
        
    if not product:
        raise HTTPException(status_code=404, detail="Product not found after creation attempt")
        
    existing_review = reviews_collection.find_one({
        "productId": review.productId,
        "customerId": customer_id
    })
    
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this product")
        
    new_review = {
        "productId": review.productId,
        "customerId": customer_id,
        "rating": review.rating,
        "review": review.review,
        "timestamp": datetime.utcnow()
    }
    
    try:
        reviews_collection.insert_one(new_review)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="You have already reviewed this product")
        
    all_reviews_cursor = reviews_collection.find({"productId": review.productId})
    all_reviews = list(all_reviews_cursor)
    
    review_count = len(all_reviews)
    if review_count > 0:
        total_rating = sum(r["rating"] for r in all_reviews)
        avg_rating = round(total_rating / review_count, 2)
    else:
        avg_rating = 0.0
        
    products_collection.update_one(
        {"productId": review.productId},
        {"$set": {
            "avgRating": avg_rating,
            "reviewCount": review_count
        }}
    )
    
    updated_product = products_collection.find_one({"productId": review.productId})
    
    return {
        "success": True,
        "message": "Review added successfully",
        "data": product_serializer(updated_product)
    }
