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
} from "@fortawesome/free-solid-svg-icons";
/**
 * data
 */
import { Schedule, transformServerData } from "@/constants/data";
/**
/**
 * componens
 */
import { EditModal } from "@/components/layout/EditModal/page";
import { ScheduleModal } from "@/components/layout/ScheduleModal/page";
import { BarChart } from "@/components/layout/BarChart/page";
/**
 * api
 */
import { apiFetch } from "@/lib/api";
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
  // スケジュールデータ
  const [scheduleList, setScheduleList] = React.useState<Schedule[]>([]);
  // ラベルデータ
  const [labelData, setLabelData] = React.useState<string[]>([]);
  // 回数データ
  const [countData, setCountData] = React.useState<number[]>([]);

  /**
   * ログインしていなければログイン画面へリダイレクト
   */
  React.useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await apiFetch("/check_login", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Not authenticated");
        }

        const result = await response.json();
        if (!result.isAuthenticated) {
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Redirecting to login due to auth error:", error);
        window.location.href = "/login";
      }
    };

    checkLoginStatus();
  }, []);

  /**
   * スケジュールをDBから取得
   */
  const fetchSchedules = async () => {
    try {
      const response = await apiFetch("/schedules", {
        method: "GET",
        credentials: "include",
      });
      const rawData = await response.json();
      const transformedData = transformServerData(rawData);

      setScheduleList(transformedData);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    }
  };

  // 初回レンダリング時にデータを取得
  React.useEffect(() => {
    fetchSchedules();
  }, []);

  /**
   * 最新のラベルを取得
   */
  React.useEffect(() => {
    const updateLabelsAndData = () => {
      const uniqueLabels = Array.from(
        new Set(scheduleList.map((itme) => itme.prefectures))
      );

      // 各ラベルの出現回数を計算
      const counts = uniqueLabels.map(
        (label) =>
          scheduleList.filter((item) => item.prefectures === label).length
      );

      setLabelData(uniqueLabels);
      setCountData(counts);
    };

    updateLabelsAndData();
  }, [scheduleList]); // scheduleList が更新されたときに再実行

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
      const response = await apiFetch("/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // クッキーを送信
      });

      if (!response.ok) {
        throw new Error("Failed to add User");
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
      console.error("Error adding User:", error);
      throw error;
    }
  };

  // 都道府県制覇率計算
  const visitedPrefectures = new Set(scheduleList.map(s => s.prefectures)).size;
  const completionRate = Math.round((visitedPrefectures / 47) * 100);

  return (
    <>
      {/* header領域 */}
      <section className={styles.headerArea}>
        <div
          onClick={() => setIsEditModalOpne(true)}
          className={styles.editArea}
        >
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
        <div
          onClick={() => setIsScheduleModalOpne(true)}
          className={styles.addButton}
        >
          予定を追加
        </div>
        <ScheduleModal
          isScheduleModalOpnen={isScheduleModalOpnen}
          handleCloseScheduleModal={handleCloseScheduleModal}
          fetchSchedules={fetchSchedules}
        />
        <Link href={"calendar"} className={styles.showButton}>
          予定を表示
        </Link>
      </section>
      {/* 旅行の軌跡表示領域 */}
      <section className={styles.trajectoryArea}>
        <h2>旅行の軌跡</h2>
        <Link href={"map"} className={styles.showMap}>
          地図を表示
        </Link>
        {/* 都道府県制覇率表示 */}
        <p>47都道府県中 {visitedPrefectures}県 制覇! ({completionRate}%) </p>
        <BarChart labels={labelData} data={countData} />
      </section>
    </>
  );
}
