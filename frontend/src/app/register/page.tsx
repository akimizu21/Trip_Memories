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
  name: string;
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

  const onSubmit: SubmitHandler<RegisterForm> = (data) => {
    console.log(data);
  };

  // パスワード1の値をリアルタイムで取得
  const password1 = watch('password1');

  return (
    <>
      <section className={styles.commonAera}>
        <h1>新規登録フォーム</h1>

        {/* フォーム領域 */}  
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formArea}>
          <div className={styles.inputArea}>
            {/* ユーザー名フィールド */}
            <InputField 
              id="name"
              type="text"
              placeholder="ユーザー名"
              register={register('name', {
                required: {
                  value: true,
                  message: 'ユーザー名を入力してください',
                },
              })}
              error={errors.name}
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