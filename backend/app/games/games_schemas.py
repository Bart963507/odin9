import datetime

from pydantic import BaseModel, ConfigDict


class GameOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    date: datetime.date
    home: str
    away: str
    competition: str | None
    goals_odin: int | None
    goals_opponent: int | None
