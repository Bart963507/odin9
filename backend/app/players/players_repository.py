from collections.abc import Collection, Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import DBPlayer


def select_players_ordered_by_id(session: Session) -> Sequence[DBPlayer]:
    return session.scalars(select(DBPlayer).order_by(DBPlayer.id)).all()


def select_existing_player_ids(
    session: Session, player_ids: Collection[int]
) -> set[int]:
    return set(session.scalars(select(DBPlayer.id).where(DBPlayer.id.in_(player_ids))))


def insert_player(session: Session, db_player: DBPlayer) -> DBPlayer:
    session.add(db_player)
    session.flush()
    return db_player
