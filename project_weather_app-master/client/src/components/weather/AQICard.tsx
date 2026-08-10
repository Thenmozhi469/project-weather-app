'use client';

import { motion } from 'framer-motion';
import type { AirQuality } from '@/types/weather';
import { getAQILevel } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';

interface AQICardProps { airQuality: AirQuality | null }

const pollutants = [
  { key: 'pm2_5', label: 'PM2.5',   unit: 'μg/m³', maxSafe: 12,   emoji: '🔴' },
  { key: 'pm10',  label: 'PM10',    unit: 'μg/m³', maxSafe: 54,   emoji: '🟠' },
  { key: 'o3',    label: 'O₃',      unit: 'μg/m³', maxSafe: 100,  emoji: '🟡' },
  { key: 'co',    label: 'CO',      unit: 'μg/m³', maxSafe: 4400, emoji: '⚫' },
  { key: 'no2',   label: 'NO₂',     unit: 'μg/m³', maxSafe: 53,   emoji: '🟣' },
  { key: 'so2',   label: 'SO₂',     unit: 'μg/m³', maxSafe: 35,   emoji: '🟤' },
];

const healthMessages: Record<number, string> = {
  1: '😊 Air quality is great — perfect for outdoor activities!',
  2: '🙂 Air quality is acceptable. Sensitive individuals should monitor conditions.',
  3: '😐 Unhealthy for sensitive groups. Limit prolonged outdoor exertion.',
  4: '😷 Unhealthy air quality. Everyone should limit outdoor activities.',
  5: '⚠️ Very unhealthy — avoid outdoor exertion. Stay indoors.',
  6: '🚨 Hazardous! Avoid all outdoor activities and wear a mask if outside.',
};

export default function AQICard({ airQuality }: AQICardProps) {
  if (!airQuality) return null;

  const aqiInfo   = getAQILevel(airQuality.us_epa_index);
  const circumference = 2 * Math.PI * 52;
  const dashOffset    = circumference - (Math.min(airQuality.us_epa_index / 6, 1)) * circumference;

  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-white/90">Air Quality Index</h3>
        <span className="badge-glass text-xs font-bold" style={{ color: aqiInfo.color, borderColor: `${aqiInfo.color}40` }}>
          {aqiInfo.label}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">

        {/* ── Circular gauge ── */}
        <div className="flex-shrink-0 relative">
          <svg width="136" height="136" className="-rotate-90">
            <circle cx="68" cy="68" r="52" stroke="rgba(255,255,255,0.07)" strokeWidth="10" fill="none" />
            <motion.circle
              cx="68" cy="68" r="52"
              stroke={aqiInfo.color}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 8px ${aqiInfo.color}60)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-4xl font-extrabold tabular-nums"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{ color: aqiInfo.color }}
            >
              {airQuality.us_epa_index}
            </motion.span>
            <span className="text-[10px] text-white/45 uppercase tracking-widest mt-0.5 font-semibold">EPA AQI</span>
          </div>
        </div>

        {/* ── Pollutant grid ── */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
          {pollutants.map((p, i) => {
            const value = (airQuality as any)[p.key] ?? 0;
            const pct   = Math.min((value / p.maxSafe) * 100, 100);
            const isHigh = value > p.maxSafe;
            const barColor = isHigh ? '#ef4444' : aqiInfo.color;

            return (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ scale: 1.04 }}
                className="glass-card-compact p-3"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-sm">{p.emoji}</span>
                  <span className="text-xs text-white/52 font-semibold">{p.label}</span>
                </div>
                <div className={`text-xl font-extrabold tabular-nums mb-0.5 ${isHigh ? 'text-red-400' : 'text-white/90'}`}>
                  {Math.round(value)}
                </div>
                <div className="text-[9px] text-white/35 mb-2 uppercase tracking-wider">{p.unit}</div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.09, ease: 'easeOut' }}
                    style={{ background: `linear-gradient(90deg, ${barColor}99, ${barColor})` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Health message ── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-5 px-4 py-3 rounded-2xl text-sm font-medium"
        style={{ background: `${aqiInfo.color}18`, color: aqiInfo.color, border: `1px solid ${aqiInfo.color}30` }}
      >
        {healthMessages[airQuality.us_epa_index] ?? healthMessages[6]}
      </motion.div>
    </GlassCard>
  );
}
