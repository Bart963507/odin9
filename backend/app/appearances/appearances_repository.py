from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import DBAppearance


def select_appearances_ordered_by_game(session: Session) -> Sequence[DBAppearance]:
    return session.scalars(
        select(DBAppearance).order_by(DBAppearance.game_id, DBAppearance.player_id)
    ).all()
