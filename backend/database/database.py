# DBへの接続設定
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session

# 接続したいDBの基本情報を設定
user_name = "user"
password = "password"
host = "db"
database_name = "app"

DATABASE = 'mysql://%s:%s@%s/%s?charset=utf8' % (
  user_name,
  password,
  host,
  database_name,
)

# DBとの接続
ENGINE = create_engine(
  DATABASE,
  echo=True
)

# Sessionの作成
SessionLocal = sessionmaker(
  autocommit=False,
  autoflush=False,
  bind=ENGINE,
)

# modelで使用する
Base = declarative_base()

# セッション依存関係
def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()