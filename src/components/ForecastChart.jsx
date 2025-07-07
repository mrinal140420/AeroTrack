import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchAQIForecast } from "../services/forecastAPI";
 // Registers Chart.js globally with dark styling

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

export default function ForecastChart({ lat, lon }) {
  const [forecastData, setForecastData] = useState([]);
  const [days, setDays] = useState(3);

  const mapOWMAQI = (val) => {
    switch (val) {
      case 1: return 50;
      case 2: return 100;
      case 3: return 150;
      case 4: return 200;
      case 5: return 300;
      default: return 0;
    }
  };

  useEffect(() => {
    if (!lat || !lon) return;

    fetchAQIForecast(lat, lon).then((data) => {
      const daily = [];
      for (let i = 0; i < data.length; i += 24) {
        const dayData = data.slice(i, i + 24);
        const avg =
          dayData.reduce((sum, d) => sum + mapOWMAQI(d.main.aqi), 0) / dayData.length;
        daily.push({
          date: new Date(dayData[0].dt * 1000).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
          }),
          aqi: Math.round(avg),
        });
      }
      setForecastData(daily.slice(0, 7)); // Keep full 7, toggle view below
    });
  }, [lat, lon]);

  const visibleData = forecastData.slice(0, days);

  const chartData = {
    labels: visibleData.map((d) => d.date),
    datasets: [
      {
        label: "AQI Forecast",
        data: visibleData.map((d) => d.aqi),
        fill: true,
        borderColor: "#34D399",
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        tension: 0.3,
        pointBackgroundColor: "#10B981",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#fff" } },
      tooltip: {
        callbacks: {
          label: (ctx) => `AQI: ${ctx.raw}`,
        },
      },
      annotation: {
        annotations: {
          good: {
            type: "box",
            yMin: 0,
            yMax: 50,
            backgroundColor: "rgba(0,228,0,0.15)",
          },
          moderate: {
            type: "box",
            yMin: 51,
            yMax: 100,
            backgroundColor: "rgba(255,255,0,0.15)",
          },
          unhealthySG: {
            type: "box",
            yMin: 101,
            yMax: 150,
            backgroundColor: "rgba(255,126,0,0.15)",
          },
          unhealthy: {
            type: "box",
            yMin: 151,
            yMax: 200,
            backgroundColor: "rgba(255,0,0,0.15)",
          },
          veryUnhealthy: {
            type: "box",
            yMin: 201,
            yMax: 300,
            backgroundColor: "rgba(143,63,151,0.15)",
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 320,
        ticks: { color: "#fff" },
        title: { display: true, text: "AQI", color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      x: {
        ticks: { color: "#fff" },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4 shadow">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">📈 {days}-Day AQI Forecast</h2>
        <button
          onClick={() => setDays(days === 3 ? 7 : 3)}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        >
          Toggle to {days === 3 ? "7-Day" : "3-Day"}
        </button>
      </div>
      {visibleData.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p className="text-sm italic text-gray-400">Loading forecast...</p>
      )}
    </div>
  );
}
