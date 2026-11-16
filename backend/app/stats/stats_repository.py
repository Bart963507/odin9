from collections.abc import Sequence

from sqlalchemy import RowMapping, Subquery, func, select
from sqlalchemy.orm import Session

from app.models import DBAppearance, DBGameEvent, DBPlayer, EventType

STAT_COLUMN_BY_EVENT_TYPE = {
    EventType.GOAL: "goals",
    EventType.OWN_GOAL: "own_goals",
    EventType.ASSIST: "assists",
    EventType.YELLOW_CARD: "yellow_cards",
    EventType.RED_CARD: "red_cards",
    EventType.THROWIN_FAILED: "throwins_failed",
    EventType.INJURY: "injuries",
    EventType.CLEAN_SHEET: "clean_sheets",
}


def select_player_stats_ordered_by_player(session: Session) -> Sequence[RowMapping]:
    games_played = games_played_per_player()
    event_counts = event_counts_per_player()
    statement = (
        select(
            DBPlayer.id.label("player_id"),
            func.coalesce(games_played.c.games_played, 0).label("games_played"),
            *(
                func.coalesce(event_counts.c[stat_column], 0).label(stat_column)
                for stat_column in STAT_COLUMN_BY_EVENT_TYPE.values()
            ),
        )
        .outerjoin(games_played, games_played.c.player_id == DBPlayer.id)
        .outerjoin(event_counts, event_counts.c.player_id == DBPlayer.id)
        .order_by(DBPlayer.id)
    )
    return session.execute(statement).mappings().all()


def games_played_per_player() -> Subquery:
    return (
        select(DBAppearance.player_id, func.count().label("games_played"))
        .group_by(DBAppearance.player_id)
        .subquery()
    )


def event_counts_per_player() -> Subquery:
    return (
        select(
            DBGameEvent.player_id,
            *(
                func.count()
                .filter(DBGameEvent.event_type == event_type)
                .label(stat_column)
                for event_type, stat_column in STAT_COLUMN_BY_EVENT_TYPE.items()
            ),
        )
        .group_by(DBGameEvent.player_id)
        .subquery()
    )
