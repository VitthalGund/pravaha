class PravahaServiceError(Exception): pass
class AuthenticationError(PravahaServiceError): pass
class AuthorizationError(PravahaServiceError): pass
class NotFoundError(PravahaServiceError): pass
class ConflictError(PravahaServiceError): pass
class ValidationError(PravahaServiceError): pass
