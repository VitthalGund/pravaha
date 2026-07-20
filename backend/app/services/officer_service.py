def compute_visit_priority(flag_severity: str, days_since_last_visit: int, trend_direction: str) -> float:
    # Ranking combines severity, days since visit, and trend direction into one computed score
    sev_weight = {"high": 3.0, "watch": 2.0, "low": 1.0}.get(flag_severity, 1.0)
    recency_weight = min(3.0, days_since_last_visit / 7.0)
    trend_weight = {"deteriorating": 2.0, "stable": 1.0, "improving": 0.5}.get(trend_direction, 1.0)
    return round(sev_weight * recency_weight * trend_weight, 2)

def rank_portfolio(enterprises: list[dict]) -> list[dict]:
    for e in enterprises:
        sev = e.get("severity", "low")
        days = e.get("days_since_visit", 7)
        trend = e.get("trend", "stable")
        e["visit_priority_score"] = compute_visit_priority(sev, days, trend)

    # Sort descending by computed priority score
    return sorted(enterprises, key=lambda x: x["visit_priority_score"], reverse=True)
