// src/components/AQICard.jsx
export default function AQICard({ aqi, pm25, pm10 }) {
  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { level: "Good", color: "good", emoji: "😊" };
    if (aqi <= 100) return { level: "Moderate", color: "moderate", emoji: "😐" };
    if (aqi <= 200) return { level: "Unhealthy", color: "unhealthy", emoji: "😷" };
    return { level: "Hazardous", color: "hazardous", emoji: "☠️" };
  };

  const { level, color, emoji } = getAQIStatus(aqi);

  return (
    <div className={`bg-${color} text-black rounded-xl p-6 shadow-md transition-all`}>
      <h2 className="text-2xl font-bold mb-2">Current AQI</h2>
      <p className="text-5xl">{aqi} {emoji}</p>
      <p className="mt-2">PM2.5: {pm25} μg/m³</p>
      <p>PM10: {pm10} μg/m³</p>
      <p className="mt-1 font-semibold">{level}</p>
    </div>
  );
}
