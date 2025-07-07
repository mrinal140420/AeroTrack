// src/services/reverseGeocode.js
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;


export async function reverseGeocode(lat, lon) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_API_KEY}`;

  try {
    const proxy = "https://api.allorigins.win/raw?url=";
    const res = await fetch(`${proxy}${encodeURIComponent(url)}`);
    const json = await res.json();

    if (!json.results || !json.results.length) throw new Error("No results");

    const address = json.results[0].address_components;
    const locality = address.find((c) => c.types.includes("locality"));
    const sublocality = address.find((c) => c.types.includes("sublocality"));
    const adminArea = address.find((c) => c.types.includes("administrative_area_level_2"));
    const state = address.find((c) => c.types.includes("administrative_area_level_1"));

    return `${sublocality?.long_name || locality?.long_name || adminArea?.long_name || "Unknown"}, ${state?.short_name || ""}`;
  } catch (e) {
    console.error("Reverse geocode error:", e);
    return null;
  }
}
