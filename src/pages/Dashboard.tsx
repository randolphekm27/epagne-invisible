import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowUpRight, ArrowDownLeft, Zap, Flame } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { io } from 'socket.io-client';
import { cn } from '../utils/cn';
import { ProgressCircle } from '../components/ui/ProgressCircle';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Card } from '../components/ui/Card';
import { PremiumBadge } from '../components/ui/PremiumBadge';
import { Badge } from '../components/ui/Badge';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { AmountDisplay } from '../components/ui/AmountDisplay';
import { FadeTransition, StaggerContainer, StaggerItem, ParallaxItem } from '../components/animations';
import { useResponsive } from '../hooks/useResponsive';

export function Dashboard() {
  const { user, transactions, isAmountHidden, toggleAmountHidden } = useStore();
  const { isTablet, isDesktop } = useResponsive();
  const [selectedTx, setSelectedTx] = useState<any>(null);

  if (!user) return null;

  // Calculate progress based on goals if available, or just a mock for now
  const progress = 65; 

  return (
    <FadeTransition className={cn(
      "p-6 pb-24 space-y-8 bg-black text-white min-h-full relative",
      isTablet && "p-10",
      isDesktop && "p-12 max-w-5xl mx-auto"
    )}>
      {/* Transaction Detail Modal */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-zinc-900 rounded-3xl p-8 border border-white/10 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-2",
                  selectedTx.type === 'roundup' ? "bg-white/10 text-white" :
                  selectedTx.type === 'deposit' ? "bg-accent/20 text-accent" :
                  "bg-white/5 text-white/50"
                )}>
                  {selectedTx.type === 'roundup' ? <Zap size={32} /> : 
                   selectedTx.type === 'deposit' ? <ArrowDownLeft size={32} /> : 
                   <ArrowUpRight size={32} />}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedTx.description}</h3>
                  <p className="text-white/40 text-sm mt-1 uppercase tracking-widest">
                    {format(new Date(selectedTx.date), 'dd MMMM yyyy • HH:mm', { locale: fr })}
                  </p>
                </div>
                <div className="py-4">
                  <span className="text-3xl font-bold">
                    {selectedTx.type === 'withdrawal' ? '-' : '+'}
                    <AmountDisplay amount={selectedTx.amount} isHidden={false} size="xl" showCurrency={true} />
                  </span>
                </div>
                <div className="w-full pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Statut</span>
                    <Badge text="Confirmé" variant="success" size="sm" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">ID Transaction</span>
                    <span className="text-white/60 font-mono text-[10px]">{selectedTx.id}</span>
                  </div>
                </div>
                <Button variant="outline" fullWidth onClick={() => setSelectedTx(null)} className="mt-6">Fermer</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex justify-between items-center pt-4">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <div>
            <h1 className={cn(
              "text-white/70 font-medium",
              isTablet ? "text-base" : "text-sm"
            )}>
              Bonjour, {user.name} 👋
            </h1>
            <Badge text="Épargnant Bronze" variant="bronze" size={isTablet ? "md" : "sm"} className="mt-2" />
          </div>
        </div>
        <div className={cn(
          "rounded-full bg-white/10 flex items-center justify-center border border-white/20",
          isTablet ? "w-12 h-12" : "w-10 h-10"
        )}>
          <span className={cn(
            "text-white font-medium",
            isTablet ? "text-base" : "text-sm"
          )}>
            {user.name.charAt(0)}
          </span>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className={cn(
        "flex flex-col gap-8",
        isTablet && "grid grid-cols-12 items-start"
      )}>
        {/* Main Progress Area */}
        <div className={cn(
          "flex flex-col items-center justify-center py-6",
          isTablet && "col-span-7 py-0"
        )}>
          <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-6">Votre épargne invisible</p>
          
          <ProgressCircle
            progress={progress}
            size={{ mobile: 240, phablet: 260, tablet: 300, desktop: 320 }}
            strokeWidth={4}
            showPercentage={true}
            showAmount={true}
            amount={user.balance.total}
            isAmountHidden={isAmountHidden}
            onReveal={toggleAmountHidden}
          />

          <div className="w-full mt-8">
            <ProgressBar 
              progress={progress} 
              height="md" 
              color="black" 
              showLabel={true} 
              label="Prochain palier dans 5 000 FCFA" 
            />
          </div>
        </div>

        {/* Indicators and Activity */}
        <div className={cn(
          "space-y-8",
          isTablet && "col-span-5"
        )}>
            {/* Key Indicators */}
          <StaggerContainer className={cn(
            "grid grid-cols-3 gap-3",
            isTablet && "grid-cols-1"
          )}>
            <StaggerItem>
              <Card variant="glass" padding={isTablet ? "md" : "sm"} className={cn(
                "flex flex-col items-center justify-center text-center h-full",
                isTablet && "flex-row justify-between px-6"
              )}>
                <div className="flex flex-col items-center">
                  <Flame size={isTablet ? 20 : 16} className="text-orange-500 mb-1" />
                  <span className="text-white/50 text-[9px] uppercase tracking-wider mt-0.5">Jours 🔥</span>
                </div>
                <span className={cn("text-white font-semibold", isTablet ? "text-xl" : "text-sm")}>15</span>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card variant="glass" padding={isTablet ? "md" : "sm"} className={cn(
                "flex flex-col items-center justify-center text-center h-full",
                isTablet && "flex-row justify-between px-6"
              )}>
                <div className="flex flex-col items-center">
                  <Zap size={isTablet ? 20 : 16} className="text-accent mb-1" />
                  <span className="text-white/50 text-[9px] uppercase tracking-wider mt-0.5">Arrondis</span>
                </div>
                <span className={cn("text-white font-semibold", isTablet ? "text-xl" : "text-sm")}>24</span>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card 
                variant="glass" 
                padding={isTablet ? "md" : "sm"} 
                className={cn(
                  "flex flex-col items-center justify-center text-center h-full border-accent/30 bg-accent/10 relative",
                  isTablet && "flex-row justify-between px-6",
                  !useStore.getState().isPremium && "opacity-50 cursor-pointer"
                )}
                onClick={!useStore.getState().isPremium ? () => useStore.getState().setPremiumModalOpen(true) : undefined}
              >
                {!useStore.getState().isPremium && <PremiumBadge />}
                <div className="flex flex-col items-center">
                  <ArrowUpRight size={isTablet ? 20 : 16} className="text-accent mb-1" />
                  <span className="text-accent/70 text-[9px] uppercase tracking-wider mt-0.5">Boost Actif</span>
                </div>
                <span className={cn("text-accent font-semibold", isTablet ? "text-xl" : "text-sm")}>x1.5</span>
              </Card>
            </StaggerItem>
          </StaggerContainer>

          {/* Recent Transactions */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-white/80 font-medium text-sm uppercase tracking-wider">Activité Récente</h3>
            </div>
            
            <StaggerContainer className="space-y-2">
              {transactions.slice(0, 4).map((tx, i) => (
                <StaggerItem key={tx.id}>
                  <ParallaxItem yOffset={5 + i * 2}>
                    <Card 
                      variant="glass" 
                      padding="sm" 
                      onPress={() => setSelectedTx(tx)}
                      className="flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          tx.type === 'roundup' ? "bg-white/10 text-white" :
                          tx.type === 'deposit' ? "bg-accent/20 text-accent" :
                          "bg-white/5 text-white/50"
                        )}>
                          {tx.type === 'roundup' ? <Zap size={16} /> : 
                           tx.type === 'deposit' ? <ArrowDownLeft size={16} /> : 
                           <ArrowUpRight size={16} />}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{tx.description}</p>
                          <p className="text-white/40 text-[10px] mt-0.5 uppercase tracking-wider">
                            {format(new Date(tx.date), 'dd MMM • HH:mm', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={cn(
                          "font-medium text-sm",
                          tx.type === 'withdrawal' ? "text-white/70" : "text-white"
                        )}>
                          {tx.type === 'withdrawal' ? '-' : '+'}
                        </span>
                        <AmountDisplay amount={tx.amount} isHidden={isAmountHidden} size="sm" showCurrency={true} />
                      </div>
                    </Card>
                  </ParallaxItem>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </FadeTransition>
  );
}
