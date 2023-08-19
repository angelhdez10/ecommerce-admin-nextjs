"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { GraphData } from "@/actions/get-graph-revenue";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface OverviewProps {
  data: GraphData[];
}

const Overview: React.FC<OverviewProps> = ({ data }) => {
  const [chartData, setChartData] = useState({
    labels: [""],
    datasets: [{}],
  });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData({
      labels: data.map((d) => d?.name),
      datasets: [
        {
          label: "Sales $",
          data: data?.map((d) => d?.total),
          backgroundColor: "rgb(53, 162, 235)",
        },
      ],
    });
  }, []);
  return (
    <div>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default Overview;
