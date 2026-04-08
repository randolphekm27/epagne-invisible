import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

export interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (key: string) => void;
  className?: string;
}

export function TabBar({
  tabs,
  activeTab,
  onTabChange,
  className,
}: TabBarProps) {
  return (
    <div className={cn(
      'absolute bottom-0 left-0 w-full h-24 bg-black/80 dark:bg-black/80 backdrop-blur-xl border-t border-black/10 dark:border-white/10 flex justify-around items-start pt-4 px-2 z-50',
      className
    )}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className="flex flex-col items-center justify-center w-16 gap-1.5 relative group"
          >
            <div className="relative">
              <span className={cn(
                'transition-colors duration-300',
                isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'
              )}>
                {tab.icon}
              </span>
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </AnimatePresence>
            </div>
            <span className={cn(
              'text-[10px] font-medium transition-colors duration-300',
              isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'
            )}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
