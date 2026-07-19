from dataclasses import dataclass
from datetime import datetime, timezone

@dataclass
class BacktestResult:
    enterprise_id: str
    holdout_months: int
    mae: float
    mape: float
    directional_accuracy: float
    eval_timestamp: datetime

def evaluate_forecast_accuracy(actual_series: list[float], predicted_series: list[float], enterprise_id: str = "demo-enterprise-id") -> BacktestResult:
    if not actual_series or not predicted_series or len(actual_series) != len(predicted_series):
        return BacktestResult(
            enterprise_id=enterprise_id,
            holdout_months=len(actual_series) if actual_series else 0,
            mae=0.0,
            mape=0.0,
            directional_accuracy=1.0,
            eval_timestamp=datetime.now(timezone.utc),
        )

    n = len(actual_series)
    errors = [abs(act - pred) for act, pred in zip(actual_series, predicted_series)]
    mae = sum(errors) / n

    pct_errors = [abs((act - pred) / act) for act, pred in zip(actual_series, predicted_series) if act != 0]
    mape = (sum(pct_errors) / len(pct_errors)) * 100.0 if pct_errors else 0.0

    # Directional accuracy
    correct_direction = 0
    for i in range(1, n):
        act_dir = actual_series[i] >= actual_series[i - 1]
        pred_dir = predicted_series[i] >= predicted_series[i - 1]
        if act_dir == pred_dir:
            correct_direction += 1
    dir_acc = correct_direction / (n - 1) if n > 1 else 1.0

    return BacktestResult(
        enterprise_id=enterprise_id,
        holdout_months=n,
        mae=round(mae, 2),
        mape=round(mape, 2),
        directional_accuracy=round(dir_acc, 2),
        eval_timestamp=datetime.now(timezone.utc),
    )
