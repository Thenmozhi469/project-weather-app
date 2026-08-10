'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'compact';
  hover?: boolean;
  className?: string;
  delay?: number;
}

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1], delay },
  }),
};

export default function GlassCard({
  children, variant = 'default', hover = true, className, delay = 0, ...props
}: GlassCardProps) {
  const baseClass = cn(
    variant === 'elevated' ? 'glass-card-elevated'
    : variant === 'compact' ? 'glass-card-compact'
    : 'glass-card',
    className,
  );

  return (
    <motion.div
      className={baseClass}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
      whileHover={hover ? { y: -4, transition: { duration: 0.22 } } : undefined}
      {...(props as any)}
    >
      <div className="gradient-border absolute inset-0 rounded-[inherit] pointer-events-none" />
      {children}
    </motion.div>
  );
}
