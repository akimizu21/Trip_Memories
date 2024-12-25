'use client';

/**
 * Calnedar
 */

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocale from '@fullcalendar/core/locales/ja'

export const Calendar = (): JSX.Element => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      locales={[jaLocale]}
      locale="ja"
    />
  )
}