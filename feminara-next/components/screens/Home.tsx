'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppIcon, { type AppIconName } from '../AppIcon';

type Screen = 'home' | 'journal' | 'community' | 'flourish' | 'spark' | 'glow' | 'bloom' | 'profile';

interface HomeProps {
  onNavigate: (s: Screen) => void;
}

const featureCards: { id: Screen; icon: AppIconName; title: string; sub: string; grad: string }[] = [
  {
    id: 'flourish' as Screen,
    icon: 'leaf',
    title: 'FLOURISH',
    sub: 'Mental Health & Relationships',
    grad: 'grad-fl',
  },
  {
    id: 'spark' as Screen,
    icon: 'zap',
    title: 'SPARK',
    sub: 'Skills & Empowerment',
    grad: 'grad-sp',
  },
  {
    id: 'glow' as Screen,
    icon: 'sparkles',
    title: 'GLOW',
    sub: 'Nutrition & Body Care',
    grad: 'grad-gl',
  },
  {
    id: 'bloom' as Screen,
    icon: 'flower',
    title: 'BLOOM',
    sub: 'Maternal & Menstrual Health',
    grad: 'grad-bm',
  },
];

const affirmations = [
  'You are strong, capable, and worthy of every good thing.',
  'Your growth and healing matter deeply.',
  'Today, you choose yourself — and that is enough.',
];

export default function Home({ onNavigate }: HomeProps) {
  const { user } = useAuth();
  const [mood, setMood] = useState<string>('—');
  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const affirmation = affirmations[today.getDate() % affirmations.length];
  const firstName = user?.name?.split(' ')[0] ?? 'Friend';
  const firstInitial = firstName?.[0]?.toUpperCase() ?? 'F';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedMood = localStorage.getItem('feminara_mood');
    setMood(savedMood ?? '—');
  }, []);

  return (
    <div className="section-scroll">
      <div className="screen-hdr" style={{ paddingTop: 28 }}>
        {/* Greeting */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-medium" style={{ color: '#7CCFDE', display: 'flex', alignItems: 'center', gap: 6 }}>
              {greeting}
              <AppIcon name="sparkles" size={14} className="text-[#7CCFDE]" />
            </p>
            <h1 className="text-2xl font-bold" style={{ color: '#0B4F6C' }}>
              {firstName}
            </h1>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#7CCFDE,#2899B4)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 18,
              fontWeight: 700,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {firstInitial}
          </button>
        </div>

        {/* Affirmation card */}
        <div className="affirmation-card mb-5">
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ opacity: 0.7 }}>
            Daily Affirmation
          </p>
          <p className="text-sm font-medium leading-relaxed">&ldquo;{affirmation}&rdquo;</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Day', value: '14', sub: 'of cycle' },
            { label: 'Mood', value: mood, sub: 'today' },
            { label: 'Streak', value: '7', sub: 'days' },
          ].map((stat) => (
            <div key={stat.label} className="card text-center py-3 px-2">
              <p className="text-xl font-bold" style={{ color: '#0B4F6C' }}>
                {stat.value}
              </p>
              <p className="text-xs font-medium" style={{ color: '#7CCFDE' }}>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Feature grid */}
        <h2 className="text-base font-semibold mb-3" style={{ color: '#0B4F6C' }}>
          Your Sections
        </h2>
        <div className="feature-grid mb-6">
          {featureCards.map((card) => (
            <button
              key={card.id}
              className={`${card.grad} rounded-2xl p-4 text-white text-left cursor-pointer border-0 font-sans`}
              style={{
                minHeight: 120,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 4px 16px rgba(40,153,180,0.18)',
              }}
              onClick={() => onNavigate(card.id)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = '';
              }}
            >
              <AppIcon name={card.icon} size={26} className="text-white" />
              <div>
                <p className="font-bold text-sm tracking-wide">{card.title}</p>
                <p className="text-xs font-light opacity-80 leading-tight mt-0.5">{card.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Recent activity */}
        <h2 className="text-base font-semibold mb-3" style={{ color: '#0B4F6C' }}>
          Recent Activity
        </h2>
        <div className="flex flex-col gap-3 mb-6">
          {[
            { icon: 'pen', title: 'Journal entry', sub: 'Gratitude & intentions', time: '2h ago' },
            { icon: 'leaf', title: 'Mood logged', sub: 'Feeling calm & focused', time: 'Yesterday' },
            { icon: 'flower', title: 'Cycle updated', sub: 'Day 14 — Follicular phase', time: 'Today' },
          ].map((item, i) => (
            <div key={i} className="card flex items-center gap-3 p-3">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: '#EBF8FC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AppIcon name={item.icon as AppIconName} size={20} className="text-[#2899B4]" />
              </div>
              <div style={{ flex: 1 }}>
                <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
                  {item.title}
                </p>
                <p className="text-xs" style={{ color: '#7CCFDE' }}>
                  {item.sub}
                </p>
              </div>
              <span className="text-xs" style={{ color: '#B0E4EF' }}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
