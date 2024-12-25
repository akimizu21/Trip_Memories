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
  }
};

// Propsの型定義
interface Props {
  labels: string[];
  data: number[];
}

export const BarChart = (props: Props) => {
  const {labels, data} = props;

  const chartData = {
    labels,
    datasets: [
      {
        label: "旅行先一覧",
        data,
        backgroundColor: "#CCE0AC"
      },
    ]
  };

  return (
    <Bar options={options} data={chartData} />
  )
}