from fastapi import APIRouter, HTTPException, status

from app.database import SessionDependency
from app.games.games_application import (
    UnknownPlayersError,
    create_match_report,
    get_games,
)
from app.games.games_schemas import GameOut, MatchReportIn

router = APIRouter(prefix="/games", tags=["games"])


@router.get("")
def list_games(session: SessionDependency) -> list[GameOut]:
    return get_games(session)


@router.post("", status_code=status.HTTP_201_CREATED)
def add_match_report(report: MatchReportIn, session: SessionDependency) -> GameOut:
    try:
        return create_match_report(session, report)
    except UnknownPlayersError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"Unknown player ids: {error.player_ids}",
        ) from error
