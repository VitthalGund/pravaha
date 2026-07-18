from motor.motor_asyncio import AsyncIOMotorClient
from app.db.mongo import get_client, get_collection
from app.core.config import settings

async def ensure_time_series_collections():
    client = get_client()
    db = client[settings.MONGODB_DB_NAME]
    collections = await db.list_collection_names()
    
    ts_configs = {
        "cash_flow_entries": {"timeField": "recorded_at", "metaField": "meta"},
        "forecasts": {"timeField": "generated_at", "metaField": "meta"},
        "market_signals": {"timeField": "timestamp", "metaField": "meta"},
        "climate_signals": {"timeField": "timestamp", "metaField": "meta"}
    }
    
    for coll_name, config in ts_configs.items():
        if coll_name not in collections:
            await db.create_collection(coll_name, timeseries=config)

async def ensure_indexes():
    await get_collection("users").create_index([("phone", 1)], unique=True, sparse=True)
    await get_collection("users").create_index([("email", 1)], unique=True, sparse=True)
    await get_collection("enterprises").create_index([("owner_user_id", 1)])
    await get_collection("risk_flags").create_index([("enterprise_id", 1), ("status", 1)])
    await get_collection("obligations").create_index([("enterprise_id", 1)])
    await get_collection("visits").create_index([("field_officer_id", 1), ("enterprise_id", 1)])
    await get_collection("translations_cache").create_index(
        [("text_hash", 1), ("source_lang", 1), ("target_lang", 1)],
        unique=True
    )
