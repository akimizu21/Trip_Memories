from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

# ハッシュ化などの処理を使用するために定義する
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT認証のシークレットキー（任意の文字列）
SECRET_KEY = "aaa"

# JWT認証のハッシュ化のアルゴリズム
ALGORITHM = 'HS256'

# ユーザーが入力したパスワードをハッシュ化したバスワードにする
def create_password_hash(user_password: str):
  return pwd_context.hash(user_password)

# ユーザーが入力したパスワードとハッシュ化したパスワードが一致するか確認する
def verify_password(plain_password:str, hashed_password: str):
  return pwd_context.verify(plain_password, hashed_password)

# アクセストークンを発行する
def create_access_token(data: dict, expires_delta: int):
  to_encode = data.copy()
  expire = datetime.now() + timedelta(days=expires_delta)
  to_encode.update({"exp": expire})
  encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
  return encoded_jwt