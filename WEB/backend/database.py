"""
database.py - MongoDB connection and collection accessors.
Uses pymongo with a singleton client pattern.
"""
from pymongo import MongoClient
from pymongo.collection import Collection
from config import MONGO_URI, DB_NAME

# Singleton client
_client: MongoClient = MongoClient(MONGO_URI)
_db = _client[DB_NAME]


def get_db():
    """Return the database instance."""
    return _db


def get_collection(name: str) -> Collection:
    """Return a named collection from the PRS database."""
    return _db[name]


# Convenience accessors for all collections
def customers_col() -> Collection:
    return _db["customers"]

def products_col() -> Collection:
    return _db["products"]

def reviews_col() -> Collection:
    return _db["reviews"]

def cart_col() -> Collection:
    return _db["cart"]

def purchase_preferences_col() -> Collection:
    return _db["purchase_preferences"]
