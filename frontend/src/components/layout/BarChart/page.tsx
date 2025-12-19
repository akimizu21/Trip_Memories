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

const options: ChartOptions<"bar"> = {
  indexAxis: 'y', //横棒にする
  responsive: true,
  plugins: {
    legend: {
      position: "top"
    },
  },
  scales: {
    x: {
      grid: {
        lineWidth: 0.5, // 縦線
        color: "#ddd", // 線の色
      },
    },
    y: {
      grid: {
        lineWidth: 0.5, // 横線
        color: "#ddd", // 線の色
      },
    },
  },
};

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
  const sortedData = combined.map((item) => item.value)

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

  return (
    <Bar options={options} data={chartData} />
  )
}