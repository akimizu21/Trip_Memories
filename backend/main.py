
from fastapi import FastAPI, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette.middleware.cors import CORSMiddleware # CORSを回避するために必要
from datetime import datetime, timedelta, timezone
from database.database import get_db  # DBと接続するためのセッション
from database.models import User, Schedule
from schema import CreateUser, Login, CreateSchedule
from crud.certification_crud import create_password_hash, create_session_id, authenticate_user, ACCESS_TOKEN_EXPIRE_MINUTES, sessions_db

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
@app.post("/users", summary="新規登録")
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

# ログイン処理  
@app.post("/login", summary="ログイン")
async def login (
    response: Response, 
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)    
):
    # データベースを使ったユーザー認証
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
          status_code=status.HTTP_401_UNAUTHORIZED,
          detail="Incorrect username or password",
          headers={"WWW-Authenticate": "Bearer"},
        )
    
    # セッションIDの生成と保存
    session_id = create_session_id()
    sessions_db[session_id] = user.user_name

    # セッションの有効期限を設定
    expires = datetime.now(tz=timezone.utc) + \
      timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    response.set_cookie(
        key="session_id",
        value=session_id,
        expires=expires,
        httponly=True
    )
    # 成功レスポンス
    return {"message": "Login successful", "session_id": session_id}


    


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

