'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import type { MapLayer } from '@/types/weather';
import GlassCard from '@/components/ui/GlassCard';
import 'leaflet/dist/leaflet.css';

interface WeatherMapProps { lat: number; lon: number }

const OWM_KEY = '432f33707717c4218e70ae3c3a27e0e9';

const layers: { key: MapLayer; label: string; emoji: string; url: string }[] = [
  { key: 'clouds',        label: 'Clouds',        emoji: '☁️', url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OWM_KEY}` },
  { key: 'precipitation', label: 'Rain',           emoji: '🌧️', url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OWM_KEY}` },
  { key: 'temperature',   label: 'Temperature',   emoji: '🌡️', url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OWM_KEY}` },
  { key: 'wind',          label: 'Wind',          emoji: '💨', url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OWM_KEY}` },
];

function MapUpdater({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lon], map.getZoom()); }, [lat, lon, map]);
  return null;
}

export default function WeatherMap({ lat, lon }: WeatherMapProps) {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('clouds');
  const current = layers.find(l => l.key === activeLayer) ?? layers[0];

  return (
    <GlassCard className="p-6 overflow-hidden" hover={false}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white/90">Weather Map</h3>
          <p className="text-xs text-white/38 font-medium">Interactive live overlay</p>
        </div>

        {/* Layer tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {layers.map(l => (
            <motion.button
              key={l.key}
              onClick={() => setActiveLayer(l.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                activeLayer === l.key
                  ? 'bg-white/22 text-white ring-1 ring-white/20'
                  : 'bg-white/6 text-white/48 hover:bg-white/12 hover:text-white/72',
              ].join(' ')}
            >
              <span>{l.emoji}</span>
              <span className="hidden sm:inline">{l.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden relative z-0 shadow-xl"
        style={{ height: 'clamp(280px, 40vw, 420px)' }}>
        <MapContainer
          center={[lat, lon]} zoom={8}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false} attributionControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <TileLayer url={current.url} opacity={0.65} />
          <Marker position={[lat, lon]} />
          <MapUpdater lat={lat} lon={lon} />
        </MapContainer>

        {/* Active layer label */}
        <div className="absolute top-3 left-3 z-[999] glass-card-compact px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-sm">{current.emoji}</span>
          <span className="text-xs font-bold text-white/80">{current.label} Layer</span>
        </div>
      </div>
    </GlassCard>
  );
}
