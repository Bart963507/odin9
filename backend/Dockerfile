FROM python:3.14-slim

COPY --from=ghcr.io/astral-sh/uv:0.13.7 /uv /uvx /bin/

ENV UV_COMPILE_BYTECODE=1 \
    UV_NO_DEV=1 \
    UV_NO_CACHE=1 \
    UV_PYTHON_DOWNLOADS=0 \
    PYTHONUNBUFFERED=1 \
    FORWARDED_ALLOW_IPS="*" \
    PATH="/app/.venv/bin:$PATH"

RUN useradd --system --no-create-home app

WORKDIR /app

RUN --mount=type=bind,source=uv.lock,target=uv.lock \
    uv sync --frozen --no-install-project

COPY . .
RUN uv sync --locked

USER app

CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
