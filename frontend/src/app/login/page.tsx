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
  user_name: string;
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

  /**
   * ログイン情報送信処理
   * @param data 
   */
  const onLoginSubmit: SubmitHandler<LoginForm> = async (data) => { 
    console.log(data);
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          // FastAPIのログインエンドポイントが OAuth2PasswordRequestForm を使用
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        // 送るデータを指定
        body: new URLSearchParams({
          username: data.user_name,
          password: data.password,
        }),
        credentials: "include", // クッキーを含める
      });

      if (!response.ok) {
        throw new Error('Failed to add User');
      }

      // レスポンスデータを取得
      const responseData = await response.json();
      console.log("Successfully added User:", responseData);

      // // サーバーからリダイレクトURLを受け取る
      if (responseData.redirect_url) {
        window.location.href = responseData.redirect_url;
      } else {
        console.error("Redirect URL not provided");
      }
    } catch (error) {
      console.error('Error adding User:', error);
      throw error;
    }
  };

  return (
    <>
      <section className={styles.commonArea}>
        {/* 画像表示領域  */}
        <h1>画像表示</h1>

        {/* フォーム領域 */}
        <form onSubmit={handleSubmit(onLoginSubmit)}className={styles.formArea}>

          {/* ユーザー名フィールド */}
          <InputField
            id="user_name"
            type="text"
            placeholder="ユーザー名"
            register={register('user_name', {
              required: {
                value: true,
                message: 'ユーザー名を入力してください'
              },
            })}
            error={errors.user_name}
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