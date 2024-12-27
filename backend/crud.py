from datetime import datetime, timedelta, timezone
import secrets
import jwt
from jwt import InvalidTokenError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from typing import Optional, Union
from sqlalchemy.orm import Session
from database.models import User
from database.database import get_db
from schema import TokenData, UserResponse

# ハッシュ化などの処理を使用するために定義する
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT認証のシークレットキー（任意の文字列)
SECRET_KEY = secrets.token_hex(32)

# JWT認証のハッシュ化のアルゴリズム
ALGORITHM = "HS256"

# JWTの時間
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ユーザーが入力したパスワードをハッシュ化したバスワードにする
def create_password_hash(user_password: str):
  return pwd_context.hash(user_password)

# ユーザーが入力したパスワードとハッシュ化したパスワードが一致するか確認する
def verify_password(plain_password:str, hashed_password: str):
  return pwd_context.verify(plain_password, hashed_password)

# ログインユーザー情報を取得
def authenticate_user(db: Session, user_name: str, password: str) -> Optional[User]:
  user = db.query(User).filter(User.user_name == user_name).first()
  if not user:
    return None
  if not verify_password(password, user.password):
    return None
  return user

# アクセストークンを発行する
def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
  to_encode = data.copy()
  if expires_delta:
    expires = datetime.now(timezone.utc) + expires_delta
  else:
    expires = datetime.now(timezone.utc) + timedelta(minutes=15)
  to_encode.update({"exp": expires})
  encode_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
  return encode_jwt

# 認証トークンをデコードし、ユーザー情報を取得する
async def get_current_user(db:Session, token: str = Depends(oauth2_scheme)):
  credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
  )
  try: 
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username: str = payload.get("user_name")
    print(f"Decoded username: {username}")  # デバッグログ
    if username is None:
      print(f"User not found for username: {username}")  # デバッグログ
      raise credentials_exception
    token_data = TokenData(user_name=username)
  except InvalidTokenError:
    raise credentials_exception
  
  # ユーザー名を使ってユーザー情報を取得
  user = db.query(User).filter(User.user_name == token_data.user_name).first()
  if user is None:
    raise credentials_exception
  
   # パスワードを含まないユーザー情報を返す
  return UserResponse.from_orm(user)  # UserResponseはパスワードを含まないモデル

# ヘルパー関数
async def get_current_user_wrapper(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return await get_current_user(db=db, token=token)

# 取得したユーザー情報を返す
async def get_current_user_info(
    current_user: UserResponse = Depends(get_current_user_wrapper),
):
    return current_user

