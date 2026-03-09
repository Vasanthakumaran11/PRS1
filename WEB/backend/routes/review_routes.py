from fastapi import APIRouter, HTTPException
from datetime import datetime

from database import products_collection, reviews_collection
from models.review_model import ReviewModel
from schemas.product_schema import product_schema

router = APIRouter()

@router.post("/review")
async def add_review(review: ReviewModel):
    pr = products_collection.find_one({"productId": review.productId})  
    if not pr:
        new_pr = products_collection.insert_one({
            "productId": review.productId,
            "name": review.productName,
            "avgRating": 0.0,
            "reviewCount": 0
        })
    new_review = reviews_collection.insert_one({
            "productId": review.productId,
            "customerId": review.customerId,
            "rating": review.rating,
            "review": review.review,
            "timestamp": datetime.now()
    })
    
    all_reviews = reviews_collection.find({"productId": review.productId})
    total_rating = sum(review["rating"] for review in all_reviews)
    count = len(all_reviews)
    new_avg_rating = total_rating / count
    products_collection.update_one({"productId": review.productId}, {"$set": {"avgRating": new_avg_rating, "reviewCount": count}})  
    return {"message": "Review added successfully"}
    
