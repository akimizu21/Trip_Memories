/**
 * BarChart
 */
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


// Propsの型定義
interface Props {
  labels: string[];
  data: number[];
}

export const BarChart = (props: Props) => {
  const {labels, data} = props;
  
  // 多い順にソート
  const combined = labels.map((label, index) => ({
    label,
    value: data[index]
  }));
  combined.sort((a, b) => b.value - a.value); // 降順ソート
  
  const sortedLabels = combined.map((itemm) => itemm.label);
  const sortedData = combined.map((item) => item.value);
  
  // 最大値を取得
  const maxValue = Math.max(...sortedData);

  // optionsをコンポーネント内で定義（maxValueを使うため） 
  const options: ChartOptions<"bar"> = {
    indexAxis: 'y', //横棒にする
    responsive: true,
    maintainAspectRatio: false, // 高さを自由に設定可能に
    plugins: {
      legend: {
        position: "top"
      },
    },
    scales: {
      /* 横軸 */
      x: {
        min: 0,
        max : maxValue + 1, // 最大値＋1に設定
        ticks: {
          stepSize: 1, // 1刻み
        },
        grid: {
          lineWidth: 0.5, // 縦線
          color: "#ddd", // 線の色
        },
      },
      /* 縦軸 */
      y: {
        grid: {
          lineWidth: 0.5, // 横線
          color: "#ddd", // 線の色
        },
      },
    },
  };

  const chartData = {
    labels: sortedLabels,
    datasets: [
      {
        label: "旅行先一覧",
        data: sortedData,
        backgroundColor: "#CCE0AC",
        barThickness: 20, //バーの太さ
      },
    ]
  };

  /* データ数に応じて高さを動的に計算 */
  const chartHeight = Math.max(sortedLabels.length * 50 + 80, 150)

  return (
    <div style={{ height: `${chartHeight}px` }}>
      <Bar options={options} data={chartData} />
    </div>
  );
};