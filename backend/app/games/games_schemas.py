import datetime
from typing import Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models import EventType

LAST_MINUTE_OF_MATCH = 120
MAX_LINEUP_SIZE = 30
MAX_EVENTS_PER_MATCH = 100


class GameOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    date: datetime.date
    home: str
    away: str
    competition: str | None
    goals_odin: int | None
    goals_opponent: int | None


class LineupEntryIn(BaseModel):
    player_id: int
    started: bool | None = None
    minutes_played: int | None = Field(default=None, ge=0, le=LAST_MINUTE_OF_MATCH)


class MatchEventIn(BaseModel):
    player_id: int
    event_type: EventType
    minute: int | None = Field(default=None, ge=0, le=LAST_MINUTE_OF_MATCH)


class MatchReportIn(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    date: datetime.date
    home: str = Field(min_length=1, max_length=100)
    away: str = Field(min_length=1, max_length=100)
    competition: str | None = Field(default=None, max_length=100)
    goals_odin: int | None = Field(default=None, ge=0)
    goals_opponent: int | None = Field(default=None, ge=0)
    lineup: list[LineupEntryIn] = Field(
        default_factory=list, max_length=MAX_LINEUP_SIZE
    )
    events: list[MatchEventIn] = Field(
        default_factory=list, max_length=MAX_EVENTS_PER_MATCH
    )

    @model_validator(mode="after")
    def reject_duplicate_lineup_players(self) -> Self:
        lineup_player_ids = [entry.player_id for entry in self.lineup]
        if len(set(lineup_player_ids)) != len(lineup_player_ids):
            raise ValueError("A player appears more than once in the lineup")
        return self

    @model_validator(mode="after")
    def reject_events_for_players_outside_lineup(self) -> Self:
        lineup_player_ids = {entry.player_id for entry in self.lineup}
        players_outside_lineup = {
            event.player_id for event in self.events
        } - lineup_player_ids
        if players_outside_lineup:
            raise ValueError(
                "Events for players not in the lineup: "
                f"{sorted(players_outside_lineup)}"
            )
        return self
