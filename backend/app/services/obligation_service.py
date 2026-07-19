from app.models.obligation import ObligationCreate, ObligationOut
from app.services.enterprise_service import get_enterprise_by_id
from app.core.constants import OVER_LEVERAGE_RATIO_THRESHOLD
from app.core.exceptions import NotFoundError
from app.db.mongo import get_collection
import uuid
from datetime import datetime, timezone

async def create_obligation(obl_in: ObligationCreate, requesting_user: dict) -> dict:
    await get_enterprise_by_id(obl_in.enterprise_id, requesting_user)
    
    ent = await get_collection("enterprises").find_one({"_id": obl_in.enterprise_id})
    if not ent:
        raise NotFoundError("Enterprise not found")

    doc = obl_in.model_dump()
    doc["_id"] = str(uuid.uuid4())
    doc["status"] = "active"
    doc["created_at"] = datetime.now(timezone.utc)

    await get_collection("obligations").insert_one(doc)

    # Audit Log Entry (Invariant: obligation writes log to audit_log)
    audit_entry = {
        "_id": str(uuid.uuid4()),
        "actor_user_id": requesting_user.get("sub"),
        "action": "create",
        "entity_type": "obligation",
        "entity_id": doc["_id"],
        "after": doc,
        "created_at": datetime.now(timezone.utc),
    }
    await get_collection("audit_log").insert_one(audit_entry)

    doc["id"] = doc["_id"]
    return doc

async def get_enterprise_obligations(enterprise_id: str, requesting_user: dict) -> list[dict]:
    await get_enterprise_by_id(enterprise_id, requesting_user)
    
    coll = get_collection("obligations")
    cursor = coll.find({"enterprise_id": enterprise_id})
    results = []
    async for doc in cursor:
        doc["id"] = doc["_id"]
        results.append(doc)
    return results

def check_over_leverage(obligations: list[dict], forecast_monthly_income: float) -> dict:
    if forecast_monthly_income <= 0:
        return {"is_overleveraged": True, "ratio": 1.0, "total_monthly_installment": sum(float(o.get("monthly_installment", 0)) for o in obligations)}

    total_installment = sum(float(o.get("monthly_installment", 0)) for o in obligations)
    ratio = total_installment / forecast_monthly_income
    is_over = ratio > OVER_LEVERAGE_RATIO_THRESHOLD

    return {
        "is_overleveraged": is_over,
        "ratio": round(ratio, 3),
        "total_monthly_installment": total_installment,
        "forecast_monthly_income": forecast_monthly_income,
    }

def get_informal_cost_comparison(amount: float, estimated_informal_rate: float = 36.0, formal_rate: float = 8.5) -> dict:
    # Typical priority sector credit ~8.5% vs informal trader/moneylender ~36%+
    annual_informal_cost = amount * (estimated_informal_rate / 100.0)
    annual_formal_cost = amount * (formal_rate / 100.0)
    savings = annual_informal_cost - annual_formal_cost

    return {
        "amount": amount,
        "informal_annual_cost": round(annual_informal_cost, 2),
        "formal_annual_cost": round(annual_formal_cost, 2),
        "potential_annual_savings": round(savings, 2),
        "comparison_text": f"This informal credit costs ~₹{int(annual_informal_cost):,}/yr. Refinancing through Kisan Credit Card (KCC) at 8.5% could save ~₹{int(savings):,}/yr."
    }
