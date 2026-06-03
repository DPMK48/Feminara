'use client';

import { useState } from 'react';
import FlowerLogo from '../FlowerLogo';
import AppIcon, { type AppIconName } from '../AppIcon';

interface OnboardingProps {
  onComplete: () => void;
}

const slides: { icon: AppIconName; title: string; desc: string; bg: string }[] = [
  {
    icon: 'leaf',
    title: 'Flourish & Grow',
    desc: 'Track your mental health, nurture relationships, and build emotional resilience every day.',
    bg: 'linear-gradient(160deg,#0B4F6C,#1A7A9A)',
  },
  {
    icon: 'flower',
    title: 'Understand Your Cycle',
    desc: 'Log symptoms, predict periods, track fertility, and understand your body on a deeper level.',
    bg: 'linear-gradient(160deg,#0B4F6C,#00838F)',
  },
  {
    icon: 'sparkles',
    title: 'Glow From Within',
    desc: 'Personalized nutrition tips, body care routines, and skills to empower your everyday life.',
    bg: 'linear-gradient(160deg,#006064,#00838F)',
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [slide, setSlide] = useState(0);

  const next = () => {
    if (slide < slides.length - 1) setSlide(slide + 1);
    else onComplete();
  };

  const s = slides[slide];

  return (
    <div
      className="flex flex-col items-center justify-between px-8 py-12 text-white"
      style={{
        minHeight: '100dvh',
        background: s.bg,
        transition: 'background 0.5s ease',
      }}
    >
      {/* Logo small */}
      <div className="flex items-center gap-2 self-start">
        <FlowerLogo size={28} />
        <span className="font-semibold text-sm tracking-widest opacity-80">FEMINARA</span>
      </div>

      {/* Slide content */}
      <div className="flex flex-col items-center gap-6 text-center" style={{ flex: 1, justifyContent: 'center' }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppIcon name={s.icon} size={52} className="text-white" />
        </div>
        <h2 className="font-bold text-2xl">{s.title}</h2>
        <p className="font-light text-sm leading-relaxed opacity-80" style={{ maxWidth: 300 }}>
          {s.desc}
        </p>
      </div>

      {/* Dots + button */}
      <div className="flex flex-col items-center gap-6 w-full" style={{ maxWidth: 360 }}>
        <div className="flex gap-2 items-center">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`ob-dot${i === slide ? ' on' : ''}`}
              onClick={() => setSlide(i)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="btn-primary"
          style={{
            background: 'rgba(255,255,255,0.22)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(255,255,255,0.45)',
          }}
        >
          {slide < slides.length - 1 ? 'Next' : 'Get Started'}
        </button>
      </div>
    </div>
  );
}
