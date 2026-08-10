import { create } from 'zustand';
import type { SavedLocation } from '@/types/weather';

interface LocationState {
  currentLat: number;
  currentLon: number;
  recentSearches: SavedLocation[];
  favorites: SavedLocation[];
  setCurrentLocation: (lat: number, lon: number) => void;
  addRecentSearch: (location: SavedLocation) => void;
  toggleFavorite: (location: SavedLocation) => void;
  isFavorite: (lat: number, lon: number) => boolean;
}

const POPULAR_LOCATIONS: SavedLocation[] = [
  { id: 'london', name: 'London', region: 'England', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { id: 'new-york', name: 'New York', region: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
  { id: 'tokyo', name: 'Tokyo', region: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { id: 'paris', name: 'Paris', region: 'Ile-de-France', country: 'France', lat: 48.8566, lon: 2.3522 },
  { id: 'sydney', name: 'Sydney', region: 'New South Wales', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { id: 'dubai', name: 'Dubai', region: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
];

export const useLocationStore = create<LocationState>((set, get) => ({
  currentLat: 51.5074,
  currentLon: -0.1278,
  recentSearches: [],
  favorites: [],
  popularLocations: POPULAR_LOCATIONS,

  setCurrentLocation: (lat, lon) => set({ currentLat: lat, currentLon: lon }),

  addRecentSearch: (location) => {
    const { recentSearches } = get();
    const filtered = recentSearches.filter(
      (s) => !(s.lat === location.lat && s.lon === location.lon)
    );
    set({ recentSearches: [location, ...filtered].slice(0, 5) });
  },

  toggleFavorite: (location) => {
    const { favorites } = get();
    const exists = favorites.find((f) => f.lat === location.lat && f.lon === location.lon);
    if (exists) {
      set({ favorites: favorites.filter((f) => !(f.lat === location.lat && f.lon === location.lon)) });
    } else {
      set({ favorites: [...favorites, { ...location, isFavorite: true }] });
    }
  },

  isFavorite: (lat, lon) => {
    return get().favorites.some((f) => f.lat === lat && f.lon === lon);
  },
}));

export { POPULAR_LOCATIONS };
