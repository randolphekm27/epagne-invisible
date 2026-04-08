import React, { useEffect } from 'react';
import { motion } from 'motion/react';

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center space-y-4"
      >
        <div className="text-6xl">✨</div>
        <h1 className="text-3xl font-bold tracking-tighter">ÉPARGNE INVISIBLE</h1>
        <p className="text-white/60">Épargnez sans même y penser</p>
      </motion.div>
      <div className="absolute bottom-8 text-white/30 text-sm">version 1.0.0</div>
    </motion.div>
  );
};
