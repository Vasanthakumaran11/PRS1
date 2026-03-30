"""
routes/decision.py - Purchase Decision Engine (Core Feature).

POST /purchase-decision
  - Fetches product from DB (with enriched platform data)
  - Compares price, delivery, and rating across platforms
  - Checks user budget
  - Applies priority logic (low_price / fast_delivery / best_rating)
  - Returns the best platform recommendation with a clear reason

Platform data now includes:
  • Amazon:   dynamic pricing, 1-2 day delivery, variable rating
  • Flipkart: dynamic pricing, 2-3 day delivery, variable rating
"""
from datetime import datetime

from fastapi import APIRouter, HTTPException, status, Depends

from database import products_col, purchase_preferences_col
from models.decision import DecisionRequest, DecisionResponse
from routes.auth import get_current_customer

router = APIRouter(tags=["Decision Engine"])

import uuid


def get_platform_data(product: dict, platform: str) -> dict:
    """
    Extract platform data, supporting both old and new schema.
    
    New schema: product["platforms"][platform]
    Old schema: product["price_{platform}"]
    """
    # Try new schema first
    if "platforms" in product and platform in product["platforms"]:
        return product["platforms"][platform]
    
    # Fallback to old schema for backward compatibility
    old_price_key = f"price_{platform}"
    if old_price_key in product:
        return {
            "price": product[old_price_key],
            "delivery": 1 if platform == "amazon" else 2,
            "rating": product.get("avgRating", 3.0),
        }
    
    # Return default if not found
    return {
        "price": product.get("base_price", 0.0),
        "delivery": 2,
        "rating": product.get("rating", 3.0),
    }


