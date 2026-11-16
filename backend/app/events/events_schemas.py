from pydantic import BaseModel, ConfigDict

from app.models import EventType


class GameEventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    game_id: int
    player_id: int
    event_type: EventType
    minute: int | None
