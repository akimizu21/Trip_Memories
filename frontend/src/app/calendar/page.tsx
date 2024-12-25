/**
 * Calendar
 */
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from '@fortawesome/free-solid-svg-icons';
/**
 * componetnts
 */
import { Calendar as Cal } from "@/components/layout/Calendar/page"
/**
 * styels
 */
import styels from "./page.module.css"

export default function Calendar() {
  return (
    <>
      {/* header領域 */}
      <section className={styels.headerArea}>
        <h1 className={styels.headerTitle}>カレンダー</h1>
        <Link href={"/"} className={styels.homeLink}>
          <FontAwesomeIcon icon={faHouse} className={styels.far} />
          <p>Home</p>
        </Link>
      </section>

      {/* カレンダー領域 */}
      <section className={styels.calendarArea}>
        <Cal></Cal>
      </section>

      {/* 予定領域 */}
    </>
  )
}