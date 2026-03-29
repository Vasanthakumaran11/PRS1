try:
    print("Importing routes.auth...")
    from routes import auth
    print("✓ auth imported")
    print("Importing routes.product...")
    from routes import product
    print("✓ product imported")
    print("Importing routes.review...")
    from routes import review
    print("✓ review imported")
    print("Importing routes.cart...")
    from routes import cart
    print("✓ cart imported")
    print("Importing routes.decision...")
    from routes import decision
    print("✓ decision imported")
    print("\nAll routes imported successfully!")
except Exception as e:
    import traceback
    print(f"ERROR: {e}")
    traceback.print_exc()
