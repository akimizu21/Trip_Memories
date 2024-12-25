"use client"

/**
 * Calendar
 */
import React from "react";
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPen, faX } from '@fortawesome/free-solid-svg-icons';
/**
 * data
 */
import { INIT_SCHEDULE_LIST } from "@/constants/data";
/**
 * componetnts
 */
import { Calendar as ScheduleCalendar } from "@/components/layout/Calendar/page"
import { ScheduleEditModal } from "@/components/layout/ScheduleEditModal/page";
/**
 * styels
 */
import styels from "./page.module.css"


export default function Calendar() {
  // 本日の日付を取得
  const today = new Date();
  // 曜日を取得
  const weekdays = ["Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"][today.getDay()];

  // スケジュールリスト
  const [scheduleList, setScheduleList] = React.useState(INIT_SCHEDULE_LIST);
  // モーダル開閉を管理
  const [isSheduleEditModalOpen, setIsSheduleEditModalOpen] = React.useState(false);

  /**
   * モーダル開閉処理
   */
  const handleCloseSheduleEditModal = () => {
    setIsSheduleEditModalOpen((isSheduleEditModalOpen) => !isSheduleEditModalOpen);
  }

  /**
   * スケジュール削除処理
   * @param targetId 
   * @param targetTitle 
   */
  const handleDeleteSchedule = (targetId: number, targetTitle: string) => {
    if (window.confirm(`旅先: ${targetTitle}を削除しますか?`)) {
      const newScheduleList = scheduleList.filter((schedule) => {
        return schedule.id !== targetId;
      });
      setScheduleList(newScheduleList);
    }
  };

  /**
   * カレンダーのイベントに入れる
   */
  const events = scheduleList.map((schedule) => (
    {
      title: schedule.prefectures,
      date: schedule.date,
    }
  ));

  return (
    <>
      {/* header領域 */}
      <section className={styels.headerArea}>
        <h1 className={styels.headerTitle}>カレンダー</h1>
        <Link href={"/"} className={styels.homeLink}>
          <FontAwesomeIcon icon={faHouse} className={styels.farHome} />
          <p>Home</p>
        </Link>
      </section>

      {/* カレンダー領域 */}
      <section className={styels.calendarArea}>
        <ScheduleCalendar 
          events={events}
        />
      </section>

      {/* 予定領域 */}
      <section className={styels.scheduleArea}>
        {/* 日時表示エリア */}
        <div className={styels.dateArea}>
          <p className={styels.date}>{today.getFullYear()}.{today.getMonth() + 1}.{today.getDate()}</p>
          <p className={styels.date}>{weekdays}</p>
        </div>
        {/* 予定カード表示エリア */}
        <ul className={styels.scheduleList}>
          {scheduleList.map((schedule:any) => {
            return (
              <li className={styels.scheduleCard} key={schedule.id}>
                <div>
                  {/* スケジュールの都道府県名 */}
                  <span className={styels.scheduleTitle}>旅先 : {schedule.prefectures}</span>
                  {/* スケジュールの目的地 */}
                  <ul className={styels.destinations}>
                    <li className={styels.destination}>目的地1 : {schedule.destination1}</li>
                    {schedule.destination2 && (
                      <li className={styels.destination}>目的地2 : {schedule.destination2}</li>
                    )} {/* 空でなければ表示する */}
                    {schedule.destination3 && (
                      <li className={styels.destination}>目的地3 : {schedule.destination3}</li>
                    )} {/* 空でなければ表示する */}
                  </ul>
                </div>
                {/* アイコン */}
                <div className={styels.iconArea}>
                  <FontAwesomeIcon icon={faPen} onClick={() => setIsSheduleEditModalOpen(true)} className={styels.far}/>
                  <ScheduleEditModal
                    isSheduleEditModalOpen={isSheduleEditModalOpen}
                    handleCloseSheduleEditModal={handleCloseSheduleEditModal}
                  />
                  <FontAwesomeIcon icon={faX} onClick={() => handleDeleteSchedule(schedule.id, schedule.prefectures)} className={styels.far}/>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}