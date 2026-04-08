import { create } from 'zustand';

export type Screen = 'onboarding' | 'login' | 'otp' | 'profile-creation' | 'connect' | 'mode' | 'main' | 'goal-detail';
export type Tab = 'dashboard' | 'goals' | 'challenges' | 'profile';

export interface User {
  id: string;
  name: string;
  balance: {
    total: number;
    savings: number;
    available: number;
  };
  savingsMode: string;
  savingsValue: number;
  operator: string;
  phone?: string;
  level?: number;
  email: string;
  memberSince: string;
  isPremium: boolean;
}

export interface Account {
  id: string;
  provider: 'mtn' | 'wave' | 'moov';
  number: string;
  connectedAt: string;
  isMain: boolean;
}

export interface SavingsPreferences {
  mode: 'roundup' | 'percent' | 'goal' | 'hybrid';
  rate: number;
  dailyCap: number;
  transactionCap: number;
  autoSavings: boolean;
  noSavingsDays: number;
  withdrawalDelay: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'roundup';
  date: string;
  description: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
  icon: string;
  color?: string;
  bg?: string;
  completed?: boolean;
}

interface AppState {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isAmountHidden: boolean;
  toggleAmountHidden: () => void;
  selectedGoalId: string | null;
  setSelectedGoalId: (id: string | null) => void;
  
  user: User | null;
  setUser: (user: User | null) => void;
  setGoals: (goals: Goal[]) => void;
  setTransactions: (txs: Transaction[]) => void;
  setAccounts: (accounts: Account[]) => void;
  transactions: Transaction[];
  goals: Goal[];
  challenges: Challenge[];
  accounts: Account[];
  savingsPreferences: SavingsPreferences;
  notifications: Record<string, boolean>;
  isDarkMode: boolean;
  language: string;
  isPremium: boolean;
  isPremiumModalOpen: boolean;
  
  addTransaction: (tx: Transaction) => void;
  updateBalance: (amount: number) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  addChallenge: (challenge: Challenge) => void;
  updateChallengeProgress: (id: string, progress: number) => void;
  updateSavingsPreferences: (prefs: Partial<SavingsPreferences>) => void;
  toggleNotification: (key: string) => void;
  toggleDarkMode: () => void;
  setLanguage: (lang: string) => void;
  upgradeToPremium: () => void;
  setPremiumModalOpen: (open: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  currentScreen: 'onboarding',
  setScreen: (screen) => set({ currentScreen: screen }),
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),
  isAmountHidden: true,
  toggleAmountHidden: () => set((state) => ({ isAmountHidden: !state.isAmountHidden })),
  selectedGoalId: null,
  setSelectedGoalId: (id) => set({ selectedGoalId: id }),

  user: null,
  setUser: (user) => set({ user }),
  setGoals: (goals) => set({ goals }),
  setTransactions: (transactions) => set({ transactions }),
  setAccounts: (accounts) => set({ accounts }),
  transactions: [],
  goals: [],
  challenges: [
    {
      id: 'c1',
      title: 'Semaine sans café',
      description: 'Économisez 5000 FCFA en préparant votre café à la maison.',
      reward: 50,
      progress: 3,
      total: 7,
      icon: 'coffee',
      color: 'text-white',
      bg: 'bg-white/10'
    },
    {
      id: 'c2',
      title: 'Arrondi Turbo',
      description: 'Doublez vos arrondis pendant 3 jours.',
      reward: 100,
      progress: 1,
      total: 3,
      icon: 'zap',
      color: 'text-accent',
      bg: 'bg-accent/20'
    },
    {
      id: 'c3',
      title: 'Épargnant Constant',
      description: 'Faites un dépôt manuel 5 jours de suite.',
      reward: 200,
      progress: 5,
      total: 5,
      icon: 'flame',
      color: 'text-orange-500',
      bg: 'bg-orange-500/20',
      completed: true
    }
  ],
  accounts: [],
  savingsPreferences: {
    mode: 'roundup',
    rate: 5,
    dailyCap: 1000,
    transactionCap: 500,
    autoSavings: true,
    noSavingsDays: 3,
    withdrawalDelay: 24
  },
  notifications: {
    savingsAlerts: true,
    newChallenges: true,
    weeklyReports: true,
    security: true,
    promotions: false,
    social: false
  },
  isDarkMode: true,
  language: 'fr',
  isPremium: false,
  isPremiumModalOpen: false,
  
  addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
  updateBalance: (amount) => set((state) => ({ 
    user: state.user ? { 
      ...state.user, 
      balance: {
        ...state.user.balance,
        total: state.user.balance.total + amount,
        savings: state.user.balance.savings + amount
      }
    } : null 
  })),
  addGoal: (goal) => set((state) => ({ goals: [goal, ...state.goals] })),
  updateGoal: (id, updates) => set((state) => ({
    goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g)
  })),
  addChallenge: (challenge) => set((state) => ({ challenges: [challenge, ...state.challenges] })),
  updateChallengeProgress: (id, progress) => set((state) => ({
    challenges: state.challenges.map(c => c.id === id ? { ...c, progress, completed: progress >= c.total } : c)
  })),
  updateSavingsPreferences: (prefs) => set((state) => ({ savingsPreferences: { ...state.savingsPreferences, ...prefs } })),
  toggleNotification: (key) => set((state) => ({ notifications: { ...state.notifications, [key]: !state.notifications[key] } })),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setLanguage: (lang) => set((state) => ({ language: lang })),
  upgradeToPremium: () => set({ isPremium: true, isPremiumModalOpen: false }),
  setPremiumModalOpen: (open) => set({ isPremiumModalOpen: open }),
}));
