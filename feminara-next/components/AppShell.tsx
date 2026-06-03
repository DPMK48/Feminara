'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';
import { SCREEN_PATHS, SCREEN_STORAGE_KEY, type Screen, screenFromPath } from '@/lib/screens';
import { setupChunkErrorRecovery, setupServiceWorker } from '@/lib/service-worker';

interface AppShellProps {
  screen: React.ReactNode;
  current?: Screen;
}

export default function AppShell({ screen, current }: AppShellProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const activeScreen = current ?? screenFromPath(pathname);

  useEffect(() => {
    setupServiceWorker();
    return setupChunkErrorRecovery();
  }, []);

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
    if (loading || user || pathname === '/') return;
    router.replace('/');
  }, [loading, pathname, router, user]);

  useEffect(() => {
    if (!user || typeof window === 'undefined') return;
    window.localStorage.setItem(SCREEN_STORAGE_KEY, activeScreen);
  }, [activeScreen, user]);

  if (loading) return null;
  if (!user) return null;

  const handleNavigate = (screen: Screen) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SCREEN_STORAGE_KEY, screen);
    }
    router.push(SCREEN_PATHS[screen]);
  };

  return (
    <div
      id="app-root"
      style={{ display: 'flex', height: '100dvh', overflow: 'hidden', background: '#F5FBFD' }}
    >
      <Sidebar current={activeScreen} onNavigate={handleNavigate} />
      <div
        id="main-area"
        style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', height: '100%' }}
      >
        {screen}
      </div>
      <BottomNav current={activeScreen} onNavigate={handleNavigate} />
    </div>
  );
}
