# DBへの接続設定
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session

# 環境変数から読み込む
user_name = os.getenv("DB_USER", "user")
password = os.getenv("DB_PASSWORD", "password")
# host = os.getenv("DB_HOST", "db") # ローカルの場合
host = os.getenv("DB_HOST", "10.0.0.116") # AWS の場合
port = os.getenv("DB_PORT", "3306")
database_name = os.getenv("DB_NAME", "app")

# 接続文字列
DATABASE = 'mysql://%s:%s@%s:%s/%s?charset=utf8' % (
  user_name,
  password,
  host,
  port,
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