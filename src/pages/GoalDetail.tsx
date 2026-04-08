import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import { ProgressCircle } from '../components/ui/ProgressCircle';
import { FadeTransition, StaggerContainer, StaggerItem } from '../components/animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AmountDisplay } from '../components/ui/AmountDisplay';
import { useResponsive } from '../hooks/useResponsive';

import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '../firebase';

export function GoalDetail() {
  const { goals, selectedGoalId, setScreen, isAmountHidden, toggleAmountHidden, user } = useStore();
  const { isTablet, isDesktop } = useResponsive();
  const [withdrawing, setWithdrawing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [manualAmount, setManualAmount] = useState('');

  const goal = goals.find(g => g.id === selectedGoalId);

  if (!goal) {
    setScreen('main');
    return null;
  }

  const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

  const handleWithdraw = () => {
    setWithdrawing(true);
  };

  const handleManualSave = async () => {
    if (!manualAmount || isNaN(Number(manualAmount)) || !auth.currentUser || !goal) return;
    setLoading(true);

    try {
      const amount = Number(manualAmount);
      
      // 1. Create transaction
      await addDoc(collection(db, 'transactions'), {
        userId: auth.currentUser.uid,
        goalId: goal.id,
        amount: amount,
        type: 'deposit',
        category: 'manual',
        description: `Dépôt manuel pour ${goal.title}`,
        status: 'completed',
        timestamp: serverTimestamp()
      });

      // 2. Update goal amount
      await updateDoc(doc(db, 'goals', goal.id), {
        currentAmount: increment(amount)
      });

      // 3. Update user balance
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        'balance.total': increment(amount),
        'balance.savings': increment(amount)
      });

      setIsAddingManual(false);
      setManualAmount('');
    } catch (error) {
      console.error('Error saving manually:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeTransition className={cn(
      "p-6 pb-24 space-y-8 bg-black text-white min-h-full",
      (isTablet || isDesktop) && "max-w-4xl mx-auto py-12"
    )}>
      <header className="flex items-center justify-between pt-4">
        <button onClick={() => setScreen('main')} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className={cn(
          "font-medium",
          (isTablet || isDesktop) ? "text-2xl" : "text-lg"
        )}>{goal.title}</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <Edit2 size={16} />
        </button>
      </header>

      <div className={cn(
        "flex flex-col items-center py-8",
        (isTablet || isDesktop) && "flex-row justify-center gap-16 py-12"
      )}>
        <ProgressCircle
          progress={progress}
          size={{ mobile: 200, tablet: 240, desktop: 280 }}
          strokeWidth={4}
          showPercentage={true}
          showAmount={false}
          isAmountHidden={isAmountHidden}
        />

        <div className={cn(
          "mt-8 text-center space-y-2",
          (isTablet || isDesktop) && "mt-0 text-left"
        )}>
          <p className="text-white/50 text-xs uppercase tracking-widest font-medium">Montant Actuel</p>
          <div className={cn(
            "flex items-center gap-2",
            !(isTablet || isDesktop) && "justify-center"
          )}>
            <AmountDisplay 
              amount={goal.currentAmount} 
              isHidden={isAmountHidden} 
              size={(isTablet || isDesktop) ? "xl" : "lg"} 
              showCurrency={true} 
            />
          </div>
          <p className={cn(
            "text-white/40",
            (isTablet || isDesktop) ? "text-lg" : "text-sm"
          )}>
            sur {new Intl.NumberFormat('fr-BJ', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(goal.targetAmount)}
          </p>
        </div>
      </div>

      <div className={cn(
        "grid gap-6",
        (isTablet || isDesktop) && "grid-cols-2"
      )}>
        <StaggerContainer className="space-y-4">
          <StaggerItem>
            <Card variant="glass" padding="md" className="space-y-4 h-full flex flex-col justify-center">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-white/60 text-sm">Date cible</span>
                <span className="text-white font-medium">{new Date(goal.deadline).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Recommandé</span>
                <span className="text-white font-medium">+ 1 500 FCFA / jour</span>
              </div>
            </Card>
          </StaggerItem>
        </StaggerContainer>

        <StaggerContainer className="space-y-4">
          <StaggerItem className="space-y-3">
            {!isAddingManual ? (
              <Button 
                variant="secondary" 
                fullWidth 
                size={(isTablet || isDesktop) ? "lg" : "md"}
                onPress={() => setIsAddingManual(true)}
              >
                Ajouter manuellement
              </Button>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                <input 
                  type="number" 
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  placeholder="Montant (FCFA)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent text-white"
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" fullWidth onPress={() => setIsAddingManual(false)}>Annuler</Button>
                  <Button 
                    variant="premium" 
                    size="sm" 
                    fullWidth 
                    onPress={handleManualSave}
                    loading={loading}
                    disabled={!manualAmount || loading}
                  >
                    Confirmer
                  </Button>
                </div>
              </div>
            )}
            
            {!withdrawing ? (
              <Button 
                variant="outline" 
                fullWidth 
                size={(isTablet || isDesktop) ? "lg" : "md"}
                icon={<ShieldAlert size={16} className="text-white/50" />}
                onPress={handleWithdraw}
              >
                Retirer les fonds
              </Button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="bg-accent/10 border border-accent/20 rounded-2xl p-5 text-center space-y-3"
              >
                <div className="flex justify-center mb-2"><ShieldAlert className="text-accent" size={24} /></div>
                <h3 className="text-accent font-semibold text-sm">Délai Anti-Impulsion Actif</h3>
                <p className="text-white/70 text-xs leading-relaxed">
                  Pour protéger votre épargne, les retraits sont soumis à un délai de 24h.
                </p>
                <div className="text-2xl font-mono font-bold text-white tracking-widest py-2">
                  23:59:59
                </div>
                <Button variant="outline" fullWidth size="sm" onPress={() => setWithdrawing(false)}>
                  Annuler le retrait
                </Button>
              </motion.div>
            )}
          </StaggerItem>
        </StaggerContainer>
      </div>
    </FadeTransition>
  );
}
