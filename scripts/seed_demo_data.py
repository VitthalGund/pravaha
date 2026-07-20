import asyncio
import uuid
import sys
import os
from datetime import datetime, timezone

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

async def seed_demo():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    print("[START] Seeding realistic Pravaha demo dataset...")

    # Drop time series collections to recreate with correct metaField='meta'
    await db.drop_collection("cash_flow_entries")
    await db.drop_collection("forecasts")    # 1. Demo User
    user_doc = {
        "_id": "demo-owner-123",
        "phone": "+919876543210",
        "role": "enterprise_owner",
        "full_name": "Sunita Patil",
        "preferred_language": "hi",
        "district": "Nashik",
        "state": "Maharashtra",
        "created_at": datetime.now(timezone.utc),
    }
    await db["users"].replace_one({"_id": user_doc["_id"]}, user_doc, upsert=True)

    # 2. Demo Enterprise
    ent_doc = {
        "_id": "demo-enterprise-id",
        "owner_user_id": "demo-owner-123",
        "name": "Kamdhenu Dairy Farm",
        "sector": "dairy",
        "district": "Nashik",
        "state": "Maharashtra",
        "credit_readiness_stage": "grant_dependent",
        "onboarded_at": datetime.now(timezone.utc),
        "e_shakti_ref": "ESHAKTI-9F2A1B",
    }
    await db["enterprises"].replace_one({"_id": ent_doc["_id"]}, ent_doc, upsert=True)

    # 3. Cash Flow Entries (Time Series)
    entries = [
        {"recorded_at": datetime.now(timezone.utc), "meta": {"enterprise_id": "demo-enterprise-id"}, "type": "income", "category": "milk_sale", "amount": 15000.0, "client_entry_id": "demo-entry-1"},
        {"recorded_at": datetime.now(timezone.utc), "meta": {"enterprise_id": "demo-enterprise-id"}, "type": "expense", "category": "feed_purchase", "amount": 8000.0, "client_entry_id": "demo-entry-2"},
    ]
    if entries:
        await db["cash_flow_entries"].insert_many(entries)

    # 4. Obligations (Over-leverage scenario)
    obligations = [
        {"_id": "obl-1", "enterprise_id": "demo-enterprise-id", "source_type": "bank_loan", "lender_name": "State Bank of India (KCC)", "amount_outstanding": 50000.0, "monthly_installment": 5000.0, "interest_rate_annual": 8.5, "self_reported": False},
        {"_id": "obl-2", "enterprise_id": "demo-enterprise-id", "source_type": "informal_moneylender", "lender_name": "Local Feed Supplier (Shop Credit)", "amount_outstanding": 25000.0, "monthly_installment": 4000.0, "interest_rate_annual": None, "self_reported": True},
    ]
    for o in obligations:
        await db["obligations"].replace_one({"_id": o["_id"]}, o, upsert=True)

    # 5. Risk Flag (Market shock + Over-leverage)
    flag_doc = {
        "_id": "flag-demo-1",
        "enterprise_id": "demo-enterprise-id",
        "flag_type": "market_shock",
        "severity": "high",
        "reason_codes": ["Fodder prices in Nashik rose 35% over past 3 weeks while milk yields remained flat."],
        "suggested_action": "Apply for NABARD Priority Sector Feed Subsidy before next repayment cycle",
        "status": "active",
        "generated_at": datetime.now(timezone.utc),
    }
    await db["risk_flags"].replace_one({"_id": flag_doc["_id"]}, flag_doc, upsert=True)

    client.close()
    print("[SUCCESS] Pravaha Demo Data Seeding Complete!")

if __name__ == "__main__":
    asyncio.run(seed_demo())

