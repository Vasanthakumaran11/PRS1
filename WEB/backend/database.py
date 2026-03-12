
from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017/"

try:
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
    db = client["prs_database"]
    client.admin.command('ping')
    print("MongoDB connected successfully")
except Exception as e:
    print("MongoDB connection failed:", e)

customers_collection = db["customers"]
products_collection = db["products"]
reviews_collection = db["reviews"]