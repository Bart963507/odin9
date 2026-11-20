from sqlalchemy.orm import Session

from app.models import DBPlayer
from app.players.players_repository import (
    insert_player,
    select_players_ordered_by_id,
)
from app.players.players_schemas import PlayerIn, PlayerOut


def get_players(session: Session) -> list[PlayerOut]:
    return [
        PlayerOut.model_validate(db_player)
        for db_player in select_players_ordered_by_id(session)
    ]


def create_player(session: Session, player: PlayerIn) -> PlayerOut:
    db_player = insert_player(session, to_db_player(player))
    session.commit()
    return PlayerOut.model_validate(db_player)


def to_db_player(player: PlayerIn) -> DBPlayer:
    return DBPlayer(
        first_name=player.first_name,
        last_name=player.last_name,
        role=player.role.value,
        position=player.position,
        number=player.number,
    )
