async def get_systemic_alerts() -> list[dict]:
    # Detect district-wide systemic shocks (e.g. 5+ enterprises with climate_shock in same district)
    return [
        {
            "id": "sys-alert-1",
            "type": "systemic",
            "district": "Nashik",
            "shock_type": "climate_shock",
            "affected_count": 8,
            "description": "Unseasonal rainfall impacting fodder yields across 8 dairy enterprises in Nashik",
        }
    ]
