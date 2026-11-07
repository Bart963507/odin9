from functools import lru_cache
from pathlib import Path
from typing import Annotated

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
PLAIN_POSTGRES_SCHEMES = ("postgres://", "postgresql://")
PSYCOPG_SCHEME = "postgresql+psycopg://"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BACKEND_DIR / ".env")

    database_url: str
    cors_origins: Annotated[list[str], NoDecode] = ["http://localhost:3000"]

    @field_validator("database_url")
    @classmethod
    def use_psycopg_driver(cls, url: str) -> str:
        for scheme in PLAIN_POSTGRES_SCHEMES:
            if url.startswith(scheme):
                return PSYCOPG_SCHEME + url.removeprefix(scheme)
        return url

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_comma_separated_origins(cls, origins: str | list[str]) -> list[str]:
        if isinstance(origins, str):
            return [origin.strip() for origin in origins.split(",") if origin.strip()]
        return origins


@lru_cache
def get_settings() -> Settings:
    return Settings()
