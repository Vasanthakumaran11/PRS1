"""
routes/decision.py - Purchase Decision Engine (Core Feature).

POST /purchase-decision
  - Fetches product from DB
  - Compares price_amazon vs price_flipkart
  - Checks user budget
  - Applies priority logic (low_price / fast_delivery / best_rating)
  - Returns the best platform recommendation with a clear reason

Simulated platform data:
  • Amazon:   slightly faster delivery, fixed delivery rating advantage
  • Flipkart: slightly better community rating advantage
"""
from datetime import datetime

from fastapi import APIRouter, HTTPException, status, Depends

from database import products_col, purchase_preferences_col
from models.decision import DecisionRequest, DecisionResponse
from routes.auth import get_current_customer

router = APIRouter(tags=["Decision Engine"])

import uuid


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

    amazon_price = product.get("price_amazon", 0.0)
    flipkart_price = product.get("price_flipkart", 0.0)
    avg_rating = product.get("avgRating", 3.0)
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
        # Amazon is simulated as the faster delivery platform
        winner = "Amazon"
        winner_price = amazon_price
        loser = "Flipkart"
        loser_price = flipkart_price
        if amazon_affordable:
            reason = (
                f"Amazon provides the fastest delivery for this product at ₹{amazon_price:.2f}. "
                f"Expected delivery: 1-2 business days."
            )
        else:
            reason = (
                f"Amazon has faster delivery but ₹{amazon_price:.2f} exceeds your budget of ₹{budget:.2f}. "
                f"Consider Flipkart at ₹{flipkart_price:.2f} as a budget-friendly alternative (3-5 days delivery)."
            )
            if flipkart_affordable:
                winner = "Flipkart"
                winner_price = flipkart_price
                loser = "Amazon"
                loser_price = amazon_price

    elif priority == "best_rating":
        # Flipkart is simulated to have a slight community rating advantage (+0.1)
        flipkart_effective_rating = round(avg_rating + 0.1, 2)
        amazon_effective_rating = avg_rating

        if flipkart_effective_rating > amazon_effective_rating:
            winner = "Flipkart"
            winner_price = flipkart_price
            loser = "Amazon"
            loser_price = amazon_price
            reason = (
                f"Flipkart has the highest community rating ({flipkart_effective_rating}/5) for this product "
                f"at ₹{flipkart_price:.2f}. Customers consistently rate it higher on Flipkart."
            )
        else:
            winner = "Amazon"
            winner_price = amazon_price
            loser = "Flipkart"
            loser_price = flipkart_price
            reason = (
                f"Amazon has a strong rating ({amazon_effective_rating}/5) for this product "
                f"at ₹{amazon_price:.2f}."
            )

        if not (winner == "Amazon" and amazon_affordable) and not (winner == "Flipkart" and flipkart_affordable):
            if not budget_sufficient:
                reason += f" However, your budget (₹{budget:.2f}) is insufficient. Consider increasing it."

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
