from app.models.user import UserCreate, UserOut
from app.core.security import hash_password
from app.core.exceptions import ConflictError, NotFoundError, ValidationError
from app.db.mongo import get_collection
import uuid
from datetime import datetime, timezone

async def create_staff_user(user_in: UserCreate) -> dict:
    if user_in.role not in ("field_officer", "hq_risk_officer", "fpo_officebearer", "admin"):
        raise ValidationError("Invalid staff role")

    coll = get_collection("users")
    if user_in.email:
        existing = await coll.find_one({"email": user_in.email})
        if existing:
            raise ConflictError("Email already registered")

    doc = user_in.model_dump()
    doc["_id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc)
    if user_in.password:
        doc["password_hash"] = hash_password(user_in.password)
    doc["assigned_enterprise_ids"] = []

    await coll.insert_one(doc)
    doc["id"] = doc["_id"]
    return doc

async def assign_portfolio(officer_user_id: str, enterprise_ids: list[str]) -> dict:
    coll = get_collection("users")
    officer = await coll.find_one({"_id": officer_user_id, "role": "field_officer"})
    if not officer:
        raise NotFoundError("Field officer not found")

    # Verify enterprise IDs exist
    if enterprise_ids:
        count = await get_collection("enterprises").count_documents({"_id": {"$in": enterprise_ids}})
        if count != len(enterprise_ids):
            raise NotFoundError("One or more enterprise IDs do not exist")

    await coll.update_one(
        {"_id": officer_user_id},
        {"$set": {"assigned_enterprise_ids": enterprise_ids}}
    )
    return {"officer_id": officer_user_id, "assigned_enterprise_ids": enterprise_ids}
