from app.core.constants import CREDIT_READINESS_STAGES

def compute_credit_readiness(current_stage: str, period_history: list[dict]) -> str:
    # 3+ consecutive stable periods with no active over_leverage flags advances stage
    has_over_leverage = any("over_leverage" in p.get("flag_types", []) for p in period_history)
    if has_over_leverage:
        return current_stage  # Blocked by over-leverage

    stable_periods = sum(1 for p in period_history if p.get("forecast_stable") and not p.get("has_flags"))
    
    if stable_periods >= 3:
        if current_stage == "grant_dependent":
            return "emerging"
        elif current_stage == "emerging":
            return "loan_ready"

    return current_stage
