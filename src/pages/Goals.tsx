import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Smartphone, Shield, Car, Plane, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { GoalCard } from '../components/ui/GoalCard';
import { PremiumLock } from '../components/ui/PremiumLock';
import { PremiumBadge } from '../components/ui/PremiumBadge';
import { FadeTransition, StaggerContainer, StaggerItem, ParallaxItem } from '../components/animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useResponsive } from '../hooks/useResponsive';
import { cn } from '../utils/cn';

import { supabase } from '../lib/supabase';

const iconMap: Record<string, React.ReactNode> = {
  smartphone: <Smartphone size={20} />,
  shield: <Shield size={20} />,
  car: <Car size={20} />,
  plane: <Plane size={20} />,
  default: <Target size={20} />
};

export function Goals() {
  const { goals, setScreen, setSelectedGoalId, isAmountHidden, addGoal, user } = useStore();
  const { isTablet, isDesktop } = useResponsive();
  const [isAdding, setIsAdding] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  
  // Form state
  const [newGoal, setNewGoal] = React.useState({
    title: '',
    targetAmount: '',
    deadline: '',
    icon: 'default'
  });

  const handleGoalClick = (id: string) => {
    setSelectedGoalId(id);
    setScreen('goal-detail');
  };

  const handleCreateGoal = async () => {
    if (!newGoal.title || !newGoal.targetAmount || !user) return;
    
    // PREMIUM CHECK: Limit to 1 goal for free users
    const isPremium = useStore.getState().isPremium;
    if (!isPremium && goals.length >= 1) {
      alert("En mode gratuit, vous êtes limité à 1 objectif. Passez à Premium pour en ajouter d'autres !");
      useStore.getState().setPremiumModalOpen(true);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('goals').insert({
        user_id: user.id,
        title: newGoal.title,
        target_amount: Number(newGoal.targetAmount),
        current_amount: 0,
        deadline: newGoal.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        icon: newGoal.icon,
        is_completed: false
      });

      if (error) throw error;

      setIsAdding(false);
      setNewGoal({ title: '', targetAmount: '', deadline: '', icon: 'default' });
      await useStore.getState().fetchUserData(user.id);
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeTransition className={cn(
      "p-6 pb-24 space-y-6 bg-black text-white min-h-full relative",
      isTablet && "p-10",
      isDesktop && "p-12 max-w-6xl mx-auto"
    )}>
      <header className="flex justify-between items-center mb-8 pt-4">
        <h1 className={cn(
          "font-semibold tracking-tight",
          isTablet ? "text-3xl" : "text-2xl"
        )}>
          Objectifs
        </h1>
        <button 
          onClick={() => setIsAdding(true)}
          className={cn(
            "bg-white text-black hover:bg-white/90 transition-all active:scale-90 rounded-full flex items-center justify-center shadow-lg",
            isTablet ? "w-12 h-12" : "w-10 h-10"
          )}
        >
          <Plus size={isTablet ? 24 : 20} />
        </button>
      </header>

      {/* New Goal Modal Overlay */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-999 flex items-end sm:items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-lg bg-zinc-900 rounded-[2.5rem] sm:rounded-3xl p-8 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8 sm:hidden" />
              <h2 className="text-2xl font-semibold mb-6">Nouvel Objectif</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase tracking-widest">Nom de l'objectif</label>
                  <input 
                    type="text" 
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="Ex: Nouveau PC, Vacances..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-accent outline-none transition-colors text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase tracking-widest">Montant cible (FCFA)</label>
                  <input 
                    type="number" 
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    placeholder="500 000" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-accent outline-none transition-colors text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-white/40 uppercase tracking-widest">Date limite</label>
                    <input 
                      type="date" 
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-accent outline-none transition-colors text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-white/40 uppercase tracking-widest">Icône</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setNewGoal({ ...newGoal, icon: 'default' })}
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                          newGoal.icon === 'default' ? "bg-accent text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
                        )}
                      >
                        <Target size={20} />
                      </button>
                      <button 
                        onClick={() => setNewGoal({ ...newGoal, icon: 'plane' })}
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                          newGoal.icon === 'plane' ? "bg-accent text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
                        )}
                      >
                        <Plane size={20} />
                      </button>
                      <button 
                        onClick={() => setNewGoal({ ...newGoal, icon: 'car' })}
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                          newGoal.icon === 'car' ? "bg-accent text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
                        )}
                      >
                        <Car size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" fullWidth onClick={() => setIsAdding(false)} className="order-2 sm:order-1">Annuler</Button>
                  <Button 
                    variant="premium" 
                    fullWidth 
                    onClick={handleCreateGoal} 
                    disabled={!newGoal.title || !newGoal.targetAmount || loading}
                    loading={loading}
                    className="order-1 sm:order-2"
                  >
                    Créer l'objectif
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <StaggerContainer className={cn(
        "grid gap-4",
        isTablet && "grid-cols-2",
        isDesktop && "grid-cols-3"
      )}>
        {goals.map((goal, i) => (
          <StaggerItem key={goal.id}>
            <ParallaxItem yOffset={5 + i * 2}>
              <GoalCard
                title={goal.title}
                currentAmount={goal.currentAmount}
                targetAmount={goal.targetAmount}
                deadline={new Date(goal.deadline)}
                icon={iconMap[goal.icon] || iconMap.default}
                isAmountHidden={isAmountHidden}
                onPress={() => handleGoalClick(goal.id)}
              />
            </ParallaxItem>
          </StaggerItem>
        ))}
        {/* Premium Locked Goals */}
        {!useStore.getState().isPremium && Array.from({ length: 2 }).map((_, i) => (
          <StaggerItem key={`locked-${i}`}>
            <Card 
              variant="glass" 
              className="h-full flex flex-col items-center justify-center p-6 opacity-50 cursor-pointer relative"
              onClick={() => useStore.getState().setPremiumModalOpen(true)}
            >
              <PremiumBadge />
              <Target size={32} className="text-white/20 mb-4" />
              <p className="text-white/40 text-sm">Objectif Premium</p>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="mt-12 space-y-4">
        <h3 className="text-lg font-semibold text-white">Objectifs Avancés (Premium)</h3>
        {useStore.getState().isPremium ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card variant="glass" className="p-4">
              <h4 className="text-white font-medium">Investissement Automatique</h4>
              <p className="text-zinc-400 text-sm">Placez vos économies automatiquement.</p>
            </Card>
            <Card variant="glass" className="p-4">
              <h4 className="text-white font-medium">Gestion de Portefeuille</h4>
              <p className="text-zinc-400 text-sm">Diversifiez vos actifs.</p>
            </Card>
          </div>
        ) : (
          <PremiumLock title="Objectifs Avancés" />
        )}
      </div>

      {/* Smart Suggestion */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={cn("mt-8", isTablet && "max-w-2xl mx-auto")}
      >
        <Card variant="glass" className="border-accent/20 bg-accent/10 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <Target size={isTablet ? 140 : 100} />
          </div>
          <div className="flex gap-4 items-start relative z-10">
            <div className={cn(
              "rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1",
              isTablet ? "w-12 h-12" : "w-10 h-10"
            )}>
              <Target className="text-accent" size={isTablet ? 24 : 20} />
            </div>
            <div>
              <h4 className={cn("text-white font-medium", isTablet ? "text-base" : "text-sm")}>Suggestion Intelligente</h4>
              <p className={cn("text-white/60 mt-1 leading-relaxed", isTablet ? "text-sm" : "text-xs")}>
                D'après vos habitudes de dépenses, vous pourriez épargner 15 000 FCFA de plus ce mois-ci en activant le défi "Zéro Fast-Food".
              </p>
              <button className="mt-3 text-accent text-xs font-semibold hover:text-accent/80 transition-colors flex items-center gap-1">
                Voir le défi <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </FadeTransition>
  );
}
