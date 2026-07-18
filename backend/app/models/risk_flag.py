from pydantic import BaseModel, field_validator
from typing import Literal, Optional
from datetime import datetime
from app.core.constants import FLAG_TYPES, RISK_SEVERITIES

class RiskFlagOut(BaseModel):
    id: str
    enterprise_id: str
    flag_type: str
    severity: str
    reason_codes: list[str]
    suggested_action: str
    status: Literal["active", "acknowledged", "resolved"]
    generated_at: datetime
    resolved_at: Optional[datetime] = None

    @field_validator("flag_type")
    def validate_flag(cls, v):
        if v not in FLAG_TYPES:
            raise ValueError(f"Invalid flag type {v}")
        return v

    @field_validator("severity")
    def validate_severity(cls, v):
        if v not in RISK_SEVERITIES:
            raise ValueError(f"Invalid severity {v}")
        return v
