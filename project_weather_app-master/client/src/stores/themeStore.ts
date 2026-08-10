import { create } from 'zustand';
import type { WeatherConditionType } from '@/types/weather';

interface ThemeState {
  currentTheme: WeatherConditionType;
  setTheme: (theme: WeatherConditionType) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: 'sunny',
  setTheme: (theme) => set({ currentTheme: theme }),
}));
