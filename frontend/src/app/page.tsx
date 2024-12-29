"use client";
/**
 * Home
 */
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

/**
 * componens
 */
import { EditModal } from "@/components/layout/EditModal/page";
import { ScheduleModal } from "@/components/layout/ScheduleModal/page";
import { BarChart } from "@/components/layout/BarChart/page";
/**
 * styles
 */
import styles from "./page.module.css";

// サンプルデータ
const labels = ["沖縄", "北海道", "長野", "京都", "広島"];
const data1 = [10, 7, 5, 3, 3];

export default function Home() {
  // モーダルの開閉処理を管理
  const [isEditModalOpen, setIsEditModalOpne] = React.useState(false);
  const [isScheduleModalOpnen, setIsScheduleModalOpne] = React.useState(false);
  
  /**
   * エディットモーダル開閉処理
   */
  const handleCloseEditModal = () => {
    setIsEditModalOpne((isEditModalOpen) => !isEditModalOpen);
  };

  /**
   * スケジュールモーダル開閉処理
   */
  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpne((isScheduleModalOpnen) => !isScheduleModalOpnen);
  };

  /**
   * Logout処理
   */
  const onLogoutSbumit = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include", // クッキーを送信
      });
      
      if (!response.ok) {
        throw new Error('Failed to add User');
      }

      // レスポンスデータを取得
      const responseData = await response.json();
      console.log("Successfully added User:", responseData);

      // サーバーからリダイレクトURLを受け取る
      if (responseData.redirect_url) {
        window.location.href = responseData.redirect_url;
      } else {
        console.error("Redirect URL not provided");
      }
    } catch (error) {
      console.error('Error adding User:', error);
      throw error;
    }
  }

  return (
    <>
      {/* header領域 */}
        <section className={styles.headerArea}>
          <div onClick={() => setIsEditModalOpne(true)} className={styles.editArea}>
            <FontAwesomeIcon icon={faPenToSquare} className={styles.far} />
            <p>edit</p>
          </div>
          <EditModal 
            isEditModalOpen={isEditModalOpen}
            handleCloseEditModal={handleCloseEditModal}
          />
          <div className={styles.logoutArea} onClick={onLogoutSbumit}>
              <FontAwesomeIcon icon={faRightFromBracket} className={styles.far} />
              <p>logout</p>
          </div>
        </section>
      {/* ボタン表示領域 */}
      <section className={styles.buttonArea}>
        <div onClick={() => setIsScheduleModalOpne(true)} className={styles.addButton}>予定を追加</div>
        <ScheduleModal
          isScheduleModalOpnen={isScheduleModalOpnen}
          handleCloseScheduleModal={handleCloseScheduleModal}
        />
        <Link href={"calendar"} className={styles.showButton}>
          予定を表示
        </Link>
      </section>
      {/* 旅行の軌跡表示領域 */}
        <section className={styles.trajectoryArea}>
          <h2>旅行の軌跡</h2>
          <div className={styles.showMap}>地図を表示</div>
          <BarChart
            labels={labels}
            data={data1}
          />
        </section>
    </>
  );
}
