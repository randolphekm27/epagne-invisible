import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Target, Trophy, User, Menu, X, Zap } from 'lucide-react';
import { useStore, Tab } from '../store/useStore';
import { cn } from '../utils/cn';
import { TabTransition } from './animations';
import { useResponsive } from '../hooks/useResponsive';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const ScrollContext = createContext<React.RefObject<HTMLDivElement> | null>(null);

export function useScrollContainer() {
  return useContext(ScrollContext);
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const { activeTab, setActiveTab } = useStore();
  const { isTablet, isDesktop, deviceType } = useResponsive();
  const [previousTab, setPreviousTab] = useState<Tab>(activeTab);
  const [direction, setDirection] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Accueil', icon: Home },
    { id: 'goals', label: 'Objectifs', icon: Target },
    { id: 'challenges', label: 'Défis', icon: Trophy },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  useEffect(() => {
    if (activeTab !== previousTab) {
      const prevIndex = tabs.findIndex(t => t.id === previousTab);
      const nextIndex = tabs.findIndex(t => t.id === activeTab);
      setDirection(nextIndex > prevIndex ? 1 : -1);
      setPreviousTab(activeTab);
      
      // Auto-close sidebar on mobile/tablet when tab changes
      if (!isDesktop) setIsSidebarOpen(false);
    }
  }, [activeTab, previousTab, tabs, isDesktop]);

  const NavItem: React.FC<{ tab: { id: Tab; label: string; icon: React.ElementType }, isSidebar?: boolean }> = ({ tab, isSidebar = false }) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    
    return (
      <button
        onClick={() => setActiveTab(tab.id)}
        className={cn(
          "flex items-center justify-center transition-all duration-300 relative group",
          isSidebar 
            ? "w-full justify-start gap-4 px-6 py-4 hover:bg-white/5" 
            : "flex-col w-16 gap-1.5"
        )}
      >
        <div className="relative">
          <Icon 
            size={isSidebar ? 24 : 22} 
            strokeWidth={isActive ? 2.5 : 2}
            className={cn(
              "transition-colors duration-300",
              isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
            )} 
          />
          {isActive && !isSidebar && (
            <motion.div
              layoutId="activeTabDot"
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </div>
        <span className={cn(
          "font-medium transition-colors duration-300",
          isSidebar ? "text-base" : "text-[10px]",
          isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
        )}>
          {tab.label}
        </span>
        {isActive && isSidebar && (
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute left-0 w-1 h-6 bg-accent rounded-r-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </button>
    );
  };

  return (
    <ScrollContext.Provider value={scrollRef}>
      <div className="min-h-screen bg-black flex font-sans text-white overflow-hidden">
        
        {/* Sidebar for Desktop / Tablet */}
        {(isDesktop || (isTablet && isSidebarOpen)) && (
          <motion.aside
            initial={isTablet ? { x: -300 } : false}
            animate={{ x: 0 }}
            className={cn(
              "h-screen bg-zinc-950 border-r border-white/10 flex flex-col z-100",
              isDesktop ? "w-64" : "fixed top-0 left-0 w-72 shadow-2xl"
            )}
          >
            <div className="p-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Zap size={18} className="text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight">Invisible</span>
              </div>
              {isTablet && (
                <button onClick={() => setIsSidebarOpen(false)} className="text-white/50 hover:text-white">
                  <X size={24} />
                </button>
              )}
            </div>

            <nav className="flex-1 py-4">
              {tabs.map(tab => (
                <NavItem key={tab.id} tab={tab} isSidebar />
              ))}
            </nav>

            <div className="p-6">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Statut</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Synchronisé</span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}

        {isTablet && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-90"
          />
        )}

        {/* Main Content Container */}
        <div className={cn(
          "flex-1 flex flex-col relative h-screen overflow-hidden transition-all duration-300",
          (isTablet && isSidebarOpen) && "ml-72"
        )}>
          
          {/* Top Bar for Mobile/Tablet */}
          {!isDesktop && (
            <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-md z-50">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="font-bold text-base tracking-tight">Invisible</span>
              </div>
              {isTablet && (
                <button onClick={() => setIsSidebarOpen(true)} className="text-white/70 hover:text-white">
                  <Menu size={24} />
                </button>
              )}
            </header>
          )}

          {/* Content Area */}
          <main 
            ref={scrollRef} 
            className={cn(
              "flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide relative z-10",
              !isDesktop && "pb-24"
            )}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <TabTransition key={activeTab} direction={direction as any} className="h-full">
                {children}
              </TabTransition>
            </AnimatePresence>
          </main>

          {/* Bottom Navigation (Mobile Only) */}
          {!isTablet && !isDesktop && (
            <div className="fixed bottom-0 left-0 w-full h-24 bg-black/80 backdrop-blur-xl border-t border-white/10 flex justify-around items-start pt-4 px-2 z-50">
              {tabs.map((tab) => (
                <NavItem key={tab.id} tab={tab} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollContext.Provider>
  );
}
