const axios = require('axios');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || '9b6f3dac27msh4e84ae2a2f01p1e3cae5jsnd5f7e1e6b82a16';
const BASE_URL = 'https://api.weatherapi.com/v1';

const forecast = async (latitude, longitude) => {
  try {
    // Current weather + forecast (3 days hourly + daily)
    const forecastUrl = `${BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}&days=7&aqi=yes&alerts=no`;
    const { data } = await axios.get(forecastUrl);

    // Parse current weather
    const current = {
      temp_c: data.current.temp_c,
      temp_f: data.current.temp_f,
      feelslike_c: data.current.feelslike_c,
      feelslike_f: data.current.feelslike_f,
      condition: data.current.condition.text,
      condition_code: data.current.condition.code,
      icon: data.current.condition.icon,
      humidity: data.current.humidity,
      wind_kph: data.current.wind_kph,
      wind_mph: data.current.wind_mph,
      wind_dir: data.current.wind_dir,
      pressure_mb: data.current.pressure_mb,
      uv: data.current.uv,
      vis_km: data.current.vis_km,
      cloud: data.current.cloud,
      precip_mm: data.current.precip_mm,
      is_day: data.current.is_day,
      last_updated: data.current.last_updated,
    };

    // Parse hourly forecast (next 48 hours from today + tomorrow)
    const hourly = [];
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const allHours = [
      ...(data.forecast.forecastday[0]?.hour || []),
      ...(data.forecast.forecastday[1]?.hour || []),
      ...(data.forecast.forecastday[2]?.hour || []),
    ];

    const now = new Date();
    allHours.forEach((hour) => {
      const hourDate = new Date(hour.time);
      if (hourDate >= now) {
        hourly.push({
          time: hour.time,
          time_epoch: hour.time_epoch,
          temp_c: hour.temp_c,
          temp_f: hour.temp_f,
          condition: hour.condition.text,
          condition_code: hour.condition.code,
          icon: hour.condition.icon,
          wind_kph: hour.wind_kph,
          wind_dir: hour.wind_dir,
          humidity: hour.humidity,
          chance_of_rain: hour.chance_of_rain,
          chance_of_snow: hour.chance_of_snow,
          precip_mm: hour.precip_mm,
          uv: hour.uv,
          vis_km: hour.vis_km,
          cloud: hour.cloud,
          feelslike_c: hour.feelslike_c,
          feelslike_f: hour.feelslike_f,
        });
      }
    });

    // Parse daily forecast
    const daily = data.forecast.forecastday.map((day) => ({
      date: day.date,
      date_epoch: day.date_epoch,
      maxtemp_c: day.day.maxtemp_c,
      maxtemp_f: day.day.maxtemp_f,
      mintemp_c: day.day.mintemp_c,
      mintemp_f: day.day.mintemp_f,
      condition: day.day.condition.text,
      condition_code: day.day.condition.code,
      icon: day.day.condition.icon,
      maxwind_kph: day.day.maxwind_kph,
      maxwind_mph: day.day.maxwind_mph,
      totalprecip_mm: day.day.totalprecip_mm,
      avghumidity: day.day.avghumidity,
      daily_chance_of_rain: day.day.daily_chance_of_rain,
      daily_chance_of_snow: day.day.daily_chance_of_snow,
      uv: day.day.uv,
      sunrise: day.astro.sunrise,
      sunset: day.astro.sunset,
      moonrise: day.astro.moonrise,
      moonset: day.astro.moonset,
      moon_phase: day.astro.moon_phase,
    }));

    // Location data
    const location = {
      name: data.location.name,
      region: data.location.region,
      country: data.location.country,
      lat: data.location.lat,
      lon: data.location.lon,
      timezone_id: data.location.tz_id,
      localtime: data.location.localtime,
    };

    // Air quality
    const airQuality = data.current.air_quality
      ? {
          co: data.current.air_quality.co,
          no2: data.current.air_quality.no2,
          o3: data.current.air_quality.o3,
          so2: data.current.air_quality.so2,
          pm2_5: data.current.air_quality.pm2_5,
          pm10: data.current.air_quality.pm10,
          us_epa_index: data.current.air_quality['us-epa-index'],
          gb_defra_index: data.current.air_quality['gb-defra-index'],
        }
      : null;

    return { current, hourly: hourly.slice(0, 48), daily, location, airQuality };
  } catch (error) {
    console.error('Forecast error:', error.response?.data || error.message);
    throw new Error('Unable to fetch forecast data');
  }
};

module.exports = forecast;
