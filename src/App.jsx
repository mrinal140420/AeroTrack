import { useEffect, useState } from "react";
import { fetchCPCBAQIData, fetchWeather } from "./services/api";
import { reverseGeocode } from "./services/reverseGeocode";
import { saveAs } from "file-saver";

import HeatmapMap from "./components/HeatmapMap";
import ForecastChart from "./components/ForecastChart";
import HealthTips from "./components/HealthTips";
import ForecastHybridChart from "./components/ForecastHybridChart";
import { getNearbyHospitals } from "./services/getNearbyHospitals";

import "./index.css";

function App() {
  const [aqiData, setAqiData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState([20.5937, 78.9629]);
  const [zoom, setZoom] = useState(8);
  const [layer, setLayer] = useState("NO2");
  const [opacity, setOpacity] = useState(0.8);
  const [useAI, setUseAI] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [countdown, setCountdown] = useState(300);
  const [locationName, setLocationName] = useState("Detecting...");
  const [geoError, setGeoError] = useState(false);

  const sendAQIAlert = (aqi) => {
    if (Notification.permission === "granted" && aqi > 200) {
      new Notification("⚠️ Air Quality Alert", {
        body: `AQI is ${aqi}. Stay indoors and wear a mask.`,
        icon: "/favicon.png",
      });
    }
  };

  const fetchData = async (lat, lon) => {
    const [aqi, weatherData] = await Promise.all([
      fetchCPCBAQIData(lat, lon),
      fetchWeather(lat, lon),
    ]);
    setAqiData(aqi);
    setWeather(weatherData);
    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);

    if (aqi?.aqi > 200) sendAQIAlert(aqi.aqi);
    if (aqi?.aqi > 300) {
      const nearby = await getNearbyHospitals(lat, lon);
      setHospitals(nearby);
    } else {
      setHospitals([]);
    }

    const loc = await reverseGeocode(lat, lon);
    if (loc) {
      setLocationName(loc);
      setGeoError(false);
    } else {
      setLocationName("Unknown");
      setGeoError(true);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("aero_location");
    if (stored) {
      const [lat, lon] = JSON.parse(stored);
      setPosition([lat, lon]);
      fetchData(lat, lon);
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          fetchData(latitude, longitude);
          localStorage.setItem("aero_location", JSON.stringify([latitude, longitude]));
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    }

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!autoRefresh || loading) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            fetchData(latitude, longitude);
          });
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, loading]);

  const exportAQIData = () => {
    if (!aqiData) return;
    const csv = `Location,Latitude,Longitude,AQI,PM2.5,PM10,NO2\n${locationName},${position[0]},${position[1]},${aqiData.aqi},${aqiData.pm25},${aqiData.pm10},${aqiData.no2}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `AQI_${locationName.replace(/\s+/g, "_")}.csv`);
  };

  return (
    <div className="min-h-screen bg-dark text-white font-sans p-4 relative">
      
      <div className="max-w-4xl mx-auto mt-12">
        <h1 className="text-3xl font-bold text-center mb-6">🌍 AeroTrack Dashboard</h1>

        <div className="text-center mb-4 space-y-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded shadow"
            onClick={() => {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const { latitude, longitude } = pos.coords;
                  setPosition([latitude, longitude]);
                  fetchData(latitude, longitude);
                },
                (err) => console.error(err),
                { enableHighAccuracy: true }
              );
            }}
          >
            🔄 Refresh Location & AQI
          </button>

          <div>
            <button
              className={`px-3 py-1 rounded text-white ${autoRefresh ? "bg-green-600" : "bg-gray-600"}`}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? "✅ Auto Refresh ON" : "⏸️ Auto Refresh OFF"}
            </button>
            <p className="text-sm text-gray-300">
              ⏱ Next refresh in: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-400">🕒 Last updated at: {lastUpdated}</p>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-lg animate-pulse">Fetching your data...</p>
        ) : (
          <>
            <div className="text-right mb-2">
              {geoError ? (
                <button
                  onClick={() => reverseGeocode(position[0], position[1]).then((loc) => {
                    if (loc) {
                      setLocationName(loc);
                      setGeoError(false);
                    } else {
                      setLocationName("Unknown");
                      setGeoError(true);
                    }
                  })}
                  className="text-sm bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
                >
                  🔁 Retry Location Detection
                </button>
              ) : (
                <p className="text-sm text-gray-400">📍 Location: {locationName}</p>
              )}
            </div>

            {aqiData && (
              <>
                <button
                  onClick={exportAQIData}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm mb-4"
                >
                  📤 Export AQI Data as CSV
                </button>

                <div className="bg-gray-800 rounded-lg p-4 mb-4 shadow">
                  <h2 className="text-xl font-semibold mb-2">📊 Air Quality Data</h2>
                  <p><strong>Current AQI:</strong> {aqiData.aqi}</p>
                  <p><strong>PM2.5:</strong> {aqiData.pm25} μg/m³</p>
                  <p><strong>PM10:</strong> {aqiData.pm10} μg/m³</p>
                  <p><strong>NO₂:</strong> {aqiData.no2} μg/m³</p>
                </div>
              </>
            )}

            {weather && (
              <div className="bg-gray-800 rounded-lg p-4 mb-4 shadow">
                <h2 className="text-xl font-semibold mb-2">☁️ Weather Info</h2>
                <p><strong>Temperature:</strong> {weather.temp} °C</p>
                <p><strong>Humidity:</strong> {weather.humidity}%</p>
                <p><strong>Wind Speed:</strong> {weather.wind} m/s</p>
                <p><strong>Condition:</strong> {weather.condition}</p>
              </div>
            )}

            {aqiData?.aqi > 300 && hospitals.length > 0 && (
              <div className="bg-red-800 text-white p-4 rounded-lg shadow mb-4">
                <h2 className="text-xl font-bold mb-2">🚨 Emergency Advisory</h2>
                <p className="mb-2">AQI is extremely hazardous. Please avoid outdoor activity.</p>
                <p className="mb-2 font-semibold">Nearby Hospitals:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {hospitals.map((h, i) => (
                    <li key={i}>
                      <strong>{h.name}</strong> — {h.address}<br />
                      <a href={h.mapsLink} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">
                        📍 Get Directions
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <HealthTips aqi={aqiData?.aqi} />
            <ForecastChart lat={position[0]} lon={position[1]} />
            <ForecastHybridChart lat={position[0]} lon={position[1]} useAI={useAI} />
            <HeatmapMap
              position={position}
              setPosition={setPosition}
              zoom={zoom}
              setZoom={setZoom}
              selectedLayer={layer}
              setSelectedLayer={setLayer}
              aqiData={aqiData}
              opacity={opacity}
              setOpacity={setOpacity}
              hospitals={hospitals}
            />
          </>
        )}
        
      </div>
      <footer className="mt-10 text-center text-gray-400 text-sm py-4 border-t border-gray-700">
        © {new Date().getFullYear()} CosmosX. All rights reserved.
      </footer>
      
    </div>
  );
}

export default App;
