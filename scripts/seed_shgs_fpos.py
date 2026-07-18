import asyncio
import uuid
import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings


MOCK_SHGS = [
    {"name": "Mahila Samriddhi SHG", "district": "Nashik", "state": "Maharashtra", "member_count": 12},
    {"name": "Jai Kisan SHG", "district": "Nashik", "state": "Maharashtra", "member_count": 15},
    {"name": "Pragati Mahila Bachat Gat", "district": "Ahmednagar", "state": "Maharashtra", "member_count": 10},
    {"name": "Annapurna Women Group", "district": "Ahmednagar", "state": "Maharashtra", "member_count": 14},
    {"name": "Laxmi Dairy SHG", "district": "Pune", "state": "Maharashtra", "member_count": 18},
]

MOCK_FPOS = [
    {"name": "Sahyadri Farmer Producer Co.", "district": "Nashik", "state": "Maharashtra", "sector": "dairy"},
    {"name": "Godavari Agriculture FPO", "district": "Ahmednagar", "state": "Maharashtra", "sector": "food_processing"},
]

async def seed():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]

    
    # Seed SHGs
    shgs_coll = db["shgs"]
    for shg in MOCK_SHGS:
        existing = await shgs_coll.find_one({"name": shg["name"], "district": shg["district"]})
        if not existing:
            shg_doc = shg.copy()
            shg_doc["_id"] = str(uuid.uuid4())
            await shgs_coll.insert_one(shg_doc)
            print(f"Seeded SHG: {shg['name']}")

    # Seed FPOs
    fpos_coll = db["fpos"]
    for fpo in MOCK_FPOS:
        existing = await fpos_coll.find_one({"name": fpo["name"], "district": fpo["district"]})
        if not existing:
            fpo_doc = fpo.copy()
            fpo_doc["_id"] = str(uuid.uuid4())
            await fpos_coll.insert_one(fpo_doc)
            print(f"Seeded FPO: {fpo['name']}")

    client.close()
    print("SHG/FPO Seeding Complete.")

if __name__ == "__main__":
    asyncio.run(seed())
