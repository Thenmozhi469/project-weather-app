import type { WeatherData, SearchSuggestion } from '@/types/weather';

const API_BASE = '/api/weather';

export async function fetchWeatherData(lat?: number, lon?: number): Promise<WeatherData> {
  const params = new URLSearchParams();
  if (lat != null) params.set('latitude', lat.toString());
  if (lon != null) params.set('longitude', lon.toString());

  const url = `${API_BASE}/current${params.toString() ? `?${params}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to fetch weather data' }));
    throw new Error(err.error || 'Failed to fetch weather data');
  }
  return res.json();
}

export async function postCoordinates(lat: number, lon: number): Promise<void> {
  const res = await fetch(`${API_BASE}/post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude: lat, longitude: lon }),
  });
  if (!res.ok) throw new Error('Failed to set coordinates');
}

export async function searchLocations(query: string): Promise<SearchSuggestion[]> {
  if (query.length < 2) return [];
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  return res.json();
}
