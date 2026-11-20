from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import DBGame


def select_games_ordered_by_date(session: Session) -> Sequence[DBGame]:
    return session.scalars(select(DBGame).order_by(DBGame.date, DBGame.id)).all()


def insert_game(session: Session, db_game: DBGame) -> DBGame:
    session.add(db_game)
    session.flush()
    return db_game
