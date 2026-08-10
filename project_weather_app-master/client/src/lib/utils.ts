import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(dateStr: string, fmt: string = 'h:mm a'): string {
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

export function formatDate(dateStr: string, fmt: string = 'EEEE, MMMM d'): string {
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

export function formatDay(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'EEE');
  } catch {
    return dateStr;
  }
}

export function formatFullDay(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'EEEE');
  } catch {
    return dateStr;
  }
}

export function getWeatherIconUrl(icon: string): string {
  if (icon.startsWith('//')) return `https:${icon}`;
  if (icon.startsWith('http')) return icon;
  return `https:${icon}`;
}

export function tempGradientClass(temp: number): string {
  if (temp >= 25) return 'temp-gradient-warm';
  if (temp >= 10) return 'temp-gradient-cool';
  return 'temp-gradient-cold';
}

export function getWindDirection(degrees: string): string {
  const directions: Record<string, string> = {
    N: 'North', NNE: 'North-Northeast', NE: 'Northeast', ENE: 'East-Northeast',
    E: 'East', ESE: 'East-Southeast', SE: 'Southeast', SSE: 'South-Southeast',
    S: 'South', SSW: 'South-Southwest', SW: 'Southwest', WSW: 'West-Southwest',
    W: 'West', WNW: 'West-Northwest', NW: 'Northwest', NNW: 'North-Northwest',
  };
  return directions[degrees] || degrees;
}

export function getUVLevel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: 'Low', color: '#4ade80' };
  if (uv <= 5) return { label: 'Moderate', color: '#facc15' };
  if (uv <= 7) return { label: 'High', color: '#fb923c' };
  if (uv <= 10) return { label: 'Very High', color: '#ef4444' };
  return { label: 'Extreme', color: '#a855f7' };
}

export function getAQILevel(aqi: number): { label: string; color: string; bgColor: string } {
  if (aqi <= 1) return { label: 'Good', color: '#4ade80', bgColor: 'rgba(74, 222, 128, 0.15)' };
  if (aqi <= 2) return { label: 'Moderate', color: '#facc15', bgColor: 'rgba(250, 204, 21, 0.15)' };
  if (aqi <= 3) return { label: 'Unhealthy for Sensitive', color: '#fb923c', bgColor: 'rgba(251, 146, 60, 0.15)' };
  if (aqi <= 4) return { label: 'Unhealthy', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)' };
  if (aqi <= 5) return { label: 'Very Unhealthy', color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.15)' };
  return { label: 'Hazardous', color: '#991b1b', bgColor: 'rgba(153, 27, 27, 0.15)' };
}
