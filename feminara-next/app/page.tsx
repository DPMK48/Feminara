'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import Auth from '@/components/screens/Auth';
import HomeRoute from '@/components/screens/HomeRoute';
import Onboarding from '@/components/screens/Onboarding';
import Splash from '@/components/screens/Splash';
import { useAuth } from '@/contexts/AuthContext';
import { SCREEN_PATHS, SCREEN_STORAGE_KEY, SCREENS, type Screen } from '@/lib/screens';
import { setupChunkErrorRecovery, setupServiceWorker } from '@/lib/service-worker';

type FlowState = 'splash' | 'onboarding' | 'auth';

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [flow, setFlow] = useState<FlowState>('splash');
  const [restoringScreen, setRestoringScreen] = useState(false);

  useEffect(() => {
    setupServiceWorker();
    return setupChunkErrorRecovery();
  }, []);

  useEffect(() => {
    if (loading || !user || typeof window === 'undefined') return;

    const stored = window.localStorage.getItem(SCREEN_STORAGE_KEY);
    if (stored && SCREENS.includes(stored as Screen) && stored !== 'home') {
      setRestoringScreen(true);
      router.replace(SCREEN_PATHS[stored as Screen]);
      return;
    }

    setRestoringScreen(false);
  }, [loading, router, user]);

  if (loading || restoringScreen) return null;

  if (user) {
    return <AppShell current="home" screen={<HomeRoute />} />;
  }

  if (flow === 'splash') {
    return <Splash onContinue={() => setFlow('onboarding')} />;
  }

  if (flow === 'onboarding') {
    return <Onboarding onComplete={() => setFlow('auth')} />;
  }

  return <Auth onAuth={() => {}} />;
}
