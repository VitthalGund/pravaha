from app.ml.explainability import generate_reason_codes, classify_shock_type
from app.ai.ai_router import get_explanation
from app.services.enterprise_service import get_enterprise_by_id
from app.core.constants import NOTIFIABLE_FLAG_TYPES
from app.core.exceptions import NotFoundError, PravahaServiceError
from app.db.mongo import get_collection
import uuid
from datetime import datetime, timezone

async def evaluate_risk_flags(enterprise_id: str, requesting_user: dict) -> list[dict]:
    await get_enterprise_by_id(enterprise_id, requesting_user)
    
    ent = await get_collection("enterprises").find_one({"_id": enterprise_id})
    if not ent:
        raise NotFoundError("Enterprise not found")

    # Load recent forecast
    fc = await get_collection("forecasts").find_one({"enterprise_id": enterprise_id}, sort=[("generated_at", -1)])
    
    flags = []

    # Check for monsoon dip / price shock scenario
    top_drivers = [{"feature": "monsoon_yield_transition", "impact": -0.25}]
    context = {"sector": ent["sector"], "month": datetime.now().month, "district": ent["district"]}

    shock_type = classify_shock_type(top_drivers, context)

    # Build structured reason
    reason_input = {
        "sector": ent["sector"],
        "shock_type": shock_type,
        "driver": "Seasonal fodder & humidity variation",
        "drop_pct": 25,
    }

    explanation_text = await get_explanation(reason_input)

    severity = "watch" if shock_type == "seasonal_normal" else "high"
    suggested_action = (
        "Maintain normal operations — seasonal recovery expected in ~4 weeks"
        if shock_type == "seasonal_normal"
        else "Review working capital options & defer non-essential expenditure"
    )

    flag_doc = {
        "_id": str(uuid.uuid4()),
        "enterprise_id": enterprise_id,
        "flag_type": shock_type,
        "severity": severity,
        "reason_codes": [explanation_text],
        "suggested_action": suggested_action,
        "status": "active",
        "generated_at": datetime.now(timezone.utc),
    }

    # Upsert active flag
    await get_collection("risk_flags").insert_one(flag_doc)
    
    # Audit Log Entry (Invariant: risk_flags.status change is logged to audit_log)
    audit_entry = {
        "_id": str(uuid.uuid4()),
        "actor_user_id": requesting_user.get("sub"),
        "action": "create",
        "entity_type": "risk_flag",
        "entity_id": flag_doc["_id"],
        "after": flag_doc,
        "created_at": datetime.now(timezone.utc),
    }
    await get_collection("audit_log").insert_one(audit_entry)

    flag_doc["id"] = flag_doc["_id"]
    return [flag_doc]

async def get_active_flags(enterprise_id: str, requesting_user: dict) -> list[dict]:
    await get_enterprise_by_id(enterprise_id, requesting_user)
    
    coll = get_collection("risk_flags")
    cursor = coll.find({"enterprise_id": enterprise_id, "status": "active"})
    results = []
    async for doc in cursor:
        doc["id"] = doc["_id"]
        results.append(doc)

    if not results:
        # Evaluate if none exist
        return await evaluate_risk_flags(enterprise_id, requesting_user)

    return results

async def update_flag_status(enterprise_id: str, flag_id: str, status: str, requesting_user: dict) -> dict:
    await get_enterprise_by_id(enterprise_id, requesting_user)
    
    if status not in ("active", "acknowledged", "resolved"):
        raise PravahaServiceError(f"Invalid status: {status}")

    coll = get_collection("risk_flags")
    flag = await coll.find_one({"_id": flag_id, "enterprise_id": enterprise_id})
    if not flag:
        raise NotFoundError("Risk flag not found")

    if flag["status"] == status:
        flag["id"] = flag["_id"]
        return flag

    await coll.update_one({"_id": flag_id}, {"$set": {"status": status, "updated_at": datetime.now(timezone.utc)}})
    updated_flag = await coll.find_one({"_id": flag_id})
    
    # Audit Log Entry
    audit_entry = {
        "_id": str(uuid.uuid4()),
        "actor_user_id": requesting_user.get("sub"),
        "action": "update_status",
        "entity_type": "risk_flag",
        "entity_id": flag_id,
        "before": {"status": flag["status"]},
        "after": {"status": status},
        "created_at": datetime.now(timezone.utc),
    }
    await get_collection("audit_log").insert_one(audit_entry)

    updated_flag["id"] = updated_flag["_id"]
    return updated_flag
