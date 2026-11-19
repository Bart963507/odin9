import math
import time
from collections.abc import Callable

from fastapi import HTTPException, Request, status
from limits import RateLimitItem, parse
from limits.storage import MemoryStorage
from limits.strategies import MovingWindowRateLimiter

RAILWAY_CLIENT_IP_HEADER = "x-real-ip"
ALL_CLIENTS_KEY = "all-clients"

rate_limiter = MovingWindowRateLimiter(MemoryStorage())


def rate_limit(limit: str, namespace: str) -> Callable[[Request], None]:
    rate_limit_item = parse(limit)

    def enforce_rate_limit(request: Request) -> None:
        enforce_limit_for_key(
            rate_limit_item, limit, namespace, client_address_of(request)
        )

    return enforce_rate_limit


def global_rate_limit(limit: str, namespace: str) -> Callable[[], None]:
    rate_limit_item = parse(limit)

    def enforce_global_rate_limit() -> None:
        enforce_limit_for_key(rate_limit_item, limit, namespace, ALL_CLIENTS_KEY)

    return enforce_global_rate_limit


def enforce_limit_for_key(
    rate_limit_item: RateLimitItem, limit: str, namespace: str, key: str
) -> None:
    if not rate_limiter.hit(rate_limit_item, namespace, key):
        retry_after = seconds_until_reset(rate_limit_item, namespace, key)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many requests, limit is {limit}",
            headers={"Retry-After": str(retry_after)},
        )


def client_address_of(request: Request) -> str:
    if railway_client_ip := request.headers.get(RAILWAY_CLIENT_IP_HEADER):
        return railway_client_ip
    return request.client.host if request.client else "unknown"


def seconds_until_reset(
    rate_limit_item: RateLimitItem, namespace: str, client_address: str
) -> int:
    window = rate_limiter.get_window_stats(rate_limit_item, namespace, client_address)
    return max(1, math.ceil(window.reset_time - time.time()))
