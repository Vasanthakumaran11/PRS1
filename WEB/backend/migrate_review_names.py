"""
migrate_review_names.py - Migrate existing reviews to include customerName field.

This script updates existing reviews that don't have a customerName field
by looking up the name from the customers collection.

Run this once after updating the code to populate names for existing reviews.
"""
import sys
import os
from datetime import datetime

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import reviews_col, customers_col
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def migrate_review_names():
    """
    Update all reviews without customerName by looking up the customer name.
    """
    try:
        reviews_collection = reviews_col()
        customers_collection = customers_col()
        
        # Find reviews without customerName
        reviews_without_names = list(reviews_collection.find({
            "$or": [
                {"customerName": None},
                {"customerName": ""},
                {"customerName": {"$exists": False}}
            ]
        }))
        
        logger.info(f"Found {len(reviews_without_names)} reviews without customerName")
        
        if len(reviews_without_names) == 0:
            logger.info("✓ All reviews already have customerName. No migration needed.")
            return {
                "success": True,
                "message": "All reviews already have customerName",
                "updated": 0,
                "total": 0
            }
        
        updated_count = 0
        not_found_count = 0
        
        for review in reviews_without_names:
            customer_id = review.get("customerId")
            
            if not customer_id:
                logger.warning(f"Review {review.get('reviewId')} has no customerId")
                not_found_count += 1
                continue
            
            # Look up customer
            customer = customers_collection.find_one({"customerId": customer_id})
            
            if customer:
                customer_name = customer.get("name", "Anonymous User")
                
                # Update review with customer name
                result = reviews_collection.update_one(
                    {"reviewId": review.get("reviewId")},
                    {
                        "$set": {
                            "customerName": customer_name,
                            "lastUpdated": datetime.utcnow()
                        }
                    }
                )
                
                if result.modified_count > 0:
                    updated_count += 1
                    logger.info(f"✓ Updated review for {customer_name}")
            else:
                logger.warning(f"Customer {customer_id} not found for review {review.get('reviewId')}")
                not_found_count += 1
                
                # Set default name
                reviews_collection.update_one(
                    {"reviewId": review.get("reviewId")},
                    {"$set": {"customerName": "Anonymous User", "lastUpdated": datetime.utcnow()}}
                )
                updated_count += 1
        
        logger.info(f"\n✓ Migration Complete:")
        logger.info(f"  - Updated: {updated_count}")
        logger.info(f"  - Not found: {not_found_count}")
        
        return {
            "success": True,
            "message": "Migration completed successfully",
            "updated": updated_count,
            "not_found": not_found_count,
            "total": len(reviews_without_names)
        }
        
    except Exception as e:
        logger.error(f"✗ Migration failed: {e}")
        return {
            "success": False,
            "message": f"Migration failed: {str(e)}",
            "error": str(e)
        }


if __name__ == "__main__":
    logger.info("Starting review name migration...\n")
    result = migrate_review_names()
    
    logger.info("\n" + "="*60)
    if result["success"]:
        logger.info("✓ MIGRATION SUCCESSFUL")
    else:
        logger.info("✗ MIGRATION FAILED")
    logger.info("="*60)
