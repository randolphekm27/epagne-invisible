import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Shield, CreditCard, Bell, LogOut, ChevronRight, Lock, User, Star, HelpCircle, ArrowLeft, Smartphone, Plus, Smartphone as PhoneIcon, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { FadeTransition, StaggerContainer, StaggerItem, ParallaxItem } from '../components/animations';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useResponsive } from '../hooks/useResponsive';
import { cn } from '../utils/cn';
import { ToggleSwitch, ListItem } from '../components/ui/ProfileComponents';

type SubPage = 'main' | 'identity' | 'premium' | 'accounts' | 'savings' | 'notifications' | 'privacy' | 'language' | 'support' | 'about';

export function Profile() {
  const { user, setScreen } = useStore();
  const { isTablet, isDesktop } = useResponsive();
  const [activeSubPage, setActiveSubPage] = useState<SubPage>('main');

  const menuItems = [
    { id: 'identity' as SubPage, icon: User, label: 'Identité & infos', value: 'Jean Dupont' },
    { id: 'premium' as SubPage, icon: Star, label: 'Statut abonnement', value: 'Gratuit' },
    { id: 'accounts' as SubPage, icon: CreditCard, label: 'Comptes connectés', value: '2 comptes' },
    { id: 'savings' as SubPage, icon: Settings, label: 'Préférences d\'épargne', value: 'Arrondi' },
    { id: 'notifications' as SubPage, icon: Bell, label: 'Notifications', value: '' },
    { id: 'privacy' as SubPage, icon: Lock, label: 'Confidentialité', value: '' },
    { id: 'language' as SubPage, icon: Smartphone, label: 'Langue', value: 'Français' },
    { id: 'support' as SubPage, icon: HelpCircle, label: 'Aide & Support', value: '' },
    { id: 'about' as SubPage, icon: Shield, label: 'À propos', value: '' },
  ];

  const renderSubPage = () => {
    switch (activeSubPage) {
      case 'identity':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Identité & informations</h2>
            <div className="space-y-4">
              <ListItem label="Nom complet" value={user?.name} />
              <ListItem label="Email" value={user?.email} />
              <ListItem label="Téléphone" value={user?.phone} />
              <ListItem label="Membre depuis" value={user?.memberSince} />
            </div>
          </div>
        );
      case 'premium':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Abonnement Premium</h2>
            {useStore.getState().isPremium ? (
              <Card variant="glass" className="p-6 text-center">
                <Sparkles className="text-accent mx-auto mb-4" size={48} />
                <h3 className="text-2xl font-bold text-white mb-2">Vous êtes Premium !</h3>
                <p className="text-zinc-400">Profitez de toutes les fonctionnalités avancées.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card variant="glass" className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Avantages Premium</h3>
                  <ul className="space-y-2 text-zinc-400">
                    <li className="flex items-center gap-2">✓ Épargne illimitée</li>
                    <li className="flex items-center gap-2">✓ Objectifs multiples</li>
                    <li className="flex items-center gap-2">✓ Statistiques détaillées</li>
                  </ul>
                </Card>
                <Button variant="premium" fullWidth onClick={() => useStore.getState().upgradeToPremium()}>
                  Passer Premium (2000 FCFA/mois)
                </Button>
              </div>
            )}
          </div>
        );
      case 'accounts':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Comptes connectés</h2>
            <div className="space-y-4">
              {useStore.getState().accounts.map(account => (
                <Card key={account.id} variant="glass" className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-white">{account.provider.toUpperCase()}</div>
                    <div>
                      <p className="font-medium text-zinc-200">{account.provider.toUpperCase()} Money</p>
                      <p className="text-xs text-zinc-500">{account.number}</p>
                    </div>
                  </div>
                  {account.isMain && <Badge text="Principal" variant="success" size="sm" />}
                </Card>
              ))}
              <Button variant="outline" fullWidth icon={<Plus size={18} />}>Ajouter un compte</Button>
            </div>
          </div>
        );
      case 'savings':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Préférences d'épargne</h2>
            <div className="space-y-4">
              <ListItem label="Mode d'épargne" value={useStore.getState().savingsPreferences.mode} />
              <ListItem label="Taux d'épargne" value={`${useStore.getState().savingsPreferences.rate}%`} />
              <ToggleSwitch 
                label="Épargne automatique" 
                checked={useStore.getState().savingsPreferences.autoSavings} 
                onChange={() => useStore.getState().updateSavingsPreferences({ autoSavings: !useStore.getState().savingsPreferences.autoSavings })}
              />
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Notifications</h2>
            <div className="space-y-2">
              {Object.entries(useStore.getState().notifications).map(([key, value]) => (
                <ToggleSwitch 
                  key={key} 
                  label={key.charAt(0).toUpperCase() + key.slice(1)} 
                  checked={value} 
                  onChange={() => useStore.getState().toggleNotification(key)}
                />
              ))}
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Confidentialité</h2>
            <div className="space-y-4">
              <ListItem label="Supprimer mon compte" onClick={() => {}} icon={LogOut} />
            </div>
          </div>
        );
      case 'language':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Langue</h2>
            <div className="space-y-4">
              <ListItem label="Français" onClick={() => useStore.getState().setLanguage('fr')} />
              <ListItem label="English" onClick={() => useStore.getState().setLanguage('en')} />
            </div>
          </div>
        );
      case 'support':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Aide & Support</h2>
            <div className="space-y-4">
              <ListItem label="FAQ" onClick={() => {}} icon={HelpCircle} />
              <ListItem label="Contacter le support" onClick={() => {}} icon={PhoneIcon} />
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">À propos</h2>
            <div className="space-y-4">
              <ListItem label="Version" value="1.0.0" />
              <ListItem label="Conditions d'utilisation" onClick={() => {}} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <FadeTransition className={cn(
      "p-6 pb-24 space-y-6 bg-black text-white min-h-full",
      isTablet && "p-10",
      isDesktop && "p-12 max-w-6xl mx-auto"
    )}>
      <AnimatePresence mode="wait">
        {activeSubPage === 'main' ? (
          <motion.div
            key="main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <header className="mb-8 pt-4">
              <h1 className={cn(
                "font-semibold tracking-tight",
                isTablet ? "text-3xl" : "text-2xl"
              )}>
                Profil
              </h1>
            </header>

            <div className={cn(
              "flex flex-col gap-8",
              isTablet && "grid grid-cols-12 items-start"
            )}>
              {/* Profile Header & Premium Banner */}
              <div className={cn(
                "space-y-8",
                isTablet && "col-span-5"
              )}>
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "rounded-full bg-white/10 flex items-center justify-center border border-white/20",
                    isTablet ? "w-24 h-24" : "w-20 h-20"
                  )}>
                    <User size={isTablet ? 40 : 32} className="text-white/50" />
                  </div>
                  <div>
                    <h2 className={cn("font-semibold text-white", isTablet ? "text-2xl" : "text-xl")}>{user?.name || 'Utilisateur'}</h2>
                    <p className="text-white/50 text-sm mt-1">{user?.phone || '+229 00 00 00 00'}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full border border-white/5">
                      <Star size={12} className="text-accent fill-accent" />
                      <span className="text-xs font-medium text-white">Niveau 1</span>
                    </div>
                  </div>
                </div>

                {/* Premium Banner */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card variant="glass" className="bg-gradient-to-r from-accent/20 to-accent/5 border-accent/20 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-10 -mt-10" />
                    <div className="relative z-10">
                      <h3 className="text-white font-medium flex items-center gap-2">
                        <Star size={16} className="text-accent fill-accent" />
                        Passez à Premium
                      </h3>
                      <p className="text-white/60 text-xs mt-2 leading-relaxed max-w-[80%]">
                        Débloquez des objectifs illimités, des analyses avancées et un support prioritaire.
                      </p>
                      <Button variant="secondary" size="sm" className="mt-4" onClick={() => useStore.getState().setPremiumModalOpen(true)}>
                        Voir les offres
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Menu List */}
              <div className={cn(
                isTablet && "col-span-7"
              )}>
                <StaggerContainer className={cn(
                  "space-y-2",
                  isDesktop && "grid grid-cols-2 gap-4 space-y-0"
                )}>
                  {menuItems.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <StaggerItem key={item.label}>
                        <ParallaxItem yOffset={5 + i * 2}>
                          <Card
                            variant="glass"
                            padding="sm"
                            onPress={() => setActiveSubPage(item.id)}
                            className="flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer h-full"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
                                <Icon size={20} />
                              </div>
                              <span className="text-white font-medium text-sm">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {item.value && <span className="text-white/40 text-xs">{item.value}</span>}
                              <ChevronRight size={16} className="text-white/30" />
                            </div>
                          </Card>
                        </ParallaxItem>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>

                {/* Logout Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8"
                >
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<LogOut size={20} />}
                    onPress={() => setScreen('onboarding')}
                    className="text-red-400 border-red-400/20 hover:bg-red-400/10"
                  >
                    Déconnexion
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="subpage"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <button 
              onClick={() => setActiveSubPage('main')}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft size={20} />
              <span>Retour au profil</span>
            </button>
            {renderSubPage()}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="text-center mt-8">
        <p className="text-white/30 text-xs">Épargne Invisible v1.0.0</p>
      </div>
    </FadeTransition>
  );
}
