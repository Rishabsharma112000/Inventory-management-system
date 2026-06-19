from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    PORT: int = 5000
    JWT_SECRET: str = "ims-secret"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 8
    
    DATABASE_URL: str = "sqlite:///./ims.db"


@lru_cache()
def get_settings():
    return Settings()
