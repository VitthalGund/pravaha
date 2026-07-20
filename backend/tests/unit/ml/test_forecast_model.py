import pytest
from app.ml.forecast_model import generate_forecast, ForecastInput

def test_forecast_output_structure():
    input_data = ForecastInput(
        own_history=[{"amount": 10000}, {"amount": 12000}],
        cohort_priors=None,
        sector="dairy",
        horizon_months=3,
    )
    result = generate_forecast(input_data)
    assert len(result.predicted_series) == 3
    assert len(result.confidence_bands) == 3
    assert result.model_version == "lgbm-prophet-v1"
    assert result.cohort_used is True  # <3 months history

def test_cohort_bootstrapped_has_wider_bands():
    rich_input = ForecastInput(
        own_history=[{"amount": 10000}] * 6,
        cohort_priors=None,
        sector="dairy",
        horizon_months=3,
    )
    thin_input = ForecastInput(
        own_history=[{"amount": 10000}],
        cohort_priors=[{"amount": 10000}],
        sector="dairy",
        horizon_months=3,
    )
    rich_res = generate_forecast(rich_input)
    thin_res = generate_forecast(thin_input)

    rich_spread = rich_res.confidence_bands[0]["upper"] - rich_res.confidence_bands[0]["lower"]
    thin_spread = thin_res.confidence_bands[0]["upper"] - thin_res.confidence_bands[0]["lower"]

    assert thin_spread > rich_spread
