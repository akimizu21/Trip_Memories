'use client'
/**
 * Register
 */
import React from "react";
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
interface RegisterForm {
  user_name: string;
  email: string;
  password1: string;
  password2: string;
};

/**
 * 
 * @returns 
 */
export default function Register() {
  // カスタムフックの指定
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors}
  } = useForm<RegisterForm>({
    // 新規登録ボタンを押したときのみバリデーションを行う
    reValidateMode: 'onSubmit',
  });
 
  /**
   * データ送信処理
   * @param data 
   */
  const handlePostUser: SubmitHandler<RegisterForm> = async (data) => {
    console.log(data);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          // 
          'Content-Type': 'application/json',
        },
        // 送るデータをjson形式に変換
        body: JSON.stringify(data)
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
        console.log("Redirect URL not provided")
      }
    } catch (error) {
      console.error('Error adding User:', error);
      throw error;
    }
  };

  // パスワード1の値をリアルタイムで取得
  const password1 = watch('password1');

  return (
    <>
      <section className={styles.commonAera}>
        <h1>新規登録フォーム</h1>

        {/* フォーム領域 */}  
        <form onSubmit={handleSubmit(handlePostUser)} className={styles.formArea}>
          <div className={styles.inputArea}>
            {/* ユーザー名フィールド */}
            <InputField 
              id="user_name"
              type="text"
              placeholder="ユーザー名"
              register={register('user_name', {
                required: {
                  value: true,
                  message: 'ユーザー名を入力してください',
                },
              })}
              error={errors.user_name}
            />
          </div>
          {/* emailフィールド */}
          <div className={styles.inputArea}>
            <InputField 
              id="email"
              type="email"
              placeholder="メールアドレス"
              register={register('email', {
                required: {
                  value: true,
                  message: 'メールアドレスを入力してください',
                },
              })}
              error={errors.email}
            />
          </div>
          {/* パスワード領域 */}
          <div className={styles.inputArea}>
            <InputField 
              id="password1"
              type="password"
              placeholder="パスワード"
             register={register('password1', {
                required: {
                  value: true,
                  message: 'パスワードを入力してください',
                },
              })}
              error={errors.password1}
            />
          </div>
          {/* パスワード(再入力)フィールド */}
          <div className={styles.inputArea}>
            <InputField 
              id="password2"
              type="password"
              placeholder="パスワード(再入力)"
              register={register('password2', {
                required: {
                  value: true,
                  message: 'パスワード(再入力)を入力してください',
                },
                validate: (value) => 
                  value === password1 || 'パスワードが一致しません',
              })}
              error={errors.password2}
            />
          </div>
          {/* 新規登録ボタン */}
          <button type="submit" className={styles.registerButton}>
            新規登録
          </button>
        </form>

        {/* ログイン画面へ戻る */}
        <Link href={"login"} className={styles.loginLink}>
          ログイン画面へ戻る
        </Link>
      </section>
    </>
  )
}