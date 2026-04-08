import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Star } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from './Button';
import { Card } from './Card';

export const PremiumModal = () => {
  const { isPremiumModalOpen, setPremiumModalOpen, upgradeToPremium } = useStore();

  if (!isPremiumModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setPremiumModalOpen(false)}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md bg-zinc-900 rounded-3xl p-8 border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => setPremiumModalOpen(false)}
            className="absolute top-4 right-4 text-white/50 hover:text-white"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="text-accent" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Passez à Premium</h2>
            <p className="text-zinc-400">Débloquez tout le potentiel de votre épargne.</p>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              "Objectifs illimités",
              "Défis exclusifs chaque semaine",
              "Analyses prédictives intelligentes",
              "Mode surprise avancé",
              "Support prioritaire"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white">
                <div className="bg-accent/20 p-1 rounded-full"><Star size={16} className="text-accent" /></div>
                {item}
              </li>
            ))}
          </ul>

          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-white">500 FCFA / mois</p>
            <p className="text-sm text-zinc-500">seulement 16 FCFA par jour</p>
          </div>

          <Button variant="premium" fullWidth onClick={upgradeToPremium}>
            Passer à Premium
          </Button>
          <button onClick={() => setPremiumModalOpen(false)} className="w-full mt-4 text-zinc-500 hover:text-white text-sm">
            Peut-être plus tard
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
