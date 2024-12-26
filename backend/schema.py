from pydantic import BaseModel, EmailStr
from datetime import datetime

# ユーザーの作成
class CreateUser(BaseModel):
  user_name: str
  email: EmailStr
  password: str

# スケジュール作成
class CreateSchedule(BaseModel):
  date: datetime.date
  prefectures: str