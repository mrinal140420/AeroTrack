
// services/getNearbyHospitals.js
export const getNearbyHospitals = async (lat, lon, radius = 5000) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=hospital&key=${API_KEY}`;

  try {
    const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
    const json = await res.json();
    if (!json.results) throw new Error("No results");

    const hospitals = json.results.map(h => ({
      name: h.name,
      address: h.vicinity,
      lat: h.geometry.location.lat,
      lon: h.geometry.location.lng,
      mapsLink: `https://www.google.com/maps/dir/?api=1&destination=${h.geometry.location.lat},${h.geometry.location.lng}`,
    }));

    // Calculate distance using Haversine formula
    const haversine = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    hospitals.sort((a, b) =>
      haversine(lat, lon, a.lat, a.lon) - haversine(lat, lon, b.lat, b.lon)
    );

    return hospitals.slice(0, 3);
  } catch (err) {
    console.error("Hospital fetch failed:", err);
    return [
      {
        name: "Emergency Helpline",
        address: "Dial 108 or contact local hospital",
        lat: lat + 0.01,
        lon: lon + 0.01,
        mapsLink: "tel:108",
      },
    ];
  }
};
