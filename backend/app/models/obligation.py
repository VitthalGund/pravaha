from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime

SOURCE_TYPES = ['bank_loan', 'mfi_loan', 'shg_liability', 'kcc', 'informal_trade_credit', 'informal_moneylender']

class ObligationCreate(BaseModel):
    enterprise_id: str
    source_type: str
    lender_name: str
    amount_outstanding: float = Field(..., gt=0)
    monthly_installment: float = Field(..., gt=0)
    interest_rate_annual: Optional[float] = None
    self_reported: bool

    @field_validator("source_type")
    def validate_source(cls, v):
        if v not in SOURCE_TYPES:
            raise ValueError(f"Invalid source type {v}")
        return v

class ObligationOut(ObligationCreate):
    id: str
    created_at: datetime
