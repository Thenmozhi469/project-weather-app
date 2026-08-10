/**
 * Mock weather data — used automatically when the WeatherAPI key is missing/invalid.
 * Shows a fully functional UI so you can see the design immediately.
 */

const now   = new Date();
const pad   = n => String(n).padStart(2, '0');
const hhmm  = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

function makeHourly() {
  const hours = [];
  const baseTemps = [18,17,17,16,16,16,17,18,20,22,24,25,26,26,25,24,23,22,21,20,19,18,18,17];
  for (let i = 0; i < 24; i++) {
    const t = new Date(now.getTime() + i * 3600000);
    const temp = baseTemps[i] + (Math.random() * 2 - 1);
    hours.push({
      time: `${t.getFullYear()}-${pad(t.getMonth()+1)}-${pad(t.getDate())} ${pad(t.getHours())}:00`,
      time_epoch: Math.floor(t.getTime() / 1000),
      temp_c: +temp.toFixed(1),
      temp_f: +(temp * 9/5 + 32).toFixed(1),
      condition: i < 6 ? 'Clear' : i < 12 ? 'Partly Cloudy' : i < 18 ? 'Sunny' : 'Clear',
      condition_code: i < 6 ? 1000 : i < 12 ? 1003 : i < 18 ? 1000 : 1000,
      icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
      wind_kph: 10 + Math.random() * 15,
      wind_dir: ['N','NE','E','SE','S','SW','W','NW'][i % 8],
      humidity: 55 + Math.round(Math.random() * 25),
      chance_of_rain: i >= 12 && i <= 15 ? 30 + Math.round(Math.random() * 20) : 0,
      chance_of_snow: 0,
      precip_mm: 0,
      uv: i >= 6 && i <= 18 ? 3 + Math.round(Math.random() * 5) : 0,
      vis_km: 10,
      cloud: i < 6 ? 10 : i < 12 ? 40 : i < 18 ? 20 : 10,
      feelslike_c: +(temp - 1.5).toFixed(1),
      feelslike_f: +((temp - 1.5) * 9/5 + 32).toFixed(1),
    });
  }
  return hours;
}

function makeDaily() {
  const conditions = [
    { text: 'Sunny',          code: 1000, icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' },
    { text: 'Partly Cloudy',  code: 1003, icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' },
    { text: 'Cloudy',         code: 1006, icon: '//cdn.weatherapi.com/weather/64x64/day/119.png' },
    { text: 'Light Rain',     code: 1183, icon: '//cdn.weatherapi.com/weather/64x64/day/296.png' },
    { text: 'Sunny',          code: 1000, icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' },
    { text: 'Partly Cloudy',  code: 1003, icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' },
    { text: 'Sunny',          code: 1000, icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' },
  ];
  return conditions.map((c, i) => {
    const d = new Date(now.getTime() + i * 86400000);
    const maxtemp = 22 + Math.round(Math.random() * 6);
    const mintemp = 13 + Math.round(Math.random() * 4);
    return {
      date: `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`,
      date_epoch: Math.floor(d.getTime() / 1000),
      maxtemp_c: maxtemp,
      maxtemp_f: +(maxtemp * 9/5 + 32).toFixed(1),
      mintemp_c: mintemp,
      mintemp_f: +(mintemp * 9/5 + 32).toFixed(1),
      condition: c.text,
      condition_code: c.code,
      icon: c.icon,
      maxwind_kph: 15 + Math.round(Math.random() * 20),
      maxwind_mph: 10 + Math.round(Math.random() * 12),
      totalprecip_mm: c.code > 1100 ? 2 + Math.random() * 8 : 0,
      avghumidity: 55 + Math.round(Math.random() * 20),
      daily_chance_of_rain: c.code > 1100 ? 60 + Math.round(Math.random() * 30) : Math.round(Math.random() * 15),
      daily_chance_of_snow: 0,
      uv: 4 + Math.round(Math.random() * 4),
      sunrise: '06:12 AM',
      sunset: '08:47 PM',
      moonrise: '09:30 PM',
      moonset: '07:15 AM',
      moon_phase: ['New Moon','Waxing Crescent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Last Quarter','Waning Crescent'][i],
    };
  });
}

function getMockData(latitude, longitude) {
  const curTemp = 23.4;
  return {
    current: {
      temp_c: curTemp,
      temp_f: +(curTemp * 9/5 + 32).toFixed(1),
      feelslike_c: 22.1,
      feelslike_f: 71.8,
      condition: 'Partly Cloudy',
      condition_code: 1003,
      icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
      humidity: 62,
      wind_kph: 18.4,
      wind_mph: 11.4,
      wind_dir: 'WSW',
      pressure_mb: 1018,
      uv: 5,
      vis_km: 10,
      cloud: 38,
      precip_mm: 0,
      is_day: 1,
      last_updated: `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${hhmm(now)}`,
    },
    hourly: makeHourly(),
    daily:  makeDaily(),
    location: {
      name:        'London',
      region:      'City of London, Greater London',
      country:     'United Kingdom',
      lat:         latitude || 51.52,
      lon:         longitude || -0.11,
      timezone_id: 'Europe/London',
      localtime:   `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${hhmm(now)}`,
    },
    airQuality: {
      co:           233.4,
      no2:          8.2,
      o3:           62.1,
      so2:          3.4,
      pm2_5:        7.8,
      pm10:         12.3,
      us_epa_index: 1,
      gb_defra_index: 1,
    },
  };
}

module.exports = { getMockData };
