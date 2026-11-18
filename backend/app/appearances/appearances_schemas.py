from pydantic import BaseModel, ConfigDict


class AppearanceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    game_id: int
    player_id: int
    started: bool | None
    minutes_played: int | None
