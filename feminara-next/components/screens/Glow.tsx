"use client";

import { useEffect, useMemo, useState } from 'react';
import AppIcon, { type AppIconName } from '../AppIcon';
import { apiFetch } from '@/lib/api';

type NutritionPick = { icon: AppIconName; name: string; benefit: string; tag: string };
type Challenge = { id: string; icon: AppIconName; title: string; goal: string };
type ChallengeConfig = {
  goal: string;
  frequency: string;
  notes: string;
  isActive: boolean;
};

const fallbackNutrition: NutritionPick[] = [
  { icon: 'leaf', name: 'Avocado', benefit: 'Healthy fats & folate', tag: 'Hormone support' },
  { icon: 'apple', name: 'Blueberries', benefit: 'Antioxidants & vitamins', tag: 'Skin glow' },
  { icon: 'sprout', name: 'Broccoli', benefit: 'Iron & calcium', tag: 'Bone health' },
];

const fallbackChallenges: Challenge[] = [
  { id: 'hydration', icon: 'droplets', title: 'Hydration Challenge', goal: '8 glasses today' },
  { id: 'sleep', icon: 'moon', title: 'Sleep Reset', goal: 'Wind down by 10:30 pm' },
  { id: 'movement', icon: 'zap', title: 'Movement Breaks', goal: '20 minutes of activity' },
  { id: 'nutrition', icon: 'apple', title: 'Nourish Well', goal: 'Include 2 colorful veggies' },
  { id: 'stress', icon: 'heart', title: 'Stress Reset', goal: '3 breathing breaks' },
  { id: 'skincare', icon: 'sparkles', title: 'Glow Routine', goal: 'Cleanse + moisturize' },
  { id: 'cycle', icon: 'flower', title: 'Cycle Care', goal: 'Log symptoms and energy' },
];

const STORAGE_KEYS = {
  hydrationStarted: 'feminara_hydration_started',
  hydrationCount: 'feminara_hydration_count',
  hydrationDate: 'feminara_hydration_date',
  hydrationLastLogged: 'feminara_hydration_last_logged',
  activeChallenges: 'feminara_glow_active_challenges',
  challengeConfigs: 'feminara_glow_challenge_configs',
  challengeNotify: 'feminara_glow_challenge_notify',
  periodStart: 'feminara_period_start',
  periodDuration: 'feminara_period_duration',
};

const getDateKey = () => new Date().toISOString().slice(0, 10);

const phaseLabel = (cycleDay: number | null, duration: number) => {
  if (!cycleDay) return 'Set your cycle in Bloom';
  const ovulationDay = Math.round(duration * 0.5);
  if (cycleDay <= 5) return 'Menstrual Phase';
  if (cycleDay <= ovulationDay - 1) return 'Follicular Phase';
  if (cycleDay <= ovulationDay + 2) return 'Ovulation Phase';
  return 'Luteal Phase';
};

