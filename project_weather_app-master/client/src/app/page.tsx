'use client';

import { useQuery } from '@tanstack/react-query';
import { motion, type Variants } from 'framer-motion';
import { useCallback } from 'react';
import { fetchWeatherData } from '@/lib/api';
import { generateInsights } from '@/lib/weatherHelpers';
import { useLocationStore } from '@/stores/locationStore';

import ThemeProvider    from '@/components/theme/ThemeProvider';
import AnimatedBackground from '@/components/background/AnimatedBackground';
import SearchPanel      from '@/components/search/SearchPanel';
import WeatherHero      from '@/components/weather/WeatherHero';
import WeatherTimeline  from '@/components/weather/WeatherTimeline';
import WeatherChart     from '@/components/weather/WeatherChart';
import DailyForecast    from '@/components/weather/DailyForecast';
import AQICard          from '@/components/weather/AQICard';
import WeatherInsights  from '@/components/weather/WeatherInsights';
import dynamic          from 'next/dynamic';

import {
  HeroSkeleton, TimelineSkeleton, ChartSkeleton,
  DailySkeleton, AQISkeleton, InsightsSkeleton,
} from '@/components/ui/LoadingSkeleton';

const WeatherMap = dynamic(() => import('@/components/weather/WeatherMap'), {
  ssr: false,
  loading: () => (
    <div className="glass-card p-6">
      <div className="skeleton h-[350px] rounded-2xl" />
    </div>
  ),
});

const section: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: 'easeOut' as const },
  }),
};

export default function Dashboard() {
  const { currentLat, currentLon, setCurrentLocation } = useLocationStore();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['weather', currentLat, currentLon],
    queryFn:  () => fetchWeatherData(currentLat, currentLon),
    refetchInterval: 5 * 60 * 1000,
  });

  const handleLocationSelect = useCallback(
    (lat: number, lon: number, _name: string) => setCurrentLocation(lat, lon),
    [setCurrentLocation],
  );

  const insights = data ? generateInsights(data.current, data.hourly, data.daily) : [];
  const loaded   = !isLoading && !!data;

  return (
    <ThemeProvider conditionCode={data?.current.condition_code} isDay={data?.current.is_day}>
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen">

        {/* ── Sticky header ── */}
        <header className="sticky top-0 z-50 py-3 px-4 md:px-8">
          <div className="glass-card-elevated !rounded-full flex items-center gap-4 max-w-4xl mx-auto"
            style={{ padding: '10px 18px', borderRadius: 9999 }}>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 mr-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-base"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                🌤️
              </div>
              <span className="text-sm font-bold text-white/80 hidden sm:block tracking-tight">WeatherOS</span>
            </div>

            {/* Search */}
            <div className="flex-1">
              <SearchPanel onLocationSelect={handleLocationSelect} />
            </div>

            {/* Live indicator */}
            {loaded && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex-shrink-0 hidden sm:flex items-center gap-1.5 text-[11px] text-white/45 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </motion.div>
            )}
          </div>
        </header>

        {/* ── Error state ── */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto px-4 mt-8">
            <div className="glass-card p-10 text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-lg font-semibold text-white/85 mb-2">Failed to load weather data</p>
              <p className="text-sm text-white/45 mb-6">{(error as Error)?.message ?? 'Unknown error'}</p>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => refetch()}
                className="px-6 py-2.5 rounded-full font-semibold text-sm text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                Try Again
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── Main content ── */}
        <main className="max-w-4xl mx-auto px-4 md:px-8 pb-20 space-y-5 mt-4">

          {/* Hero */}
          <motion.section custom={0} variants={section} initial="hidden" animate={isLoading ? 'hidden' : 'visible'}>
            {isLoading || !data ? <HeroSkeleton /> : (
              <WeatherHero current={data.current} location={data.location} today={data.daily[0]} />
            )}
          </motion.section>

          {/* Hourly Timeline */}
          <motion.section custom={1} variants={section} initial="hidden" animate={isLoading ? 'hidden' : 'visible'}>
            {isLoading || !data ? <TimelineSkeleton /> : <WeatherTimeline hourly={data.hourly} />}
          </motion.section>

          {/* Charts */}
          <motion.section custom={2} variants={section} initial="hidden" animate={isLoading ? 'hidden' : 'visible'}>
            {isLoading || !data ? <ChartSkeleton /> : <WeatherChart hourly={data.hourly} />}
          </motion.section>

          {/* Daily */}
          <motion.section custom={3} variants={section} initial="hidden" animate={isLoading ? 'hidden' : 'visible'}>
            {isLoading || !data ? <DailySkeleton /> : <DailyForecast daily={data.daily} />}
          </motion.section>

          {/* AQI */}
          {(isLoading || data?.airQuality) && (
            <motion.section custom={4} variants={section} initial="hidden" animate={isLoading ? 'hidden' : 'visible'}>
              {isLoading || !data ? <AQISkeleton /> : <AQICard airQuality={data.airQuality} />}
            </motion.section>
          )}

          {/* Insights */}
          {(isLoading || insights.length > 0) && (
            <motion.section custom={5} variants={section} initial="hidden" animate={isLoading ? 'hidden' : 'visible'}>
              {isLoading || !data ? <InsightsSkeleton /> : <WeatherInsights insights={insights} />}
            </motion.section>
          )}

          {/* Map */}
          {loaded && (
            <motion.section custom={6} variants={section} initial="hidden" animate="visible">
              <WeatherMap lat={data.location.lat} lon={data.location.lon} />
            </motion.section>
          )}

        </main>

        {/* ── Footer ── */}
        {loaded && (
          <footer className="pb-6 text-center">
            <p className="text-xs text-white/20 font-medium">
              Last updated {data.current.last_updated} · Powered by WeatherAPI
            </p>
          </footer>
        )}
      </div>
    </ThemeProvider>
  );
}
