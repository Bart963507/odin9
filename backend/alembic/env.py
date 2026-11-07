from logging.config import fileConfig

from alembic import context
from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool

from app.config import get_settings
from app.models import Base


def run_migrations() -> None:
    if context.config.config_file_name is not None:
        fileConfig(context.config.config_file_name)

    if context.is_offline_mode():
        run_migrations_offline()
    else:
        run_migrations_online()


def run_migrations_offline() -> None:
    context.configure(
        url=get_settings().database_url,
        target_metadata=Base.metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    migration_engine = create_engine(get_settings().database_url, poolclass=NullPool)
    with migration_engine.connect() as connection:
        context.configure(connection=connection, target_metadata=Base.metadata)
        with context.begin_transaction():
            context.run_migrations()


run_migrations()
