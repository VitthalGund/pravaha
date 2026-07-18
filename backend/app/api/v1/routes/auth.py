from fastapi import APIRouter, Depends, HTTPException, status
from app.models.common import APIResponse
from app.models.user import UserCreate, UserOut, LoginRequest, OTPRequest, OTPVerify, TokenResponse
from app.services import auth_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=APIResponse)
async def register(user_in: UserCreate):
    user_data = await auth_service.register_user(user_in)
    return APIResponse(success=True, data=UserOut(**user_data).model_dump(mode="json"))

@router.post("/request-otp", response_model=APIResponse)
async def request_otp(req: OTPRequest):
    await auth_service.request_otp(req.phone)
    return APIResponse(success=True, data={"message": "OTP requested"})

@router.post("/verify-otp", response_model=APIResponse)
async def verify_otp(req: OTPVerify):
    tokens = await auth_service.verify_otp(req.phone, req.otp)
    return APIResponse(success=True, data=tokens.model_dump())

@router.post("/login", response_model=APIResponse)
async def login(req: LoginRequest):
    tokens = await auth_service.login(req)
    return APIResponse(success=True, data=tokens.model_dump())

@router.post("/refresh", response_model=APIResponse)
async def refresh():
    return APIResponse(success=True, data={"message": "Token refreshed"})

@router.get("/me", response_model=APIResponse)
async def get_me(user: dict = Depends(get_current_user)):
    return APIResponse(success=True, data={"id": user["sub"], "role": user.get("role")})
