import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Zap, Shield, TrendingUp, Users, Target, BarChart3, Clock, Gift, CreditCard, Award, FileText, Smartphone, Bell, Heart, Sparkles, X } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import { FadeTransition, StaggerContainer, StaggerItem } from './animations';

interface PremiumPageProps {
  onClose: () => void;
}

export function PremiumPage({ onClose }: PremiumPageProps) {
  const { user, upgradeToPremium } = useStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'benefits' | 'payment'>('benefits');

  const proFeatures = [
    { icon: Target, title: "Objectifs illimités", desc: "Créez autant de cagnottes que vous voulez." },
    { icon: Zap, title: "Arrondi Multiplié", desc: "Multipliez par 2, 5 ou 10 votre épargne auto." },
    { icon: BarChart3, title: "Analyses Avancées", desc: "Graphiques précis de vos revenus vs épargne." },
    { icon: Shield, title: "Support Prioritaire", desc: "Une équipe dédiée pour vous aider 24/7." },
    { icon: Users, title: "Épargne de Groupe", desc: "Épargnez à plusieurs pour des projets communs." },
    { icon: Award, title: "Badge Exclusif", desc: "Marquez votre prestige sur votre profil." },
    { icon: FileText, title: "Rapports PDF/Excel", desc: "Exportez vos relevés pour votre comptabilité." },
    { icon: Smartphone, title: "Multi-Comptes", desc: "Liez MTN, Moov et Wave simultanément." },
    { icon: Clock, title: "Épargne Plannifiée", desc: "Virements programmés en plus des arrondis." },
    { icon: Gift, title: "Réductions Partenaires", desc: "Bénéficiez de promos chez nos marchands." },
    { icon: Bell, title: "Alertes Budget", desc: "Ne dépassez plus jamais vos limites de dépenses." },
    { icon: Heart, title: "Micro-Assurance", desc: "Couverture santé offerte selon votre épargne." },
    { icon: TrendingUp, title: "Conseils IA", desc: "Recommandations personnalisées pour épargner plus." },
    { icon: Shield, title: "Coffre-Fort Numérique", desc: "Stockage chiffré de vos documents financiers." },
    { icon: Sparkles, title: "Thèmes Premium", desc: "Personnalisez entièrement l'interface de l'app." },
  ];

  const handleSubscribe = async () => {
    setLoading(true);
    // Simulate payment process
    setTimeout(() => {
      upgradeToPremium();
      setLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-2000 bg-black overflow-y-auto">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 p-6 flex justify-between items-center bg-black/50 backdrop-blur-xl border-b border-white/5">
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Star className="text-accent fill-accent" size={18} />
            <span className="font-bold tracking-tighter text-lg uppercase">Épargne Pro</span>
          </div>
          <div className="w-10" />
        </header>

        <div className="flex-1 p-6 space-y-12 pb-32">
          {step === 'benefits' ? (
            <>
              {/* Hero */}
              <div className="text-center space-y-4 pt-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-20 h-20 bg-accent/20 rounded-3xl mx-auto flex items-center justify-center border border-accent/30 shadow-[0_0_30px_rgba(0,71,171,0.3)]"
                >
                  <Sparkles size={40} className="text-accent" />
                </motion.div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Passez au niveau supérieur</h1>
                <p className="text-zinc-400 max-w-xs mx-auto">
                  Débloquez toute la puissance de l'Épargne Invisible avec le mode Premium.
                </p>
              </div>

              {/* Price Card */}
              <Card variant="glass" className="bg-linear-to-br from-accent/20 to-black border-accent/30 p-8 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3">
                  <Badge text="OFFRE LIMITÉE" variant="warning" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-end justify-center gap-1 mb-4">
                    <span className="text-4xl font-bold text-white">2 500</span>
                    <span className="text-zinc-400 mb-1 font-medium">FCFA / mois</span>
                  </div>
                  <p className="text-sm text-accent font-medium mb-6 italic">“Le meilleur investissement, c'est celui que vous faites pour votre avenir.”</p>
                  <Button variant="premium" fullWidth size="xl" onClick={() => setStep('payment')}>
                    Activer maintenant
                  </Button>
                </div>
              </Card>

              {/* Features Grid */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white px-2">15+ Fonctionnalités Pro</h2>
                <StaggerContainer className="grid grid-cols-1 gap-3">
                  {proFeatures.map((feature, i) => (
                    <StaggerItem key={i}>
                      <Card variant="glass" className="p-4 flex gap-4 items-start border-white/5 hover:border-accent/30 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent shrink-0">
                          <feature.icon size={20} />
                        </div>
                        <div>
                          <h3 className="text-white font-medium text-sm">{feature.title}</h3>
                          <p className="text-zinc-500 text-xs mt-0.5">{feature.desc}</p>
                        </div>
                      </Card>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </>
          ) : (
            <FadeTransition className="space-y-8 pt-4">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-white">Paiement Sécurisé</h1>
                <p className="text-zinc-400">Choisissez votre moyen de paiement Mobile Money.</p>
              </div>

              <div className="space-y-4">
                <button className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#ffcb05] flex items-center justify-center font-bold text-black">MTN</div>
                    <div className="text-left">
                      <p className="font-bold text-white">MTN Mobile Money</p>
                      <p className="text-xs text-zinc-500">Paiement instantané par push OTP</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-white/20 group-hover:border-accent flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>

                <button className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1c98d7] flex items-center justify-center font-bold text-white">Wave</div>
                    <div className="text-left">
                      <p className="font-bold text-white">Wave Mobile Money</p>
                      <p className="text-xs text-zinc-500">Scannez ou recevez une demande</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-white/20" />
                </button>

                <button className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#00a651] flex items-center justify-center font-bold text-white">Moov</div>
                    <div className="text-left">
                      <p className="font-bold text-white">Moov Money</p>
                      <p className="text-xs text-zinc-500">Paiement par code USSD</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-white/20" />
                </button>
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Abonnement Mensuel</span>
                  <span className="text-white font-bold">2 500 FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Frais de transaction</span>
                  <span className="text-white font-bold">0 FCFA</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-accent">2 500 FCFA</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-4">
                <Button 
                  variant="premium" 
                  fullWidth 
                  size="xl" 
                  onClick={handleSubscribe} 
                  loading={loading}
                  disabled={loading}
                >
                  Confirmer le paiement
                </Button>
                <button 
                  onClick={() => setStep('benefits')}
                  className="text-white/40 text-sm hover:text-white transition-colors"
                >
                  Revenir aux avantages
                </button>
              </div>

              <p className="text-[10px] text-zinc-600 text-center px-10 leading-relaxed">
                En confirmant, vous autorisez Épargne Invisible à prélever 2 500 FCFA chaque mois. Vous pouvez annuler à tout moment depuis les réglages.
              </p>
            </FadeTransition>
          )}
        </div>
      </div>
    </div>
  );
}

function Badge({ text, variant }: { text: string, variant: 'warning' | 'success' }) {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter",
      variant === 'warning' ? "bg-amber-500 text-black" : "bg-emerald-500 text-white"
    )}>
      {text}
    </span>
  );
}
