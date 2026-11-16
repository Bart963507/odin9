from sqlalchemy.orm import Session

from app.players.players_repository import select_players_ordered_by_id
from app.players.players_schemas import PlayerOut


def get_players(session: Session) -> list[PlayerOut]:
    return [
        PlayerOut.model_validate(db_player)
        for db_player in select_players_ordered_by_id(session)
    ]
