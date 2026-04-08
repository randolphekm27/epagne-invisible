import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useResponsive, ResponsiveProp, getResponsiveValue } from '../../hooks/useResponsive';

export interface SkeletonProps {
  type?: 'card' | 'text' | 'circle' | 'progress';
  width?: ResponsiveProp<number | string>;
  height?: ResponsiveProp<number | string>;
  animated?: boolean;
  className?: string;
}

export function Skeleton({
  type = 'text',
  width,
  height,
  animated = true,
  className,
}: SkeletonProps) {
  const { deviceType } = useResponsive();
  const currentWidth = getResponsiveValue(width, deviceType);
  const currentHeight = getResponsiveValue(height, deviceType);

  const baseStyles = 'bg-black/5 dark:bg-white/10 overflow-hidden relative';

  const types = {
    card: 'rounded-2xl w-full h-32',
    text: 'rounded w-full h-4',
    circle: 'rounded-full w-12 h-12',
    progress: 'rounded-full w-full h-1.5',
  };

  const style = {
    width: currentWidth || undefined,
    height: currentHeight || undefined,
  };

  return (
    <div
      className={cn(baseStyles, types[type], className)}
      style={style}
    >
      {animated && (
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/5 dark:via-white/10 to-transparent"
          animate={{ translateX: ['-100%', '100%'] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
}
