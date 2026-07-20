import uuid
from datetime import datetime, timezone
from app.db.mongo import get_collection

async def record_consent(user_id: str, consent_type: str, granted: bool, metadata: dict | None = None) -> dict:
    coll = get_collection("audit_log")
    doc = {
        "_id": str(uuid.uuid4()),
        "action": "consent_recorded",
        "user_id": user_id,
        "consent_type": consent_type,
        "granted": granted,
        "metadata": metadata or {},
        "timestamp": datetime.now(timezone.utc),
    }
    await coll.insert_one(doc)
    doc["id"] = doc["_id"]
    return doc

async def check_consent(user_id: str, consent_type: str) -> bool:
    coll = get_collection("audit_log")
    doc = await coll.find_one(
        {"action": "consent_recorded", "user_id": user_id, "consent_type": consent_type},
        sort=[("timestamp", -1)]
    )
    return doc.get("granted", False) if doc else False
