import math
import time
from collections.abc import Callable

from fastapi import HTTPException, Request, status
from limits import RateLimitItem, parse
from limits.storage import MemoryStorage
from limits.strategies import MovingWindowRateLimiter

rate_limiter = MovingWindowRateLimiter(MemoryStorage())


def rate_limit(limit: str, namespace: str) -> Callable[[Request], None]:
    rate_limit_item = parse(limit)

    def enforce_rate_limit(request: Request) -> None:
        client_address = client_address_of(request)
        if not rate_limiter.hit(rate_limit_item, namespace, client_address):
            retry_after = seconds_until_reset(
                rate_limit_item, namespace, client_address
            )
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Too many requests, limit is {limit}",
                headers={"Retry-After": str(retry_after)},
            )

    return enforce_rate_limit


def client_address_of(request: Request) -> str:
    return request.client.host if request.client else "unknown"


def seconds_until_reset(
    rate_limit_item: RateLimitItem, namespace: str, client_address: str
) -> int:
    window = rate_limiter.get_window_stats(rate_limit_item, namespace, client_address)
    return max(1, math.ceil(window.reset_time - time.time()))
