from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware # CORSを回避するために必要
from database import session  # DBと接続するためのセッション
from models import Users

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

# user情報の取得
@app.get("/users")
async def get_users():
    user = session.query(Users).all()
    return[{"id": user_list.id, "user_name": user_list.user_name, "email": user_list.email, "password": user_list.password} for user_list in user]