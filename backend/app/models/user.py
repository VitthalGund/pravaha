from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    pin: Optional[str] = None
    password: Optional[str] = None
    full_name: str
    role: str = "enterprise_owner"

class UserOut(BaseModel):
    id: str
    role: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: str
    preferred_language: str = "en"
    district: Optional[str] = None
    state: Optional[str] = None
    created_at: datetime

class LoginRequest(BaseModel):
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    pin: Optional[str] = None
    password: Optional[str] = None

class OTPRequest(BaseModel):
    phone: str

class OTPVerify(BaseModel):
    phone: str
    otp: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class PINSetup(BaseModel):
    pin: str
    
    @field_validator("pin")
    def validate_pin(cls, v):
        if not v.isdigit() or len(v) != 4:
            raise ValueError("PIN must be exactly 4 digits")
        return v
