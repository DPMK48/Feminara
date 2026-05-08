'use client';

import AppIcon, { type AppIconName } from './AppIcon';
import FlowerLogo from './FlowerLogo';

type Screen = 'home' | 'journal' | 'community' | 'flourish' | 'spark' | 'glow' | 'bloom' | 'profile';

interface SidebarProps {
  current: Screen;
  onNavigate: (s: Screen) => void;
}

const navItems: { id: Screen; icon: AppIconName; label: string }[] = [
  { id: 'home',      icon: 'home',  label: 'Home' },
  { id: 'journal',   icon: 'book',  label: 'Journal' },
  { id: 'community', icon: 'users', label: 'Community' },
];

const sections: { id: Screen; icon: AppIconName; label: string }[] = [
  { id: 'flourish', icon: 'leaf',     label: 'Flourish' },
  { id: 'spark',    icon: 'zap',      label: 'Spark' },
  { id: 'glow',     icon: 'sparkles', label: 'Glow' },
  { id: 'bloom',    icon: 'flower',   label: 'Bloom' },
];

export default function Sidebar({ current, onNavigate }: SidebarProps) {
  return (
    <nav id="sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-6 w-full">
        <FlowerLogo size={36} color="white" centerColor="#7CCFDE" />
        <span
          className="sb-logo-text hidden text-white font-bold text-lg tracking-wide"
          style={{ display: 'none' }}
        >
          FEMINARA
        </span>
      </div>

      {/* Main nav */}
      <div className="flex flex-col gap-1 w-full px-0">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sb-btn${current === item.id ? ' on' : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
          >
            <span style={{ minWidth: 22, display: 'flex', justifyContent: 'center' }}>
              <AppIcon name={item.icon} size={18} />
            </span>
            <span className="sb-label hidden" style={{ display: 'none' }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="w-full px-0 mt-4">
        <p
          id="sb-sections-label"
          className="hidden text-xs font-semibold uppercase tracking-widest px-3 mb-2"
          style={{ color: 'rgba(255,255,255,0.4)', display: 'none' }}
        >
          Sections
        </p>
        <div className="flex flex-col gap-1">
          {sections.map((item) => (
            <button
              key={item.id}
              className={`sb-btn${current === item.id ? ' on' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
            >
              <span style={{ minWidth: 22, display: 'flex', justifyContent: 'center' }}>
                <AppIcon name={item.icon} size={18} />
              </span>
              <span className="sb-label hidden" style={{ display: 'none' }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile at bottom */}
      <div className="flex-1" />
      <button
        className={`sb-btn w-full${current === 'profile' ? ' on' : ''}`}
        onClick={() => onNavigate('profile')}
        aria-label="Profile"
        style={{ marginBottom: 8 }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#7CCFDE,#2899B4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            fontWeight: 700,
            color: '#fff',
            minWidth: 32,
          }}
        >
          A
        </div>
        <span
          className="sb-label hidden text-sm font-medium"
          style={{ color: 'rgba(255,255,255,0.9)', display: 'none' }}
        >
          Amara
        </span>
      </button>
    </nav>
  );
}
