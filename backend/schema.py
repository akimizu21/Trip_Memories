import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field, model_validator


# ユーザーの作成(DBへ渡す)
class CreateUser(BaseModel):
    user_name: str
    email: str
    password1: str
    password2: str

    # パスワードの一致チェック
    @model_validator(mode="after")
    def check_passwords_match(cls, values):
        if values.password1 != values.password2:
            raise ValueError("Passwords do not match")
        return values


# レスポンスユーザー
class UserResponse(BaseModel):
    id: int
    user_name: str
    email: str

    class Config:
        orm_mode = True  # SQLAlchemy モデルを自動変換するため
        from_attributes = True  # from_ormを使用するための設定


# ログインレスポンスモデル
class LoginResponse(BaseModel):
    status: bool
    access_token: str
    message: str
    data: Optional[UserResponse]  # UserResponseはパスワードを含まないモデル


# トークンデータ
class TokenData(BaseModel):
    user_name: Optional[str] = None


# ユーザー情報の変更(DBへ渡す)
class EditUser(BaseModel):
    user_name: Optional[str] = None
    email: Optional[str] = None
    password1: Optional[str] = None
    password2: Optional[str] = None

    # パスワードの一致チェック
    @model_validator(mode="after")
    def check_passwords_match(cls, values):
        password1 = values.password1
        password2 = values.password2

        # 両方とも未入力の場合はチェックスキップ
        if password1 is None and password2 is None:
            return values

        # パスワードが一致しない場合にエラーを発生
        if password1 != password2:
            raise ValueError("Passwords do not match")

        # 空文字列のバリテーション
        if password1 and not password1.strip():
            raise ValueError("Password1 cannot be empty or whitespace")
        if password2 and not password2.strip():
            raise ValueError("Password2 cannot be empty or whitespace")

        return values


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


# スケジュール変更モデル(DBへ渡す)
class EditSchedule(BaseModel):
    date: Optional[datetime.date] = None
    prefectures: Optional[str] = None
    destinations: List[str] = Field(..., max_itme=3)
