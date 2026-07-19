from app.core.constants import FLAG_TYPES

def generate_reason_codes(top_features: list[dict]) -> list[dict]:
    # Formats top SHAP feature drivers into structured reason inputs
    reason_codes = []
    for f in top_features[:3]:
        feat_name = f.get("feature", "unknown_driver")
        impact = f.get("impact", 0.0)
        reason_codes.append({
            "feature": feat_name,
            "impact": impact,
            "label": feat_name.replace("_", " ").title(),
        })
    return reason_codes

def classify_shock_type(top_drivers: list[dict], context: dict) -> str:
    # Check if seasonality matches expected sector dip
    month = context.get("month", 7)
    sector = context.get("sector", "dairy")

    if sector == "dairy" and month in (6, 7, 8):
        return "seasonal_normal"
    elif context.get("market_signal"):
        return "market_shock"
    elif context.get("climate_signal"):
        return "climate_shock"
    elif context.get("personal_note"):
        return "personal_shock"
    elif context.get("is_overleveraged"):
        return "over_leverage"

    # Default fallback to market_shock (never unclassified)
    return "market_shock"
