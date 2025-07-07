import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { fetchAQIForecast } from "../services/forecastAPI";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function PollutantChart({ lat, lon }) {
  const [pollutionData, setPollutionData] = useState([]);
  const [days, setDays] = useState(3);

  useEffect(() => {
    if (!lat || !lon) return;

    fetchAQIForecast(lat, lon).then((data) => {
      const daily = [];
      for (let i = 0; i < data.length; i += 24) {
        const slice = data.slice(i, i + 24);
        const avgPM25 = slice.reduce((s, d) => s + d.components.pm2_5, 0) / slice.length;
        const avgPM10 = slice.reduce((s, d) => s + d.components.pm10, 0) / slice.length;

        daily.push({
          date: new Date(slice[0].dt * 1000).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
          }),
          pm25: parseFloat(avgPM25.toFixed(2)),
          pm10: parseFloat(avgPM10.toFixed(2)),
        });
      }

      setPollutionData(daily.slice(0, 7));
    });
  }, [lat, lon]);

  const displayData = pollutionData.slice(0, days);

  const chartData = {
    labels: displayData.map((d) => d.date),
    datasets: [
      {
        label: "PM2.5 (μg/m³)",
        data: displayData.map((d) => d.pm25),
        backgroundColor: "rgba(239, 68, 68, 0.7)", // red-500
        stack: "stack1",
      },
      {
        label: "PM10 (μg/m³)",
        data: displayData.map((d) => d.pm10),
        backgroundColor: "rgba(234, 179, 8, 0.7)", // yellow-500
        stack: "stack1",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: { color: "#fff" },
        grid: { display: false },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: { display: true, text: "μg/m³", color: "#fff" },
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
    plugins: {
      legend: { labels: { color: "#fff" } },
    },
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">📊 PM2.5 & PM10 Levels ({days}-Day)</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          onClick={() => setDays(days === 3 ? 7 : 3)}
        >
          Toggle to {days === 3 ? "7-Day" : "3-Day"}
        </button>
      </div>
      {displayData.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p className="text-sm italic text-gray-400">Loading pollutant data...</p>
      )}
    </div>
  );
}
