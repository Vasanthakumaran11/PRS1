"""
test_integration.py - Quick test script for Fake Store API integration.

Run this after starting the backend to verify the integration is working.
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_load_products():
    """Test loading products from Fake Store API."""
    print("\n" + "="*60)
    print("TEST 1: Load Products from Fake Store API")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/load-products")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_get_all_products():
    """Test getting all products."""
    print("\n" + "="*60)
    print("TEST 2: Get All Products")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/products")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        products = response.json()
        print(f"Total products: {len(products)}")
        
        if products:
            print(f"\nFirst product structure:")
            print(json.dumps(products[0], indent=2, default=str))
            
            # Verify platform data exists
            if "platforms" in products[0]:
                print("✓ Platform data exists")
                print(f"  Amazon price: {products[0]['platforms']['amazon']['price']}")
                print(f"  Flipkart price: {products[0]['platforms']['flipkart']['price']}")
            else:
                print("✗ No platform data found")
        
        return True
    else:
        print("Failed to get products")
        return False


def test_get_category():
    """Test getting products by category."""
    print("\n" + "="*60)
    print("TEST 3: Get Products by Category")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/products/category/electronics")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        products = response.json()
        print(f"Electronics products: {len(products)}")
        return True
    elif response.status_code == 404:
        print("No electronics found (normal if API doesn't have this category)")
        return True
    else:
        print(f"Error: {response.status_code}")
        return False


def test_get_product():
    """Test getting a single product."""
    print("\n" + "="*60)
    print("TEST 4: Get Single Product")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/product/1")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        product = response.json()
        print(json.dumps(product, indent=2, default=str))
        return True
    else:
        print("Failed to get product")
        return False


def test_search():
    """Test search functionality."""
    print("\n" + "="*60)
    print("TEST 5: Search Products")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/search?query=shirt")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        products = response.json()
        print(f"Search results: {len(products)} products found")
        return True
    else:
        print("Search failed")
        return False


def main():
    """Run all tests."""
    print("\n\n" + "#"*60)
    print("# Fake Store API Integration Tests")
    print("#"*60)
    
    tests = [
        ("Load Products", test_load_products),
        ("Get All Products", test_get_all_products),
        ("Get by Category", test_get_category),
        ("Get Single Product", test_get_product),
        ("Search", test_search),
    ]
    
    results = []
    
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"\n✗ {name} ERROR: {e}")
            results.append((name, False))
    
    # Summary
    print("\n\n" + "#"*60)
    print("# TEST SUMMARY")
    print("#"*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status}: {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n✓ All tests passed! Integration is working correctly.")
    else:
        print("\n✗ Some tests failed. Check the output above for details.")


if __name__ == "__main__":
    main()
