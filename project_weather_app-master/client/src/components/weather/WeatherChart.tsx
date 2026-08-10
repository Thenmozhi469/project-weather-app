'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import type { HourlyForecast } from '@/types/weather';
import { formatTime } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';

interface WeatherChartProps { hourly: HourlyForecast[] }

type ChartType = 'temperature' | 'humidity' | 'wind' | 'rain';

const tabs: { key: ChartType; label: string; emoji: string; color: string }[] = [
  { key: 'temperature', label: 'Temperature', emoji: '🌡️', color: '#f97316' },
  { key: 'humidity',    label: 'Humidity',    emoji: '💧', color: '#34d399' },
  { key: 'wind',        label: 'Wind Speed',  emoji: '💨', color: '#60a5fa' },
  { key: 'rain',        label: 'Rain %',      emoji: '🌧️', color: '#818cf8' },
];

function Tip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-compact px-4 py-3 text-sm border border-white/15 shadow-xl">
      <p className="text-white/52 text-[11px] font-semibold uppercase tracking-wider mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-bold" style={{ color: p.color ?? p.stroke }}>
          {p.name}: {p.value}
          {p.name === 'Temp' || p.name === 'Feels'
            ? '°C'
            : p.name === 'Humidity' || p.name === 'Rain'
            ? '%'
            : p.name === 'Wind'
            ? ' km/h'
            : ''}
        </p>
      ))}
    </div>
  );
}

const axisStyle = { fill: 'rgba(255,255,255,0.38)', fontSize: 11 };
const grid = <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />;

export default function WeatherChart({ hourly }: WeatherChartProps) {
  const [active, setActive] = useState<ChartType>('temperature');

  const data = hourly.slice(0, 24).map(h => ({
    time:     formatTime(h.time, 'h a'),
    temp:     Math.round(h.temp_c),
    feels:    Math.round(h.feelslike_c),
    humidity: h.humidity,
    wind:     Math.round(h.wind_kph),
    rain:     h.chance_of_rain,
  }));

  const avgTemp = Math.round(data.reduce((s, d) => s + d.temp, 0) / data.length);

  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-white/90">Weather Trends</h3>
        {active === 'temperature' && (
          <span className="text-xs text-white/40 font-medium">
            Avg {avgTemp}°C over 24 h
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
        {tabs.map(t => (
          <motion.button
            key={t.key}
            onClick={() => setActive(t.key)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className={[
              'flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all',
              active === t.key
                ? 'bg-white/22 text-white shadow-lg ring-1 ring-white/20'
                : 'bg-white/6 text-white/50 hover:bg-white/11 hover:text-white/75',
            ].join(' ')}
          >
            <span>{t.emoji}</span>
            <span>{t.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="h-64 md:h-72"
      >
        <ResponsiveContainer width="100%" height="100%">
          {active === 'temperature' ? (
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#f97316" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gFeels" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#a78bfa" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              {grid}
              <ReferenceLine y={avgTemp} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 4" />
              <XAxis dataKey="time" tick={axisStyle} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} unit="°" />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="temp"   name="Temp"   stroke="#f97316" strokeWidth={2.5} fill="url(#gTemp)" dot={false} activeDot={{ r: 5, fill: '#f97316' }} />
              <Area type="monotone" dataKey="feels"  name="Feels"  stroke="#a78bfa" strokeWidth={1.5} fill="url(#gFeels)" strokeDasharray="5 4" dot={false} />
            </AreaChart>
          ) : active === 'humidity' ? (
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gHum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#34d399" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              {grid}
              <XAxis dataKey="time" tick={axisStyle} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="humidity" name="Humidity" stroke="#34d399" strokeWidth={2.5} fill="url(#gHum)" dot={false} activeDot={{ r: 5, fill: '#34d399' }} />
            </AreaChart>
          ) : active === 'wind' ? (
            <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gWind" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%"   stopColor="#60a5fa" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              {grid}
              <XAxis dataKey="time" tick={axisStyle} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="wind" name="Wind" fill="url(#gWind)" radius={[4, 4, 0, 0]} maxBarSize={20} />
            </BarChart>
          ) : (
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gRain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#818cf8" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              {grid}
              <XAxis dataKey="time" tick={axisStyle} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="rain" name="Rain" stroke="#818cf8" strokeWidth={2.5} fill="url(#gRain)" dot={false} activeDot={{ r: 5, fill: '#818cf8' }} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
