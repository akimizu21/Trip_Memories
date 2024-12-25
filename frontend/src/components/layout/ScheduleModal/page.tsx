/**
 * ScheduleModal
 */
import { useForm, SubmitHandler } from "react-hook-form";
/**
 * components
 */
import { InputField } from "@/components/ui/InputField/page"
import { SelectField } from "@/components/ui/SelectField/page";
/**
 * styles
 */
import styles from "./ScheduleModal.module.css"

// formで利用する値のtype指定
interface ScheduleForm {
  date: Date;
  prefectures: string;
  destination1: string;
  destination2: string;
  destination3: string;
};

interface Props {
  isScheduleModalOpnen: boolean;
  handleCloseScheduleModal: () => void;
}

export const ScheduleModal = (props: Props) => {
  const {isScheduleModalOpnen, handleCloseScheduleModal} = props

  // カスタムフックの指定
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm<ScheduleForm>({
    // 変更ボタンを押したときのみバリデーションを行う
    reValidateMode: 'onSubmit',
  });

  // 空フォームのデータが空文字列で送られるため要検討 //
  /**
   * データ送信処理
   * @param data 
   */
  const onSubmit: SubmitHandler<ScheduleForm> = (data) => {
      console.log(data);
      reset();
      handleCloseScheduleModal();
  };
  
if (!isScheduleModalOpnen) {
  return <></>
}

return (
  <section className={styles.orverlay}>
    <h1>予定を追加</h1>

    {/* フォーム領域 */}  
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formArea}>
      {/* 日時フィールド */}
      <div className={styles.inputArea}>
        <InputField 
          id="date"
          type="date"
          placeholder="日時"
          register={register('date', {
            required: {
              value: true,
              message: '日時を入力してください'
            },
          })}
          error={errors.date}
        />
      </div>
      {/* 都道府県フィールド */}
      <div className={styles.inputArea}>
        <SelectField 
           id="prefectures"
           register={register('prefectures', {
            required: {
              value: true,
              message: '都道府県を入力してください'
            },
          })}
          error={errors.prefectures}
        />
      </div>
      {/* 目的地1フィールド */}
      <div className={styles.inputArea}>
        <InputField 
          id="destination1"
          type="text"
          placeholder="目的地1"
          register={register('destination1', {
            required: {
              value: true,
              message: '目的地1を入力してください'
            },
          })}
          error={errors.destination1}
        />
      </div>
      {/* 目的地2フィールド */}
      <div className={styles.inputArea}>
        <InputField 
          id="destination2"
          type="text"
          placeholder="目的地2"
          register={register('destination2')}
        />
      </div>
      {/* 目的地3フィールド */}
      <div className={styles.inputArea}>
        <InputField 
          id="destination3"
          type="text"
          placeholder="目的地3"
          register={register('destination3')}
        />
      </div>
     
      {/* ボタンエリア */}
      <section className={styles.buttonArea}>
        {/* 新規登録ボタン */}
        <button type="submit" className={styles.registerButton}>
          追加
        </button>
        {/* 戻るボタン */}
        <div onClick={handleCloseScheduleModal} className={styles.backButton}>戻る</div>
      </section>
    </form>
  </section>
)
}