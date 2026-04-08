import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ConfettiProps {
  visible: boolean;
  type?: 'success' | 'milestone' | 'challenge';
  duration?: number;
  onComplete?: () => void;
}

export function Confetti({
  visible,
  type = 'success',
  duration = 3000,
  onComplete,
}: ConfettiProps) {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      const count = type === 'milestone' ? 100 : type === 'challenge' ? 50 : 30;
      const newParticles = Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -20 - Math.random() * 50,
        size: Math.random() * 8 + 4,
        color: type === 'milestone' ? ['#000000', '#FFFFFF', '#0047AB'][Math.floor(Math.random() * 3)] : ['#000000', '#FFFFFF'][Math.floor(Math.random() * 2)],
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5,
        duration: Math.random() * 2 + 1.5,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [visible, type, duration, onComplete]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: `${p.x}vw`, y: `${p.y}vh`, rotate: 0, opacity: 1 }}
              animate={{
                y: '120vh',
                rotate: p.rotation + 360 * 2,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                boxShadow: p.color === '#0047AB' ? '0 0 10px rgba(0,71,171,0.5)' : 'none',
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
