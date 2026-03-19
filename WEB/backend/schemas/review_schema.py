def review_serializer(review) -> dict:
    return {
        "id": str(review["_id"]),
        "productId": review.get("productId"),
        "customerId": review.get("customerId"),
        "rating": review.get("rating"),
        "review": review.get("review"),
        "timestamp": review.get("timestamp")
    }

def review_list_serializer(reviews) -> list:
    return [review_serializer(review) for review in reviews]
