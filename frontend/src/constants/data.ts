/**
 * data
 */

// ScheduleListの型定義
export interface Schedule {
  id: number;
  date: Date;
  prefectures: string;
  destination1: string;
  destination2?: string;
  destination3?: string;
}

export const INIT_SCHEDULE_LIST = [
  {
    id: 1,
    date: new Date(),
    prefectures: '北海道', 
    destination1: '札幌時計台',
    destination2: '大通り公園',
    destination3: '二条市場',
  },
  {
    id: 2,
    date: "2024-12-27",
    prefectures: '京都府', 
    destination1: '嵐山',
    destination2: '二条城',
  }
];