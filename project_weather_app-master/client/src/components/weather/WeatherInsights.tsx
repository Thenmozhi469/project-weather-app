'use client';

import { motion } from 'framer-motion';
import {
  FiUmbrella, FiSun, FiWind, FiDroplet, FiThermometer,
  FiEye, FiCloud, FiCheck, FiInfo, FiAlertTriangle,
} from 'react-icons/fi';
import type { WeatherInsight as WeatherInsightType } from '@/types/weather';
import GlassCard from '@/components/ui/GlassCard';

interface WeatherInsightsProps { insights: WeatherInsightType[] }

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  umbrella:        FiUmbrella,
  sun:             FiSun,
  wind:            FiWind,
  droplet:         FiDroplet,
  droplets:        FiDroplet,
  thermometer:     FiThermometer,
  'thermometer-sun': FiThermometer,
  eye:             FiEye,
  snowflake:       FiCloud,
  tree:            FiCheck,
};

const typeConfig: Record<string, { color: string; bg: string; ring: string; badge: string }> = {
  warning:  { color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  ring: 'rgba(251,146,60,0.25)',  badge: '⚠️' },
  info:     { color: '#60a5fa', bg: 'rgba(96,165,250,0.10)',  ring: 'rgba(96,165,250,0.22)',  badge: 'ℹ️' },
  tip:      { color: '#a78bfa', bg: 'rgba(167,139,250,0.10)', ring: 'rgba(167,139,250,0.22)', badge: '💡' },
  positive: { color: '#4ade80', bg: 'rgba(74,222,128,0.10)',  ring: 'rgba(74,222,128,0.22)',  badge: '✅' },
};

export default function WeatherInsights({ insights }: WeatherInsightsProps) {
  if (!insights.length) return null;

  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white/90">Weather Insights</h3>
        <span className="badge-glass text-white/50 text-xs">{insights.length} insights</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, i) => {
          const Icon   = iconMap[insight.icon] ?? FiInfo;
          const config = typeConfig[insight.type] ?? typeConfig.info;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.38 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="glass-card-compact p-4 flex items-start gap-3 cursor-default"
              style={{ border: `1px solid ${config.ring}` }}
            >
              {/* Icon bubble */}
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-base"
                style={{ background: config.bg }}
              >
                <Icon className="text-lg" style={{ color: config.color }} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-sm font-bold text-white/90 truncate">{insight.title}</h4>
                  <span className="text-base flex-shrink-0">{config.badge}</span>
                </div>
                <p className="text-xs text-white/55 leading-relaxed">{insight.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
