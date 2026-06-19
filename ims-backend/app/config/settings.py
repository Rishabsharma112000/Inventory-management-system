from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    PORT: int = 5000
    JWT_SECRET: str = "ims-secret"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 8
    
    DB_DIALECT: str = "sqlite"
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASS: str = "password"
    DB_NAME: str = "./ims.db"

    @property
    def DATABASE_URL(self) -> str:
        if self.DB_DIALECT == "sqlite":
            return "sqlite:///./ims.db"
        elif self.DB_DIALECT == "postgresql":
            return f"postgresql://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        return f"mysql+pymysql://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


@lru_cache()
def get_settings():
    return Settings()
