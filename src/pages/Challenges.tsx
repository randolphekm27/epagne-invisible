import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Star, Zap, Coffee, Plus, Target, Gift } from 'lucide-react';
import { ChallengeCard } from '../components/ui/ChallengeCard';
import { FadeTransition, StaggerContainer, StaggerItem, ParallaxItem } from '../components/animations';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { useResponsive } from '../hooks/useResponsive';
import { cn } from '../utils/cn';
import { useStore } from '../store/useStore';

export function Challenges() {
  const { isTablet, isDesktop } = useResponsive();
  const { challenges, addChallenge, updateChallengeProgress } = useStore();
  const [activeChallenges, setActiveChallenges] = React.useState<string[]>(['c1']);
  const [isAdding, setIsAdding] = React.useState(false);

  // Form state
  const [newChallenge, setNewChallenge] = React.useState({
    title: '',
    description: '',
    reward: '',
    total: '',
    icon: 'zap'
  });

  const handleStart = (id: string) => {
    setActiveChallenges(prev => [...prev, id]);
  };

  const handleCreateChallenge = () => {
    if (!newChallenge.title || !newChallenge.reward || !newChallenge.total) return;

    addChallenge({
      id: Math.random().toString(36).substr(2, 9),
      title: newChallenge.title,
      description: newChallenge.description || `Économisez pour gagner ${newChallenge.reward} pts`,
      reward: Number(newChallenge.reward),
      progress: 0,
      total: Number(newChallenge.total),
      icon: newChallenge.icon,
      color: 'text-accent',
      bg: 'bg-accent/20'
    });

    setIsAdding(false);
    setNewChallenge({ title: '', description: '', reward: '', total: '', icon: 'zap' });
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'coffee': return <Coffee size={20} />;
      case 'zap': return <Zap size={20} />;
      case 'flame': return <Flame size={20} />;
      case 'star': return <Star size={20} />;
      case 'target': return <Target size={20} />;
      default: return <Zap size={20} />;
    }
  };

  return (
    <FadeTransition className={cn(
      "p-6 pb-24 space-y-6 bg-black text-white min-h-full relative",
      isTablet && "p-10",
      isDesktop && "p-12 max-w-6xl mx-auto"
    )}>
      <header className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h1 className={cn(
            "font-semibold tracking-tight",
            isTablet ? "text-3xl" : "text-2xl"
          )}>
            Défis
          </h1>
          <p className="text-white/50 text-sm mt-1">Gagnez des points et montez en niveau</p>
        </div>
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

      {/* Level Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(isTablet && "max-w-2xl mx-auto w-full")}
      >
        <Card variant="glass" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Trophy size={140} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className={cn(
              "rounded-full bg-white/10 flex items-center justify-center border border-white/20",
              isTablet ? "w-20 h-20" : "w-16 h-16"
            )}>
              <span className={cn("font-bold text-white", isTablet ? "text-3xl" : "text-2xl")}>4</span>
            </div>
            <div>
              <h2 className={cn("text-white font-semibold", isTablet ? "text-xl" : "text-lg")}>Niveau Épargnant</h2>
              <p className="text-accent text-sm font-medium mt-0.5">1,250 pts</p>
            </div>
          </div>
          <div className="mt-6 relative z-10">
            <ProgressBar
              progress={80}
              height="sm"
              color="white"
              showLabel={true}
              label="Progression vers Niv. 5"
            />
            <div className="text-right mt-1">
              <span className="text-white/80 text-xs font-medium">250 pts restants</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Active Challenges */}
      <div className="space-y-4 mt-8">
        <h3 className="text-white/80 font-medium text-sm uppercase tracking-wider mb-4">Défis de la semaine</h3>
        
        <StaggerContainer className={cn(
          "grid gap-4",
          isTablet && "grid-cols-2",
          isDesktop && "grid-cols-3"
        )}>
          {challenges.map((challenge, i) => (
            <StaggerItem key={challenge.id}>
              <ParallaxItem yOffset={5 + i * 2}>
                <ChallengeCard
                  title={challenge.title}
                  description={challenge.description}
                  progress={(challenge.progress / challenge.total) * 100}
                  total={challenge.total}
                  reward={challenge.reward}
                  icon={getIcon(challenge.icon)}
                  status={challenge.completed ? 'completed' : activeChallenges.includes(challenge.id) ? 'active' : 'available'}
                  onStart={() => handleStart(challenge.id)}
                  onAction={() => console.log('Action challenge', challenge.id)}
                />
              </ParallaxItem>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* New Challenge Modal Overlay */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-4 sm:p-6">
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
              <h2 className="text-2xl font-semibold mb-6">Nouveau Défi</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase tracking-widest">Titre du défi</label>
                  <input 
                    type="text" 
                    value={newChallenge.title}
                    onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                    placeholder="Ex: 3 jours sans fast-food" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-accent outline-none transition-colors text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase tracking-widest">Description</label>
                  <textarea 
                    value={newChallenge.description}
                    onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                    placeholder="Détails du défi..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-accent outline-none transition-colors text-white min-h-[100px] resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-white/40 uppercase tracking-widest">Récompense (pts)</label>
                    <input 
                      type="number" 
                      value={newChallenge.reward}
                      onChange={(e) => setNewChallenge({ ...newChallenge, reward: e.target.value })}
                      placeholder="100" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-accent outline-none transition-colors text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-white/40 uppercase tracking-widest">Objectif (jours/fois)</label>
                    <input 
                      type="number" 
                      value={newChallenge.total}
                      onChange={(e) => setNewChallenge({ ...newChallenge, total: e.target.value })}
                      placeholder="7" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-accent outline-none transition-colors text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase tracking-widest">Icône</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'zap', icon: <Zap size={20} /> },
                      { id: 'coffee', icon: <Coffee size={20} /> },
                      { id: 'flame', icon: <Flame size={20} /> },
                      { id: 'star', icon: <Star size={20} /> },
                      { id: 'target', icon: <Target size={20} /> },
                      { id: 'gift', icon: <Gift size={20} /> },
                    ].map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => setNewChallenge({ ...newChallenge, icon: item.id })}
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                          newChallenge.icon === item.id ? "bg-accent text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
                        )}
                      >
                        {item.icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" fullWidth onClick={() => setIsAdding(false)} className="order-2 sm:order-1">Annuler</Button>
                  <Button 
                    variant="premium" 
                    fullWidth 
                    onClick={handleCreateChallenge} 
                    disabled={!newChallenge.title || !newChallenge.reward || !newChallenge.total}
                    className="order-1 sm:order-2"
                  >
                    Créer le défi
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </FadeTransition>
  );
}