@router.post("/purchase-decision", response_model=DecisionResponse)
def purchase_decision(
    data: DecisionRequest,
    current_customer: dict = Depends(get_current_customer)
):
    # -----------------------------------------------------------------------
    # Step 1: Fetch product
    # -----------------------------------------------------------------------
    product = products_col().find_one({"productId": data.productId})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{data.productId}' not found."
        )

    # Extract platform data (supports both old and new schema)
    amazon_data = get_platform_data(product, "amazon")
    flipkart_data = get_platform_data(product, "flipkart")
    
    amazon_price = amazon_data["price"]
    flipkart_price = flipkart_data["price"]
    amazon_delivery = amazon_data.get("delivery", 1)
    flipkart_delivery = flipkart_data.get("delivery", 2)
    amazon_rating = amazon_data.get("rating", 3.0)
    flipkart_rating = flipkart_data.get("rating", 3.0)
    
    budget = data.budget
    priority = data.priority.value

    # -----------------------------------------------------------------------
    # Step 2: Save purchase preference record
    # -----------------------------------------------------------------------
    purchase_preferences_col().insert_one({
        "preferenceId": str(uuid.uuid4()),
        "customerId": current_customer["customerId"],
        "productId": data.productId,
        "budget": budget,
        "location": data.location,
        "priority": priority,
        "createdAt": datetime.utcnow(),
    })

    # -----------------------------------------------------------------------
    # Step 3: Budget sufficiency check
    # -----------------------------------------------------------------------
    amazon_affordable = amazon_price <= budget
    flipkart_affordable = flipkart_price <= budget
    budget_sufficient = amazon_affordable or flipkart_affordable

    # -----------------------------------------------------------------------
    # Step 4: Decision logic based on priority
    # -----------------------------------------------------------------------

    if priority == "low_price":
        # Pick the cheaper option; if neither is within budget, still pick cheaper
        if amazon_price <= flipkart_price:
            winner = "Amazon"
            winner_price = amazon_price
            loser = "Flipkart"
            loser_price = flipkart_price
            reason = f"Amazon offers the lowest price at ₹{amazon_price:.2f}, saving ₹{flipkart_price - amazon_price:.2f} over Flipkart."
        else:
            winner = "Flipkart"
            winner_price = flipkart_price
            loser = "Amazon"
            loser_price = amazon_price
            reason = f"Flipkart offers the lowest price at ₹{flipkart_price:.2f}, saving ₹{amazon_price - flipkart_price:.2f} over Amazon."

        if not budget_sufficient:
            reason = (
                f"Your budget of ₹{budget:.2f} is below both Amazon (₹{amazon_price:.2f}) "
                f"and Flipkart (₹{flipkart_price:.2f}). Consider waiting for a sale or increasing budget. "
                f"Best option when ready: {winner} at ₹{winner_price:.2f}."
            )

    elif priority == "fast_delivery":
        # Compare delivery times and pick the faster option
        if amazon_delivery < flipkart_delivery:
            winner = "Amazon"
            winner_price = amazon_price
            loser = "Flipkart"
            loser_price = flipkart_price
            if amazon_affordable:
                reason = (
                    f"Amazon provides faster delivery ({amazon_delivery} days) at ₹{amazon_price:.2f}. "
                    f"Flipkart takes {flipkart_delivery} days (₹{flipkart_price:.2f})."
                )
            else:
                reason = (
                    f"Amazon has faster delivery ({amazon_delivery} days) but ₹{amazon_price:.2f} exceeds your budget. "
                    f"Best budget option: Flipkart at ₹{flipkart_price:.2f} ({flipkart_delivery} days)."
                )
                if flipkart_affordable:
                    winner = "Flipkart"
                    winner_price = flipkart_price
                    loser = "Amazon"
                    loser_price = amazon_price
        elif flipkart_delivery < amazon_delivery:
            winner = "Flipkart"
            winner_price = flipkart_price
            loser = "Amazon"
            loser_price = amazon_price
            if flipkart_affordable:
                reason = (
                    f"Flipkart provides faster delivery ({flipkart_delivery} days) at ₹{flipkart_price:.2f}. "
                    f"Amazon takes {amazon_delivery} days (₹{amazon_price:.2f})."
                )
            else:
                reason = (
                    f"Flipkart has faster delivery ({flipkart_delivery} days) but ₹{flipkart_price:.2f} exceeds your budget. "
                    f"Best budget option: Amazon at ₹{amazon_price:.2f} ({amazon_delivery} days)."
                )
                if amazon_affordable:
                    winner = "Amazon"
                    winner_price = amazon_price
                    loser = "Flipkart"
                    loser_price = flipkart_price
        else:
            # Same delivery time, pick cheaper option
            if amazon_price <= flipkart_price:
                winner = "Amazon"
                winner_price = amazon_price
                loser = "Flipkart"
                loser_price = flipkart_price
            else:
                winner = "Flipkart"
                winner_price = flipkart_price
                loser = "Amazon"
                loser_price = amazon_price
            reason = (
                f"Both platforms deliver in {amazon_delivery} days. "
                f"Choosing {winner} as the cheaper option at ₹{winner_price:.2f}."
            )

    elif priority == "best_rating":
        # Compare platform ratings
        if flipkart_rating > amazon_rating:
            winner = "Flipkart"
            winner_price = flipkart_price
            loser = "Amazon"
            loser_price = amazon_price
            reason = (
                f"Flipkart has the highest rating ({flipkart_rating}/5) for this product "
                f"at ₹{flipkart_price:.2f} with {flipkart_delivery}-day delivery. "
                f"Amazon rating: {amazon_rating}/5 at ₹{amazon_price:.2f}."
            )
        elif amazon_rating > flipkart_rating:
            winner = "Amazon"
            winner_price = amazon_price
            loser = "Flipkart"
            loser_price = flipkart_price
            reason = (
                f"Amazon has the highest rating ({amazon_rating}/5) for this product "
                f"at ₹{amazon_price:.2f} with {amazon_delivery}-day delivery. "
                f"Flipkart rating: {flipkart_rating}/5 at ₹{flipkart_price:.2f}."
            )
        else:
            # Ratings equal, pick cheaper
            if amazon_price <= flipkart_price:
                winner = "Amazon"
                winner_price = amazon_price
                loser = "Flipkart"
                loser_price = flipkart_price
            else:
                winner = "Flipkart"
                winner_price = flipkart_price
                loser = "Amazon"
                loser_price = amazon_price
            reason = (
                f"Both platforms have equal ratings ({amazon_rating}/5). "
                f"Choosing {winner} as the better value at ₹{winner_price:.2f}."
            )

        if not budget_sufficient:
            reason += f" However, your budget (₹{budget:.2f}) is insufficient for both options."

    else:
        # Fallback: cheapest
        winner = "Amazon" if amazon_price <= flipkart_price else "Flipkart"
        winner_price = amazon_price if winner == "Amazon" else flipkart_price
        loser = "Flipkart" if winner == "Amazon" else "Amazon"
        loser_price = flipkart_price if winner == "Amazon" else amazon_price
        reason = f"Best overall value available on {winner} at ₹{winner_price:.2f}."

    return DecisionResponse(
        recommendedPlatform=winner,
        price=winner_price,
        reason=reason,
        budgetSufficient=budget_sufficient,
        alternativePlatform=loser,
        alternativePrice=loser_price,
    )

