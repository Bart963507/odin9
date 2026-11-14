from collections.abc import Sequence

from fastapi import APIRouter
from sqlalchemy import select

from app.database import SessionDependency
from app.models import Player
from app.schemas import PlayerOut

router = APIRouter(prefix="/players", tags=["players"])


@router.get("", response_model=list[PlayerOut])
def list_players(session: SessionDependency) -> Sequence[Player]:
    return session.scalars(select(Player).order_by(Player.id)).all()
