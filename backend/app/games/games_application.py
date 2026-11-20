from sqlalchemy.orm import Session

from app.games.games_repository import insert_game, select_games_ordered_by_date
from app.games.games_schemas import GameOut, MatchReportIn
from app.models import DBAppearance, DBGame, DBGameEvent
from app.players.players_repository import select_existing_player_ids


class UnknownPlayersError(Exception):
    def __init__(self, player_ids: list[int]) -> None:
        super().__init__(f"Unknown player ids: {player_ids}")
        self.player_ids = player_ids


def get_games(session: Session) -> list[GameOut]:
    return [
        GameOut.model_validate(db_game)
        for db_game in select_games_ordered_by_date(session)
    ]


def create_match_report(session: Session, report: MatchReportIn) -> GameOut:
    unknown_player_ids = find_unknown_player_ids(session, report)
    if unknown_player_ids:
        raise UnknownPlayersError(unknown_player_ids)
    db_game = insert_game(session, to_db_game(report))
    session.commit()
    return GameOut.model_validate(db_game)


def find_unknown_player_ids(session: Session, report: MatchReportIn) -> list[int]:
    lineup_player_ids = {entry.player_id for entry in report.lineup}
    existing_player_ids = select_existing_player_ids(session, lineup_player_ids)
    return sorted(lineup_player_ids - existing_player_ids)


def to_db_game(report: MatchReportIn) -> DBGame:
    return DBGame(
        date=report.date,
        home=report.home,
        away=report.away,
        competition=report.competition,
        goals_odin=report.goals_odin,
        goals_opponent=report.goals_opponent,
        appearances=[
            DBAppearance(
                player_id=entry.player_id,
                started=entry.started,
                minutes_played=entry.minutes_played,
            )
            for entry in report.lineup
        ],
        events=[
            DBGameEvent(
                player_id=event.player_id,
                event_type=event.event_type,
                minute=event.minute,
            )
            for event in report.events
        ],
    )
