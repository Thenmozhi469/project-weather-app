# 🌤️ WeatherNow

A **production-ready, fully responsive** weather application built with vanilla HTML, CSS and JavaScript.

## ✨ Features

| Feature | Details |
|---|---|
| Real-time weather | Temperature, humidity, wind, pressure, visibility |
| Hourly forecast | Next 24 hours with rain probability |
| 5-day forecast | Min/max temps with visual temperature bar |
| Air Quality Index | AQI gauge + PM2.5, PM10, O3, NO2, SO2, CO |
| Detailed metrics | UV, wind compass, humidity bar, pressure |
| Geolocation | One-click "Use my location" |
| Unit toggle | °C / °F with no extra API call |
| Dark / Light mode | Saved to localStorage |
| Favorites | Save cities, loads instantly |
| Recent searches | Last 10 cities, persistent |
| Autocomplete | City suggestions as you type |
| Dynamic backgrounds | Changes with weather condition |
| Live clock | Local time updates every second |
| Animated UI | Glassmorphism, floating orbs, card animations |
| Fully accessible | ARIA labels, keyboard nav, focus styles |
| Responsive | Mobile, tablet, desktop layouts |

## 🚀 Setup

### 1. Get a free API key
Sign up at [openweathermap.org](https://openweathermap.org/api)  
The **free plan** covers all features used here.

### 2. Add your key
Open `script.js` and replace:
```js
KEY: 'YOUR_API_KEY_HERE',
```
with your actual key.

### 3. Run
Open `index.html` directly in your browser, or use **VS Code Live Server**:
```
Right-click index.html → Open with Live Server
```

## 📁 Folder Structure
```
weather-app/
├── index.html      # Semantic HTML structure
├── style.css       # All styles — variables, glassmorphism, responsive
├── script.js       # All logic — API, DOM, state, events
├── assets/
│   └── icons/      # (optional custom icons)
└── README.md
```

## 🔐 API Key Security
**Never commit your API key to a public repo.**  
For production, proxy all API calls through your own server so the key stays server-side.

## 🌐 Deployment
- **GitHub Pages**: push to `gh-pages` branch
- **Netlify**: drag and drop the folder at netlify.com/drop
- **Vercel**: `vercel --prod` from the folder

## 🛠️ Technologies
- HTML5 (semantic elements, ARIA)
- CSS3 (variables, glassmorphism, grid, flexbox, animations)
- JavaScript ES6+ (async/await, modules pattern, localStorage)
- OpenWeatherMap API (current, forecast, AQI, geocoding)
- Font Awesome 6 (icons)
- Google Fonts — Inter
