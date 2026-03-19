def product_serializer(product) -> dict:
    return {
        "id": str(product["_id"]),
        "productId": product.get("productId"),
        "name": product.get("name"),
        "avgRating": product.get("avgRating", 0.0),
        "reviewCount": product.get("reviewCount", 0)
    }

def product_list_serializer(products) -> list:
    return [product_serializer(product) for product in products]
