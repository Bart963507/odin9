from fastapi import APIRouter

from app.database import SessionDependency
from app.games.games_application import get_games
from app.games.games_schemas import GameOut

router = APIRouter(prefix="/games", tags=["games"])


@router.get("")
def list_games(session: SessionDependency) -> list[GameOut]:
    return get_games(session)
