"""
routes/cart.py - Shopping cart routes.

POST   /cart/add              - Add product to cart (JWT protected)
GET    /cart/{customerId}     - Get cart with full product details
DELETE /cart/remove           - Remove product from cart (JWT protected)
"""
from datetime import datetime

from fastapi import APIRouter, HTTPException, status, Depends

from database import cart_col, products_col
from models.cart import CartAddItem, CartRemoveItem
from routes.auth import get_current_customer

router = APIRouter(tags=["Cart"])


def serialize(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc


# ---------------------------------------------------------------------------
# POST /cart/add  (JWT Protected)
# ---------------------------------------------------------------------------
@router.post("/cart/add", status_code=status.HTTP_200_OK)
def add_to_cart(
    data: CartAddItem,
    current_customer: dict = Depends(get_current_customer)
):
    customer_id = current_customer["customerId"]

    # Ensure product exists
    product = products_col().find_one({"productId": data.productId})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{data.productId}' not found."
        )

    cart = cart_col().find_one({"customerId": customer_id})

    if cart is None:
        # Create new cart document
        cart_col().insert_one({
            "customerId": customer_id,
            "items": [{"productId": data.productId, "quantity": 1, "addedAt": datetime.utcnow()}]
        })
    else:
        # Check if already in cart
        items = cart.get("items", [])
        found = False
        for item in items:
            if item["productId"] == data.productId:
                item["quantity"] = item.get("quantity", 1) + 1
                found = True
                break
        
        if found:
            cart_col().update_one(
                {"customerId": customer_id},
                {"$set": {"items": items}}
            )
        else:
            cart_col().update_one(
                {"customerId": customer_id},
                {"$push": {"items": {"productId": data.productId, "quantity": 1, "addedAt": datetime.utcnow()}}}
            )

    return {"message": "Product added to cart successfully."}


# ---------------------------------------------------------------------------
# GET /cart/{customerId}
# ---------------------------------------------------------------------------
@router.get("/cart/{customerId}")
def get_cart(customerId: str, current_customer: dict = Depends(get_current_customer)):
    # Users can only view their own cart
    if current_customer["customerId"] != customerId:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied."
        )

    cart = cart_col().find_one({"customerId": customerId})
    if not cart:
        return {"customerId": customerId, "items": []}

    # Populate each item with product details
    populated_items = []
    for item in cart.get("items", []):
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
                "quantity": item.get("quantity", 1),
                "addedAt": item.get("addedAt"),
            })

    return {"customerId": customerId, "items": populated_items}

# ---------------------------------------------------------------------------
# PATCH /cart/update-quantity (JWT Protected)
# ---------------------------------------------------------------------------
@router.patch("/cart/update-quantity")
def update_cart_quantity(
    productId: str,
    quantity: int,
    current_customer: dict = Depends(get_current_customer)
):
    customer_id = current_customer["customerId"]
    if quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")

    cart = cart_col().find_one({"customerId": customer_id})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    items = cart.get("items", [])
    found = False
    for item in items:
        if item["productId"] == productId:
            item["quantity"] = quantity
            found = True
            break
    
    if not found:
        raise HTTPException(status_code=404, detail="Product not in cart")

    cart_col().update_one(
        {"customerId": customer_id},
        {"$set": {"items": items}}
    )
    return {"message": "Quantity updated"}


# ---------------------------------------------------------------------------
# DELETE /cart/remove  (JWT Protected)
# ---------------------------------------------------------------------------
@router.delete("/cart/remove", status_code=status.HTTP_200_OK)
def remove_from_cart(
    data: CartRemoveItem,
    current_customer: dict = Depends(get_current_customer)
):
    customer_id = current_customer["customerId"]

    cart = cart_col().find_one({"customerId": customer_id})
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found."
        )

    existing_ids = [item["productId"] for item in cart.get("items", [])]
    if data.productId not in existing_ids:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not in cart."
        )

    cart_col().update_one(
        {"customerId": customer_id},
        {"$pull": {"items": {"productId": data.productId}}}
    )

    return {"message": "Product removed from cart."}
