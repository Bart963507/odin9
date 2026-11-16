from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import DBPlayer


def select_players_ordered_by_id(session: Session) -> Sequence[DBPlayer]:
    return session.scalars(select(DBPlayer).order_by(DBPlayer.id)).all()
