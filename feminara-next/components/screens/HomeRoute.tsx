'use client';

import { useRouter } from 'next/navigation';
import Home from '@/components/screens/Home';
import { SCREEN_PATHS, type Screen } from '@/lib/screens';

export default function HomeRoute() {
  const router = useRouter();

  return <Home onNavigate={(screen: Screen) => router.push(SCREEN_PATHS[screen])} />;
}

