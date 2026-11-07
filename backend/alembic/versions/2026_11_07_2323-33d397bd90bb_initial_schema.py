"""initial schema

Revision ID: 33d397bd90bb
Revises:
Create Date: 2026-11-07 23:23:59.565416

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "33d397bd90bb"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "games",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("home", sa.String(length=100), nullable=False),
        sa.Column("away", sa.String(length=100), nullable=False),
        sa.Column("competition", sa.String(length=100), nullable=True),
        sa.Column("goals_odin", sa.Integer(), nullable=True),
        sa.Column("goals_opponent", sa.Integer(), nullable=True),
        sa.CheckConstraint(
            "goals_odin >= 0 AND goals_opponent >= 0",
            name=op.f("ck_games_goals_nonneg"),
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_games")),
    )
    op.create_index(op.f("ix_games_date"), "games", ["date"], unique=False)
    op.create_table(
        "players",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("first_name", sa.String(length=100), nullable=False),
        sa.Column("last_name", sa.String(length=100), nullable=False),
        sa.Column("role", sa.String(length=50), nullable=True),
        sa.Column("position", sa.String(length=50), nullable=True),
        sa.Column("number", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_players")),
    )
    op.create_table(
        "appearances",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("game_id", sa.Integer(), nullable=False),
        sa.Column("player_id", sa.Integer(), nullable=False),
        sa.Column("started", sa.Boolean(), nullable=True),
        sa.Column("minutes_played", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["game_id"],
            ["games.id"],
            name=op.f("fk_appearances_game_id_games"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["player_id"],
            ["players.id"],
            name=op.f("fk_appearances_player_id_players"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_appearances")),
        sa.UniqueConstraint("game_id", "player_id", name="uq_appearances_game_player"),
    )
    op.create_index(
        op.f("ix_appearances_game_id"), "appearances", ["game_id"], unique=False
    )
    op.create_index(
        op.f("ix_appearances_player_id"), "appearances", ["player_id"], unique=False
    )
    op.create_table(
        "events",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("game_id", sa.Integer(), nullable=False),
        sa.Column("player_id", sa.Integer(), nullable=False),
        sa.Column(
            "event_type",
            sa.Enum(
                "goal",
                "own_goal",
                "assist",
                "yellow_card",
                "red_card",
                "throwin_failed",
                "injury",
                name="event_type",
            ),
            nullable=False,
        ),
        sa.Column("minute", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["game_id"],
            ["games.id"],
            name=op.f("fk_events_game_id_games"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["player_id"],
            ["players.id"],
            name=op.f("fk_events_player_id_players"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_events")),
    )
    op.create_index(op.f("ix_events_game_id"), "events", ["game_id"], unique=False)
    op.create_index(op.f("ix_events_player_id"), "events", ["player_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_events_player_id"), table_name="events")
    op.drop_index(op.f("ix_events_game_id"), table_name="events")
    op.drop_table("events")
    op.drop_index(op.f("ix_appearances_player_id"), table_name="appearances")
    op.drop_index(op.f("ix_appearances_game_id"), table_name="appearances")
    op.drop_table("appearances")
    op.drop_table("players")
    op.drop_index(op.f("ix_games_date"), table_name="games")
    op.drop_table("games")
    sa.Enum(name="event_type").drop(op.get_bind(), checkfirst=True)
