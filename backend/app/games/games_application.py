from sqlalchemy.orm import Session

from app.games.games_repository import select_games_ordered_by_date
from app.games.games_schemas import GameOut


def get_games(session: Session) -> list[GameOut]:
    return [
        GameOut.model_validate(db_game)
        for db_game in select_games_ordered_by_date(session)
    ]
