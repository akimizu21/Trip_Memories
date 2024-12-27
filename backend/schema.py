from pydantic import BaseModel, EmailStr, Field
import datetime
from typing import Optional, List

# ユーザーの作成(DBへ渡す)
class CreateUser(BaseModel):
  user_name: str
  email: EmailStr
  password: str

# レスポンスユーザー
class UserResponse(BaseModel):
    id: int
    user_name: str
    email: str

    class Config:
        orm_mode = True  # SQLAlchemy モデルを自動変換するため
        from_attributes = True # from_ormを使用するための設定

# ログインレスポンスモデル
class LoginResponse(BaseModel):
    status: bool
    access_token: str
    message: str
    data: Optional[UserResponse]  # UserResponseはパスワードを含まないモデル

# トークンデータ
class TokenData(BaseModel):
  user_name: Optional[str] = None

# スケジュールモデル(DBへ渡す)
class CreateSchedule(BaseModel):
   date: datetime.date
   prefectures: str
   destinations: List[str] = Field(..., max_itme=3)


# 目的地のレスポンス
class DestinationResponse(BaseModel):
   id: int
   schedule_id: int
   destination: str
   
   class Config:
        orm_mode = True

# スケジュールレスポンス
class ScheduleResponse(BaseModel):
   id: int
   user_id: int
   date: datetime.date
   prefectures: str
   destinations: List[DestinationResponse]

   class Config:
        orm_mode = True