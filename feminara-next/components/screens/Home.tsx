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

const fallbackQuote = {
  quote: 'Your future needs your best today.',
  author: 'Unknown',
};

const notices = [
  {
    tag: 'Health Alert',
    title: 'Breakout of Ebola virus nearby',
    detail: 'Women should be cautious and seek care early for fever, weakness, or bleeding.',
    tips: ['Wash hands often', 'Avoid direct contact with bodily fluids', 'Visit a clinic if symptoms appear'],
    time: 'Today',
  },
  {
    tag: 'Community Support',
    title: 'Free fertilization distribution',
    detail: 'Government distribution at East Market Clinic, 9am to 3pm this Friday.',
    tips: ['Bring a valid ID', 'Arrive early for queue numbers', 'Ask the nurse for guidance'],
    time: 'This week',
  },
];

export default function Home({ onNavigate }: HomeProps) {
  const { user } = useAuth();
  const [mood, setMood] = useState<string>('—');
  const [dailyQuote, setDailyQuote] = useState(fallbackQuote);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [cycleDay, setCycleDay] = useState<string>('_');
  const [streakCount, setStreakCount] = useState<string>('0');
  const [openNotices, setOpenNotices] = useState<Record<string, boolean>>({});
  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? 'Friend';
  const firstInitial = firstName?.[0]?.toUpperCase() ?? 'F';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedMood = localStorage.getItem('feminara_mood');
    setMood(savedMood ?? '—');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('feminara_glow_active_challenges');
    if (!stored) {
      setStreakCount('0');
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setStreakCount(String(parsed.length));
        return;
      }
    } catch {
      // Ignore parse issues and fall back to 0.
    }
    setStreakCount('0');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedStart = localStorage.getItem('feminara_period_start');
    const storedDuration = localStorage.getItem('feminara_period_duration');

    if (!storedStart || !storedDuration) {
      setCycleDay('_');
      return;
    }

    const start = new Date(storedStart);
    const duration = Number(storedDuration);
    if (Number.isNaN(start.getTime()) || !Number.isFinite(duration) || duration <= 0) {
      setCycleDay('_');
      return;
    }

    const diff = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
    const day = diff >= 0 ? (diff % duration) + 1 : null;
    setCycleDay(day ? String(day) : '_');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const todayKey = new Date().toISOString().slice(0, 10);
    const cached = localStorage.getItem(`feminara_daily_quote_${todayKey}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed?.quote && parsed?.author) {
          setDailyQuote(parsed);
          setQuoteLoading(false);
          return;
        }
      } catch {
        // Ignore cache parse issues.
      }
    }

    const loadQuote = async () => {
      try {
        const response = await fetch('/api/quotes/daily');
        if (!response.ok) throw new Error('Failed to load quote');
        const data = await response.json();
        if (data?.quote && data?.author) {
          setDailyQuote({ quote: data.quote, author: data.author });
          localStorage.setItem(`feminara_daily_quote_${todayKey}`,
            JSON.stringify({ quote: data.quote, author: data.author })
          );
        }
      } catch {
        setDailyQuote(fallbackQuote);
      } finally {
        setQuoteLoading(false);
      }
    };

    loadQuote();
  }, []);

  const toggleNotice = (title: string) => {
    setOpenNotices((prev) => ({ ...prev, [title]: !prev[title] }));
  };

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

        {/* Daily quote */}
        <div className="affirmation-card mb-5">
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ opacity: 0.7 }}>
            Daily Quote
          </p>
          <p className="text-sm font-medium leading-relaxed">
            {quoteLoading ? 'Loading today\'s quote...' : `"${dailyQuote.quote}"`}
          </p>
          {!quoteLoading && (
            <p className="text-xs mt-2" style={{ color: '#7CCFDE' }}>
              - {dailyQuote.author}
            </p>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Day', value: cycleDay, sub: 'of cycle' },
            { label: 'Mood', value: mood, sub: 'today' },
            { label: 'Streak', value: streakCount, sub: 'active challenges' },
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
        <div className="sections-grid mb-6">
          {featureCards.map((card) => (
            <button
              key={card.id}
              className="section-tile-compact"
              onClick={() => onNavigate(card.id)}
              style={{
                background: '#0B4F6C',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.background = '#2A6C86';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = '';
                (e.currentTarget as HTMLElement).style.background = '#0B4F6C';
              }}
            >
              <div className="section-tile-compact__text">
                <p className="section-tile-compact__title" style={{ color: '#fff' }}>{card.title}</p>
                <p className="section-tile-compact__sub" style={{ color: 'rgba(255,255,255,0.8)' }}>{card.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Notice */}
        <h2 className="text-base font-semibold mb-3" style={{ color: '#0B4F6C' }}>
          Alert!
        </h2>
        <div className="flex flex-col gap-4 mb-6">
          {notices.map((notice) => {
            const isOpen = Boolean(openNotices[notice.title]);
            return (
              <div key={notice.title} className="notice-card">
                <div className="notice-card__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="notice-card__tag">{notice.tag}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="notice-card__time">{notice.time}</span>
                    <button
                      type="button"
                      onClick={() => toggleNotice(notice.title)}
                      aria-expanded={isOpen}
                      aria-label={isOpen ? 'Collapse alert details' : 'Expand alert details'}
                      style={{
                        width: 24,
                        height: 24,
                        border: 'none',
                        background: 'transparent',
                        color: '#2899B4',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <AppIcon
                        name="chevronDown"
                        size={16}
                        className="text-[#2899B4]"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 160ms ease' }}
                      />
                    </button>
                  </div>
                </div>
                <h3 className="notice-card__title">{notice.title}</h3>
                {isOpen && (
                  <>
                    <p className="notice-card__detail">{notice.detail}</p>
                    <div className="notice-card__tips">
                      {notice.tips.map((tip) => (
                        <span key={tip} className="notice-card__tip">
                          {tip}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
