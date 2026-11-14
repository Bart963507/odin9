from fastapi import APIRouter

from app.database import SessionDependency
from app.players.players_application import get_players
from app.players.players_schemas import PlayerOut

router = APIRouter(prefix="/players", tags=["players"])


@router.get("")
def list_players(session: SessionDependency) -> list[PlayerOut]:
    return get_players(session)
