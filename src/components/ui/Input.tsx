import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useResponsive } from '../../hooks/useResponsive';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'phone' | 'password' | 'number';
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      value,
      onChangeText,
      type = 'text',
      error,
      success,
      disabled,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const { isTablet, isDesktop } = useResponsive();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let text = e.target.value;
      if (type === 'phone') {
        // Auto-format for +229
        text = text.replace(/[^\d+ ]/g, '');
        if (text.startsWith('229')) text = '+' + text;
        if (!text.startsWith('+229') && text.length > 0 && !text.startsWith('+')) {
          text = '+229 ' + text;
        }
      }
      onChangeText(text);
    };

    return (
      <div className={cn('w-full', className)}>
        {label && (
          <label className={cn(
            "block font-medium text-black/70 dark:text-white/70 mb-1.5",
            (isTablet || isDesktop) ? "text-base" : "text-sm"
          )}>
            {label}
          </label>
        )}
        <motion.div
          animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.4 }}
          className={cn(
            'relative flex items-center w-full rounded-xl border transition-all duration-200',
            'bg-black/5 dark:bg-white/5',
            isFocused ? 'border-black dark:border-white ring-1 ring-black dark:ring-white' : 'border-transparent',
            error ? 'border-red-500 ring-1 ring-red-500 bg-red-50 dark:bg-red-500/10' : '',
            success ? 'border-green-500 ring-1 ring-green-500' : '',
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          )}
        >
          {leftIcon && <div className={cn("pl-4 text-black/50 dark:text-white/50", (isTablet || isDesktop) && "pl-6")}>{leftIcon}</div>}
          
          <input
            ref={ref}
            type={type === 'phone' ? 'tel' : type}
            value={value}
            onChange={handleChange}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            disabled={disabled}
            className={cn(
              'flex-1 bg-transparent border-none outline-none text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 transition-all duration-200',
              (isTablet || isDesktop) ? 'py-4.5 px-6 text-lg' : 'py-3.5 px-4 text-base',
              leftIcon ? 'pl-3' : '',
              rightIcon ? 'pr-3' : ''
            )}
            {...props}
          />

          {rightIcon && <div className={cn("pr-4 text-black/50 dark:text-white/50", (isTablet || isDesktop) && "pr-6")}>{rightIcon}</div>}
        </motion.div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-xs mt-1.5 font-medium"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
