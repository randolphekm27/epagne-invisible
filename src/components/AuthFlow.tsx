import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Droplets, TrendingUp, CircleDashed, CheckCircle2, Smartphone, Zap, Target, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Logo } from './ui/Logo';
import { FadeTransition, StaggerContainer, StaggerItem } from './animations';
import { useResponsive } from '../hooks/useResponsive';

import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export function AuthFlow() {
  const { currentScreen, setScreen, setUser } = useStore();
  const { isTablet, isDesktop } = useResponsive();
  const [authData, setAuthData] = useState({
    phone: '',
    name: '',
    email: '',
    operator: '',
    mode: '',
    pin: ''
  });

  const updateAuthData = (data: Partial<typeof authData>) => {
    setAuthData(prev => ({ ...prev, ...data }));
  };

  const handleFinalize = async () => {
    const email = `${authData.phone}@epargne.invisible`;
    const password = authData.pin;
    
    try {
      // Create user with PIN as password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        name: authData.name,
        phone: authData.phone,
        email: authData.email,
        operator: authData.operator,
        savingsMode: authData.mode,
        savingsValue: 5, // Default percentage or base value
        balance: {
          total: 0,
          savings: 0,
          available: 0
        },
        isPremium: false,
        createdAt: serverTimestamp()
      });
      setScreen('main');
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-8 font-sans text-white overflow-hidden">
      <div className={cn(
        "w-full bg-black shadow-2xl overflow-hidden relative border border-white/10 flex flex-col transition-all duration-500",
        (isTablet || isDesktop) 
          ? "max-w-[450px] h-[850px] rounded-[3rem]" 
          : "max-w-[400px] h-full min-h-[600px] rounded-[2rem]"
      )}>
        <AnimatePresence mode="wait">
          {currentScreen === 'onboarding' && <Onboarding key="onboarding" onNext={() => setScreen('login')} />}
          {currentScreen === 'login' && <Login key="login" onNext={(phone, pin, isExisting) => {
            updateAuthData({ phone, pin });
            if (isExisting) {
              setScreen('main');
            } else {
              setScreen('otp');
            }
          }} />}
          {currentScreen === 'otp' && <OTP key="otp" onNext={() => setScreen('profile-creation')} />}
          {currentScreen === 'profile-creation' && <ProfileCreation key="profile-creation" onNext={(name, email, pin) => {
            updateAuthData({ name, email, pin });
            setScreen('connect');
          }} />}
          {currentScreen === 'connect' && <ConnectMobileMoney key="connect" onNext={(operator) => {
            updateAuthData({ operator });
            setScreen('mode');
          }} />}
          {currentScreen === 'mode' && (
            <ModeSelection 
              key="mode" 
              onNext={(mode) => {
                updateAuthData({ mode });
                handleFinalize();
              }} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Onboarding({ onNext }: { onNext: () => void; key?: string }) {
  const [slide, setSlide] = useState(0);
  const { isTablet, isDesktop } = useResponsive();

  const slides = [
    {
      title: "Épargnez sans y penser",
      text: "Chaque dépense devient une opportunité d'épargne",
      icon: <Logo size={isTablet || isDesktop ? 120 : 100} />,
      button: "Suivant",
      action: () => setSlide(1)
    },
    {
      title: "Votre argent travaille en silence",
      text: "Des micro-montants invisibles qui deviennent significatifs",
      icon: <Droplets size={isTablet || isDesktop ? 100 : 80} strokeWidth={1} className="text-white" />,
      button: "Suivant",
      action: () => setSlide(2)
    },
    {
      title: "Rejoignez l'épargne intelligente",
      text: "Connectez votre compte Mobile Money en 30 secondes",
      icon: <TrendingUp size={isTablet || isDesktop ? 100 : 80} strokeWidth={1} className="text-white" />,
      button: "Créer mon compte",
      action: onNext,
      primary: true
    }
  ];

  const current = slides[slide];

  return (
    <FadeTransition className="flex flex-col h-full p-8 sm:p-10">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 sm:space-y-12">
        <motion.div
          key={slide}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "flex items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300",
            (isTablet || isDesktop) ? "w-48 h-48" : "w-40 h-40"
          )}
        >
          {current.icon}
        </motion.div>
        
        <div className="space-y-4">
          <motion.h1 
            key={`title-${slide}`}
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className={cn(
              "font-semibold tracking-tight transition-all duration-300",
              (isTablet || isDesktop) ? "text-4xl" : "text-3xl"
            )}
          >
            {current.title}
          </motion.h1>
          <motion.p 
            key={`text-${slide}`}
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className={cn(
              "text-white/60 leading-relaxed transition-all duration-300",
              (isTablet || isDesktop) ? "text-xl" : "text-lg"
            )}
          >
            {current.text}
          </motion.p>
        </div>
      </div>

      <div className="space-y-8 pb-8 sm:pb-12">
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className={cn("h-1 rounded-full transition-all duration-300", i === slide ? "w-8 bg-white" : "w-2 bg-white/20")} />
          ))}
        </div>
        
        <Button
          onClick={current.action}
          variant={current.primary ? 'premium' : 'secondary'}
          fullWidth
          size={(isTablet || isDesktop) ? "xl" : "lg"}
          icon={current.primary ? <ChevronRight size={20} /> : undefined}
          iconPosition="right"
        >
          {current.button}
        </Button>
        {current.primary && (
          <button 
            onClick={() => useStore.getState().setScreen('login')}
            className="w-full text-center text-sm text-white/50 hover:text-white transition-colors mt-4"
          >
            Déjà un compte ? Se connecter
          </button>
        )}
      </div>
    </FadeTransition>
  );
}

