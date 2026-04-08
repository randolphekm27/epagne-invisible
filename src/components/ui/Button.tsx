import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useResponsive } from '../../hooks/useResponsive';

type ResponsiveProp<T> = T | { mobile?: T; phablet?: T; tablet?: T; desktop?: T };

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'premium';
  size?: ResponsiveProp<'sm' | 'md' | 'lg' | 'xl'>;
  color?: 'black' | 'white' | 'blue';
  fullWidth?: ResponsiveProp<boolean>;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: ResponsiveProp<'left' | 'right' | 'top'>;
  onPress?: () => void;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      color = 'black',
      fullWidth = false,
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      onPress,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const { deviceType } = useResponsive();

    const getResponsiveValue = <T,>(prop: ResponsiveProp<T>, defaultValue: T): T => {
      if (typeof prop !== 'object' || prop === null || React.isValidElement(prop)) {
        return prop as T;
      }
      const p = prop as { mobile?: T; phablet?: T; tablet?: T; desktop?: T };
      return p[deviceType] || p.mobile || defaultValue;
    };

    const currentSize = getResponsiveValue(size, 'md');
    const isFullWidth = getResponsiveValue(fullWidth, false);
    const currentIconPosition = getResponsiveValue(iconPosition, 'left');

    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
    
    const variants = {
      primary: 'bg-black text-white hover:bg-zinc-900 active:bg-zinc-800',
      secondary: 'bg-white text-black border border-black/10 hover:bg-gray-50 active:bg-gray-100',
      outline: 'bg-transparent text-black border border-black hover:bg-black/5 active:bg-black/10',
      premium: 'bg-accent text-white shadow-[0_0_20px_rgba(0,71,171,0.3)] hover:shadow-[0_0_25px_rgba(0,71,171,0.5)]',
    };

    if (color === 'white' && variant === 'primary') {
      variants.primary = 'bg-white text-black hover:bg-gray-100 active:bg-gray-200';
    }

    const sizes = {
      sm: 'h-10 px-4 text-xs', 
      md: 'h-12 px-6 text-sm', 
      lg: 'h-14 px-8 text-base',
      xl: 'h-16 px-10 text-lg',
    };

    const handlePress = (e: any) => {
      if (disabled || loading) return;
      if (onPress) onPress();
      if (onClick) onClick(e);
    };

    return (
      <motion.button
        ref={ref}
        whileTap={disabled || loading ? undefined : { scale: 0.98 }}
        whileHover={disabled || loading ? undefined : { y: -1 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[currentSize as keyof typeof sizes] || sizes.md,
          isFullWidth ? 'w-full' : '',
          currentIconPosition === 'top' ? 'flex-col gap-1 py-2 h-auto min-h-[48px]' : '',
          className
        )}
        onClick={handlePress}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : icon && (currentIconPosition === 'left' || currentIconPosition === 'top') ? (
          <span className={cn(currentIconPosition === 'left' ? "mr-2" : "")}>{icon}</span>
        ) : null}
        
        <span className="leading-none">{children}</span>
        
        {!loading && icon && currentIconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
