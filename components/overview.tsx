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
  ChartData,
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
  const [chartDataObj, setChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});

  const labels = [...data.map((d) => d?.name)];

  useEffect(() => {
    setChartData({
      datasets: [
        {
          data: [...data?.map((d) => d.total)],
          backgroundColor: "#353535",
        },
      ],
    });
  }, [data]);
  return (
    <div>
      <Bar
        data={{ ...chartDataObj, labels: [...labels] }}
        options={chartOptions}
      />
    </div>
  );
};

export default Overview;
