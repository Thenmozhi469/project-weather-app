require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const forecast = require('./utils/forecast');
const { geocode, reverseGeocode } = require('./utils/geocode');
const { getMockData } = require('./utils/mockData');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory current coords (default: London)
let currentCoords = { latitude: 51.5074, longitude: -0.1278 };

// ── POST /api/weather/post ─────────────────────────────────────
app.post('/api/weather/post', (req, res) => {
  const { latitude, longitude } = req.body;
  if (latitude == null || longitude == null)
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  currentCoords = { latitude, longitude };
  res.json({ success: true, latitude, longitude });
});

// ── GET /api/weather/current ──────────────────────────────────
app.get('/api/weather/current', async (req, res) => {
  const lat = req.query.latitude  ? parseFloat(req.query.latitude)  : currentCoords.latitude;
  const lon = req.query.longitude ? parseFloat(req.query.longitude) : currentCoords.longitude;

  try {
    const data = await forecast(lat, lon);
    res.json(data);
  } catch (err) {
    // API key invalid or quota exceeded → serve mock data so UI still works
    console.warn('⚠  WeatherAPI failed — serving mock data. Error:', err.message);
    console.warn('   ➜ Add a valid key to server/.env as WEATHER_API_KEY=<key>');
    console.warn('   ➜ Get a free key at https://www.weatherapi.com/signup.aspx');
    res.json(getMockData(lat, lon));
  }
});

// ── GET /api/weather/search ────────────────────────────────────
app.get('/api/weather/search', async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json([]);
  try {
    res.json(await geocode(q));
  } catch (err) {
    console.error('Search error:', err.message);
    // Return empty list so the UI gracefully shows "no results"
    res.json([]);
  }
});

// ── GET /api/weather/reverse ───────────────────────────────────
app.get('/api/weather/reverse', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon are required' });
  try {
    res.json(await reverseGeocode(parseFloat(lat), parseFloat(lon)));
  } catch (err) {
    console.error('Reverse geocode error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌤  WeatherOS API server running on port ${PORT}`);
  const hasKey = !!(process.env.WEATHER_API_KEY);
  if (hasKey) {
    console.log(`✅  WEATHER_API_KEY loaded from environment`);
  } else {
    console.log(`⚠️  No WEATHER_API_KEY found — mock data will be served.`);
    console.log(`   Get a free key: https://www.weatherapi.com/signup.aspx`);
    console.log(`   Then create server/.env with: WEATHER_API_KEY=your_key\n`);
  }
});
