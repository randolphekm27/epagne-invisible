import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { useStore } from '../../store/useStore';

export const PremiumLock = ({ title }: { title: string }) => {
  const upgradeToPremium = useStore(state => state.upgradeToPremium);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-zinc-900/50 rounded-2xl border border-white/5 backdrop-blur-sm">
      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
        <Lock className="text-accent" size={24} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm text-center mb-4">Passez à la version Premium pour débloquer cette fonctionnalité.</p>
      <Button variant="premium" icon={<Sparkles size={16} />} onClick={upgradeToPremium}>
        Passer Premium
      </Button>
    </div>
  );
};
