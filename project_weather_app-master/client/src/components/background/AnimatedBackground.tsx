'use client';

import { useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/stores/themeStore';

/* ── Rain ─────────────────────────────────────────────────── */
function RainParticles() {
  const drops = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 110 - 5,
      height: 16 + Math.random() * 30,
      delay: Math.random() * 1.5,
      duration: 0.5 + Math.random() * 0.5,
      opacity: 0.25 + Math.random() * 0.45,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map(d => (
        <div
          key={d.id}
          className="rain-drop"
          style={{
            left: `${d.left}%`,
            height: `${d.height}px`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ── Snow ─────────────────────────────────────────────────── */
function SnowParticles() {
  const flakes = useMemo(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      left: Math.random() * 110 - 5,
      size: 3 + Math.random() * 7,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 5,
      opacity: 0.4 + Math.random() * 0.5,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map(f => (
        <div
          key={f.id}
          className="snow-flake"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            opacity: f.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ── Stars + Moon ─────────────────────────────────────────── */
function Stars() {
  const stars = useMemo(() =>
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 80,
      size: 0.8 + Math.random() * 2.2,
      delay: Math.random() * 6,
      duration: 2 + Math.random() * 4,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      {/* Moon */}
      <motion.div
        className="absolute top-10 right-20 w-20 h-20 rounded-full"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        style={{
          background: 'radial-gradient(circle at 35% 35%, #fef3c7, #fcd34d)',
          boxShadow: '0 0 60px rgba(252,211,77,0.18), 0 0 120px rgba(252,211,77,0.08)',
        }}
      />
    </div>
  );
}

/* ── Sun Glow ─────────────────────────────────────────────── */
function SunGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
        animate={{ scale: [1, 1.08, 1], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(circle, rgba(255,200,50,0.4) 0%, transparent 70%)' }}
      />
      <motion.div
        className="absolute top-8 right-8 w-48 h-48 rounded-full"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(255,220,100,0.3) 0%, transparent 70%)',
          boxShadow: '0 0 80px rgba(255,200,50,0.2)',
        }}
      />
      {/* Sun rays */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute top-16 right-16 origin-center"
          style={{
            width: 2,
            height: 60 + i * 8,
            background: 'linear-gradient(transparent, rgba(255,210,60,0.15), transparent)',
            transform: `rotate(${i * 45}deg) translateY(-50%)`,
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ── Clouds ───────────────────────────────────────────────── */
function Clouds() {
  const clouds = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      top: 5 + Math.random() * 55,
      width: 180 + Math.random() * 320,
      height: 50 + Math.random() * 90,
      delay: Math.random() * 25,
      duration: 30 + Math.random() * 30,
      opacity: 0.04 + Math.random() * 0.09,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map(c => (
        <div
          key={c.id}
          className="cloud-layer"
          style={{
            top: `${c.top}%`,
            width: `${c.width}px`,
            height: `${c.height}px`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            opacity: c.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ── Thunderstorm ─────────────────────────────────────────── */
function Thunderstorm() {
  const lightningRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const flash = () => {
      if (!lightningRef.current) return;
      lightningRef.current.style.opacity = '1';
      setTimeout(() => {
        if (lightningRef.current) lightningRef.current.style.opacity = '0';
      }, 120);
      setTimeout(() => {
        if (lightningRef.current) lightningRef.current.style.opacity = '0.7';
        setTimeout(() => {
          if (lightningRef.current) lightningRef.current.style.opacity = '0';
        }, 60);
      }, 180);
      setTimeout(flash, 3000 + Math.random() * 5000);
    };
    const t = setTimeout(flash, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <RainParticles />
      {/* Lightning bolt SVG */}
      <div
        ref={lightningRef}
        className="absolute inset-0 transition-opacity duration-75"
        style={{ opacity: 0 }}
      >
        <svg className="absolute top-0 left-1/2 -translate-x-1/2" width="80" height="240" viewBox="0 0 80 240">
          <polyline
            points="45,0 20,100 40,100 15,240"
            fill="none"
            stroke="rgba(253,224,71,0.95)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="45,0 20,100 40,100 15,240"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(100,80,200,0.06)' }}
        />
      </div>
    </div>
  );
}

/* ── Fog ──────────────────────────────────────────────────── */
function FogLayers() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute inset-x-0"
          style={{
            top: `${20 + i * 20}%`,
            height: '18%',
            background: 'linear-gradient(transparent, rgba(200,210,220,0.06), transparent)',
          }}
          animate={{ x: ['-10%', '10%', '-10%'] }}
          transition={{ duration: 20 + i * 8, repeat: Infinity, ease: 'easeInOut', delay: i * 3 }}
        />
      ))}
    </div>
  );
}

/* ── Ambient orbs (all themes) ────────────────────────────── */
function AmbientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.07]"
        animate={{ scale: [1, 1.15, 1], rotate: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 70%)' }}
      />
      <motion.div
        className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-[0.05]"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 70%)' }}
      />
    </div>
  );
}

export default function AnimatedBackground() {
  const { currentTheme } = useThemeStore();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <AmbientOrbs />
      {currentTheme === 'sunny'       && <SunGlow />}
      {currentTheme === 'rain'        && <RainParticles />}
      {currentTheme === 'snow'        && <SnowParticles />}
      {currentTheme === 'night'       && <Stars />}
      {currentTheme === 'thunderstorm'&& <Thunderstorm />}
      {currentTheme === 'cloudy'      && <Clouds />}
      {currentTheme === 'fog'         && <FogLayers />}
    </div>
  );
}
