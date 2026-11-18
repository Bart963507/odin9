from pydantic import BaseModel


class PlayerStatsOut(BaseModel):
    player_id: int
    games_played: int
    goals: int
    own_goals: int
    assists: int
    yellow_cards: int
    red_cards: int
    throwins_failed: int
    injuries: int
    clean_sheets: int
