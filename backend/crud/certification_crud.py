import secrets
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Dict, Optional
from jose import jwt
from sqlalchemy.orm import Session
from database.models import User

from schema import UserInDB

# ハッシュ化などの処理を使用するために定義する
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# アクセストークンの有効期限
ACCESS_TOKEN_EXPIRE_MINUTES = 5

# セッションIDの長さ
SESSION_ID_LENGTH = 64

# セッションIDとユーザー名を紐付けるためのデータベース。今回はメモリ上に保存する。
sessions_db: Dict[str, str] = {}

# ユーザーが入力したパスワードをハッシュ化したバスワードにする
def create_password_hash(user_password: str):
  return pwd_context.hash(user_password)

# ユーザーが入力したパスワードとハッシュ化したパスワードが一致するか確認する
def verify_password(plain_password:str, hashed_password: str):
  return pwd_context.verify(plain_password, hashed_password)


# ログインユーザー情報
def authenticate_user(db: Session, user_name: str, password: str) -> Optional[User]:
  user = db.query(User).filter(User.user_name == user_name).first()
  if not user:
    print(f"User with email {user_name} not found")  # デバッグ出力
    return None
  if not verify_password(password, user.password):
    print("Password verification failed")  # デバッグ出力
    return None
  return user

# セッションIDの作成
def create_session_id() -> str:
  while True:
    sessions_id = secrets.token_hex(SESSION_ID_LENGTH)
    if sessions_id not in sessions_db:
      return sessions_id