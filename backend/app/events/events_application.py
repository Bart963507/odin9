from sqlalchemy.orm import Session

from app.events.events_repository import select_events_ordered_by_game
from app.events.events_schemas import GameEventOut


def get_events(session: Session) -> list[GameEventOut]:
    return [
        GameEventOut.model_validate(db_event)
        for db_event in select_events_ordered_by_game(session)
    ]
