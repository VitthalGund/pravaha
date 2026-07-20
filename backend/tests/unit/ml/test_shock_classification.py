import pytest
from app.ml.explainability import classify_shock_type

def test_dairy_monsoon_classified_as_seasonal_normal():
    context = {"sector": "dairy", "month": 7, "district": "Nashik"}
    res = classify_shock_type([], context)
    assert res == "seasonal_normal"

def test_market_signal_classified_as_market_shock():
    context = {"sector": "dairy", "month": 1, "market_signal": True}
    res = classify_shock_type([], context)
    assert res == "market_shock"
