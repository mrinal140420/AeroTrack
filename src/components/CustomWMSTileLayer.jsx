import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const CustomWMSTileLayer = ({ url, layers, opacity }) => {
  const map = useMap();

  useEffect(() => {
    const wmsLayer = L.tileLayer.wms(url, {
      layers,
      format: "image/png",
      transparent: true,
      attribution: "© ISRO Bhuvan",
      opacity,
    });

    map.addLayer(wmsLayer);
    return () => map.removeLayer(wmsLayer);
  }, [map, url, layers, opacity]);

  return null;
};

export default CustomWMSTileLayer;
