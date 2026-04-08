import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useResponsive } from '../../hooks/useResponsive';

type ResponsiveProp<T> = T | { mobile?: T; phablet?: T; tablet?: T; desktop?: T };

export interface CardProps {
  variant?: 'default' | 'glass' | 'elevated';
  padding?: ResponsiveProp<'none' | 'sm' | 'md' | 'lg'>;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  onPress,
  selected = false,
  disabled = false,
  className,
  children,
}) => {
  const { deviceType } = useResponsive();

  const getResponsiveValue = <T,>(prop: ResponsiveProp<T>, defaultValue: T): T => {
    if (typeof prop !== 'object' || prop === null || React.isValidElement(prop)) {
      return prop as T;
    }
    const p = prop as { mobile?: T; phablet?: T; tablet?: T; desktop?: T };
    return p[deviceType] || p.mobile || defaultValue;
  };

  const currentPadding = getResponsiveValue(padding, 'md');

  const baseStyles = "rounded-2xl overflow-hidden transition-all duration-300";
  
  const variants = {
    default: "bg-white border border-black/5 shadow-sm dark:bg-white/5 dark:border-white/10",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 dark:bg-black/10 dark:border-white/10",
    elevated: "bg-white shadow-lg border border-black/5 dark:bg-zinc-900 dark:border-white/5 dark:shadow-2xl",
  };

  const paddings = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-8",
  };

  const isClickable = !!onPress && !disabled;

  const Component = isClickable ? motion.div : 'div';
  const motionProps = isClickable ? {
    whileTap: { scale: 0.98 },
    whileHover: { y: -2 },
    onClick: onPress,
  } : {};

  return (
    <Component
      {...motionProps}
      className={cn(
        baseStyles,
        variants[variant],
        paddings[currentPadding],
        isClickable && "cursor-pointer hover:shadow-lg hover:border-white/30 dark:hover:border-white/20",
        selected && "border-accent ring-1 ring-accent shadow-md",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </Component>
  );
}
