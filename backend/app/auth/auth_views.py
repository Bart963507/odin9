from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.auth.auth_application import (
    InvalidPasswordError,
    InvalidTokenError,
    log_in,
    verify_token,
)
from app.auth.auth_schemas import LoginIn, TokenOut
from app.rate_limit import global_rate_limit

router = APIRouter(prefix="/auth", tags=["auth"])

bearer_scheme = HTTPBearer(auto_error=False)


@router.post("/login", dependencies=[Depends(global_rate_limit("5/minute", "login"))])
def login(login_request: LoginIn) -> TokenOut:
    try:
        return log_in(login_request.password)
    except InvalidPasswordError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password"
        ) from error


def require_token(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> None:
    if credentials is None:
        raise unauthorized("Missing token")
    try:
        verify_token(credentials.credentials)
    except InvalidTokenError as error:
        raise unauthorized("Invalid or expired token") from error


def unauthorized(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )
