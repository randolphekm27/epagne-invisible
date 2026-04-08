import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useResponsive } from '../../hooks/useResponsive';

export interface NotificationProps {
  type?: 'success' | 'info' | 'warning' | 'error';
  message: string;
  duration?: number;
  onClose: () => void;
  action?: { label: string; onPress: () => void };
  visible: boolean;
  className?: string;
}

export function Notification({
  type = 'info',
  message,
  duration = 3000,
  onClose,
  action,
  visible,
  className,
}: NotificationProps) {
  const { isTablet, isDesktop } = useResponsive();

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const icons = {
    success: <CheckCircle2 size={isTablet || isDesktop ? 24 : 20} className="text-green-500" />,
    info: <Info size={isTablet || isDesktop ? 24 : 20} className="text-blue-500" />,
    warning: <AlertTriangle size={isTablet || isDesktop ? 24 : 20} className="text-yellow-500" />,
    error: <XCircle size={isTablet || isDesktop ? 24 : 20} className="text-red-500" />,
  };

  const bgs = {
    success: 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20',
    info: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
    warning: 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20',
    error: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20',
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95, x: (isTablet || isDesktop) ? 0 : 0 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={cn(
            'fixed z-[100] flex items-center gap-3 p-4 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-500',
            (isTablet || isDesktop) ? 'top-6 right-6 w-full max-w-md' : 'top-4 left-4 right-4',
            bgs[type],
            className
          )}
        >
          <div className="flex-shrink-0">{icons[type]}</div>
          <p className={cn(
            "flex-1 font-medium text-black dark:text-white transition-all duration-300",
            (isTablet || isDesktop) ? "text-base" : "text-sm"
          )}>
            {message}
          </p>
          
          {action && (
            <button
              onClick={(e) => { e.stopPropagation(); action.onPress(); }}
              className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
            >
              {action.label}
            </button>
          )}
          
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-black/50 dark:text-white/50"
          >
            <X size={isTablet || isDesktop ? 20 : 16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
