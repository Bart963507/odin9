import enum

from pydantic import BaseModel, ConfigDict, Field


class PlayerRole(enum.StrEnum):
    GOALKEEPER = "Doelman"
    DEFENDER = "Verdediger"
    MIDFIELDER = "Middenvelder"
    FORWARD = "Aanvaller"


class PlayerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    first_name: str
    last_name: str
    role: str | None
    position: str | None
    number: int | None


class PlayerIn(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    role: PlayerRole
    position: str = Field(min_length=1, max_length=50)
    number: int | None = Field(default=None, ge=0, le=99)
