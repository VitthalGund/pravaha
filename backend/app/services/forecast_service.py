from app.ml.forecast_model import generate_forecast, ForecastInput
from app.services.cohort_service import get_peer_cohort_priors
from app.services.enterprise_service import get_enterprise_by_id
from app.core.exceptions import NotFoundError
from app.db.mongo import get_collection
import uuid
from datetime import datetime, timezone

async def generate_and_save_forecast(enterprise_id: str, horizon_months: int, requesting_user: dict) -> dict:
    await get_enterprise_by_id(enterprise_id, requesting_user)
    
    ent = await get_collection("enterprises").find_one({"_id": enterprise_id})
    if not ent:
        raise NotFoundError("Enterprise not found")

    # Load enterprise's own entries
    entries_coll = get_collection("cash_flow_entries")
    cursor = entries_coll.find({"enterprise_id": enterprise_id})
    own_history = [doc async for doc in cursor]

    # Pull cohort priors if thin data
    cohort_priors = None
    if len(own_history) < 3:
        cohort_priors = await get_peer_cohort_priors(
            sector=ent["sector"],
            district=ent["district"],
            exclude_enterprise_id=enterprise_id,
        )

    input_data = ForecastInput(
        own_history=own_history,
        cohort_priors=cohort_priors,
        sector=ent["sector"],
        horizon_months=horizon_months,
    )

    result = generate_forecast(input_data)

    forecast_doc = {
        "_id": str(uuid.uuid4()),
        "meta": {"enterprise_id": enterprise_id},
        "model_version": result.model_version,
        "horizon_months": horizon_months,
        "predicted_series": result.predicted_series,
        "cohort_used": result.cohort_used,
        "generated_at": datetime.now(timezone.utc),
    }

    await get_collection("forecasts").insert_one(forecast_doc)
    forecast_doc["id"] = forecast_doc["_id"]
    return forecast_doc

async def get_latest_forecast(enterprise_id: str, requesting_user: dict) -> dict:
    await get_enterprise_by_id(enterprise_id, requesting_user)
    
    coll = get_collection("forecasts")
    doc = await coll.find_one({"meta.enterprise_id": enterprise_id}, sort=[("generated_at", -1)])
    if not doc:
        # Generate on demand
        return await generate_and_save_forecast(enterprise_id, 3, requesting_user)
    doc["id"] = doc["_id"]
    return doc
