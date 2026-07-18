from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VisitCreate(BaseModel):
    enterprise_id: str
    outcome_notes: str
    offline_created: bool = False

class VisitOut(BaseModel):
    id: str
    field_officer_id: str
    enterprise_id: str
    scheduled_at: Optional[datetime]
    completed_at: datetime
    outcome_notes: str
    offline_created: bool
    synced_at: datetime
