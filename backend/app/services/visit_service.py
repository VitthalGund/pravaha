from app.models.visit import VisitCreate, VisitOut
from app.db.mongo import get_collection
import uuid
from datetime import datetime, timezone

async def log_visit(visit_in: VisitCreate, officer_user_id: str) -> dict:
    doc = visit_in.model_dump()
    doc["_id"] = str(uuid.uuid4())
    doc["field_officer_id"] = officer_user_id
    doc["scheduled_at"] = None
    doc["completed_at"] = datetime.now(timezone.utc)
    doc["synced_at"] = datetime.now(timezone.utc)

    await get_collection("visits").insert_one(doc)
    doc["id"] = doc["_id"]
    return doc
