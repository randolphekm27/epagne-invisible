import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useResponsive } from '../../hooks/useResponsive';

export interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  largeTitle?: boolean;
  className?: string;
}

export function Header({
  title,
  showBack = false,
  onBack,
  rightAction,
  transparent = false,
  largeTitle = false,
  className,
}: HeaderProps) {
  const { scrollY } = useScroll();
  const { isTablet, isDesktop } = useResponsive();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  const headerBg = useTransform(
    scrollY,
    [0, 50],
    [transparent ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,1)', 'rgba(0,0,0,0.8)']
  );

  const headerBlur = useTransform(
    scrollY,
    [0, 50],
    ['blur(0px)', 'blur(12px)']
  );

  const titleScale = useTransform(scrollY, [0, 50], [1, 0.85]);
  const titleY = useTransform(scrollY, [0, 50], [0, -4]);

  return (
    <motion.header
      style={{
        backgroundColor: headerBg,
        backdropFilter: headerBlur,
      }}
      className={cn(
        'sticky top-0 z-50 w-full px-6 flex items-center justify-between transition-all duration-300',
        isScrolled ? 'border-b border-white/10' : 'border-b border-transparent',
        (isTablet || isDesktop) ? 'py-6 px-10' : 'py-4',
        className
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        {showBack && (
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <motion.h1
          style={{ scale: largeTitle ? titleScale : 1, y: largeTitle ? titleY : 0, originX: 0 }}
          className={cn(
            'font-semibold tracking-tight text-white transition-all duration-300',
            largeTitle 
              ? (isTablet || isDesktop ? 'text-4xl' : 'text-3xl') 
              : (isTablet || isDesktop ? 'text-2xl' : 'text-xl')
          )}
        >
          {title}
        </motion.h1>
      </div>
      
      {rightAction && (
        <div className="flex-shrink-0">
          {rightAction}
        </div>
      )}
    </motion.header>
  );
}
