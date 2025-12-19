/**
 * ScheduleEditModal
 */
import { useForm, SubmitHandler } from "react-hook-form";
/**
 * components
 */
import { InputField } from "@/components/ui/InputField/page";
import { SelectField } from "@/components/ui/SelectField/page";
/**
 * api
 */
import { apiFetch } from "@/lib/api";
/**
 * styles
 */
import styles from "./ScheduleEditModal.module.css";

// formで利用する値のtype指定
interface ScheduleEditForm {
  date: Date;
  prefectures: string;
  destination1: string;
  destination2: string;
  destination3: string;
}

interface Props {
  scheduleEditModalState: boolean;
  handleCloseScheduleEditModal: () => void;
  targetId: number | null;
  fetchSchedules: () => void;
}

export const ScheduleEditModal = (props: Props) => {
  const {
    scheduleEditModalState,
    handleCloseScheduleEditModal,
    targetId,
    fetchSchedules,
  } = props;

  // カスタムフックの指定
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScheduleEditForm>({
    // 変更ボタンを押したときのみバリデーションを行う
    reValidateMode: "onSubmit",
  });

  // 空フォームのデータが空文字列で送られるため要検討 //
  /**
   * データ送信処理
   * @param data
   */
  const handlePostEditSchedule: SubmitHandler<ScheduleEditForm> = async (
    data
  ) => {
    // 目的地をリスト形式に変換
    const destinations = [
      data.destination1,
      data.destination2,
      data.destination3,
    ].filter(Boolean); // 空の目的地を除外

    const payload = {
      date: new Date(data.date).toISOString().split("T")[0], // YYYY-MM-DD形式
      prefectures: data.prefectures,
      destinations,
    };

    console.log(payload);
    console.log(targetId);

    try {
      const response = await apiFetch(`/schedules/${targetId}`, {
        method: "POST",
        headers: {
          // サーバーへ送るファイルはJSONファイルであることを宣言
          "Content-Type": "application/json",
        },
        // 送るデータをjson形式に変換
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to add schedule");
      }

      fetchSchedules();
      reset();
      handleCloseScheduleEditModal();
    } catch (error) {
      console.error("Error adding schedule:", error);
      throw error;
    }
  };

  if (!scheduleEditModalState) {
    return <></>;
  }

  return (
    <section className={styles.orverlay}>
      <h1>予定を追加</h1>

      {/* フォーム領域 */}
      <form
        onSubmit={handleSubmit(handlePostEditSchedule)}
        className={styles.formArea}
      >
        {/* 日時フィールド */}
        <div className={styles.inputArea}>
          <InputField
            id="date"
            type="date"
            placeholder="日時"
            register={register("date")}
          />
        </div>
        {/* 都道府県フィールド */}
        <div className={styles.inputArea}>
          <SelectField id="prefectures" register={register("prefectures")} />
        </div>
        {/* 目的地1フィールド */}
        <div className={styles.inputArea}>
          <InputField
            id="destination1"
            type="text"
            placeholder="目的地1"
            register={register("destination1")}
          />
        </div>
        {/* 目的地2フィールド */}
        <div className={styles.inputArea}>
          <InputField
            id="destination2"
            type="text"
            placeholder="目的地2"
            register={register("destination2")}
          />
        </div>
        {/* 目的地3フィールド */}
        <div className={styles.inputArea}>
          <InputField
            id="destination3"
            type="text"
            placeholder="目的地3"
            register={register("destination3")}
          />
        </div>

        {/* ボタンエリア */}
        <section className={styles.buttonArea}>
          {/* 変更ボタン */}
          <button type="submit" className={styles.registerButton}>
            変更
          </button>
          {/* 戻るボタン */}
          <div
            onClick={handleCloseScheduleEditModal}
            className={styles.backButton}
          >
            戻る
          </div>
        </section>
      </form>
    </section>
  );
};
