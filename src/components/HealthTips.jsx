export default function HealthTips({ aqi }) {
  if (aqi === null) return null;

  let level = "", message = "", color = "";

  if (aqi <= 50) {
    level = "Good";
    message = "Air quality is healthy. Enjoy your day!";
    color = "bg-green-600";
  } else if (aqi <= 100) {
    level = "Moderate";
    message = "Sensitive individuals should limit prolonged outdoor exertion.";
    color = "bg-yellow-500";
  } else if (aqi <= 200) {
    level = "Unhealthy";
    message = "Wear a mask, limit outdoor activities.";
    color = "bg-orange-500";
  } else if (aqi <= 300) {
    level = "Very Unhealthy";
    message = "Schools should limit outdoor exposure. Use air purifiers.";
    color = "bg-red-600";
  } else {
    level = "Hazardous";
    message = "Emergency: Stay indoors, monitor breathing, seek medical help if needed.";
    color = "bg-purple-700";
  }

  return (
    <div className={`rounded-xl shadow-md p-4 text-white mt-4 ${color}`}>
      <h3 className="text-xl font-semibold">🩺 Health Advisory</h3>
      <p className="text-lg mt-2"><strong>{level}:</strong> {message}</p>
    </div>
  );
}
