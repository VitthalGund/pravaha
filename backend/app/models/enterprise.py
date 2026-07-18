from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from app.core.constants import SECTORS, CREDIT_READINESS_STAGES

class EnterpriseCreate(BaseModel):
    name: str
    sector: str
    shg_id: Optional[str] = None
    fpo_id: Optional[str] = None
    district: str
    state: str

    @field_validator("sector")
    def validate_sector(cls, v):
        if v not in SECTORS:
            raise ValueError(f"Sector must be one of {SECTORS}")
        return v

class EnterpriseOut(BaseModel):
    id: str
    owner_user_id: str
    name: str
    sector: str
    shg_id: Optional[str]
    fpo_id: Optional[str]
    district: str
    state: str
    credit_readiness_stage: str
    onboarded_at: datetime
    e_shakti_ref: Optional[str] = None