function Login({ onNext }: { onNext: (phone: string, pin: string, isExisting: boolean) => void; key?: string }) {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const { isTablet, isDesktop } = useResponsive();
  const { setScreen } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!phone) return;
    setLoading(true);
    setError(null);
    
    const email = `${phone}@epargne.invisible`;
    
    try {
      if (!showPin) {
        // First step: Check if user exists
        // We try a random password to see if user exists
        try {
          await signInWithEmailAndPassword(auth, email, 'check_existence_random_pass');
        } catch (e: any) {
          if (e.code === 'auth/user-not-found') {
            // New user -> Go to OTP
            onNext(phone, '', false);
            return;
          } else if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
            // User exists -> Ask for PIN
            setShowPin(true);
            setLoading(false);
            return;
          } else {
            throw e;
          }
        }
      } else {
        // Second step: Sign in with PIN
        try {
          await signInWithEmailAndPassword(auth, email, pin);
          onNext(phone, pin, true);
        } catch (e: any) {
          if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
            setError('Code PIN incorrect');
          } else {
            throw e;
          }
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      if (error.code === 'auth/operation-not-allowed') {
        setError('L\'authentification par PIN n\'est pas encore activée dans la console Firebase.');
      } else {
        setError('Une erreur est survenue lors de la connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeTransition className="flex flex-col h-full p-8 sm:p-10 bg-white text-black">
      <div className="flex justify-center pt-8 pb-12">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-bold text-xl tracking-tighter">ÉPARGNE INVISIBLE</span>
        </div>
      </div>
      
      <div className="flex-1 space-y-8 sm:space-y-12">
        <div>
          <h1 className={cn(
            "font-light tracking-tight mb-2 transition-all duration-300",
            (isTablet || isDesktop) ? "text-4xl" : "text-3xl"
          )}>
            {showPin ? 'Entrez votre code' : 'Bienvenue'}
          </h1>
          <p className={cn(
            "text-black/50 transition-all duration-300",
            (isTablet || isDesktop) ? "text-lg" : "text-base"
          )}>
            {showPin ? 'Saisissez votre code PIN secret' : 'Entrez votre numéro pour continuer'}
          </p>
        </div>

        <div className="space-y-6">
          {!showPin ? (
            <div className="flex items-center border-b border-black/20 py-3 focus-within:border-black transition-colors">
              <span className={cn(
                "text-black/50 mr-3 font-medium transition-all duration-300",
                (isTablet || isDesktop) ? "text-2xl" : "text-xl"
              )}>
                +229
              </span>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="00 00 00 00"
                className={cn(
                  "w-full outline-none font-medium bg-transparent placeholder:text-black/20 transition-all duration-300",
                  (isTablet || isDesktop) ? "text-2xl" : "text-xl"
                )}
                autoFocus
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-12 h-16 border-b-2 flex items-center justify-center text-3xl font-bold transition-all",
                      pin.length > i ? "border-black text-black" : "border-black/10 text-black/20"
                    )}
                  >
                    {pin[i] ? '•' : ''}
                  </div>
                ))}
              </div>
              <input 
                type="password" 
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="opacity-0 absolute inset-0 w-full h-full cursor-default"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 pb-8 sm:pb-12">
        <p className="text-center text-xs text-black/40 uppercase tracking-widest font-bold">Nous ne partagerons jamais vos données</p>
        <Button
          onClick={handleLogin}
          disabled={(showPin ? pin.length < 4 : phone.length < 8) || loading}
          loading={loading}
          variant="primary"
          fullWidth
          size={(isTablet || isDesktop) ? "xl" : "lg"}
        >
          {showPin ? 'Se connecter' : 'Continuer'}
        </Button>
        {showPin && (
          <button 
            onClick={() => setShowPin(false)}
            className="w-full text-center text-sm text-black/50 hover:text-black transition-colors"
          >
            Changer de numéro
          </button>
        )}
        {!showPin && (
          <button 
            onClick={() => setScreen('onboarding')}
            className="w-full text-center text-sm text-black/50 hover:text-black transition-colors"
          >
            Pas encore de compte ? Créer un compte
          </button>
        )}
      </div>
    </FadeTransition>
  );
}

