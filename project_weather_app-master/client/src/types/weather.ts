// ==================== Weather Data Types ====================

export interface CurrentWeather {
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  condition: string;
  condition_code: number;
  icon: string;
  humidity: number;
  wind_kph: number;
  wind_mph: number;
  wind_dir: string;
  pressure_mb: number;
  uv: number;
  vis_km: number;
  cloud: number;
  precip_mm: number;
  is_day: number;
  last_updated: string;
}

export interface HourlyForecast {
  time: string;
  time_epoch: number;
  temp_c: number;
  temp_f: number;
  condition: string;
  condition_code: number;
  icon: string;
  wind_kph: number;
  wind_dir: string;
  humidity: number;
  chance_of_rain: number;
  chance_of_snow: number;
  precip_mm: number;
  uv: number;
  vis_km: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
}

export interface DailyForecast {
  date: string;
  date_epoch: number;
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  condition: string;
  condition_code: number;
  icon: string;
  maxwind_kph: number;
  maxwind_mph: number;
  totalprecip_mm: number;
  avghumidity: number;
  daily_chance_of_rain: number;
  daily_chance_of_snow: number;
  uv: number;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
}

export interface AirQuality {
  co: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  us_epa_index: number;
  gb_defra_index: number;
}

export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  timezone_id: string;
  localtime: string;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  location: Location;
  airQuality: AirQuality | null;
}

// ==================== Search Types ====================

export interface SearchSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

export interface SavedLocation {
  id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  isFavorite?: boolean;
}

// ==================== Theme Types ====================

export type WeatherConditionType =
  | 'sunny'
  | 'cloudy'
  | 'rain'
  | 'snow'
  | 'thunderstorm'
  | 'fog'
  | 'night';

export interface ThemePalette {
  name: WeatherConditionType;
  bgGradient: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textMuted: string;
  cardBg: string;
  cardBorder: string;
}

// ==================== Insight Types ====================

export interface WeatherInsight {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'tip' | 'positive';
}

// ==================== Map Types ====================

export type MapLayer = 'temperature' | 'precipitation' | 'wind' | 'clouds';
