from pydantic import BaseModel

def product_schema(product):
    return {
        "_id": str(product["_id"]),
        "productId": product["productId"],
        "name": product["name"],
        "avgRating": product["avgRating"],
        "reviewCount": product["reviewCount"]
    }

def products_schema(products):
    return [product_schema(product) for product in products]
