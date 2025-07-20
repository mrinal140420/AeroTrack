# 🌍 AeroTrack

**AeroTrack** is an open-source web application for **visualizing hyperlocal air quality data** using both ground-based sensors and satellite imagery. It helps users in **rural and underserved areas** track real-time pollution levels, view forecast charts, and receive health advisories — all through an interactive, map-based interface.

It provides a **user-friendly dashboard**, **accurate visual overlays**, and **auto-refreshing air quality insights**, designed especially for public awareness and environmental monitoring.

> ⚠️ **Note:** AI/ML forecasting features are **planned for future versions** but are **not implemented yet**.

---

## ✅ Features

- **Real-Time AQI Monitoring**: Fetches live data from CPCB and OpenAQ.
- **Satellite Pollution Overlays**: Displays NO₂, SO₂ layers from Sentinel-5P and ISRO Bhuvan.
- **Forecast Chart (3/7 Days)**: Visualizes AQI forecasts via OpenWeatherMap.
- **Interactive Map**: Leaflet-powered map with layer toggles and opacity slider.
- **Health Advisories**: Dynamic risk tips and emoji-based AQI categories.
- **Offline PWA Support**: Installable and functional without internet.
- **Reverse Geocoding**: Converts coordinates into readable location names.
- **Export & Share Tools**: CSV data export and snapshot as image.
- **Emergency Alert System**: Warns user if AQI exceeds critical threshold.

---

## 🧱 Tech Stack

| Layer       | Tech                                                                 |
|-------------|----------------------------------------------------------------------|
| Frontend    | React, Tailwind CSS, Leaflet, Chart.js                               |
| Backend     | Node.js *(Planned for ML/APIs)*                                      |
| Mapping     | Leaflet.js, WMS Layers                                               |
| APIs        | OpenAQ, CPCB, OpenWeatherMap, Google Maps Geocoding, ISRO Bhuvan    |
| PWA         | Service Worker, manifest.webmanifest                                 |
| Optional    | Firebase, Supabase *(for persistence/login)*                         |

---
<img width="2879" height="1551" alt="image" src="https://github.com/user-attachments/assets/c17fd61e-2ae7-440f-8e7c-dfb50dea32d2" />
![Uploading image.png…]()
![Uploading image.png…]()

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mrinal140420/AeroTrack.git
cd AeroTrack
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root (optional for API keys):

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_OPENWEATHER_API_KEY=your_openweather_key
```

### 4. Run the Application

```bash
npm run dev
```

### 5. Access the App

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Usage

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### PWA

- Add to home screen on mobile
- Works offline using cached data and fallback UI

### Example Output

- AQI forecast graph (3-day or 7-day)
- Pollution heatmap with live overlay
- Emoji-based health tips
- Location display from reverse geocoding

---

## 📁 Project Structure

```
AeroTrack/
├── public/
│   ├── manifest.webmanifest         # PWA configuration
│   └── index.html
├── src/
│   ├── components/
│   │   ├── HeatmapMap.jsx           # Map & pollution overlays
│   │   ├── ForecastHybridChart.jsx  # AQI + pollutant charts
│   │   └── ...
│   ├── App.jsx                      # Main logic
│   ├── index.css                    # Tailwind/global styles
│   └── main.jsx
├── sw.js                            # Service worker for offline use
├── .env                             # Environment variables
├── package.json                     # NPM dependencies
└── README.md
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make your changes and commit:

   ```bash
   git commit -m "Add your feature"
   ```

4. Push the branch:

   ```bash
   git push origin feature/your-feature
   ```

5. Open a Pull Request on GitHub

> For major features or fixes, please open an issue first to discuss.

---

## 🪪 License

MIT License. See [LICENSE](LICENSE) for full details.

---

## 📬 Contact

- GitHub: [@mrinal140420](https://github.com/mrinal140420)
- Issues: [https://github.com/mrinal140420/AeroTrack/issues](https://github.com/mrinal140420/AeroTrack/issues)
