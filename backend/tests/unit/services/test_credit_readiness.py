import pytest
from app.services.credit_readiness_service import compute_credit_readiness

def test_advances_after_stable_periods():
    history = [
        {"period": "1", "forecast_stable": True, "has_flags": False},
        {"period": "2", "forecast_stable": True, "has_flags": False},
        {"period": "3", "forecast_stable": True, "has_flags": False},
    ]
    res = compute_credit_readiness("grant_dependent", history)
    assert res == "emerging"

def test_over_leverage_blocks_advancement():
    history = [
        {"period": "1", "forecast_stable": True, "has_flags": True, "flag_types": ["over_leverage"]},
        {"period": "2", "forecast_stable": True, "has_flags": False},
        {"period": "3", "forecast_stable": True, "has_flags": False},
    ]
    res = compute_credit_readiness("grant_dependent", history)
    assert res == "grant_dependent"
