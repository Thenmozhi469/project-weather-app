import type { CurrentWeather, DailyForecast, HourlyForecast, WeatherInsight } from '@/types/weather';

export function generateInsights(
  current: CurrentWeather,
  hourly: HourlyForecast[],
  daily: DailyForecast[]
): WeatherInsight[] {
  const insights: WeatherInsight[] = [];
  const today = daily[0];

  // Rain probability
  const maxRainChance = Math.max(...hourly.slice(0, 12).map((h) => h.chance_of_rain));
  if (maxRainChance > 40) {
    insights.push({
      id: 'umbrella',
      icon: 'umbrella',
      title: 'Carry an Umbrella',
      description: `Up to ${maxRainChance}% chance of rain in the next 12 hours.`,
      type: 'warning',
    });
  }

  // UV Index
  if (current.uv >= 6) {
    insights.push({
      id: 'uv-high',
      icon: 'sun',
      title: 'High UV Levels Expected',
      description: `UV index is ${current.uv}. Apply sunscreen and wear protective clothing.`,
      type: 'warning',
    });
  } else if (current.uv >= 3) {
    insights.push({
      id: 'uv-moderate',
      icon: 'sun',
      title: 'Moderate UV Index',
      description: `UV index is ${current.uv}. Consider sunscreen if spending time outdoors.`,
      type: 'info',
    });
  }

  // Great weather for outdoor activities
  if (current.temp_c >= 18 && current.temp_c <= 28 && current.cloud < 50 && current.wind_kph < 25) {
    insights.push({
      id: 'outdoor',
      icon: 'tree',
      title: 'Great Weather for Outdoors',
      description: `Perfect conditions at ${Math.round(current.temp_c)}°C with light winds.`,
      type: 'positive',
    });
  }

  // Strong winds
  const maxWind = Math.max(...hourly.slice(0, 12).map((h) => h.wind_kph));
  if (maxWind > 30) {
    insights.push({
      id: 'wind',
      icon: 'wind',
      title: 'Strong Winds Expected',
      description: `Wind speeds up to ${Math.round(maxWind)} km/h in the coming hours.`,
      type: 'warning',
    });
  }

  // Hot weather
  if (current.temp_c > 32) {
    insights.push({
      id: 'hydration',
      icon: 'droplet',
      title: 'Stay Hydrated',
      description: `Temperature is ${Math.round(current.temp_c)}°C. Drink plenty of water and avoid prolonged sun exposure.`,
      type: 'warning',
    });
  }

  // Cold weather
  if (current.temp_c < 5) {
    insights.push({
      id: 'cold',
      icon: 'thermometer',
      title: 'Bundle Up!',
      description: `It's only ${Math.round(current.temp_c)}°C. Dress warmly in layers.`,
      type: 'info',
    });
  }

  // Snow expected
  const snowChance = hourly.slice(0, 12).some((h) => h.chance_of_snow > 30);
  if (snowChance) {
    insights.push({
      id: 'snow-expected',
      icon: 'snowflake',
      title: 'Snow Expected',
      description: 'Snow is likely in the coming hours. Drive carefully and dress warmly.',
      type: 'info',
    });
  }

  // Low visibility
  if (current.vis_km < 5) {
    insights.push({
      id: 'visibility',
      icon: 'eye',
      title: 'Low Visibility',
      description: `Visibility is only ${current.vis_km} km. Drive with caution.`,
      type: 'warning',
    });
  }

  // Humidity comfort
  if (current.humidity > 75) {
    insights.push({
      id: 'humidity-high',
      icon: 'droplets',
      title: 'High Humidity',
      description: `${current.humidity}% humidity may feel uncomfortable. Stay in well-ventilated areas.`,
      type: 'tip',
    });
  }

  // Temperature swing
  if (today && today.maxtemp_c - today.mintemp_c > 15) {
    insights.push({
      id: 'temp-swing',
      icon: 'thermometer-sun',
      title: 'Large Temperature Swing',
      description: `Temperatures range from ${Math.round(today.mintemp_c)}°C to ${Math.round(today.maxtemp_c)}°C today.`,
      type: 'tip',
    });
  }

  return insights;
}

export function getWeatherEmoji(code: number): string {
  if (code === 1000) return '☀️';
  if (code === 1003) return '⛅';
  if (code === 1006 || code === 1009) return '☁️';
  if (code === 1030 || code === 1135 || code === 1147) return '🌫️';
  if (code === 1063 || (code >= 1150 && code <= 1282)) return '🌧️';
  if (code === 1066 || (code >= 1069 && code <= 1072) || (code >= 1114 && code <= 1225) || (code >= 1255 && code <= 1264)) return '❄️';
  if (code === 1087 || (code >= 1273 && code <= 1282)) return '⛈️';
  return '🌤️';
}
