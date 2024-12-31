/**
 * data
 */

// ScheduleListの型定義
export interface Schedule {
  id: number;
  date: string;
  prefectures: string;
  destination1: string;
  destination2: string;
  destination3: string;
}

export const transformServerData = (data: any[]): Schedule[] => {
  // 日付を変換
  const formatDate = (date:Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
  };

  return data.map((item) => {
    const destinations = item.destinations.map((d: any) => d.destination);
    return {
      id: item.id,
      date:formatDate(new Date(item.date)), // フォーマットされた日付を設定
      prefectures: item.prefectures,
      destination1: destinations[0] || '',
      destination2: destinations[1],
      destination3: destinations[2],
    };
  });
};