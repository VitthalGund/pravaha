import pytest
from app.services.obligation_service import check_over_leverage, get_informal_cost_comparison

def test_over_leverage_detection_ratio():
    obligations = [
        {"monthly_installment": 3000},
        {"monthly_installment": 3000},
    ]
    res = check_over_leverage(obligations, forecast_monthly_income=10000)
    assert res["is_overleveraged"] is True
    assert res["ratio"] == 0.6

def test_informal_cost_comparison():
    res = get_informal_cost_comparison(amount=10000)
    assert res["informal_annual_cost"] == 3600.0
    assert res["formal_annual_cost"] == 850.0
    assert res["potential_annual_savings"] == 2750.0
