from pydantic import BaseModel
 
def review_schema(review):
    return {
        "_id": str(review["_id"]),
        "productId": review["productId"],
        "customerId": review["customerId"],
        "rating": review["rating"],
        "review": review["review"],
        "timestamp": review["timestamp"]
    }

def reviews_schema(reviews):
    return [review_schema(review) for review in reviews]
