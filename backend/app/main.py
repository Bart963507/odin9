from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.appearances.appearances_views import router as appearances_router
from app.config import get_settings
from app.database import SessionDependency
from app.events.events_views import router as events_router
from app.games.games_views import router as games_router
from app.players.players_views import router as players_router
from app.rate_limit import rate_limit
from app.stats.stats_views import router as stats_router

app = FastAPI(title="Odin API", dependencies=[Depends(rate_limit("120/minute", "api"))])

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origins,
    allow_methods=["GET"],
)

app.include_router(players_router)
app.include_router(games_router)
app.include_router(events_router)
app.include_router(appearances_router)
app.include_router(stats_router)


@app.get("/health")
def health(session: SessionDependency) -> dict[str, str]:
    session.execute(text("SELECT 1"))
    return {"status": "ok"}
