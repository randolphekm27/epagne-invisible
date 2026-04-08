import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useResponsive } from '../../hooks/useResponsive';

type ResponsiveProp<T> = T | { mobile?: T; phablet?: T; tablet?: T; desktop?: T };

export interface ProgressCircleProps {
  progress: number;
  size?: ResponsiveProp<number>;
  strokeWidth?: ResponsiveProp<number>;
  showPercentage?: boolean;
  showAmount?: boolean;
  amount?: number;
  isAmountHidden?: boolean;
  onReveal?: () => void;
  gradient?: boolean;
  className?: string;
  children?: ReactNode;
}

export function ProgressCircle({
  progress,
  size = 200,
  strokeWidth = 4,
  showPercentage = true,
  showAmount = false,
  amount = 0,
  isAmountHidden = true,
  onReveal,
  gradient = false,
  className,
  children,
}: ProgressCircleProps) {
  const { deviceType } = useResponsive();

  const getResponsiveValue = <T,>(prop: ResponsiveProp<T>, defaultValue: T): T => {
    if (typeof prop !== 'object' || prop === null || React.isValidElement(prop)) {
      return prop as T;
    }
    const p = prop as { mobile?: T; phablet?: T; tablet?: T; desktop?: T };
    return p[deviceType] || p.mobile || defaultValue;
  };

  const currentSize = getResponsiveValue(size, 200);
  const currentStrokeWidth = getResponsiveValue(strokeWidth, 4);

  const radius = (currentSize - currentStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: currentSize, height: currentSize }}>
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox={`0 0 ${currentSize} ${currentSize}`}>
        {gradient && (
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0047AB" />
              <stop offset="100%" stopColor="#4169E1" />
            </linearGradient>
          </defs>
        )}
        <circle
          cx={currentSize / 2}
          cy={currentSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-black/5 dark:text-white/10"
          strokeWidth={currentStrokeWidth}
        />
        <motion.circle
          cx={currentSize / 2}
          cy={currentSize / 2}
          r={radius}
          fill="none"
          stroke={gradient ? "url(#progressGradient)" : "currentColor"}
          className="text-black dark:text-white"
          strokeWidth={currentStrokeWidth}
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${circumference - strokeDashoffset} ${circumference}` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {children ? (
          children
        ) : (
          <>
            <motion.div
              key={isAmountHidden ? 'hidden' : 'visible'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              {showPercentage && isAmountHidden && (
                <span className="text-4xl font-light tracking-tighter">{Math.round(progress)}%</span>
              )}
              {showAmount && !isAmountHidden && (
                <span className="text-2xl font-medium tracking-tight">
                  {new Intl.NumberFormat('fr-BJ', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount)}
                </span>
              )}
              {showAmount && isAmountHidden && !showPercentage && (
                <span className="text-3xl font-medium tracking-tight">••••</span>
              )}
            </motion.div>
            
            {onReveal && (
              <button 
                onClick={onReveal}
                className="mt-2 text-black/30 hover:text-black dark:text-white/30 dark:hover:text-white transition-colors"
              >
                {isAmountHidden ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
