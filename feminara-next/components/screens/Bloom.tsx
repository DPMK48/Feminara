'use client';

import { useEffect, useMemo, useState } from 'react';
import AppIcon from '../AppIcon';

const symptoms = ['Mood', 'Cramps', 'Flow', 'Energy', 'Headache', 'Bloating'];

const STORAGE_KEYS = {
  periodStart: 'feminara_period_start',
  periodDuration: 'feminara_period_duration',
  trackerOpen: 'feminara_period_tracker_open',
};

export default function Bloom() {
  const [trackerOpen, setTrackerOpen] = useState(true);
  const [periodStart, setPeriodStart] = useState<string>('');
  const [periodDuration, setPeriodDuration] = useState<number>(28);
  const [activeSyms, setActiveSyms] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedStart = localStorage.getItem(STORAGE_KEYS.periodStart);
    const storedDuration = localStorage.getItem(STORAGE_KEYS.periodDuration);
    const storedOpen = localStorage.getItem(STORAGE_KEYS.trackerOpen);

    if (storedStart) setPeriodStart(storedStart);
    if (storedDuration) setPeriodDuration(Number(storedDuration));
    if (storedOpen) setTrackerOpen(storedOpen === 'true');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.periodStart, periodStart);
    localStorage.setItem(STORAGE_KEYS.periodDuration, String(periodDuration));
    localStorage.setItem(STORAGE_KEYS.trackerOpen, String(trackerOpen));
  }, [periodStart, periodDuration, trackerOpen]);

  const toggleSym = (s: string) =>
    setActiveSyms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const nextPeriodDate = useMemo(() => {
    if (!periodStart) return null;
    const start = new Date(periodStart);
    if (Number.isNaN(start.getTime())) return null;
    const next = new Date(start);
    next.setDate(next.getDate() + periodDuration);
    return next;
  }, [periodStart, periodDuration]);

  const cycleDay = useMemo(() => {
    if (!periodStart) return null;
    const start = new Date(periodStart);
    if (Number.isNaN(start.getTime())) return null;
    const diff = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? (diff % periodDuration) + 1 : null;
  }, [periodStart, periodDuration]);

  const nextPeriodLabel = nextPeriodDate
    ? nextPeriodDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Set your last period start';

  return (
    <div className="section-scroll">
      <div className="screen-hdr" style={{ paddingTop: 28 }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: 'linear-gradient(135deg,#5C6BC0,#9FA8DA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppIcon name="flower" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#0B4F6C' }}>
              Bloom
            </h1>
            <p className="text-xs" style={{ color: '#7CCFDE' }}>
              Maternal & Menstrual Health
            </p>
          </div>
        </div>

        {/* Cycle ring */}
        <div className="card p-5 mb-4 flex flex-col items-center">
          <div className="cycle-ring mb-3">
            <div className="cycle-ring-inner">
              <p className="text-2xl font-bold" style={{ color: '#0B4F6C' }}>
                {cycleDay ?? '—'}
              </p>
              <p className="text-xs font-medium" style={{ color: '#7CCFDE' }}>
                Day
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
            Follicular Phase
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#7CCFDE' }}>
            {nextPeriodDate ? `Next period on ${nextPeriodLabel}` : nextPeriodLabel}
          </p>
          <div className="flex gap-6 mt-4">
            {[
              { label: 'Cycle length', value: `${periodDuration} days` },
              { label: 'Period length', value: '—' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-sm font-bold" style={{ color: '#0B4F6C' }}>
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: '#B0E4EF' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Period tracker */}
        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
              Period Tracker
            </p>
            <button
              onClick={() => setTrackerOpen((prev) => !prev)}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#2899B4',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {trackerOpen ? 'Hide' : 'Show'}
            </button>
          </div>

          {trackerOpen && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: '#7CCFDE' }}>
                    Last period start
                  </label>
                  <input
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: '#7CCFDE' }}>
                    Period duration (days)
                  </label>
                  <input
                    type="number"
                    min={21}
                    max={45}
                    value={periodDuration}
                    onChange={(e) => setPeriodDuration(Number(e.target.value))}
                    className="input-field"
                  />
                  <span className="text-[11px]" style={{ color: '#B0E4EF' }}>
                    Average days between periods
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: '#7CCFDE' }}>
                    Next period
                  </label>
                  <div
                    className="rounded-xl px-3 py-2 text-sm font-semibold"
                    style={{ background: '#EBF8FC', color: '#0B4F6C', minHeight: 42 }}
                  >
                    {nextPeriodDate ? nextPeriodLabel : '—'}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: '#7CCFDE' }}>
                    Cycle day
                  </label>
                  <div
                    className="rounded-xl px-3 py-2 text-sm font-semibold"
                    style={{ background: '#EBF8FC', color: '#0B4F6C', minHeight: 42 }}
                  >
                    {cycleDay ?? '—'}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Phase info */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: 'linear-gradient(135deg,#E8EAF6,#C5CAE9)' }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#3949AB' }}>
            Your Phase Right Now
          </p>
          <p className="text-sm font-bold mb-1" style={{ color: '#0D47A1' }}>
            Follicular Phase
          </p>
          <p className="text-xs leading-relaxed" style={{ color: '#5C6BC0' }}>
            Estrogen is rising — you may feel more energetic, creative and social. Great time for new projects and social activities.
          </p>
        </div>

        {/* Symptom logging */}
        <h2 className="text-base font-semibold mb-2" style={{ color: '#0B4F6C' }}>
          Log Symptoms
        </h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {symptoms.map((s) => (
            <button
              key={s}
              className={`sym-tag${activeSyms.includes(s) ? ' on' : ''}`}
              onClick={() => toggleSym(s)}
            >
              {s}
            </button>
          ))}
        </div>
        {activeSyms.length > 0 && (
          <button
            className="btn-primary mb-4"
            style={{ background: 'linear-gradient(135deg,#5C6BC0,#3949AB)' }}
          >
            Save Log ({activeSyms.length} symptom{activeSyms.length > 1 ? 's' : ''})
          </button>
        )}

        {/* Quick access */}
        <h2 className="text-base font-semibold mb-3" style={{ color: '#0B4F6C' }}>
          Quick Access
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="quick-card">
            <div style={{ marginBottom: 8 }}>
              <AppIcon name="baby" size={26} className="text-[#5C6BC0]" />
            </div>
            <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
              Pregnancy Tracker
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#7CCFDE' }}>
              Week by week guide
            </p>
          </div>
          <div className="quick-card">
            <div style={{ marginBottom: 8 }}>
              <AppIcon name="barChart" size={26} className="text-[#5C6BC0]" />
            </div>
            <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
              Cycle Insights
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#7CCFDE' }}>
              Patterns & trends
            </p>
          </div>
          <div className="quick-card">
            <div style={{ marginBottom: 8 }}>
              <AppIcon name="thermometer" size={26} className="text-[#5C6BC0]" />
            </div>
            <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
              Fertility Window
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#7CCFDE' }}>
              Ovulation tracker
            </p>
          </div>
          <div className="quick-card">
            <div style={{ marginBottom: 8 }}>
              <AppIcon name="pill" size={26} className="text-[#5C6BC0]" />
            </div>
            <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
              Supplements
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#7CCFDE' }}>
              For your phase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
