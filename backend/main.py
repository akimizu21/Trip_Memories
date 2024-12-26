
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette.middleware.cors import CORSMiddleware # CORSを回避するために必要
from database.database import get_db  # DBと接続するためのセッション
from database.models import User, Schedule
from schema import CreateUser, CreateSchedule
from crud.certification_crud import create_password_hash

app = FastAPI()

# CORSを回避するために設定
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],  
)

# ------APIの実装--------
# デモ
@app.get("/")
async def root():
    return {"message": "Hello World"}

# user情報を登録
@app.post("/users")
async def create_user(user: CreateUser, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # パスワードのハッシュ化
    hashed_password = create_password_hash(user.password)

    new_user = User(user_name=user.user_name, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# user情報変更処理

# トークンでユーザー情報を取得する必要あり
# # schedule登録処理
# app.post("/schedules/{user_id}")
# async def create_schedule(schedule: CreateSchedule, db:Session = Depends(get_db)):
#     db_schedule = db.query(Schedule)

#     new_schedule = Schedule(use_id=user_id, date=schedule.date, prefectures=schedule.prefectures)
#     db.add(new_schedule)
#     db.commit()
#     db.refresh(new_schedule)
#     return new_schedule

