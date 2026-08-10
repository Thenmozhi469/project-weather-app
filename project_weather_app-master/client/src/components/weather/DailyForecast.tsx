'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiWind, FiDroplet, FiSun, FiChevronDown, FiMoon } from 'react-icons/fi';
import type { DailyForecast } from '@/types/weather';
import { formatFullDay, getWeatherIconUrl } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';

interface DailyForecastProps { daily: DailyForecast[] }

export default function DailyForecast({ daily }: DailyForecastProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const allMin = Math.min(...daily.map(d => d.mintemp_c));
  const allMax = Math.max(...daily.map(d => d.maxtemp_c));
  const range  = allMax - allMin || 1;

  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white/90">7-Day Forecast</h3>
        <span className="text-xs text-white/38 font-medium">Tap a day for details</span>
      </div>

      <div className="space-y-1">
        {daily.map((day, i) => {
          const isOpen   = expanded === day.date;
          const barLeft  = ((day.mintemp_c - allMin) / range) * 100;
          const barWidth = ((day.maxtemp_c - day.mintemp_c) / range) * 100;

          return (
            <div key={day.date}>
              <motion.button
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.055 }}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.09)' }}
                onClick={() => setExpanded(isOpen ? null : day.date)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all text-left"
              >
                {/* Day name */}
                <div className="w-[72px] text-sm font-semibold text-white/80 flex-shrink-0">
                  {i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : formatFullDay(day.date)}
                </div>

                {/* Icon */}
                <Image src={getWeatherIconUrl(day.icon)} alt={day.condition}
                  width={32} height={32} className="flex-shrink-0" unoptimized />

                {/* Rain chance */}
                <div className="w-14 flex-shrink-0">
                  {day.daily_chance_of_rain > 10 && (
                    <span className="flex items-center gap-1 text-xs text-blue-300 font-semibold">
                      <FiDroplet className="text-[10px]" />{day.daily_chance_of_rain}%
                    </span>
                  )}
                </div>

                {/* Temp bar */}
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs text-white/45 w-8 text-right tabular-nums">
                    {Math.round(day.mintemp_c)}°
                  </span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/8 relative">
                    <motion.div
                      className="absolute h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(barWidth, 8)}%`, left: `${barLeft}%` }}
                      transition={{ duration: 0.7, delay: i * 0.06, ease: 'easeOut' }}
                      style={{ background: 'linear-gradient(90deg, #60a5fa, #f97316)' }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white w-8 tabular-nums">
                    {Math.round(day.maxtemp_c)}°
                  </span>
                </div>

                {/* Expand chevron */}
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22 }}>
                  <FiChevronDown className="text-white/28 text-sm" />
                </motion.div>
              </motion.button>

              {/* Expanded details */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 pt-1">
                      <div className="glass-card-compact p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Condition</p>
                          <p className="text-xs font-semibold text-white/80">{day.condition}</p>
                        </div>
                        <div className="text-center">
                          <FiWind className="mx-auto text-blue-300 mb-1 text-base" />
                          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Max Wind</p>
                          <p className="text-xs font-semibold text-white/80">{Math.round(day.maxwind_kph)} km/h</p>
                        </div>
                        <div className="text-center">
                          <FiDroplet className="mx-auto text-cyan-300 mb-1 text-base" />
                          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Humidity</p>
                          <p className="text-xs font-semibold text-white/80">{day.avghumidity}%</p>
                        </div>
                        <div className="text-center">
                          <FiSun className="mx-auto text-amber-300 mb-1 text-base" />
                          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">UV Index</p>
                          <p className="text-xs font-semibold text-white/80">{day.uv}</p>
                        </div>
                        <div className="text-center col-span-2">
                          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">🌅 Sunrise / 🌇 Sunset</p>
                          <p className="text-xs font-semibold text-white/80">{day.sunrise} &nbsp;/&nbsp; {day.sunset}</p>
                        </div>
                        <div className="text-center col-span-2">
                          <FiMoon className="mx-auto text-indigo-300 mb-1 text-base" />
                          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Moon Phase</p>
                          <p className="text-xs font-semibold text-white/80">{day.moon_phase}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
