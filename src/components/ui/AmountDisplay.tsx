import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useResponsive, ResponsiveProp, getResponsiveValue } from '../../hooks/useResponsive';

export interface AmountDisplayProps {
  amount: number;
  isHidden?: boolean;
  size?: ResponsiveProp<'sm' | 'md' | 'lg' | 'xl'>;
  showCurrency?: boolean;
  onReveal?: () => void;
  className?: string;
}

export function AmountDisplay({
  amount,
  isHidden = true,
  size = 'md',
  showCurrency = true,
  onReveal,
  className,
}: AmountDisplayProps) {
  const { deviceType } = useResponsive();
  const [tempReveal, setTempReveal] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (tempReveal) {
      timer = setTimeout(() => {
        setTempReveal(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [tempReveal]);

  const handleReveal = () => {
    if (onReveal) {
      onReveal();
    } else {
      setTempReveal(true);
    }
  };

  const isActuallyHidden = isHidden && !tempReveal;
  const currentSize = getResponsiveValue(size, deviceType);

  const formattedAmount = new Intl.NumberFormat('fr-BJ', {
    style: showCurrency ? 'currency' : 'decimal',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(amount);

  const sizes = {
    sm: 'text-lg',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={isActuallyHidden ? 'hidden' : 'visible'}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn('font-medium tracking-tight text-black dark:text-white', sizes[currentSize as keyof typeof sizes])}
        >
          {isActuallyHidden ? '••••' : formattedAmount}
        </motion.span>
      </AnimatePresence>
      
      <button
        onClick={handleReveal}
        className="p-2 rounded-full text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        {isActuallyHidden ? <Eye size={currentSize === 'sm' ? 16 : 20} /> : <EyeOff size={currentSize === 'sm' ? 16 : 20} />}
      </button>
    </div>
  );
}
