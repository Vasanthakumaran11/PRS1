def customer_serializer(customer) -> dict:
    return {
        "id": str(customer["_id"]),
        "customerId": customer.get("customerId"),
        "name": customer.get("name"),
        "email": customer.get("email"),
        "createdAt": customer.get("createdAt")
    }

def customer_list_serializer(customers) -> list:
    return [customer_serializer(customer) for customer in customers]
