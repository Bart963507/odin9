from sqlalchemy.orm import Session

from app.stats.stats_repository import select_player_stats_ordered_by_player
from app.stats.stats_schemas import PlayerStatsOut


def get_player_stats(session: Session) -> list[PlayerStatsOut]:
    return [
        PlayerStatsOut.model_validate(dict(player_stats))
        for player_stats in select_player_stats_ordered_by_player(session)
    ]
