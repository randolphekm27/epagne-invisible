import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Droplets, TrendingUp, CircleDashed, CheckCircle2, Smartphone, Zap, Target, Calendar, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Logo } from './ui/Logo';
import { FadeTransition, StaggerContainer, StaggerItem } from './animations';
import { useResponsive } from '../hooks/useResponsive';
import { supabase } from '../lib/supabase';

export function AuthFlow() {
  const { currentScreen, setScreen } = useStore();
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
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      
      const isDemo = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' || 
                     (import.meta as any).env.VITE_ENABLE_DEMO === 'true';

      if (!supabaseUser && isDemo) {
        // MOCK SESSION for testing if not logged in
        console.warn("No real session found. Creating mock user for Demo.");
        useStore.getState().setUser({
          id: 'demo-user-' + Math.random().toString(36).substr(2, 9),
          name: authData.name || 'Épargnant Démo',
          balance: { total: 0, savings: 0, available: 0 },
          savingsMode: authData.mode || 'roundup',
          savingsValue: 1000,
          operator: authData.operator || 'mtn',
          email: authData.email || '',
          memberSince: new Date().toISOString(),
          isPremium: false
        });
        setScreen('activation');
        return;
      }

      if (!supabaseUser) {
        alert("Session expirée. Veuillez vous reconnecter.");
        setScreen('login');
        return;
      }

      // 1. Create/Update Profile
      // ... (rest of the code below remains same but wrapped in the check)
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: supabaseUser.id,
        full_name: authData.name,
        phone: authData.phone,
        savings_mode: authData.mode,
        savings_value: authData.mode === 'roundup' ? 1000 : 5,
        created_at: new Date().toISOString()
      });

      if (profileError) throw profileError;

      // 2. Create Initial Account
      if (authData.operator) {
        await supabase.from('accounts').insert({
          user_id: supabaseUser.id,
          provider: authData.operator,
          number: authData.phone,
          is_main: true
        });
      }

      // 3. Create initial goals
      await supabase.from('goals').insert({
        user_id: supabaseUser.id,
        title: "Épargne de secours",
        target_amount: 50000,
        current_amount: 0,
        icon: 'zap',
        is_completed: false
      });
      
      await useStore.getState().fetchUserData(supabaseUser.id);
      setScreen('activation');
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-6 sm:p-8 font-sans text-white overflow-hidden bg-black">
      <div className={cn(
        "w-full bg-zinc-950 shadow-2xl overflow-hidden relative border border-white/10 flex flex-col transition-all duration-500",
        (isTablet || isDesktop) 
          ? "max-w-[450px] h-[850px] rounded-5xl" 
          : "max-w-[400px] h-full min-h-[600px] rounded-4xl"
      )}>
        <AnimatePresence mode="wait">
          {currentScreen === 'onboarding' && <Welcome key="onboarding" onNext={() => setScreen('login')} />}
          
          {currentScreen === 'login' && <Login key="login" onNext={(phone, operator, isExisting) => {
            updateAuthData({ phone, operator });
            if (isExisting) {
              setScreen('otp'); // Both paths go to OTP as per new requirement
            } else {
              setScreen('otp');
            }
          }} />}
          
          {currentScreen === 'otp' && <OTP key="otp" phone={authData.phone} onNext={async () => {
            // Check if user has a profile already
            const { data: profile } = await supabase.from('profiles').select('id').eq('phone', authData.phone).single();
            if (profile) {
              setScreen('main');
            } else {
              setScreen('profile-creation');
            }
          }} />}
          
          {currentScreen === 'profile-creation' && <ProfileCreation key="profile-creation" onNext={(name) => {
            updateAuthData({ name });
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

          {currentScreen === 'activation' && (
            <Activation key="activation" onStart={() => setScreen('main')} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Écran 1: Bienvenue ---
function Welcome({ onNext }: { onNext: () => void; key?: string }) {
  const { isTablet, isDesktop } = useResponsive();
  
  return (
    <FadeTransition className="flex flex-col h-full p-8 sm:p-10 justify-between">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-48 h-48 flex items-center justify-center rounded-full bg-accent/10 border border-accent/20"
        >
          <Logo size={120} />
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Épargne sans y penser.</h1>
          <p className="text-xl text-white/60">Commencez maintenant.</p>
        </div>
      </div>

      <div className="pb-8">
        <Button onClick={onNext} variant="premium" fullWidth size="xl" icon={<ChevronRight size={20} />} iconPosition="right">
          Créer mon compte
        </Button>
      </div>
    </FadeTransition>
  );
}

// --- Écran 2: Numéro de téléphone & Opérateur ---
function Login({ onNext }: { onNext: (phone: string, op: string, isExisting: boolean) => void; key?: string }) {
  const [phone, setPhone] = useState('');
  const [operator, setOperator] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSendCode = async () => {
    if (phone.length < 10) return;
    setLoading(true);
    
    try {
      // Step 1: Check if user exists (more robust)
      let exists = false;
      try {
        const { data } = await supabase.rpc('check_user_exists', { phone_val: phone });
        exists = !!data;
      } catch (e) {
        console.warn("RPC check failed, assuming new user", e);
      }
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+229${phone}`,
      });

      if (error) {
        // Special handling for Dev/Testing if SMS provider is missing
        const isDemo = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' || 
                       (import.meta as any).env.VITE_ENABLE_DEMO === 'true';

        if (isDemo) {
          console.warn("SMS Error detected. Bypassing because Demo Mode is enabled.");
          onNext(phone, operator, exists);
          return;
        }
        throw error;
      }
      onNext(phone, operator, !!exists);
    } catch (e: any) {
      console.error(e);
      alert("Erreur: " + (e.message || "Erreur inconnue") + "\n\nNote: Vérifiez si les SMS sont activés dans Supabase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeTransition className="flex flex-col h-full p-8 bg-zinc-950">
      <div className="pt-8 space-y-2">
        <h1 className="text-3xl font-bold">Votre numéro</h1>
        <p className="text-white/50">Entrez votre numéro mobile money</p>
      </div>

      <div className="flex-1 mt-12 space-y-8">
        <div className="flex items-center border-b border-white/10 py-4 focus-within:border-accent transition-colors">
          <span className="text-2xl font-medium mr-4 text-white/40">+229</span>
          <input 
            type="tel" value={phone} 
            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0,10))}
            placeholder="01 00 00 00 00"
            className="bg-transparent text-2xl font-medium outline-none w-full"
            autoFocus
          />
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-white/30">Choisir l'opérateur</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'mtn', color: 'bg-yellow-400', text: 'MTN' },
              { id: 'wave', color: 'bg-blue-400', text: 'Wave' },
              { id: 'moov', color: 'bg-blue-600', text: 'Moov' }
            ].map(op => (
              <button
                key={op.id}
                onClick={() => setOperator(op.id)}
                className={cn(
                  "p-4 rounded-xl border transition-all flex flex-col items-center gap-2",
                  operator === op.id ? "border-accent bg-accent/10" : "border-white/5 bg-white/5"
                )}
              >
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black", op.color, op.id === 'mtn' ? 'text-black' : 'text-white')}>
                  {op.text[0]}
                </div>
                <span className="text-[10px] font-bold">{op.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pb-8 space-y-6">
        <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-2xl border border-accent/10">
          <ShieldCheck className="text-accent" size={20} />
          <p className="text-xs text-white/60 leading-tight">
            Nous ne partagerons jamais vos informations. Sécurité maximale.
          </p>
        </div>
        <Button 
          onClick={handleSendCode} 
          disabled={phone.length < 10 || loading} 
          loading={loading}
          variant="primary" fullWidth size="lg"
        >
          Envoyer le code
        </Button>
      </div>
    </FadeTransition>
  );
}

// --- Écran 3: Vérification OTP ---
function OTP({ onNext, phone }: { onNext: () => void | Promise<void>; phone: string; key?: string }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) return;
    setLoading(true);
    try {
      // Bypassing for demo if code is 123456
      const isDemo = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' || 
                     (import.meta as any).env.VITE_ENABLE_DEMO === 'true';

      if (isDemo && fullCode === '123456') {
        console.warn("Bypassing OTP verification for Demo Mode.");
        onNext();
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        phone: `+229${phone}`,
        token: fullCode,
        type: 'sms',
      });
      if (error) throw error;
      onNext();
    } catch (e) {
      alert("Code invalide. Simulation: 123456");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeTransition className="flex flex-col h-full p-8 bg-zinc-950">
      <div className="pt-8 space-y-2">
        <h1 className="text-3xl font-bold">Vérification</h1>
        <p className="text-white/50">Code envoyé au +229 {phone}</p>
      </div>

      <div className="flex-1 mt-12">
        <div className="flex justify-between gap-2">
          {code.map((digit, i) => (
            <input
              key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit}
              onChange={e => {
                const newCode = [...code];
                newCode[i] = e.target.value.replace(/\D/g, '');
                setCode(newCode);
                if (e.target.value && i < 5) document.getElementById(`otp-${i+1}`)?.focus();
              }}
              className="w-12 h-16 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-bold focus:border-accent outline-none"
            />
          ))}
        </div>
        <button className="w-full text-center text-sm text-accent mt-8 font-medium">Renvoyer le code</button>
      </div>

      <div className="pb-8">
        <Button onClick={verifyOtp} disabled={code.some(c => !c) || loading} loading={loading} variant="premium" fullWidth size="lg">
          Valider
        </Button>
      </div>
    </FadeTransition>
  );
}

// --- Écran 4: Créer un profil ---
function ProfileCreation({ onNext }: { onNext: (name: string) => void; key?: string }) {
  const [name, setName] = useState('');
  
  return (
    <FadeTransition className="flex flex-col h-full p-8 bg-zinc-950">
      <div className="pt-8 space-y-2">
        <h1 className="text-3xl font-bold">Créer un profil</h1>
        <p className="text-white/50">Comptons ensemble votre épargne.</p>
      </div>

      <div className="flex-1 mt-12 space-y-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center text-white/30 hover:border-accent hover:text-accent transition-colors cursor-pointer">
            📷
          </div>
          <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Ajouter un avatar</span>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-white/30">Votre Nom ou Pseudo</label>
          <input 
            type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Ex: Koffi"
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-lg outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="pb-8 space-y-6">
        <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
          <p className="text-xs text-blue-400 leading-relaxed text-center">
            “L’épargne commence automatiquement dès votre première transaction.”
          </p>
        </div>
        <Button onClick={() => onNext(name)} disabled={!name} variant="primary" fullWidth size="lg">
          Continuer
        </Button>
      </div>
    </FadeTransition>
  );
}

// --- Écran 5: Choix du mode d'épargne ---
function ModeSelection({ onNext }: { onNext: (mode: string) => void; key?: string }) {
  const [selected, setSelected] = useState<string | null>(null);

  const modes = [
    { id: 'roundup', icon: <Zap size={24} />, title: "Arrondi automatique", desc: "Chaque achat est arrondi au millier près" },
    { id: 'percent', icon: <TrendingUp size={24} />, title: "Pourcentage intelligent", desc: "2% à 10% selon vos habitudes" },
    { id: 'goal', icon: <Target size={24} />, title: "Objectif avec date", desc: "Épargnez pour un projet précis" }
  ];

  return (
    <FadeTransition className="flex flex-col h-full p-8 bg-zinc-950">
      <div className="pt-8 space-y-2">
        <h1 className="text-3xl font-bold">Votre mode</h1>
        <p className="text-white/50">Comment voulez-vous épargner ?</p>
      </div>

      <div className="flex-1 mt-12 space-y-4 overflow-y-auto scrollbar-hide">
        {modes.map(mode => (
          <Card 
            key={mode.id} variant="glass" 
            onPress={() => setSelected(mode.id)}
            className={cn(
              "p-5 border flex items-center gap-4 transition-all cursor-pointer",
              selected === mode.id ? "border-accent bg-accent/10" : "border-white/5 bg-white/5"
            )}
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", selected === mode.id ? "bg-accent text-white" : "bg-white/10 text-white/50")}>
              {mode.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg leading-tight">{mode.title}</h3>
              <p className="text-xs text-white/50 mt-1">{mode.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="pb-8 pt-4">
        <Button onClick={() => onNext(selected!)} disabled={!selected} variant="primary" fullWidth size="lg">
          Valider mon choix
        </Button>
      </div>
    </FadeTransition>
  );
}

// --- Écran 6: Activation ---
function Activation({ onStart }: { onStart: () => void; key?: string }) {
  return (
    <FadeTransition className="flex flex-col h-full p-8 bg-zinc-950 items-center justify-center text-center">
      <div className="space-y-8">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }}
          className="w-32 h-32 mx-auto bg-green-500 rounded-full flex items-center justify-center"
        >
          <CheckCircle2 size={64} className="text-white" />
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Tout est prêt !</h1>
          <p className="text-lg text-white/60">Votre épargne invisible commence maintenant.</p>
        </div>

        <Button onClick={onStart} variant="premium" fullWidth size="xl">
          Commencer
        </Button>
      </div>
    </FadeTransition>
  );
}
