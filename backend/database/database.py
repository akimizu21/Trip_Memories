# DBへの接続設定
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 環境変数からDATABASE_URLを取得（Neon/Render用）
DATABASE_URL = os.getenv("DATABASE_URL")

# ローカル開発用フォールバック
if not DATABASE_URL:
  user_name = os.getenv("DB_USER", "user")
  password = os.getenv("DB_PASSWORD", "password")
  host = os.getenv("DB_HOST", "db") # ローカルの場合
  # host = os.getenv("DB_HOST", "172.31.16.112") # AWS の場合 IPアドレスは都度修正
  port = os.getenv("DB_PORT", "3306")
  database_name = os.getenv("DB_NAME", "app")
  DATABASE_URL = f'postgresql://{user_name}:{password}@{host}:{port}/{database_name}'

# DBとの接続
ENGINE = create_engine(
  DATABASE_URL,
  echo=True,
  pool_pre_ping=True, # 接続切れ対策（Neonはアイドル時に切断されることがある）
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