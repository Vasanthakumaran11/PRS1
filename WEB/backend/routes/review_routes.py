from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from database import products_collection, reviews_collection, customers_collection
from models.review_model import ReviewModel
from schemas.product_schema import product_schema
from schemas.review_schema import review_schema

router = APIRouter()


@router.post("/review")
async def add_review(review: ReviewModel):
   
    user = customers_collection.find_one({"customerId": review.customerId})
    if not user:
        return {"error": "User not registered, please register to add a review"}

    product = products_collection.find_one({"productId": review.productId})

    if not product:
        new_product = {
            "productId": review.productId,
            "name": review.productName,
            "avgRating": 0.0,
            "reviewCount": 0
        }
        products_collection.insert_one(new_product)
    new_review = {
        "productId": review.productId,
        "customerId": review.customerId,
        "rating": review.rating,
        "review": review.review,
        "timestamp": datetime.now()
    }
    reviews_collection.insert_one(new_review)
    all_reviews = list(reviews_collection.find({"productId": review.productId}))
    total_ratings = sum(r["rating"] for r in all_reviews)
    count = len(all_reviews)
    new_avg = round(total_ratings / count, 2)
    products_collection.update_one(
        {"productId": review.productId},
        {"$set": {
            "avgRating": new_avg,
            "reviewCount": count
        }}
    )
    updated_product = products_collection.find_one({"productId": review.productId})
    return {
        "message": "Review added successfully",
        "product": product_schema(updated_product)
    }

@router.get("/reviews")
async def get_reviews(productId: str, productName: Optional[str] = None):
    reviews = list(reviews_collection.find({"productId": productId}))
    return {
        "reviews": [review_schema(review) for review in reviews]
    }