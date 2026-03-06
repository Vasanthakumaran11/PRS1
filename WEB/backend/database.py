
from pymongo import MongoClient

MONGO_URL = "your_connection_string"

client = MongoClient(MONGO_URL)
db = client["PRS_Database"]

customers_collection = db["customers"]
products_collection = db["products"]
reviews_collection = db["reviews"]