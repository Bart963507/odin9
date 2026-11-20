from fastapi import APIRouter, status

from app.database import SessionDependency
from app.players.players_application import create_player, get_players
from app.players.players_schemas import PlayerIn, PlayerOut

router = APIRouter(prefix="/players", tags=["players"])


@router.get("")
def list_players(session: SessionDependency) -> list[PlayerOut]:
    return get_players(session)


@router.post("", status_code=status.HTTP_201_CREATED)
def add_player(player: PlayerIn, session: SessionDependency) -> PlayerOut:
    return create_player(session, player)
