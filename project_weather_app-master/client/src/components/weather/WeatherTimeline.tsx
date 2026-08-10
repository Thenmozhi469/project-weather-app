'use client';

import { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiDroplet, FiWind } from 'react-icons/fi';
import type { HourlyForecast } from '@/types/weather';
import { formatTime, getWeatherIconUrl } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';

interface WeatherTimelineProps {
  hourly: HourlyForecast[];
}

export default function WeatherTimeline({ hourly }: WeatherTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5;
  };
  const onMouseUp = () => { isDragging.current = false; };

  const displayHours = hourly.slice(0, 24);
  const temps = displayHours.map(h => h.temp_c);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = maxTemp - minTemp || 1;

  // Build SVG sparkline
  const { linePath, fillPath } = useMemo(() => {
    const W = 100, H = 36, n = displayHours.length;
    const pts = displayHours.map((h, i) => {
      const x = (i / (n - 1)) * W;
      const y = H - ((h.temp_c - minTemp) / range) * (H - 8) - 4;
      return [x, y] as [number, number];
    });
    const line = `M ${pts.map(([x, y]) => `${x},${y}`).join(' L ')}`;
    const fill = `${line} L ${W},${H} L 0,${H} Z`;
    return { linePath: line, fillPath: fill };
  }, [displayHours, minTemp, range]);

  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white/90">Hourly Forecast</h3>
        <span className="text-xs text-white/38 font-medium tracking-wide">Next 24 h · drag to scroll</span>
      </div>

      {/* Temperature sparkline */}
      <div className="px-1 mb-3">
        <svg viewBox="0 0 100 36" preserveAspectRatio="none" className="w-full h-9">
          <defs>
            <linearGradient id="sparkLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#60a5fa" />
              <stop offset="50%"  stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#a78bfa" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path d={fillPath} fill="url(#sparkFill)"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
          <motion.path d={linePath} fill="none" stroke="url(#sparkLine)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, ease: 'easeOut' }} />
        </svg>
      </div>

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing select-none pb-1"
        onMouseDown={onMouseDown} onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}   onMouseLeave={onMouseUp}
      >
        {displayHours.map((hour, i) => {
          const isNow = i === 0;
          const heatPct = ((hour.temp_c - minTemp) / range) * 100;
          const barColor = hour.temp_c > 24 ? '#fb923c' : hour.temp_c > 12 ? '#a78bfa' : '#60a5fa';

          return (
            <motion.div
              key={hour.time_epoch}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.022, duration: 0.32 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className={[
                'flex-shrink-0 w-[74px] rounded-2xl p-3 text-center relative overflow-hidden transition-colors',
                isNow
                  ? 'bg-white/16 ring-1 ring-white/24 shadow-lg'
                  : 'bg-white/5 hover:bg-white/10',
              ].join(' ')}
            >
              {/* Bottom temp bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5">
                <div className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(heatPct, 10)}%`,
                    background: barColor,
                    marginLeft: `${(100 - Math.max(heatPct, 10)) / 2}%`,
                  }}
                />
              </div>

              <div className={`text-[11px] font-semibold mb-2 ${isNow ? 'text-white' : 'text-white/48'}`}>
                {isNow ? 'Now' : formatTime(hour.time, 'h a')}
              </div>

              <Image src={getWeatherIconUrl(hour.icon)} alt={hour.condition}
                width={34} height={34} className="mx-auto mb-2" unoptimized />

              <div className={`text-sm font-bold mb-1.5 ${isNow ? 'text-white' : 'text-white/82'}`}>
                {Math.round(hour.temp_c)}°
              </div>

              {hour.chance_of_rain > 10 && (
                <div className="flex items-center justify-center gap-0.5 mb-0.5">
                  <FiDroplet className="text-blue-300 text-[9px]" />
                  <span className="text-[9px] text-blue-300 font-semibold">{hour.chance_of_rain}%</span>
                </div>
              )}
              {hour.wind_kph > 18 && (
                <div className="flex items-center justify-center gap-0.5">
                  <FiWind className="text-white/32 text-[9px]" />
                  <span className="text-[9px] text-white/32">{Math.round(hour.wind_kph)}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
