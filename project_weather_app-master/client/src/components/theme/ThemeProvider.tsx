'use client';

import { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/stores/themeStore';
import { getWeatherThemeFromCode, themePalettes } from '@/lib/themeConfig';

interface ThemeProviderProps {
  conditionCode?: number;
  isDay?: number;
  children: React.ReactNode;
}

export default function ThemeProvider({ conditionCode = 1000, isDay = 1, children }: ThemeProviderProps) {
  const { setTheme, currentTheme } = useThemeStore();
  const themeName = useMemo(
    () => getWeatherThemeFromCode(conditionCode, isDay),
    [conditionCode, isDay],
  );

  useEffect(() => { setTheme(themeName); }, [themeName, setTheme]);

  const palette = themePalettes[themeName];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={themeName}
        className="min-h-screen theme-transition"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        style={{
          background: palette.bgGradient,
          color: palette.text,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
