/**
 * EditModal
 */
import { useForm, SubmitHandler } from "react-hook-form";
/**
 * components
 */
import { InputField } from "@/components/ui/InputField/page";
/**
 * styles
 */
import styles from "./EditModal.module.css"

// formで利用する値のtype指定
interface EditForm {
  name: string;
  email: string;
  password1: string;
  password2: string;
};

interface Props {
  isEditModalOpen: boolean;
  handleCloseEditModal: () => void;
}

/**
 * 
 * @param param0 
 * @returns 
 */
export const EditModal = (props: Props) => {
  const {isEditModalOpen, handleCloseEditModal} = props

  // カスタムフックの指定
    const {
      register,
      handleSubmit,
      reset,
      watch,
      formState: {errors}
    } = useForm<EditForm>({
      // 変更ボタンを押したときのみバリデーションを行う
      reValidateMode: 'onSubmit',
    });

    // 空フォームのデータが空文字列で送られるため要検討 //
    /**
     * データ送信処理
     * @param data 
     */
    const onSubmit: SubmitHandler<EditForm> = (data) => {
      if (!name && !email && !password1 && !password2) {
        handleCloseEditModal();
      } else {
        console.log(data);
        reset();
        handleCloseEditModal();
      } 
      };
    
    // 各値をリアルタイムで取得
    const name = watch('name'); 
    const email = watch('email'); 
    const password1 = watch('password1');
    const password2 = watch('password2'); 
    
  if (!isEditModalOpen) {
    return <></>
  }

  return (
    <section className={styles.orverlay}>
      <h1>ユーザー情報変更</h1>

      {/* フォーム領域 */}  
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formArea}>
        <div className={styles.inputArea}>
          {/* ユーザー名フィールド */}
          <InputField 
            id="name"
            type="text"
            placeholder="ユーザー名"
            register={register('name')}
          />
        </div>
        {/* emailフィールド */}
        <div className={styles.inputArea}>
          <InputField 
            id="email"
            type="email"
            placeholder="メールアドレス"
            register={register('email')}
          />
        </div>
        {/* パスワード領域 */}
        <div className={styles.inputArea}>
          <InputField 
            id="password1"
            type="password"
            placeholder="パスワード"
            register={register('password1')}
          />
        </div>
        {/* パスワード(再入力)フィールド */}
        <div className={styles.inputArea}>
          <InputField 
            id="password2"
            type="password"
            placeholder="パスワード(再入力)"
            register={register('password2', {
              validate: (value) => {
                if (!value && !password1) return true;
                if (value !== password1) return "パスワードが一致しません";
                return true;
              }
            })}
            error={errors.password2}
          />
        </div>
        {/* ボタンエリア */}
        <section className={styles.buttonArea}>
          {/* 新規登録ボタン */}
          <button type="submit" className={styles.registerButton}>
            変更
          </button>
          {/* 戻るボタン */}
          <div onClick={handleCloseEditModal} className={styles.backButton}>戻る</div>
        </section>
      </form>
    </section>
  )
}