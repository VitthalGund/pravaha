from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime

class CashFlowEntry(BaseModel):
    client_entry_id: str
    enterprise_id: str
    type: Literal["income", "expense"]
    category: str
    amount: float = Field(..., gt=0)
    recorded_at: datetime

class CashFlowSyncRequest(BaseModel):
    entries: list[CashFlowEntry]

class CashFlowSnapshot(BaseModel):
    total_income: float
    total_expense: float
    net_flow: float
    period: str
    status_line: str
