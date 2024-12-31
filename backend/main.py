
from fastapi import FastAPI, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.orm import Session
from starlette.middleware.cors import CORSMiddleware # CORSを回避するために必要
from datetime import timedelta
from typing import List
from database.database import get_db  # DBと接続するためのセッション
from database.models import User, Schedule, Destination
from schema import CreateUser, LoginResponse, UserResponse, CreateSchedule, ScheduleResponse
from crud import create_password_hash, authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user_info, get_current_user_from_cookie


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8080",
    "null"
]

# CORSを回避するために設定
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins, # NginxのURLを許可
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],  
)

# ------APIの実装--------

# リダイレクト用テスト
@app.get("/test")
async def redirect_page():
    return RedirectResponse("http://localhost/login")

# user情報を登録
@app.post("/users", summary="新規登録")
async def create_user(user: CreateUser, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # パスワードのハッシュ化
    hashed_password = create_password_hash(user.password1)

    new_user = User(user_name=user.user_name, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"state": "success", "redirect_url": "http://localhost/login"}

# ログイン処理  
@app.post("/login", summary="ログイン", response_model=LoginResponse)
async def login (
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
    # アクセストークンを発行
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={'user_name': str(user.user_name)}, expires_delta=access_token_expires)

    # クッキーにアクセストークンを設定
    response = JSONResponse(
        content={
            "status": "success",
            "redirect_url": "http://localhost/",  # ダッシュボードのURL
            "access_token": access_token, # トークンをレスポンスボディに含める
            "token_type": "bearer" # トークンタイプも明示
        }
    )
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

    return response

# ログアウト処理
@app.post("/logout", summary="ログアウト", response_model=None)
def logout(response: Response):
    # クライアント側のクッキー削除
    response.delete_cookie("access_token")
    
    return {"state": "success", "redirect_url": "http://localhost/login"}

# user情報変更処理

# schedule登録処理
@app.post("/schedules", summary="スケジュール登録", response_model=ScheduleResponse)
async def create_schedule(
    schedule_data: CreateSchedule, 
    db: Session = Depends(get_db),
    create_user: UserResponse = Depends(get_current_user_from_cookie)
):
    if not create_user:  # ユーザーが認証されているか確認
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # スケジュールを作成
    new_schedule = Schedule(
        user_id=create_user.id,
        date=schedule_data.date,
        prefectures=schedule_data.prefectures,
    )
    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)
    
    # 目的地を登録
    destinations = []
    for dest in schedule_data.destinations:
        new_destination = Destination(
            schedule_id=new_schedule.id,
            destination=dest
        )
        db.add(new_destination)
        destinations.append(new_destination)
    
    db.commit()

    # リレーションをリフレッシュしてレスポンス用に取得
    db.refresh(new_schedule)

    return new_schedule

# schedule取得処理
@app.get("/schedules", summary="スケジュール取得", response_model=List[ScheduleResponse])
async def get_schedules(
    db: Session = Depends(get_db),
    create_user: UserResponse = Depends(get_current_user_from_cookie)
):
    schedules = db.query(Schedule).where(Schedule.user_id == create_user.id).all()

    return schedules

# schedule更新処理

# schedule削除処理
@app.delete("/schedules/{schedule_id}", summary="スケジュール削除")
async def delete_schedules(
    schedule_id: int,
    db: Session = Depends(get_db),
    create_user: UserResponse = Depends(get_current_user_from_cookie)
):
    del_schedule = db.query(Schedule).filter(Schedule.id == schedule_id, Schedule.user_id == create_user.id).first()

    if del_schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    db.delete(del_schedule)
    db.commit()

    return {"status": "予定を削除しました"}

