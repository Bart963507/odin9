from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import DBGameEvent


def select_events_ordered_by_game(session: Session) -> Sequence[DBGameEvent]:
    return session.scalars(
        select(DBGameEvent).order_by(DBGameEvent.game_id, DBGameEvent.id)
    ).all()
