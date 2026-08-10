'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import { FiMapPin, FiWind, FiDroplet, FiSun, FiEye, FiThermometer, FiClock } from 'react-icons/fi';
import { WiBarometer } from 'react-icons/wi';
import type { CurrentWeather, DailyForecast, Location } from '@/types/weather';
import { formatDate, getWeatherIconUrl, getUVLevel, tempGradientClass } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';

interface WeatherHeroProps {
  current: CurrentWeather;
  location: Location;
  today: DailyForecast;
}

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } as any },
};
const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } as any },
};

export default function WeatherHero({ current, location, today }: WeatherHeroProps) {
  const uvInfo = getUVLevel(current.uv);

  let localTimeStr = '';
  try {
    localTimeStr = new Date(location.localtime).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch {
    localTimeStr = location.localtime?.split(' ')[1] ?? '';
  }

  const stats = [
    { icon: FiWind,        label: 'Wind',       value: `${Math.round(current.wind_kph)} km/h`, color: '#60a5fa' },
    { icon: FiDroplet,     label: 'Humidity',   value: `${current.humidity}%`,                 color: '#34d399' },
    { icon: FiSun,         label: 'UV Index',   value: `${current.uv} — ${uvInfo.label}`,      color: uvInfo.color },
    { icon: FiEye,         label: 'Visibility', value: `${current.vis_km} km`,                 color: '#a78bfa' },
    { icon: FiThermometer, label: 'Feels Like', value: `${Math.round(current.feelslike_c)}°C`, color: '#fb923c' },
    { icon: WiBarometer,   label: 'Pressure',   value: `${current.pressure_mb} mb`,            color: '#f472b6' },
  ];

  return (
    <GlassCard variant="elevated" className="p-0 overflow-hidden" hover={false}>
      {/* top shimmer accent */}
      <div className="h-[3px] w-full"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)' }}
      />

      <motion.div variants={container} initial="hidden" animate="visible" className="p-6 md:p-10">

        {/* ── Row 1: location + local time ── */}
        <motion.div variants={item} className="flex items-start justify-between flex-wrap gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <FiMapPin className="text-white/50 text-sm" />
              <span className="text-base font-semibold text-white/90">
                {location.name}{location.region ? `, ${location.region}` : ''}
              </span>
              <span className="text-white/40 text-sm hidden sm:inline">{location.country}</span>
            </div>
            <p className="text-sm text-white/45 pl-[22px]">
              {formatDate(location.localtime, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          {localTimeStr && (
            <div className="glass-card-compact flex items-center gap-2 px-4 py-2">
              <FiClock className="text-white/50 text-sm" />
              <span className="text-sm font-semibold text-white/80 tabular-nums">{localTimeStr}</span>
            </div>
          )}
        </motion.div>

        {/* ── Row 2: icon + temp + sunrise/sunset ── */}
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 mb-8">

          {/* Animated weather icon */}
          <motion.div variants={item} className="flex-shrink-0 relative">
            <motion.div
              className="absolute inset-0 rounded-full blur-3xl"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)' }}
            />
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 1.5, -1.5, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative drop-shadow-2xl"
            >
              <Image
                src={getWeatherIconUrl(current.icon)}
                alt={current.condition}
                width={160} height={160}
                unoptimized priority
              />
            </motion.div>
          </motion.div>

          {/* Temperature block */}
          <motion.div variants={item} className="flex-1 text-center lg:text-left">
            <div className="flex items-start justify-center lg:justify-start gap-1 mb-2">
              <span className={`font-extralight leading-none tracking-tighter ${tempGradientClass(current.temp_c)}`}
                style={{ fontSize: 'clamp(72px,10vw,100px)' }}>
                {Math.round(current.temp_c)}
              </span>
              <span className="text-3xl font-light text-white/50 mt-3">°C</span>
            </div>

            <p className="text-xl font-semibold text-white/90 mb-4">{current.condition}</p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              <span className="badge-glass text-white/70">
                <FiThermometer className="text-orange-400" />
                Feels {Math.round(current.feelslike_c)}°C
              </span>
              {current.cloud > 40 && (
                <span className="badge-glass text-white/60">☁️ {current.cloud}% cloud</span>
              )}
              {current.precip_mm > 0 && (
                <span className="badge-glass text-blue-300">🌧️ {current.precip_mm}mm</span>
              )}
              <span className="badge-glass" style={{ color: uvInfo.color }}>
                🔆 UV {uvInfo.label}
              </span>
            </div>
          </motion.div>

          {/* Sunrise / Sunset */}
          {today && (
            <motion.div variants={item} className="flex lg:flex-col gap-3">
              <div className="glass-card-compact p-4 text-center min-w-[106px]">
                <div className="text-xl mb-1">🌅</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1 font-semibold">Sunrise</div>
                <div className="text-sm font-bold text-amber-300 tabular-nums">{today.sunrise}</div>
              </div>
              <div className="glass-card-compact p-4 text-center min-w-[106px]">
                <div className="text-xl mb-1">🌇</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1 font-semibold">Sunset</div>
                <div className="text-sm font-bold text-orange-400 tabular-nums">{today.sunset}</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Row 3: stats grid ── */}
        <motion.div variants={item}>
          <div className="divider mb-5" />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                whileHover={{ scale: 1.06, y: -2 }}
                className="glass-card-compact p-3 text-center cursor-default"
              >
                <s.icon className="mx-auto mb-1.5 text-lg" style={{ color: s.color }} />
                <div className="text-xs font-bold text-white/85 mb-0.5 leading-snug">{s.value}</div>
                <div className="text-[9px] text-white/38 uppercase tracking-widest font-semibold">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </GlassCard>
  );
}