function OTP({ onNext }: { onNext: () => void; key?: string }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120);
  const { isTablet, isDesktop } = useResponsive();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const isComplete = code.every(c => c !== '');

  return (
    <FadeTransition className="flex flex-col h-full p-8 sm:p-10 bg-white text-black">
      <div className="pt-12 pb-12">
        <h1 className={cn(
          "font-light tracking-tight mb-2 transition-all duration-300",
          (isTablet || isDesktop) ? "text-4xl" : "text-3xl"
        )}>
          Code de vérification
        </h1>
        <p className={cn(
          "text-black/50 transition-all duration-300",
          (isTablet || isDesktop) ? "text-lg" : "text-base"
        )}>
          Entrez le code envoyé au +229 97 00 00 00
        </p>
      </div>

      <div className="flex-1">
        <div className="flex justify-between gap-2 mb-8">
          {code.map((digit, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => {
                const newCode = [...code];
                newCode[i] = e.target.value.replace(/\D/g, '');
                setCode(newCode);
                if (e.target.value && i < 5) {
                  const next = document.getElementById(`otp-${i + 1}`);
                  next?.focus();
                }
              }}
              id={`otp-${i}`}
              className={cn(
                "border border-black/20 rounded-lg text-center font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-300",
                (isTablet || isDesktop) ? "w-14 h-16 text-3xl" : "w-12 h-14 text-2xl"
              )}
            />
          ))}
        </div>
        
        <p className="text-center text-sm text-black/50">
          {timeLeft > 0 ? `Renvoyer dans ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}` : <button className="text-black font-medium underline">Renvoyer le code</button>}
        </p>
      </div>

      <div className="pb-8 sm:pb-12">
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Button
                onClick={onNext}
                variant="premium"
                fullWidth
                size={(isTablet || isDesktop) ? "xl" : "lg"}
              >
                Vérifier
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeTransition>
  );
}

