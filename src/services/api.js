const AQICN_TOKEN = import.meta.env.VITE_AQICN_KEY;
const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

// ✅ Fetch real-time AQI from AQICN (includes CPCB stations)
export async function fetchCPCBAQIData(lat, lon) {
  const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${AQICN_TOKEN}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (json.status !== "ok") throw new Error("No AQI data");

    const data = json.data;

    return {
      aqi: data.aqi,
      pm25: data.iaqi?.pm25?.v ?? null,
      pm10: data.iaqi?.pm10?.v ?? null,
      no2: data.iaqi?.no2?.v ?? null,
      time: data.time?.s ?? null,
      location: data.city?.name ?? "Unknown",
    };
  } catch (e) {
    console.error("CPCB AQI fetch error:", e.message);
    return null;
  }
}

// ✅ Fetch weather data (temp, humidity, wind) from OpenWeatherMap
export async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    return {
      temp: json.main?.temp ?? null,
      humidity: json.main?.humidity ?? null,
      wind: json.wind?.speed ?? null,
      condition: json.weather?.[0]?.main ?? "N/A",
    };
  } catch (e) {
    console.error("Weather fetch error:", e.message);
    return null;
  }
}

// ✅ Fetch AQI forecast (hourly for 5 days) from OpenWeatherMap
export async function fetchAQIForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    return json.list ?? [];
  } catch (e) {
    console.error("Forecast fetch error:", e.message);
    return [];
  }
}
