from fastapi import APIRouter

from app.appearances.appearances_application import get_appearances
from app.appearances.appearances_schemas import AppearanceOut
from app.database import SessionDependency

router = APIRouter(prefix="/appearances", tags=["appearances"])


@router.get("")
def list_appearances(session: SessionDependency) -> list[AppearanceOut]:
    return get_appearances(session)
