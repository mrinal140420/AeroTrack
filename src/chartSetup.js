// src/chartSetup.js
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

// Optional: set global style defaults for dark theme
ChartJS.defaults.color = "#fff";
ChartJS.defaults.font.family = "sans-serif";
ChartJS.defaults.plugins.legend.labels.boxWidth = 12;
ChartJS.defaults.plugins.tooltip.backgroundColor = "#333";
ChartJS.defaults.plugins.tooltip.titleFont = { weight: "bold" };
ChartJS.defaults.plugins.tooltip.bodyFont = { size: 12 };
ChartJS.defaults.plugins.tooltip.cornerRadius = 6;
ChartJS.defaults.plugins.tooltip.displayColors = true;

ChartJS.defaults.elements.line.borderWidth = 2;
ChartJS.defaults.elements.point.radius = 3;
ChartJS.defaults.elements.point.hoverRadius = 6;
