import type { WeatherConditionType, ThemePalette } from '@/types/weather';

export const themePalettes: Record<WeatherConditionType, ThemePalette> = {
  sunny: {
    name: 'sunny',
    bgGradient: 'linear-gradient(145deg, #7c3001 0%, #c2410c 20%, #ea580c 45%, #f97316 70%, #fbbf24 100%)',
    primary: '#f97316', secondary: '#fbbf24', accent: '#fde68a',
    text: '#ffffff', textMuted: 'rgba(255,255,255,0.72)',
    cardBg: 'rgba(255,255,255,0.12)', cardBorder: 'rgba(255,255,255,0.22)',
  },
  cloudy: {
    name: 'cloudy',
    bgGradient: 'linear-gradient(145deg, #1e293b 0%, #334155 35%, #475569 65%, #64748b 100%)',
    primary: '#64748b', secondary: '#94a3b8', accent: '#cbd5e1',
    text: '#ffffff', textMuted: 'rgba(255,255,255,0.68)',
    cardBg: 'rgba(255,255,255,0.09)', cardBorder: 'rgba(255,255,255,0.16)',
  },
  rain: {
    name: 'rain',
    bgGradient: 'linear-gradient(145deg, #0c1445 0%, #1e3a8a 30%, #1d4ed8 60%, #3b82f6 100%)',
    primary: '#1d4ed8', secondary: '#3b82f6', accent: '#93c5fd',
    text: '#ffffff', textMuted: 'rgba(255,255,255,0.70)',
    cardBg: 'rgba(255,255,255,0.09)', cardBorder: 'rgba(255,255,255,0.16)',
  },
  snow: {
    name: 'snow',
    bgGradient: 'linear-gradient(145deg, #0e2139 0%, #164e63 30%, #0891b2 60%, #67e8f9 100%)',
    primary: '#0891b2', secondary: '#67e8f9', accent: '#cffafe',
    text: '#ffffff', textMuted: 'rgba(255,255,255,0.78)',
    cardBg: 'rgba(255,255,255,0.14)', cardBorder: 'rgba(255,255,255,0.26)',
  },
  thunderstorm: {
    name: 'thunderstorm',
    bgGradient: 'linear-gradient(145deg, #0d0a1f 0%, #1e1b4b 25%, #312e81 50%, #4c1d95 75%, #6d28d9 100%)',
    primary: '#4c1d95', secondary: '#7c3aed', accent: '#a78bfa',
    text: '#ffffff', textMuted: 'rgba(255,255,255,0.62)',
    cardBg: 'rgba(255,255,255,0.07)', cardBorder: 'rgba(255,255,255,0.13)',
  },
  fog: {
    name: 'fog',
    bgGradient: 'linear-gradient(145deg, #1f2937 0%, #374151 35%, #4b5563 65%, #6b7280 100%)',
    primary: '#6b7280', secondary: '#9ca3af', accent: '#d1d5db',
    text: '#ffffff', textMuted: 'rgba(255,255,255,0.62)',
    cardBg: 'rgba(255,255,255,0.08)', cardBorder: 'rgba(255,255,255,0.14)',
  },
  night: {
    name: 'night',
    bgGradient: 'linear-gradient(145deg, #020617 0%, #0f172a 30%, #1e1b4b 60%, #0c4a6e 100%)',
    primary: '#1e1b4b', secondary: '#312e81', accent: '#818cf8',
    text: '#ffffff', textMuted: 'rgba(255,255,255,0.58)',
    cardBg: 'rgba(255,255,255,0.05)', cardBorder: 'rgba(255,255,255,0.10)',
  },
};

export function getWeatherThemeFromCode(code: number, isDay: number): WeatherConditionType {
  if (!isDay) return 'night';
  if (code === 1000) return 'sunny';
  if ([1003, 1006, 1009].includes(code)) return 'cloudy';
  if ([1030, 1135, 1147].includes(code)) return 'fog';
  if (code === 1087 || (code >= 1273 && code <= 1282)) return 'thunderstorm';
  if (code === 1066 || (code >= 1069 && code <= 1072) || (code >= 1114 && code <= 1225) || (code >= 1255 && code <= 1264)) return 'snow';
  if (code === 1063 || (code >= 1150 && code <= 1282)) return 'rain';
  return 'sunny';
}
