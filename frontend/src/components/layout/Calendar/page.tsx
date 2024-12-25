'use client';

/**
 * Calnedar
 */
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocale from '@fullcalendar/core/locales/ja'

interface Props {
  events: {
    title: string;
    date: string | Date;
}[]
}

export const Calendar = (props: Props): JSX.Element => {
  const {events} = props;
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      locales={[jaLocale]}
      locale="ja"
      events={events}
    />
  )
}