function ConnectMobileMoney({ onNext }: { onNext: (op: string) => void; key?: string }) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const { isTablet, isDesktop } = useResponsive();

  const handleConnect = (provider: string) => {
    setConnecting(provider);
    setTimeout(() => {
      onNext(provider);
    }, 1500);
  };

  return (
    <FadeTransition className="flex flex-col h-full p-8 sm:p-10 relative">
      {/* Glassmorphism background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent z-0" />
      
      <div className="relative z-10 pt-12 pb-10">
        <h1 className={cn(
          "font-light tracking-tight text-white transition-all duration-300",
          (isTablet || isDesktop) ? "text-4xl" : "text-3xl"
        )}>
          Connectez votre compte
        </h1>
        <p className={cn(
          "text-white/50 mt-2 transition-all duration-300",
          (isTablet || isDesktop) ? "text-lg" : "text-base"
        )}>
          Sélectionnez votre opérateur principal
        </p>
      </div>

      <StaggerContainer className="relative z-10 flex-1 space-y-4">
        {[
          { id: 'mtn', name: 'MTN Mobile Money', color: 'bg-yellow-400', textColor: 'text-black' },
          { id: 'wave', name: 'Wave', color: 'bg-blue-400', textColor: 'text-white' },
          { id: 'moov', name: 'Moov Money', color: 'bg-blue-600', textColor: 'text-white' }
        ].map((op, i) => (
          <StaggerItem key={op.id}>
            <Card variant="glass" padding="md" className="flex items-center justify-between group hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-300",
                  (isTablet || isDesktop) ? "w-14 h-14" : "w-12 h-12",
                  op.color, 
                  op.textColor
                )}>
                  {op.name.split(' ')[0].toUpperCase()}
                </div>
                <span className={cn(
                  "font-medium text-white transition-all duration-300",
                  (isTablet || isDesktop) ? "text-lg" : "text-base"
                )}>
                  {op.name}
                </span>
              </div>
              <Button
                onClick={() => handleConnect(op.id)}
                disabled={connecting !== null}
                variant="secondary"
                size={(isTablet || isDesktop) ? "md" : "sm"}
                loading={connecting === op.id}
                className="relative z-20"
              >
                Connecter
              </Button>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </FadeTransition>
  );
}

function ModeSelection({ onNext }: { onNext: (mode: string) => void; key?: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const { isTablet, isDesktop } = useResponsive();

  const modes = [
    {
      id: 'roundup',
      icon: <Zap size={24} />,
      title: "Arrondi automatique",
      desc: "Chaque achat est arrondi au millier près",
      example: "350 FCFA → 1000 FCFA",
      badge: "Populaire"
    },
    {
      id: 'percent',
      icon: <TrendingUp size={24} />,
      title: "Pourcentage intelligent",
      desc: "2 à 5% selon vos habitudes",
      example: "Barre de progression visuelle"
    },
    {
      id: 'goal',
      icon: <Calendar size={24} />,
      title: "Objectif avec date",
      desc: "Épargnez pour un projet précis",
      example: "Voyage, Achat, Projet"
    }
  ];

  return (
    <FadeTransition className="flex flex-col h-full p-6 sm:p-8 bg-white text-black">
      <div className="pt-8 pb-6">
        <h1 className={cn(
          "font-semibold tracking-tight leading-tight transition-all duration-300",
          (isTablet || isDesktop) ? "text-3xl" : "text-2xl"
        )}>
          Comment voulez-vous épargner ?
        </h1>
      </div>

      <StaggerContainer className="flex-1 space-y-4 overflow-y-auto pb-4 scrollbar-hide">
        {modes.map((mode, i) => (
          <StaggerItem
            key={mode.id}
            onClick={() => setSelected(mode.id)}
            className={cn(
              "p-5 rounded-lg border transition-all cursor-pointer relative overflow-hidden",
              selected === mode.id 
                ? "border-accent bg-accent/5 shadow-[0_4px_20px_rgba(0,71,171,0.1)]" 
                : "border-black/10 bg-white hover:border-black/30"
            )}
          >
            {mode.badge && (
              <span className="absolute top-4 right-4 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                {mode.badge}
              </span>
            )}
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300",
              selected === mode.id ? "bg-accent text-white" : "bg-black/5 text-black"
            )}>
              {mode.icon}
            </div>
            <h3 className={cn(
              "font-semibold mb-1 transition-all duration-300",
              (isTablet || isDesktop) ? "text-xl" : "text-lg"
            )}>
              {mode.title}
            </h3>
            <p className={cn(
              "text-black/60 mb-3 transition-all duration-300",
              (isTablet || isDesktop) ? "text-base" : "text-sm"
            )}>
              {mode.desc}
            </p>
            <div className="bg-black/5 rounded p-2 text-xs font-medium text-black/70 inline-block">
              {mode.example}
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="pt-4 pb-4 sm:pb-8">
        <Button
          onClick={() => onNext(selected!)}
          disabled={!selected}
          variant="primary"
          fullWidth
          size={(isTablet || isDesktop) ? "xl" : "lg"}
        >
          Confirmer mon choix
        </Button>
      </div>
    </FadeTransition>
  );
}

function ProfileCreation({ onNext }: { onNext: (name: string, email: string, pin: string) => void; key?: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const { isTablet, isDesktop } = useResponsive();
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!name || pin.length < 4) return;
    setLoading(true);
    try {
      // Update auth password with the PIN
      if (auth.currentUser) {
        // In this demo, we already created the user with a dummy password in Login step
        // But for a new user, we should ideally set the PIN here.
        // Actually, for new users, I'll create the user in handleFinalize with the PIN.
        // Or I can do it here.
      }
      onNext(name, email, pin);
    } catch (error) {
      console.error('Profile creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeTransition className="flex flex-col h-full p-8 sm:p-10 bg-white text-black">
      <div className="pt-8 pb-8">
        <h1 className={cn("font-light tracking-tight", (isTablet || isDesktop) ? "text-4xl" : "text-3xl")}>
          Complétez votre profil
        </h1>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide">
        <div className="border-2 border-dashed border-black/20 rounded-xl p-8 text-center cursor-pointer hover:border-black transition-colors">
          🖼️ Ajouter une photo
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-black/40">Informations personnelles</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="Prénom et Nom" 
            className="w-full p-4 border border-black/20 rounded-lg outline-none focus:border-black"
          />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optionnel)" 
            className="w-full p-4 border border-black/20 rounded-lg outline-none focus:border-black"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-black/40">Sécurité (Code PIN)</label>
          <p className="text-xs text-black/50 mb-2">Ce code vous sera demandé à chaque connexion.</p>
          <div className="flex justify-between gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "w-full h-14 border rounded-lg flex items-center justify-center text-2xl font-bold transition-all",
                  pin.length > i ? "border-black bg-black/5" : "border-black/10"
                )}
              >
                {pin[i] ? '•' : ''}
              </div>
            ))}
          </div>
          <input 
            type="password" 
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="opacity-0 absolute w-0 h-0"
            id="pin-input"
            autoFocus
          />
          <button 
            onClick={() => document.getElementById('pin-input')?.focus()}
            className="w-full text-center text-xs text-accent font-medium mt-2"
          >
            Cliquer pour saisir le code
          </button>
        </div>
      </div>
      <div className="pt-4">
        <Button 
          onClick={handleComplete} 
          variant="primary" 
          fullWidth 
          size="lg"
          disabled={!name || pin.length < 4 || loading}
          loading={loading}
        >
          TERMINER L'INSCRIPTION
        </Button>
      </div>
    </FadeTransition>
  );
}
