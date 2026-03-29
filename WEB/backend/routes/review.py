"""
routes/review.py - Review management routes.

POST /add-review            - Add a review (1 per user per product, JWT protected)
GET  /reviews/{productId}   - Get all reviews for a product
"""
import uuid
from datetime import datetime

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from database import reviews_col, products_col
from models.review import ReviewCreate, ReviewOut
from routes.auth import get_current_customer

router = APIRouter(tags=["Reviews"])


def serialize_review(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc


# ---------------------------------------------------------------------------
# POST /add-review  (JWT Protected)
# ---------------------------------------------------------------------------
@router.post("/add-review", status_code=status.HTTP_201_CREATED)
def add_review(
    data: ReviewCreate,
    current_customer: dict = Depends(get_current_customer)
):
    customer_id = current_customer["customerId"]
    customer_name = current_customer["name"]

    # Ensure the product exists
    product = products_col().find_one({"productId": data.productId})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{data.productId}' not found."
        )

    # One review per user per product
    existing = reviews_col().find_one({
        "productId": data.productId,
        "customerId": customer_id
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted a review for this product."
        )

    # Insert the review
    review_id = str(uuid.uuid4())
    review_doc = {
        "reviewId": review_id,
        "productId": data.productId,
        "customerId": customer_id,
        "customerName": customer_name,
        "rating": data.rating,
        "review": data.review,
        "keyword": data.keyword,
        "timestamp": datetime.utcnow(),
    }
    reviews_col().insert_one(review_doc)

    # Recalculate avgRating and reviewCount on the product
    all_reviews = list(reviews_col().find({"productId": data.productId}))
    new_count = len(all_reviews)
    new_avg = round(sum(r["rating"] for r in all_reviews) / new_count, 2)

    products_col().update_one(
        {"productId": data.productId},
        {"$set": {"avgRating": new_avg, "reviewCount": new_count, "lastUpdated": datetime.utcnow()}}
    )

    return {
        "message": "Review submitted successfully.",
        "reviewId": review_id,
        "newAvgRating": new_avg,
        "reviewCount": new_count,
    }


# ---------------------------------------------------------------------------
# GET /reviews/{productId}
# ---------------------------------------------------------------------------
@router.get("/reviews/{productId}")
def get_reviews(productId: str):
    reviews = list(
        reviews_col()
        .find({"productId": productId})
        .sort("timestamp", -1)
    )
    return [serialize_review(r) for r in reviews]
