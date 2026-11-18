from fastapi import APIRouter

from app.database import SessionDependency
from app.stats.stats_application import get_player_stats
from app.stats.stats_schemas import PlayerStatsOut

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("")
def list_player_stats(session: SessionDependency) -> list[PlayerStatsOut]:
    return get_player_stats(session)
