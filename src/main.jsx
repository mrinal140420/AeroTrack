import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./chartSetup"; // Registers Chart.js globally with dark styling
import './index.css'
import App from './App.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(
      (reg) => {
        console.log("✅ Service Worker registered:", reg.scope);
      },
      (err) => {
        console.error("❌ Service Worker registration failed:", err);
      }
    );
  });
}
