from fastapi import APIRouter

from app.database import SessionDependency
from app.events.events_application import get_events
from app.events.events_schemas import GameEventOut

router = APIRouter(prefix="/events", tags=["events"])


@router.get("")
def list_events(session: SessionDependency) -> list[GameEventOut]:
    return get_events(session)
