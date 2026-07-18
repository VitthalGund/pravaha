import uuid
import contextvars
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

correlation_id_ctx: contextvars.ContextVar[str] = contextvars.ContextVar("correlation_id", default="")

class CorrelationIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        corr_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
        token = correlation_id_ctx.set(corr_id)
        
        response = await call_next(request)
        response.headers["X-Correlation-ID"] = corr_id
        
        correlation_id_ctx.reset(token)
        return response

def get_correlation_id() -> str:
    return correlation_id_ctx.get()
