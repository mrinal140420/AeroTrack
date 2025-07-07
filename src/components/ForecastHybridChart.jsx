import { useEffect, useState, lazy, Suspense } from "react";
import { fetchAQIForecast } from "../services/forecastAPI";

// Lazy-load the Chart component
const LazyChart = lazy(() =>
  import("react-chartjs-2").then((mod) => ({ default: mod.Chart }))
);

// ChartJS registration (only once globally in main.jsx or chartSetup.js)
 // Registers Chart.js globally with dark styling
 // Ensure you import once

const getHealthAdvisory = (type, value) => {
  if (type === "pm2_5") return value <= 12 ? "Good 😊" : value <= 35 ? "Moderate 😐" : value <= 55 ? "Unhealthy 😷" : "Very Unhealthy ⚠️";
  if (type === "pm10") return value <= 50 ? "Good 😊" : value <= 100 ? "Moderate 😐" : value <= 250 ? "Unhealthy 😷" : "Very Unhealthy ⚠️";
  if (type === "co") return value <= 4.4 ? "Good 😊" : value <= 9.4 ? "Moderate 😐" : value <= 12.4 ? "Unhealthy 😷" : "Very Unhealthy ⚠️";
  if (type === "no2") return value <= 53 ? "Good 😊" : value <= 100 ? "Moderate 😐" : value <= 360 ? "Unhealthy 😷" : "Very Unhealthy ⚠️";
  if (type === "so2") return value <= 35 ? "Good 😊" : value <= 75 ? "Moderate 😐" : value <= 185 ? "Unhealthy 😷" : "Very Unhealthy ⚠️";
  return "Unknown";
};

export default function ForecastHybridChart({ lat, lon }) {
  const [data, setData] = useState([]);
  const [days, setDays] = useState(3);

  const aqiMap = (val) => [50, 100, 150, 200, 300][val - 1] ?? 0;

  useEffect(() => {
    if (!lat || !lon) return;
    fetchAQIForecast(lat, lon).then((raw) => {
      const daily = [];
      for (let i = 0; i < raw.length; i += 24) {
        const slice = raw.slice(i, i + 24);
        const avg = (key) => slice.reduce((s, d) => s + d.components[key], 0) / slice.length;
        const aqi = slice.reduce((s, d) => s + aqiMap(d.main.aqi), 0) / slice.length;

        daily.push({
          date: new Date(slice[0].dt * 1000).toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
          pm25: +avg("pm2_5").toFixed(1),
          pm10: +avg("pm10").toFixed(1),
          co: +avg("co").toFixed(2),
          no2: +avg("no2").toFixed(1),
          so2: +avg("so2").toFixed(1),
          aqi: +aqi.toFixed(0),
        });
      }
      setData(daily.slice(0, 7));
    });
  }, [lat, lon]);

  const display = data.slice(0, days);

  const chartData = {
    labels: display.map((d) => d.date),
    datasets: [
      { type: "bar", label: "PM2.5", data: display.map((d) => d.pm25), backgroundColor: "#f87171", stack: "pollutants" },
      { type: "bar", label: "PM10", data: display.map((d) => d.pm10), backgroundColor: "#facc15", stack: "pollutants" },
      { type: "bar", label: "CO", data: display.map((d) => d.co), backgroundColor: "#60a5fa", stack: "pollutants" },
      { type: "bar", label: "NO₂", data: display.map((d) => d.no2), backgroundColor: "#34d399", stack: "pollutants" },
      { type: "bar", label: "SO₂", data: display.map((d) => d.so2), backgroundColor: "#a78bfa", stack: "pollutants" },
      {
        type: "line",
        label: "AQI",
        data: display.map((d) => d.aqi),
        borderColor: "#f472b6",
        backgroundColor: "#f472b6",
        tension: 0.4,
        yAxisID: "aqiAxis",
        fill: false,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#fff" } },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            const labelKeyMap = {
              "PM2.5": "pm2_5",
              "PM10": "pm10",
              "CO": "co",
              "NO₂": "no2",
              "SO₂": "so2",
            };
            const rawLabel = ctx.dataset.label.replace(/ \(.*?\)/, "");
            const key = labelKeyMap[rawLabel] || "unknown";
            const value = ctx.raw;
            const tip = getHealthAdvisory(key, value);
            return `${ctx.dataset.label}: ${value} — ${tip}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#fff" },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        stacked: true,
        title: {
          display: true,
          text: "Pollutants (μg/m³ or ppm)",
          color: "#fff",
        },
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      aqiAxis: {
        position: "right",
        stacked: false,
        title: {
          display: true,
          text: "AQI",
          color: "#f472b6",
        },
        ticks: { color: "#f472b6" },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">🌫️ Pollutants & AQI Forecast ({days} Day)</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          onClick={() => setDays(days === 3 ? 7 : 3)}
        >
          Toggle to {days === 3 ? "7-Day" : "3-Day"}
        </button>
      </div>

      {display.length > 0 ? (
        <Suspense fallback={<p className="text-sm italic text-gray-400">Loading chart...</p>}>
          <LazyChart type="bar" data={chartData} options={options} />
        </Suspense>
      ) : (
        <p className="text-sm italic text-gray-400">Loading...</p>
      )}
    </div>
  );
}
