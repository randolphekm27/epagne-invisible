import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useResponsive, ResponsiveProp, getResponsiveValue } from '../../hooks/useResponsive';

export interface BadgeProps {
  text: string;
  variant?: 'bronze' | 'silver' | 'gold' | 'premium' | 'default' | 'success' | 'accent' | 'warning' | 'error' | 'info';
  size?: ResponsiveProp<'sm' | 'md' | 'lg'>;
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({
  text,
  variant = 'default',
  size = 'md',
  icon,
  className,
}: BadgeProps) {
  const { deviceType } = useResponsive();
  const currentSize = getResponsiveValue(size, deviceType);

  const variants = {
    bronze: 'bg-[#CD7F32]/20 text-[#CD7F32] border-[#CD7F32]/30',
    silver: 'bg-[#C0C0C0]/20 text-[#C0C0C0] border-[#C0C0C0]/30',
    gold: 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30',
    premium: 'bg-accent/20 text-accent border-accent/30 shadow-[0_0_10px_rgba(0,71,171,0.2)]',
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    accent: 'bg-accent/20 text-accent border-accent/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    default: 'bg-white/10 text-white/70 border-white/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-full font-bold uppercase tracking-wider border transition-all duration-300',
        variants[variant],
        sizes[currentSize as keyof typeof sizes],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {text}
    </motion.div>
  );
}
