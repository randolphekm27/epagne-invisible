import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { cn } from '../utils/cn';

export function SavingsSimulation() {
  const { user, fetchUserData } = useStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const simulateTransaction = async (amount: number, description: string) => {
    if (!user) return;
    setLoading(true);
    setSuccess(null);

    try {
      // 1. Simuler l'achat (Transaction négative sur MM)
      const { error: txError } = await supabase.from('transactions').insert({
        user_id: user.id,
        amount: -amount,
        type: 'expense',
        description: description,
        created_at: new Date().toISOString()
      });

      if (txError) throw txError;

      // 2. Moteur d'épargne Invisible - Appel API Backend
      const { data, error: functionError } = await supabase.functions.invoke('savings-engine', {
        body: { amount, user_id: user.id, description }
      });

      if (functionError) throw functionError;

      if (data?.saved > 0) {
        setSuccess(`Bravo ! +${data.saved} FCFA épargnés invisiblement.`);
      }

      // Refresh data
      await fetchUserData(user.id);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  return (
    <Card variant="glass" className="border-white/10 bg-white/5 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Smartphone className="text-accent" size={20} />
          </div>
          <div>
            <h3 className="text-white font-medium">Simulateur Mobile Money</h3>
            <p className="text-white/40 text-xs">Testez l'épargne automatique en un clic</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button 
            onClick={() => simulateTransaction(1450, "Achat Boutique")}
            disabled={loading}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left"
          >
            <div>
              <p className="text-white text-sm font-medium">Achat (1 450 FCFA)</p>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Boutique • Roundup</p>
            </div>
            <ArrowRight size={16} className="text-white/20" />
          </button>

          <button 
            onClick={() => simulateTransaction(8700, "Essence")}
            disabled={loading}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left"
          >
            <div>
              <p className="text-white text-sm font-medium">Essence (8 700 FCFA)</p>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Total • Roundup</p>
            </div>
            <ArrowRight size={16} className="text-white/20" />
          </button>
        </div>

        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400 text-sm"
            >
              <CheckCircle2 size={16} />
              {success}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
