'use client';

import AppIcon, { type AppIconName } from './AppIcon';

type Screen = 'home' | 'journal' | 'community' | 'flourish' | 'spark' | 'glow' | 'bloom' | 'profile';

interface BottomNavProps {
  current: Screen;
  onNavigate: (s: Screen) => void;
}

const items: { id: Screen; icon: AppIconName; label: string }[] = [
  { id: 'home',      icon: 'home',  label: 'Home' },
  { id: 'journal',   icon: 'book',  label: 'Journal' },
  { id: 'community', icon: 'users', label: 'Community' },
  { id: 'profile',   icon: 'user',  label: 'Profile' },
];

export default function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={`bn-btn${current === item.id ? ' on' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <AppIcon name={item.icon} size={22} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
