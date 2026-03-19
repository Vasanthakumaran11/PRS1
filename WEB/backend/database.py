from pymongo import MongoClient
import os

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["product_review_system"]

# Export collections
customers_collection = db["customers"]
products_collection = db["products"]
reviews_collection = db["reviews"]

# Create indexes
customers_collection.create_index("email", unique=True)
products_collection.create_index("productId", unique=True)
reviews_collection.create_index([("productId", 1), ("customerId", 1)], unique=True)
