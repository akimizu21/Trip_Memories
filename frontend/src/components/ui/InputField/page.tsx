/**
 * InputField
 */
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
/**
 * styles
 */
import styles from "./InputField.module.css"

// Propsの型定義
interface Props {
  id: string;
  type: string;
  placeholder: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
}

export const InputField: React.FC<Props> = (props: Props) => {
  const {id, type, placeholder, register, error} = props
  return (
    <>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={styles.inputForm}
        {...register}
      />
        {error && <div className={styles.errors}>{error.message as string}</div>}
    </>
  )
}