export default function Glow() {
  const [hydrationStarted, setHydrationStarted] = useState(false);
  const [hydrationCount, setHydrationCount] = useState(0);
  const [nutrition, setNutrition] = useState<NutritionPick[]>(fallbackNutrition);
  const [challenges, setChallenges] = useState<Challenge[]>(fallbackChallenges);
  const [activeChallenges, setActiveChallenges] = useState<string[]>([]);
  const [challengeConfigs, setChallengeConfigs] = useState<Record<string, ChallengeConfig>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalChallenge, setModalChallenge] = useState<Challenge | null>(null);
  const [draftGoal, setDraftGoal] = useState('');
  const [draftFrequency, setDraftFrequency] = useState('Daily');
  const [draftNotes, setDraftNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiTip, setAiTip] = useState('');

  const dateKey = useMemo(() => getDateKey(), []);
  const targetGlasses = 8;

  const cycleDay = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const storedStart = localStorage.getItem(STORAGE_KEYS.periodStart);
    const storedDuration = Number(localStorage.getItem(STORAGE_KEYS.periodDuration) ?? 28);
    if (!storedStart) return null;
    const start = new Date(storedStart);
    if (Number.isNaN(start.getTime())) return null;
    const diff = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? (diff % storedDuration) + 1 : null;
  }, []);

  const cycleDuration = useMemo(() => {
    if (typeof window === 'undefined') return 28;
    return Number(localStorage.getItem(STORAGE_KEYS.periodDuration) ?? 28);
  }, []);

  const cyclePhase = useMemo(() => phaseLabel(cycleDay, cycleDuration), [cycleDay, cycleDuration]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedDate = localStorage.getItem(STORAGE_KEYS.hydrationDate);
    const storedStarted = localStorage.getItem(STORAGE_KEYS.hydrationStarted) === 'true';
    const storedCount = Number(localStorage.getItem(STORAGE_KEYS.hydrationCount) ?? 0);
    const storedChallenges = localStorage.getItem(STORAGE_KEYS.activeChallenges);
    const storedConfigs = localStorage.getItem(STORAGE_KEYS.challengeConfigs);

    if (storedDate === dateKey) {
      setHydrationStarted(storedStarted);
      setHydrationCount(storedCount);
    } else {
      setHydrationStarted(false);
      setHydrationCount(0);
      localStorage.setItem(STORAGE_KEYS.hydrationDate, dateKey);
      localStorage.setItem(STORAGE_KEYS.hydrationCount, '0');
      localStorage.setItem(STORAGE_KEYS.hydrationStarted, 'false');
    }

    if (storedChallenges) {
      try {
        const parsed = JSON.parse(storedChallenges);
        if (Array.isArray(parsed)) setActiveChallenges(parsed);
      } catch {
        setActiveChallenges([]);
      }
    }

    if (storedConfigs) {
      try {
        const parsed = JSON.parse(storedConfigs);
        if (parsed && typeof parsed === 'object') setChallengeConfigs(parsed);
      } catch {
        setChallengeConfigs({});
      }
    }
  }, [dateKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.hydrationStarted, String(hydrationStarted));
    localStorage.setItem(STORAGE_KEYS.hydrationCount, String(hydrationCount));
  }, [hydrationStarted, hydrationCount]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.activeChallenges, JSON.stringify(activeChallenges));
  }, [activeChallenges]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.challengeConfigs, JSON.stringify(challengeConfigs));
  }, [challengeConfigs]);

  useEffect(() => {
    if (!hydrationStarted) return undefined;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    const requestPermission = async () => {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    };

    const maybeNotify = () => {
      if (Notification.permission !== 'granted') return;
      const now = new Date();
      const hour = now.getHours();
      if (hour < 8 || hour > 20) return;
      const lastLogged = Number(localStorage.getItem(STORAGE_KEYS.hydrationLastLogged) ?? 0);
      if (Date.now() - lastLogged < 2 * 60 * 60 * 1000) return;
      new Notification('Hydration check-in', {
        body: 'Drink a glass of water to keep your glow going.',
        tag: 'hydration-reminder',
      });
    };

    requestPermission().catch(() => undefined);
    intervalId = setInterval(maybeNotify, 30 * 60 * 1000);
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [hydrationStarted]);

  useEffect(() => {
    const loadAi = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (cycleDay) params.set('cycleDay', String(cycleDay));
        params.set('cycleDuration', String(cycleDuration));
        params.set('cyclePhase', cyclePhase);
        const response = await fetch(`/api/glow/recommendations?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to load glow AI');
        const data = await response.json();
        if (Array.isArray(data?.nutritionPicks)) setNutrition(data.nutritionPicks);
        if (Array.isArray(data?.challenges)) setChallenges(data.challenges);
        if (typeof data?.tip === 'string') setAiTip(data.tip);
      } catch {
        setNutrition(fallbackNutrition);
        setChallenges(fallbackChallenges);
        setAiTip('');
      } finally {
        setIsLoading(false);
      }
    };

    loadAi();
  }, [cycleDay, cycleDuration, cyclePhase]);

  const toggleChallenge = (id: string) => {
    setActiveChallenges((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const displayChallenges = useMemo(
    () => challenges.filter((challenge) => challenge.id !== 'hydration'),
    [challenges]
  );

  const challengeMap = useMemo(() => {
    const map = new Map<string, Challenge>();
    challenges.forEach((challenge) => map.set(challenge.id, challenge));
    return map;
  }, [challenges]);

  const openChallengeModal = (challenge: Challenge) => {
    const config = challengeConfigs[challenge.id];
    setModalChallenge(challenge);
    setDraftGoal(config?.goal ?? challenge.goal);
    setDraftFrequency(config?.frequency ?? 'Daily');
    setDraftNotes(config?.notes ?? '');
    setModalOpen(true);
  };

  const closeChallengeModal = () => {
    setModalOpen(false);
    setModalChallenge(null);
  };

  const saveChallengeConfig = () => {
    if (!modalChallenge) return;
    setChallengeConfigs((prev) => ({
      ...prev,
      [modalChallenge.id]: {
        goal: draftGoal.trim() || modalChallenge.goal,
        frequency: draftFrequency,
        notes: draftNotes.trim(),
        isActive: prev[modalChallenge.id]?.isActive ?? false,
      },
    }));
    closeChallengeModal();
  };

  const startChallenge = () => {
    if (!modalChallenge) return;
    const goal = draftGoal.trim() || modalChallenge.goal;
    setActiveChallenges((prev) => (prev.includes(modalChallenge.id) ? prev : [...prev, modalChallenge.id]));
    setChallengeConfigs((prev) => ({
      ...prev,
      [modalChallenge.id]: {
        goal,
        frequency: draftFrequency,
        notes: draftNotes.trim(),
        isActive: true,
      },
    }));
    apiFetch('/api/notifications/challenge', {
      method: 'POST',
      body: JSON.stringify({ title: modalChallenge.title, goal }),
    }).catch(() => undefined);
    closeChallengeModal();
  };

  const stopChallenge = () => {
    if (!modalChallenge) return;
    setActiveChallenges((prev) => prev.filter((id) => id !== modalChallenge.id));
    setChallengeConfigs((prev) => ({
      ...prev,
      [modalChallenge.id]: {
        goal: draftGoal.trim() || modalChallenge.goal,
        frequency: draftFrequency,
        notes: draftNotes.trim(),
        isActive: false,
      },
    }));
    closeChallengeModal();
  };

  const resetChallenge = () => {
    if (!modalChallenge) return;
    setDraftGoal(modalChallenge.goal);
    setDraftFrequency('Daily');
    setDraftNotes('');
    setChallengeConfigs((prev) => ({
      ...prev,
      [modalChallenge.id]: {
        goal: modalChallenge.goal,
        frequency: 'Daily',
        notes: '',
        isActive: prev[modalChallenge.id]?.isActive ?? false,
      },
    }));
  };

  const handleHydrationStart = () => {
    setHydrationStarted(true);
    setHydrationCount(0);
    localStorage.setItem(STORAGE_KEYS.hydrationLastLogged, String(Date.now()));
  };

  const handleHydrationEnd = () => {
    setHydrationStarted(false);
  };

  const logHydration = (index: number) => {
    if (!hydrationStarted) return;
    const nextCount = index + 1;
    setHydrationCount(nextCount);
    localStorage.setItem(STORAGE_KEYS.hydrationLastLogged, String(Date.now()));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (!activeChallenges.length) return undefined;

    const getIntervalMs = (frequency: string) => {
      switch (frequency) {
        case 'Weekly':
          return 7 * 24 * 60 * 60 * 1000;
        case '3x per week':
          return 2 * 24 * 60 * 60 * 1000;
        case 'Custom':
          return 12 * 60 * 60 * 1000;
        default:
          return 4 * 60 * 60 * 1000;
      }
    };

    const requestPermission = async () => {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    };

    const tick = () => {
      if (Notification.permission !== 'granted') return;
      const now = Date.now();
      const hour = new Date().getHours();
      if (hour < 8 || hour > 20) return;

      const raw = localStorage.getItem(STORAGE_KEYS.challengeNotify);
      let lastNotified: Record<string, number> = {};
      if (raw) {
        try {
          lastNotified = JSON.parse(raw) ?? {};
        } catch {
          lastNotified = {};
        }
      }

      let updated = false;

      activeChallenges.forEach((id) => {
        const config = challengeConfigs[id];
        const intervalMs = getIntervalMs(config?.frequency ?? 'Daily');
        const last = lastNotified[id] ?? 0;
        if (now - last < intervalMs) return;

        const challenge = challengeMap.get(id);
        if (!challenge) return;

        new Notification(`${challenge.title} reminder`, {
          body: config?.goal ?? challenge.goal,
          tag: `challenge-${id}`,
        });

        lastNotified[id] = now;
        updated = true;
      });

      if (updated) {
        localStorage.setItem(STORAGE_KEYS.challengeNotify, JSON.stringify(lastNotified));
      }
    };

    requestPermission().catch(() => undefined);
    const intervalId = setInterval(tick, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [activeChallenges, challengeConfigs, challengeMap]);
  return (
    <div
      className="section-scroll"
      style={{
        background:
          'radial-gradient(circle at 15% 10%, rgba(30,136,229,0.12), transparent 45%), radial-gradient(circle at 85% 20%, rgba(42,157,143,0.12), transparent 40%)',
      }}
    >
      <div className="screen-hdr" style={{ paddingTop: 28, position: 'relative' }}>
        <div
          aria-hidden="true"
          className="spark-float"
          style={{
            position: 'absolute',
            right: 18,
            top: 10,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(30,136,229,0.18), rgba(42,157,143,0.2))',
            filter: 'blur(6px)',
            zIndex: 0,
          }}
        />
        {/* Header */}
        <div className="flex items-center gap-3 mb-6" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: 'linear-gradient(135deg,#00838F,#26C6DA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppIcon name="sparkles" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#0B4F6C' }}>
              Glow
            </h1>
            <p className="text-xs" style={{ color: '#7CCFDE' }}>
              Nutrition & Body Care
            </p>
          </div>
        </div>

        {/* Hydration challenge */}
        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: '#0B4F6C', display: 'flex', alignItems: 'center', gap: 6 }}>
              Hydration Challenge
              <AppIcon name="droplets" size={16} className="text-[#2899B4]" />
            </p>
            <span className="text-sm font-bold" style={{ color: '#2899B4' }}>
              {hydrationCount} / {targetGlasses} glasses
            </span>
          </div>
          {!hydrationStarted ? (
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: '#7CCFDE' }}>
                Start today&apos;s challenge to track your water and receive reminders.
              </p>
              <button
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: '#2899B4', color: '#fff' }}
                onClick={handleHydrationStart}
              >
                Start
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-3">
                {Array.from({ length: targetGlasses }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => logHydration(i)}
                    style={{
                      flex: 1,
                      height: 32,
                      borderRadius: 8,
                      background: i < hydrationCount ? 'linear-gradient(180deg,#2899B4,#00838F)' : '#EBF8FC',
                      transition: 'background 0.2s',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    aria-label={`Log glass ${i + 1}`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs" style={{ color: '#7CCFDE' }}>
                  Tap a glass as you drink to update your progress.
                </p>
                <button
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: '#EBF8FC', color: '#1A7A9A' }}
                  onClick={handleHydrationEnd}
                >
                  End
                </button>
              </div>
            </>
          )}
        </div>

        {/* AI sync */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: 'linear-gradient(135deg,#E0F7FA,#CDEFF7)' }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#00838F' }}>
            Synced With Bloom
          </p>
          <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
            {cycleDay ? `Cycle day ${cycleDay} • ${cyclePhase}` : cyclePhase}
          </p>
          {aiTip && (
            <p className="text-xs mt-2" style={{ color: '#1A7A9A' }}>
              {aiTip}
            </p>
          )}
        </div>

        {/* Challenges */}
        <h2 className="text-base font-semibold mb-3" style={{ color: '#0B4F6C' }}>
          Challenges for Today
        </h2>
        <div className="grid grid-cols-1 gap-3 mb-5 md:grid-cols-2">
          {displayChallenges.map((challenge) => {
            const active = activeChallenges.includes(challenge.id);
            const config = challengeConfigs[challenge.id];
            return (
              <div key={challenge.id} className="card p-3 flex items-center gap-3">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: '#D0F4F7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <AppIcon name={challenge.icon} size={22} className="text-[#00838F]" />
                </div>
                <div style={{ flex: 1 }}>
                  <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
                    {challenge.title}
                  </p>
                  <p className="text-xs" style={{ color: '#7CCFDE' }}>
                    {config?.goal ?? challenge.goal}
                  </p>
                  {config?.frequency && (
                    <p className="text-[11px] mt-1" style={{ color: '#B0E4EF' }}>
                      {config.frequency}
                    </p>
                  )}
                </div>
                <button
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: active ? '#EBF8FC' : '#2899B4', color: active ? '#1A7A9A' : '#fff' }}
                  onClick={() => openChallengeModal(challenge)}
                >
                  {active ? 'Edit' : 'Set up'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Nutrition picks */}
        <h2 className="text-base font-semibold mb-3" style={{ color: '#0B4F6C' }}>
          Nutrition Picks for You
        </h2>
        {isLoading && (
          <div className="card p-4 mb-3">
            <p className="text-xs" style={{ color: '#7CCFDE' }}>
              Updating your glow plan...
            </p>
          </div>
        )}
        <div className="flex flex-col gap-3 mb-5">
          {nutrition.map((n, i) => (
            <div key={i} className="card flex items-center gap-3 p-3">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: '#D0F4F7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AppIcon name={n.icon} size={22} className="text-[#00838F]" />
              </div>
              <div style={{ flex: 1 }}>
                <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
                  {n.name}
                </p>
                <p className="text-xs" style={{ color: '#7CCFDE' }}>
                  {n.benefit}
                </p>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: '#D0F4F7', color: '#00838F' }}
              >
                {n.tag}
              </span>
            </div>
          ))}
        </div>

      </div>

      {modalOpen && modalChallenge && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6, 28, 36, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            zIndex: 200,
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: 420,
              padding: 20,
              borderRadius: 20,
              background: '#fff',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AppIcon name={modalChallenge.icon} size={18} className="text-[#00838F]" />
                <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
                  {modalChallenge.title}
                </p>
              </div>
              <button
                onClick={closeChallengeModal}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#7CCFDE',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Close
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: '#7CCFDE' }}>
                  Goal
                </label>
                <input
                  value={draftGoal}
                  onChange={(e) => setDraftGoal(e.target.value)}
                  className="input-field"
                  placeholder="Set a goal"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: '#7CCFDE' }}>
                  Frequency
                </label>
                <select
                  value={draftFrequency}
                  onChange={(e) => setDraftFrequency(e.target.value)}
                  className="input-field"
                >
                  <option>Daily</option>
                  <option>3x per week</option>
                  <option>Weekly</option>
                  <option>Custom</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: '#7CCFDE' }}>
                  Notes
                </label>
                <textarea
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="Add reminders or preferences"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: '#2899B4', color: '#fff' }}
                onClick={startChallenge}
              >
                Start
              </button>
              <button
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: '#EBF8FC', color: '#1A7A9A' }}
                onClick={saveChallengeConfig}
              >
                Save
              </button>
              <button
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: '#FFF1DA', color: '#A86810' }}
                onClick={resetChallenge}
              >
                Reset
              </button>
              <button
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: '#FBE9E7', color: '#C0392B' }}
                onClick={stopChallenge}
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
