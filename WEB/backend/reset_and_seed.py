"""
reset_and_seed.py - Clears old mock products and seeds the MongoDB with the new Amazon and Reliance Digital CSV datasets.
"""
import sys
import os

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

from database import products_col, reviews_col, cart_col
from services.product_service import load_products_to_db

def main():
    print("Connecting to MongoDB and resetting collections...")
    
    # Clear old products, cart items, and user reviews so we start fresh with the new product catalog
    p_col = products_col()
    r_col = reviews_col()
    c_col = cart_col()
    
    old_prod_count = p_col.count_documents({})
    print(f"Current products in DB: {old_prod_count}")
    
    print("Clearing products, reviews, and carts...")
    p_col.delete_many({})
    r_col.delete_many({})
    c_col.delete_many({})
    print("Database cleared.")
    
    print("Seeding products from CSV datasets...")
    result = load_products_to_db()
    
    if result["success"]:
        print(f"Success: {result['message']}")
        print(f"Inserted: {result['productsInserted']} products")
        print(f"Updated: {result['productsUpdated']} products")
        
        # Verify first few products
        products = list(p_col.find({}).limit(3))
        for p in products:
            print(f"\nProduct: {p.get('name')}")
            print(f"  ID: {p.get('productId')}")
            print(f"  Base Price: ₹{p.get('base_price')}")
            print(f"  Rating: {p.get('rating')} ({p.get('reviewCount')} reviews)")
            print(f"  Amazon: ₹{p.get('platforms', {}).get('amazon', {}).get('price')} (Rating: {p.get('platforms', {}).get('amazon', {}).get('rating')})")
            print(f"  Flipkart/RD: ₹{p.get('platforms', {}).get('flipkart', {}).get('price')} (Rating: {p.get('platforms', {}).get('flipkart', {}).get('rating')})")
    else:
        print(f"Error seeding database: {result.get('message')}")
        if "error" in result:
            print(result["error"])

if __name__ == "__main__":
    main()
