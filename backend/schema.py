from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# ユーザーの作成
class CreateUser(BaseModel):
  user_name: str
  email: EmailStr
  password: str

# ユーザー情報
class User(BaseModel):
    username: str
    email: Optional[str] = None

# ログイン時の取得するユーザー情報
class UserInDB(User):
    hashed_password: str

# ログイン
class Login(BaseModel):
  email: EmailStr
  password: str

# スケジュール作成
class CreateSchedule(BaseModel):
  date: str
  prefectures: str