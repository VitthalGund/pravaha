from pydantic import BaseModel
from datetime import datetime

class ForecastPoint(BaseModel):
    month: str
    predicted_amount: float
    lower_bound: float
    upper_bound: float

class ForecastOut(BaseModel):
    id: str
    enterprise_id: str
    model_version: str
    horizon_months: int
    predicted_series: list[ForecastPoint]
    cohort_used: bool
    generated_at: datetime
