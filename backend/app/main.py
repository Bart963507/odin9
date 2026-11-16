from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import get_settings
from app.database import SessionDependency
from app.players.players_views import router as players_router
from app.rate_limit import rate_limit

app = FastAPI(title="Odin API", dependencies=[Depends(rate_limit("120/minute", "api"))])

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origins,
    allow_methods=["GET"],
)

app.include_router(players_router)


# test deployments
@app.get("/health")
def health(session: SessionDependency) -> dict[str, str]:
    session.execute(text("SELECT 1"))
    return {"status": "ok"}
