import React from 'react';
import { MobileLayout } from './components/MobileLayout';
import { AuthFlow } from './components/AuthFlow';
import { Dashboard } from './pages/Dashboard';
import { Goals } from './pages/Goals';
import { Challenges } from './pages/Challenges';
import { Profile } from './pages/Profile';
import { GoalDetail } from './pages/GoalDetail';
import { useStore } from './store/useStore';
import { PremiumPage } from './components/PremiumPage';

export default function App() {
  const { currentScreen, activeTab, isPremiumModalOpen, setPremiumModalOpen } = useStore();

  if (['onboarding', 'login', 'otp', 'profile-creation', 'connect', 'mode'].includes(currentScreen)) {
    return <AuthFlow />;
  }

  if (currentScreen === 'goal-detail') {
    return (
      <MobileLayout>
        <GoalDetail />
        {isPremiumModalOpen && <PremiumPage onClose={() => setPremiumModalOpen(false)} />}
      </MobileLayout>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'goals':
        return <Goals />;
      case 'challenges':
        return <Challenges />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MobileLayout>
      {renderTab()}
      {isPremiumModalOpen && <PremiumPage onClose={() => setPremiumModalOpen(false)} />}
    </MobileLayout>
  );
}

