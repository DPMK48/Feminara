'use client';

import { useState } from 'react';
import AppIcon from '../AppIcon';

const symptoms = ['Mood', 'Cramps', 'Flow', 'Energy', 'Headache', 'Bloating'];

export default function Bloom() {
  const [activeSyms, setActiveSyms] = useState<string[]>([]);

  const toggleSym = (s: string) =>
    setActiveSyms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

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
                14
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
            Next period in 14 days
          </p>
          <div className="flex gap-6 mt-4">
            {[
              { label: 'Cycle length', value: '28 days' },
              { label: 'Period length', value: '5 days' },
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
