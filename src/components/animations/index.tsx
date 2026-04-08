import React, { useRef } from 'react';
import { motion, AnimatePresence, HTMLMotionProps, useScroll, useTransform } from 'framer-motion';
import { useScrollContainer } from '../MobileLayout';

// Fade In/Out (transitions entre écrans)
export const FadeTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

// Navigation entre tabs (Slide horizontal)
export const TabTransition: React.FC<{ children: React.ReactNode; direction?: number; className?: string }> = ({ children, direction = 1, className }) => (
  <motion.div
    initial={{ opacity: 0, x: direction * 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: direction * -20 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

// Apparition initiale des cartes (Staggered Fade-in)
export const StaggerContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Effet Parallax au scroll (utilisé dans les listes)
export const ParallaxItem = ({ children, yOffset = 10, className }: { children: React.ReactNode; yOffset?: number; className?: string }) => {
  const ref = useRef(null);
  const containerRef = useScrollContainer();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef || undefined,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [yOffset, -yOffset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

// Spinner personnalisé
export const Spinner = ({ size = 24, className }: { size?: number; className?: string }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    style={{ width: size, height: size }}
    className={`rounded-full border-2 border-black/10 dark:border-white/10 border-t-accent ${className}`}
  />
);

// Transition vers écran Premium (Dévoilement)
export const PremiumReveal = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
);
