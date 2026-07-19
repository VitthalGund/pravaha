from app.db.mongo import get_collection

async def get_peer_cohort_priors(sector: str, district: str, exclude_enterprise_id: str) -> list[dict]:
    # Query peer enterprises in same sector & district
    ent_coll = get_collection("enterprises")
    cursor = ent_coll.find({
        "sector": sector,
        "district": district,
        "_id": {"$ne": exclude_enterprise_id}
    })
    
    peer_ids = [doc["_id"] async for doc in cursor]
    if not peer_ids:
        # Fallback to same sector across all districts
        cursor_sector = ent_coll.find({"sector": sector, "_id": {"$ne": exclude_enterprise_id}})
        peer_ids = [doc["_id"] async for doc in cursor_sector]

    if not peer_ids:
        return []

    # Pull entries for peer enterprises
    entries_coll = get_collection("cash_flow_entries")
    entries_cursor = entries_coll.find({"enterprise_id": {"$in": peer_ids}}).limit(100)
    return [doc async for doc in entries_cursor]
