'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import Splash from '@/components/screens/Splash';
import Onboarding from '@/components/screens/Onboarding';
import Auth from '@/components/screens/Auth';
import Home from '@/components/screens/Home';
import Flourish from '@/components/screens/Flourish';
import Spark from '@/components/screens/Spark';
import Glow from '@/components/screens/Glow';
import Bloom from '@/components/screens/Bloom';
import Journal from '@/components/screens/Journal';
import Community from '@/components/screens/Community';
import Profile from '@/components/screens/Profile';

type FlowState = 'splash' | 'onboarding' | 'auth';
type Screen = 'home' | 'journal' | 'community' | 'flourish' | 'spark' | 'glow' | 'bloom' | 'profile';

const SCREEN_STORAGE_KEY = 'feminara_current_screen';
const SCREENS: Screen[] = ['home', 'journal', 'community', 'flourish', 'spark', 'glow', 'bloom', 'profile'];

export default function Page() {
  const { user, loading, logout } = useAuth();
  const [flow, setFlow] = useState<FlowState>('splash');
  const [screen, setScreen] = useState<Screen>('home');

  // Register service worker
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  // Sync sidebar label visibility with window width
  useEffect(() => {
    if (!user) return;
    const sync = () => {
      const isDesktop = window.innerWidth >= 1024;
      document.querySelectorAll('.sb-label, .sb-logo-text, #sb-sections-label').forEach((el) => {
        (el as HTMLElement).style.display = isDesktop ? 'block' : 'none';
      });
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [user]);

  useEffect(() => {
    if (!user || typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(SCREEN_STORAGE_KEY);
    if (stored && SCREENS.includes(stored as Screen)) {
      setScreen(stored as Screen);
    }
  }, [user]);

  // While auth is being restored from localStorage, show nothing
  if (loading) return null;

  // If logged in, show the main app
  if (user) {
    const handleNavigate = (s: Screen) => {
      setScreen(s);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SCREEN_STORAGE_KEY, s);
      }
    };

    const handleLogout = () => {
      logout();
      setFlow('auth');
    };

    const screenMap: Record<Screen, React.ReactNode> = {
      home:      <Home onNavigate={handleNavigate} />,
      journal:   <Journal />,
      community: <Community />,
      flourish:  <Flourish onNavigate={handleNavigate} />,
      spark:     <Spark />,
      glow:      <Glow />,
      bloom:     <Bloom />,
      profile:   <Profile />,
    };

    return (
      <div
        id="app-root"
        style={{ display: 'flex', height: '100dvh', overflow: 'hidden', background: '#F5FBFD' }}
      >
        <Sidebar current={screen} onNavigate={handleNavigate} />
        <div
          id="main-area"
          style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', height: '100%' }}
        >
          {screenMap[screen]}
        </div>
        <BottomNav current={screen} onNavigate={handleNavigate} />
      </div>
    );
  }

  // Pre-auth flow
  if (flow === 'splash') {
    return <Splash onContinue={() => setFlow('onboarding')} />;
  }

  if (flow === 'onboarding') {
    return <Onboarding onComplete={() => setFlow('auth')} />;
  }

  // Auth screen — onAuth is handled by AuthContext (login sets user), page re-renders
  return <Auth onAuth={() => {}} />;
}
