'use client';

import { motion } from 'framer-motion';

const pulse = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

function Skel({ className }: { className?: string }) {
  return <div className={`skeleton ${className ?? ''}`} />;
}

export function HeroSkeleton() {
  return (
    <motion.div variants={pulse} initial="hidden" animate="visible" className="glass-card p-6 md:p-10">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <Skel className="w-40 h-40 rounded-full flex-shrink-0" />
        <div className="flex-1 w-full space-y-4">
          <Skel className="h-4 w-52" />
          <Skel className="h-24 w-44" />
          <Skel className="h-5 w-64" />
          <div className="flex gap-2 pt-1">
            {[80,72,80,72].map((w,i) => <Skel key={i} className={`h-7 rounded-full w-[${w}px]`} />)}
          </div>
        </div>
      </div>
      <div className="mt-6 pt-5 border-t border-white/8 grid grid-cols-3 md:grid-cols-6 gap-2">
        {Array.from({length:6}).map((_,i) => <Skel key={i} className="h-16 rounded-2xl" />)}
      </div>
    </motion.div>
  );
}

export function TimelineSkeleton() {
  return (
    <motion.div variants={pulse} initial="hidden" animate="visible" className="glass-card p-6">
      <div className="flex justify-between mb-4">
        <Skel className="h-5 w-40" />
        <Skel className="h-4 w-28" />
      </div>
      <Skel className="h-9 w-full rounded-xl mb-3" />
      <div className="flex gap-2">
        {Array.from({length:8}).map((_,i) => (
          <div key={i} className="flex-shrink-0 w-[74px] space-y-2">
            <Skel className="h-4 w-12 mx-auto" />
            <Skel className="h-9 w-9 rounded-full mx-auto" />
            <Skel className="h-5 w-10 mx-auto" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function ChartSkeleton() {
  return (
    <motion.div variants={pulse} initial="hidden" animate="visible" className="glass-card p-6">
      <div className="flex justify-between mb-5">
        <Skel className="h-5 w-44" />
        <Skel className="h-4 w-24" />
      </div>
      <div className="flex gap-2 mb-6">
        {Array.from({length:4}).map((_,i) => <Skel key={i} className="h-9 w-28 rounded-full" />)}
      </div>
      <Skel className="h-64 w-full rounded-2xl" />
    </motion.div>
  );
}

export function DailySkeleton() {
  return (
    <motion.div variants={pulse} initial="hidden" animate="visible" className="glass-card p-6">
      <Skel className="h-5 w-36 mb-5" />
      <div className="space-y-2">
        {Array.from({length:7}).map((_,i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3">
            <Skel className="h-4 w-20" />
            <Skel className="h-8 w-8 rounded-full" />
            <Skel className="h-3 w-12" />
            <Skel className="flex-1 h-2 rounded-full" />
            <Skel className="h-4 w-10" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function AQISkeleton() {
  return (
    <motion.div variants={pulse} initial="hidden" animate="visible" className="glass-card p-6">
      <Skel className="h-5 w-44 mb-6" />
      <div className="flex flex-col md:flex-row gap-8">
        <Skel className="w-[136px] h-[136px] rounded-full mx-auto flex-shrink-0" />
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({length:6}).map((_,i) => <Skel key={i} className="h-20 rounded-2xl" />)}
        </div>
      </div>
    </motion.div>
  );
}

export function InsightsSkeleton() {
  return (
    <motion.div variants={pulse} initial="hidden" animate="visible" className="glass-card p-6">
      <Skel className="h-5 w-40 mb-5" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({length:4}).map((_,i) => (
          <div key={i} className="glass-card-compact p-4 flex gap-3">
            <Skel className="w-10 h-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skel className="h-4 w-32" />
              <Skel className="h-3 w-48" />
              <Skel className="h-3 w-36" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
