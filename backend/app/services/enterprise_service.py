from app.models.enterprise import EnterpriseCreate, EnterpriseOut
from app.core.exceptions import ConflictError, NotFoundError, AuthorizationError
from app.db.mongo import get_collection
import uuid
from datetime import datetime, timezone

def _authorize_enterprise_access(requesting_user: dict, enterprise_id: str):
    role = requesting_user.get("role")
    if role in ("admin", "hq_risk_officer"):
        return
    if role == "field_officer":
        assigned = requesting_user.get("assigned_enterprise_ids", [])
        if enterprise_id not in assigned:
            raise AuthorizationError("Enterprise not in assigned portfolio")
        return
    if role == "enterprise_owner":
        # Owner check performed at query level or here
        pass

async def create_enterprise(enterprise_in: EnterpriseCreate, owner_user_id: str) -> dict:
    coll = get_collection("enterprises")
    
    # Check duplicate for owner
    existing = await coll.find_one({"owner_user_id": owner_user_id})
    if existing:
        raise ConflictError("User already has an onboarded enterprise")

    if enterprise_in.shg_id:
        shg = await get_collection("shgs").find_one({"_id": enterprise_in.shg_id})
        if not shg:
            raise NotFoundError("Referenced SHG not found")

    if enterprise_in.fpo_id:
        fpo = await get_collection("fpos").find_one({"_id": enterprise_in.fpo_id})
        if not fpo:
            raise NotFoundError("Referenced FPO not found")

    doc = enterprise_in.model_dump()
    doc["_id"] = str(uuid.uuid4())
    doc["owner_user_id"] = owner_user_id
    doc["credit_readiness_stage"] = "grant_dependent"
    doc["onboarded_at"] = datetime.now(timezone.utc)
    doc["e_shakti_ref"] = f"ESHAKTI-{uuid.uuid4().hex[:8].upper()}"

    await coll.insert_one(doc)
    doc["id"] = doc["_id"]
    return doc

async def get_enterprise_by_id(enterprise_id: str, requesting_user: dict) -> dict:
    coll = get_collection("enterprises")
    ent = await coll.find_one({"_id": enterprise_id})
    if not ent:
        raise NotFoundError("Enterprise not found")
    
    if requesting_user.get("role") == "enterprise_owner":
        if ent["owner_user_id"] != requesting_user.get("sub"):
            raise AuthorizationError("Cannot access another owner's enterprise")
    else:
        _authorize_enterprise_access(requesting_user, enterprise_id)

    ent["id"] = ent["_id"]
    return ent

async def search_shgs(query: str) -> list[dict]:
    coll = get_collection("shgs")
    cursor = coll.find({"name": {"$regex": query, "$options": "i"}}).limit(20)
    results = []
    async for doc in cursor:
        doc["id"] = doc["_id"]
        results.append(doc)
    return results

async def search_fpos(query: str) -> list[dict]:
    coll = get_collection("fpos")
    cursor = coll.find({"name": {"$regex": query, "$options": "i"}}).limit(20)
    results = []
    async for doc in cursor:
        doc["id"] = doc["_id"]
        results.append(doc)
    return results
