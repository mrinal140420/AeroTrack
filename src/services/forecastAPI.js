// src/services/forecastAPI.js
export const fetchAQIForecast = async (lat, lon) => {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
  const url = `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    return json.list || [];
  } catch (err) {
    console.error("Forecast API error:", err);
    return [];
  }
};
