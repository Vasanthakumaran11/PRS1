from fastapi import APIRouter, HTTPException
from datetime import datetime

from database import products_collection, reviews_collection
from models.review_model import ReviewModel
from schemas.product_schema import product_schema

router = APIRouter()


# ─────────────────────────────────────────
# ENDPOINT 5: POST /review
# ─────────────────────────────────────────
@router.post("/review")
async def add_review(review: ReviewModel):

    # ── STEP 1: Check if the product exists ──────────────────
    product = products_collection.find_one({"productId": review.productId})

    if not product:
        # Product doesn't exist yet — create it now
        new_product = {
            "productId": review.productId,
            "name": review.productName,   # name comes in with the review
            "avgRating": 0.0,
            "reviewCount": 0
        }
        products_collection.insert_one(new_product)


    # ── STEP 2: Save the review ──────────────────────────────
    new_review = {
        "productId": review.productId,
        "customerId": review.customerId,
        "rating": review.rating,
        "review": review.review,
        "timestamp": datetime.now()       # auto-set timestamp here
    }
    reviews_collection.insert_one(new_review)


    # ── STEP 3: Recalculate average rating ───────────────────
    # Fetch ALL reviews for this product (including the one just added)
    all_reviews = list(reviews_collection.find({"productId": review.productId}))

    total_ratings = sum(r["rating"] for r in all_reviews)   # sum all ratings
    count = len(all_reviews)                                  # how many reviews
    new_avg = round(total_ratings / count, 2)                 # average, 2 decimals


    # ── STEP 4: Update the product document ──────────────────
    products_collection.update_one(
        {"productId": review.productId},           # find product by this
        {"$set": {                                  # $set = update these fields
            "avgRating": new_avg,
            "reviewCount": count
        }}
    )


    # ── STEP 5: Return updated product info ──────────────────
    updated_product = products_collection.find_one({"productId": review.productId})

    return {
        "message": "Review added successfully",
        "product": product_schema(updated_product)
    }