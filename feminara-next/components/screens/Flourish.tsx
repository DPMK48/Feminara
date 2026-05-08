'use client';

import { useState } from 'react';
import AppIcon, { type AppIconName } from '../AppIcon';

type Screen = 'home' | 'journal' | 'community' | 'flourish' | 'spark' | 'glow' | 'bloom' | 'profile';

interface FlourishProps {
  onNavigate: (s: Screen) => void;
}

const moods = ['😔', '😐', '🙂', '😊', '😄'];
const moodLabels = ['Low', 'Neutral', 'Good', 'Happy', 'Joyful'];

const articles: { title: string; tag: string; min: string; icon: AppIconName }[] = [
  {
    title: '5 Ways to Set Healthy Boundaries',
    tag: 'Relationships',
    min: '4 min read',
    icon: 'leaf',
  },
  {
    title: 'How to Practice Self-Compassion Daily',
    tag: 'Mental Health',
    min: '6 min read',
    icon: 'heart',
  },
  {
    title: 'Building Emotional Resilience',
    tag: 'Wellness',
    min: '5 min read',
    icon: 'sparkles',
  },
];

const relTips: { icon: AppIconName; text: string }[] = [
  { icon: 'message', text: 'Express needs clearly and calmly' },
  { icon: 'ear', text: 'Practice active listening' },
  { icon: 'handshake', text: 'Establish mutual respect' },
];

export default function Flourish({ onNavigate }: FlourishProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const logMood = (index: number) => {
    setSelectedMood(index);
    if (typeof window !== 'undefined') {
      localStorage.setItem('feminara_mood', moods[index]);
      localStorage.setItem('feminara_mood_label', moodLabels[index]);
      localStorage.setItem('feminara_mood_time', new Date().toISOString());
    }
  };

  const handleWriteEntry = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'feminara_journal_prompt',
        'What is one thing you are proud of yourself for today?'
      );
      localStorage.setItem('feminara_journal_open', 'true');
    }
    onNavigate('journal');
  };

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
              background: 'linear-gradient(135deg,#1A7A9A,#2899B4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppIcon name="leaf" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#0B4F6C' }}>
              Flourish
            </h1>
            <p className="text-xs" style={{ color: '#7CCFDE' }}>
              Mental Health & Relationships
            </p>
          </div>
        </div>

        {/* Mood check-in */}
        <div className="card p-4 mb-4">
          <p className="text-sm font-semibold mb-3" style={{ color: '#0B4F6C' }}>
            How are you feeling today?
          </p>
          <div className="flex justify-between px-2">
            {moods.map((m, i) => (
              <span
                key={i}
                className={`mood-emoji${selectedMood === i ? ' selected' : ''}`}
                onClick={() => logMood(i)}
              >
                {m}
              </span>
            ))}
          </div>
          {selectedMood !== null && (
            <p className="text-xs text-center mt-3 font-medium" style={{ color: '#2899B4' }}>
              Logged ✓ — {moodLabels[selectedMood]}
            </p>
          )}
        </div>

        {/* Journaling prompt */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: 'linear-gradient(135deg,#EBF8FC,#D4F1F8)' }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#1A7A9A' }}>
            Today&apos;s Journal Prompt
          </p>
          <p className="text-sm font-medium leading-relaxed mb-3" style={{ color: '#0B4F6C' }}>
            &ldquo;What is one thing you are proud of yourself for today?&rdquo;
          </p>
          <button
            className="text-xs font-semibold px-4 py-2 rounded-xl"
            style={{
              background: '#2899B4',
              color: '#fff',
              border: 'none',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
            onClick={handleWriteEntry}
          >
            Write Entry →
          </button>
        </div>

        {/* Articles */}
        <h2 className="text-base font-semibold mb-3" style={{ color: '#0B4F6C' }}>
          Recommended Reads
        </h2>
        <div className="flex flex-col gap-3 mb-5">
          {articles.map((a, i) => (
            <div key={i} className="card flex items-center gap-3 p-3 cursor-pointer">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: '#EBF8FC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AppIcon name={a.icon} size={22} className="text-[#1A7A9A]" />
              </div>
              <div style={{ flex: 1 }}>
                <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
                  {a.title}
                </p>
                <div className="flex gap-2 mt-0.5">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: '#D4F1F8', color: '#1A7A9A' }}
                  >
                    {a.tag}
                  </span>
                  <span className="text-xs" style={{ color: '#B0E4EF' }}>
                    {a.min}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Relationship health */}
        <h2 className="text-base font-semibold mb-3" style={{ color: '#0B4F6C' }}>
          Relationship Health
        </h2>
        <div className="flex flex-col gap-3 mb-6">
          {relTips.map((tip, i) => (
            <div key={i} className="card flex items-center gap-3 p-3">
              <AppIcon name={tip.icon} size={22} className="text-[#1A7A9A]" />
              <p className="text-sm font-medium" style={{ color: '#1A7A9A' }}>
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
