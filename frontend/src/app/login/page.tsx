"use client"
/**
 * Login
 */
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
/**
 * components
 */
import { InputField } from "@/components/ui/InputField/page";
/**
 * styels
 */
import styles from "./page.module.css"

// formで利用する値のtype指定
interface LoginForm {
  email: string;
  password: string;
};

/**
 * 
 * @returns 
 */
export default function Login() {
  // カスタムフックの指定
  const { 
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<LoginForm>({
    // ログインボタンを押した時のみバリデーションを行う
    reValidateMode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    console.log(data);
  };

  return (
    <>
      <section className={styles.commonArea}>
        {/* 画像表示領域  */}
        <h1>画像表示</h1>

        {/* フォーム領域 */}
        <form onSubmit={handleSubmit(onSubmit)}className={styles.formArea}>

          {/* emailフィールド */}
          <InputField
            id="email"
            type="email"
            placeholder="email"
            register={register('email', {
              required: {
                value: true,
                message: 'メールアドレスを入力してください'
              },
            })}
            error={errors.email}
          />
          {/* パスワードフィールド */}
            <InputField
              id="password"
              type="password" 
              placeholder="パスワード" 
              register={register('password', {
                required: {
                  value: true,
                  message: 'パスワードを入力してください'
                },
              })}
              error={errors.password}
            />

          {/* ログインボタン */}
          <button type="submit" className={styles.loginButton} >
            ログイン
          </button>
        </form>

        {/* 新規登録リンク  */}
        <Link href={"register"} className={styles.registerLink}>
          新規登録はこちら
        </Link>
      </section>
    </>
  );
}