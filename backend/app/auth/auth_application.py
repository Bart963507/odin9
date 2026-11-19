import datetime
import hmac

import jwt

from app.auth.auth_schemas import TokenOut
from app.config import get_settings

TOKEN_LIFETIME = datetime.timedelta(days=7)
TOKEN_ALGORITHM = "HS256"


class InvalidPasswordError(Exception):
    pass


class InvalidTokenError(Exception):
    pass


def log_in(password: str) -> TokenOut:
    if not password_matches(password):
        raise InvalidPasswordError
    return issue_token()


def verify_token(token: str) -> None:
    try:
        jwt.decode(
            token,
            get_settings().jwt_secret,
            algorithms=[TOKEN_ALGORITHM],
            options={"require": ["exp"]},
        )
    except jwt.InvalidTokenError as error:
        raise InvalidTokenError from error


def password_matches(password: str) -> bool:
    return hmac.compare_digest(password.encode(), get_settings().site_password.encode())


def issue_token() -> TokenOut:
    expires_at = datetime.datetime.now(datetime.UTC) + TOKEN_LIFETIME
    access_token = jwt.encode(
        {"exp": expires_at}, get_settings().jwt_secret, algorithm=TOKEN_ALGORITHM
    )
    return TokenOut(access_token=access_token, expires_at=expires_at)
