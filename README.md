# 🌤️ Weather Application Workspace

Welcome to the **Weather Application Workspace**. This repository contains two production-ready implementations of modern weather forecasting interfaces, ranging from a lightweight vanilla web app to a full-stack dashboard.

---

## 📁 Repository Structure

This repository is organized as follows:

```
project-weather-app/
├── weather-app/              # 1. Vanilla HTML/CSS/JS Frontend (Client-only)
│   ├── index.html            # Main markup using semantic HTML
│   ├── style.css             # Vanilla CSS containing variables & animations
│   └── script.js             # API integrations & local state management
│
└── project_weather_app-master/ # 2. Modern Full-Stack Application
    ├── client/               # Next.js React Dashboard (TypeScript + Tailwind CSS)
    └── server/               # Express.js Proxy Server (Node.js)
```

---

## 🌤️ Option 1: Vanilla Weather App (`/weather-app`)

A highly optimized, **fully responsive** single-page weather application built with raw web technologies. Perfect for ultra-fast load times and static hosting.

### ✨ Key Features
* **Real-time Metrics:** Displays current temperature, wind speed/direction, humidity, atmospheric pressure, visibility, and UV index.
* **Forecasts:** 24-hour hourly rain/temperature projections and a 5-day forecast with interactive visual temperature bars.
* **Air Quality Index (AQI):** Comprehensive analysis of local pollutants (PM2.5, PM10, $\text{O}_3$, $\text{NO}_2$, $\text{SO}_2$, and $\text{CO}$).
* **User Preferences:** LocalStorage persistence for recent searches, saved favorite cities, temperature units (°C/°F), and Dark/Light mode theme.
* **Visual Polish:** Glassmorphism UI, floating ambient orbs, and dynamic weather-based page backgrounds.
* **Accessibility:** Full keyboard navigation support and robust ARIA labeling.

### 🚀 Getting Started

1. **Get an API Key:** Sign up for a free account at [OpenWeatherMap](https://openweathermap.org/api) if you need to create your own key.
2. **Configure:** Open [weather-app/script.js](file:///c:/Users/ELCOT/Downloads/project_weather_app-master/weather-app/script.js) and insert your key:
   ```javascript
   KEY: '065e4d1b60cf7c882bc79567481c67aa',
   ```
   *(Your API key is already configured in the script!)*
3. **Run:** Double-click [weather-app/index.html](file:///c:/Users/ELCOT/Downloads/project_weather_app-master/weather-app/index.html) to open in your browser, or serve it using the VS Code **Live Server** extension.

---

## 💻 Option 2: Full-Stack Weather Dashboard (`/project_weather_app-master`)

A modern, enterprise-ready dashboard featuring a segregated frontend client and an API-proxy backend.

### 🛠️ Tech Stack
* **Frontend (`/client`):** Next.js 15, React 19, Tailwind CSS, TypeScript, Framer Motion (animations), Recharts (data visualizations), React-Leaflet (interactive maps), and Zustand (global state).
* **Backend (`/server`):** Node.js, Express.js, CORS, and Axios (HTTP client).

### ✨ Key Features
* **Interactive Mapping:** View radar or local weather charts on an interactive geographic map.
* **Express Proxy API:** Protects API keys from exposure by running all geocoding and weather fetch requests through a backend server.
* **Graceful Degradation:** Automatic mock data fallback if the external API key is missing or invalid, ensuring the frontend interface remains fully interactive and testable.
* **Advanced Analytics:** High-fidelity data visualizations using charting libraries to depict forecast trends.

### 🚀 Getting Started

#### 1. Setup the Server Backend
1. Open your terminal and navigate to the server folder:
   ```bash
   cd project_weather_app-master/server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create your environment config by copying the example template:
   ```bash
   cp .env.example .env
   ```
4. Configure your API key. Create a `.env` file and add your key:
   ```env
   WEATHER_API_KEY=your_key_here
   PORT=5000
   ```
   *(Your local `.env` file is already configured with your API key!)*
5. Spin up the Express server:
   ```bash
   npm start
   ```
   *(The server will run on `http://localhost:5000`)*

#### 2. Setup the Client Frontend
1. Open a new terminal window and navigate to the client folder:
   ```bash
   cd project_weather_app-master/client
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to: **`http://localhost:3000`**

---

## 🔒 Security Best Practices
* **Never commit API keys** to remote Git repositories.
* The `/server` directory includes a `.gitignore` configured to keep `.env` files local.
* For the Vanilla app, ensure you rotate keys or move key management to a proxy worker if deployed to a public URL.

## 🌐 Deployment

* **Vanilla Frontend:** Deploy to **GitHub Pages**, **Netlify**, or **Vercel** simply by selecting the `weather-app` directory.
* **Full-stack App:** 
  * Deploy the Node.js server to **Render**, **Heroku**, or **DigitalOcean**.
  * Deploy the Next.js client to **Vercel** and configure the backend URL in your environment settings.
