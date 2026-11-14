import datetime
import enum

from sqlalchemy import (
    CheckConstraint,
    Enum,
    ForeignKey,
    MetaData,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=NAMING_CONVENTION)


class EventType(enum.Enum):
    GOAL = "goal"
    OWN_GOAL = "own_goal"
    ASSIST = "assist"
    YELLOW_CARD = "yellow_card"
    RED_CARD = "red_card"
    THROWIN_FAILED = "throwin_failed"
    INJURY = "injury"
    CLEAN_SHEET = "clean_sheet"


class Player(Base):
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    role: Mapped[str | None] = mapped_column(String(50))
    position: Mapped[str | None] = mapped_column(String(50))
    number: Mapped[int | None]

    appearances: Mapped[list[Appearance]] = relationship(back_populates="player")
    events: Mapped[list[GameEvent]] = relationship(back_populates="player")


class Game(Base):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[datetime.date] = mapped_column(index=True)
    home: Mapped[str] = mapped_column(String(100))
    away: Mapped[str] = mapped_column(String(100))
    competition: Mapped[str | None] = mapped_column(String(100))
    goals_odin: Mapped[int | None]
    goals_opponent: Mapped[int | None]

    appearances: Mapped[list[Appearance]] = relationship(back_populates="game")
    events: Mapped[list[GameEvent]] = relationship(back_populates="game")

    __table_args__ = (
        CheckConstraint("goals_odin >= 0 AND goals_opponent >= 0", name="goals_nonneg"),
    )


class Appearance(Base):
    __tablename__ = "appearances"

    id: Mapped[int] = mapped_column(primary_key=True)
    game_id: Mapped[int] = mapped_column(
        ForeignKey("games.id", ondelete="CASCADE"), index=True
    )
    player_id: Mapped[int] = mapped_column(
        ForeignKey("players.id", ondelete="CASCADE"), index=True
    )
    started: Mapped[bool | None]
    minutes_played: Mapped[int | None]

    game: Mapped[Game] = relationship(back_populates="appearances")
    player: Mapped[Player] = relationship(back_populates="appearances")

    __table_args__ = (
        UniqueConstraint("game_id", "player_id", name="uq_appearances_game_player"),
    )


class GameEvent(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True)
    game_id: Mapped[int] = mapped_column(
        ForeignKey("games.id", ondelete="CASCADE"), index=True
    )
    player_id: Mapped[int] = mapped_column(
        ForeignKey("players.id", ondelete="CASCADE"), index=True
    )
    event_type: Mapped[EventType] = mapped_column(
        Enum(
            EventType,
            name="event_type",
            values_callable=lambda members: [member.value for member in members],
        )
    )
    minute: Mapped[int | None]

    game: Mapped[Game] = relationship(back_populates="events")
    player: Mapped[Player] = relationship(back_populates="events")
