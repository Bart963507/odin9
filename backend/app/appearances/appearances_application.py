from sqlalchemy.orm import Session

from app.appearances.appearances_repository import select_appearances_ordered_by_game
from app.appearances.appearances_schemas import AppearanceOut


def get_appearances(session: Session) -> list[AppearanceOut]:
    return [
        AppearanceOut.model_validate(db_appearance)
        for db_appearance in select_appearances_ordered_by_game(session)
    ]
