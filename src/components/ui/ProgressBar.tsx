import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useResponsive, ResponsiveProp, getResponsiveValue } from '../../hooks/useResponsive';

export interface ProgressBarProps {
  progress: number;
  height?: ResponsiveProp<'sm' | 'md' | 'lg'>;
  color?: 'black' | 'blue' | 'white';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  height = 'md',
  color = 'black',
  showLabel = false,
  label,
  animated = true,
  className,
}: ProgressBarProps) {
  const { deviceType } = useResponsive();
  const currentHeight = getResponsiveValue(height, deviceType);

  const heights = {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2",
  };

  const colors = {
    black: "bg-black dark:bg-white",
    blue: "bg-accent",
    white: "bg-white",
  };

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between text-xs font-medium mb-2">
          {label && <span className="text-black/60 dark:text-white/60">{label}</span>}
          {showLabel && <span className="text-black/80 dark:text-white/80">{Math.round(progress)}%</span>}
        </div>
      )}
      <div className={cn("w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden", heights[currentHeight as keyof typeof heights])}>
        <motion.div
          initial={animated ? { width: 0 } : { width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", colors[color])}
        />
      </div>
    </div>
  );
}
