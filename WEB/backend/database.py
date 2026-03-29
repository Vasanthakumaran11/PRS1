"""
database.py - MongoDB connection and collection accessors.
Uses pymongo with a singleton client pattern.
"""
from pymongo import MongoClient
from pymongo.collection import Collection
from config import MONGO_URI, DB_NAME
import logging

logger = logging.getLogger(__name__)

# Singleton client with connection timeout
try:
    _client: MongoClient = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, connectTimeoutMS=10000)
    # Verify connection
    _client.admin.command('ping')
    _db = _client[DB_NAME]
    logger.info("✓ MongoDB connection successful")
except Exception as e:
    logger.error(f"✗ MongoDB connection failed: {e}")
    raise RuntimeError(f"Failed to connect to MongoDB at {MONGO_URI}. Make sure MongoDB is running. Error: {e}")


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
