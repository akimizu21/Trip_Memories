from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base
from database.database import ENGINE


class User(Base):
  __tablename__ = "users"
  id = Column(Integer, primary_key=True)
  user_name = Column(String(255), nullable=False)
  email = Column(String(255), unique=True, nullable=False)
  password = Column(String(255), unique=True, nullable=False)

  # ユーザーが持つスケジュールのリレーション
  schedules = relationship("Schedule", back_populates="user", cascade="all, delete-orphan")
 
class Schedule(Base):
  __tablename__ = "schedules"
  id = Column(Integer, primary_key=True)
  user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
  date = Column(Date, nullable=False)
  prefectures = Column(String(255), nullable=False)

  # スケジュールに紐づくユーザー
  user = relationship("User", back_populates="schedules")

  # スケジュールに紐づく目的地のリレーション
  destinations = relationship("Destination", back_populates="schedule", cascade="all, delete-orphan")


class Destination(Base):
  __tablename__ = "destinations"
  id = Column(Integer, primary_key=True)
  schedule_id = Column(Integer, ForeignKey('schedules.id'), nullable=False)
  destination = Column(String(255), nullable=False)

  # 目的地に紐づくスケジュール
  schedule = relationship("Schedule", back_populates="destinations")

def main():
    # テーブルが存在しなければ、テーブルを作成
  Base.metadata.create_all(bind=ENGINE)

if __name__=="__main__":
  main()