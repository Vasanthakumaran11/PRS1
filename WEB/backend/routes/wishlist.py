"""
routes/wishlist.py - Wishlist management routes.
"""
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from database import get_db, products_col
from routes.auth import get_current_customer

router = APIRouter(tags=["Wishlist"])


def wishlist_col():
    return get_db()["wishlist"]


class WishlistItemAdd(BaseModel):
    productId: str


@router.post("/wishlist/add", status_code=status.HTTP_200_OK)
def add_to_wishlist(
    data: WishlistItemAdd,
    current_customer: dict = Depends(get_current_customer)
):
    customer_id = current_customer["customerId"]
    product = products_col().find_one({"productId": data.productId})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{data.productId}' not found."
        )

    wishlist = wishlist_col().find_one({"customerId": customer_id})
    if not wishlist:
        wishlist_col().insert_one({
            "customerId": customer_id,
            "items": [{"productId": data.productId, "addedAt": datetime.utcnow()}]
        })
    else:
        items = wishlist.get("items", [])
        if not any(item["productId"] == data.productId for item in items):
            wishlist_col().update_one(
                {"customerId": customer_id},
                {"$push": {"items": {"productId": data.productId, "addedAt": datetime.utcnow()}}}
            )

    return {"message": "Product added to wishlist successfully."}


@router.get("/wishlist")
def get_wishlist(current_customer: dict = Depends(get_current_customer)):
    customer_id = current_customer["customerId"]
    wishlist = wishlist_col().find_one({"customerId": customer_id})
    if not wishlist:
        return {"customerId": customer_id, "items": []}

    populated_items = []
    for item in wishlist.get("items", []):
        product = products_col().find_one({"productId": item["productId"]})
        if product:
            populated_items.append({
                "productId": item["productId"],
                "name": product.get("name", ""),
                "price_amazon": product.get("price_amazon", 0),
                "price_flipkart": product.get("price_flipkart", 0),
                "avgRating": product.get("avgRating", 0),
                "image": product.get("image", ""),
                "category": product.get("category", ""),
                "addedAt": item.get("addedAt"),
            })

    return {"customerId": customer_id, "items": populated_items}


@router.delete("/wishlist/remove/{productId}")
def remove_from_wishlist(
    productId: str,
    current_customer: dict = Depends(get_current_customer)
):
    customer_id = current_customer["customerId"]
    wishlist_col().update_one(
        {"customerId": customer_id},
        {"$pull": {"items": {"productId": productId}}}
    )
    return {"message": "Product removed from wishlist successfully."}
