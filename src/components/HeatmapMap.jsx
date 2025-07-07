import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  Marker,
  Popup,
  Circle,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import hospitalIconUrl from "../assets/hospital.png";

const pollutionLayers = {
  NO2: "Aura_NO2_Column_Day",
  CO: "TROPOMI_CO_Total_Column_Day",
  FIRMS: "FIRMS_VIIRS_USA_contiguous_and_Hawaii",
};

// 🏥 Custom hospital icon (with fallback if asset fails)
const hospitalIcon = new L.Icon({
  iconUrl: hospitalIconUrl || L.Icon.Default.imagePath + "/marker-icon.png",
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10],
});

const getLegendColors = (layer) => {
  if (layer === "NO2") return [
    { color: "#00e400", label: "Good" },
    { color: "#ffff00", label: "Moderate" },
    { color: "#ff7e00", label: "Unhealthy (SG)" },
    { color: "#ff0000", label: "Unhealthy" },
    { color: "#8f3f97", label: "Very Unhealthy" },
    { color: "#7e0023", label: "Hazardous" },
  ];
  if (layer === "CO") return [
    { color: "#66ffb2", label: "Low" },
    { color: "#ccff66", label: "Moderate" },
    { color: "#ffcc66", label: "Elevated" },
    { color: "#ff9966", label: "High" },
    { color: "#ff6666", label: "Severe" },
  ];
  if (layer === "FIRMS") return [
    { color: "#ffffcc", label: "Low" },
    { color: "#fed976", label: "Medium" },
    { color: "#fd8d3c", label: "High" },
    { color: "#e31a1c", label: "Very High" },
    { color: "#bd0026", label: "Extreme" },
  ];
  return [];
};

const getAQIColor = (aqi) => {
  if (aqi <= 50) return "#00e400";
  if (aqi <= 100) return "#ffff00";
  if (aqi <= 150) return "#ff7e00";
  if (aqi <= 200) return "#ff0000";
  if (aqi <= 300) return "#8f3f97";
  return "#7e0023";
};

function LocationPicker({ setPosition, setZoom }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      setZoom(14);
    },
  });
  return null;
}

export default function HeatmapMap({
  position,
  setPosition,
  zoom,
  setZoom,
  selectedLayer,
  setSelectedLayer,
  aqiData,
  opacity,
  setOpacity,
  hospitals = [],
}) {
  const aqi = aqiData?.aqi || 0;
  const aqiColor = getAQIColor(aqi);

  return (
    <div className="mt-4">
      {/* Controls */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <label className="font-medium mr-2">🛰️ Pollution Layer:</label>
          <select
            className="text-black px-2 py-1 rounded"
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value)}
          >
            <option value="NO2">NO₂</option>
            <option value="CO">CO</option>
            <option value="FIRMS">FIRMS</option>
          </select>
        </div>
        <div>
          <label className="font-medium mr-2">🌀 Opacity:</label>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.1}
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
          />
        </div>
      </div>

      {/* Map View */}
      <div className="relative" style={{ height: "500px", width: "100%" }}>
        <MapContainer center={position} zoom={zoom} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position}>
            <Popup>
              📍 You are here<br />
              Lat: {position[0].toFixed(4)}, Lon: {position[1].toFixed(4)}
            </Popup>
          </Marker>

          <Circle
            center={position}
            radius={1500}
            pathOptions={{ color: aqiColor, fillColor: aqiColor, fillOpacity: 0.3 }}
          >
            <Tooltip direction="top" offset={[0, -10]} permanent>
              AQI: {aqi}
            </Tooltip>
          </Circle>

          <WMSTileLayer
            url="https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"
            layers={pollutionLayers[selectedLayer]}
            format="image/png"
            transparent
            opacity={opacity}
            zIndex={1000}
            params={{ time: new Date().toISOString().split("T")[0] }}
          />

          {/* Hospital Markers */}
          {hospitals.map((h, i) => (
            <Marker key={i} position={[h.lat, h.lon]} icon={hospitalIcon}>
              <Popup>
                🏥 <strong>{h.name}</strong><br />
                {h.address}<br />
                <a href={h.mapsLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  📍 Get Directions
                </a>
              </Popup>
            </Marker>
          ))}

          <LocationPicker setPosition={setPosition} setZoom={setZoom} />
        </MapContainer>

        {/* Legend Box */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded text-xs shadow-lg w-48">
          <p className="font-semibold mb-2">{selectedLayer} Levels</p>
          {getLegendColors(selectedLayer).map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-5 h-3 rounded" style={{ backgroundColor: l.color }} />
              <span>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm mt-2 italic">
        Showing pollution data for ~1.5 km around{" "}
        <strong>{position[0].toFixed(4)}, {position[1].toFixed(4)}</strong>
      </p>
    </div>
  );
}
