'use client';

import { useRouter } from 'next/navigation';
import Flourish from '@/components/screens/Flourish';
import { SCREEN_PATHS, type Screen } from '@/lib/screens';

export default function FlourishRoute() {
  const router = useRouter();

  return <Flourish onNavigate={(screen: Screen) => router.push(SCREEN_PATHS[screen])} />;
}
