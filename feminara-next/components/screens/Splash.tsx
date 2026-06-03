'use client';

import FlowerLogo from '../FlowerLogo';

interface SplashProps {
  onContinue: () => void;
}

export default function Splash({ onContinue }: SplashProps) {
  return (
    <div className="splash-bg" style={{ minHeight: '100dvh' }}>
      <div className="flex flex-col items-center justify-center gap-6 px-8 text-center" style={{ flex: 1 }}>
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <FlowerLogo size={80} />
          <h1
            className="text-white font-bold tracking-[0.22em] text-3xl"
            style={{ letterSpacing: '0.22em' }}
          >
            FEMINARA
          </h1>
          <p className="text-white font-light text-base" style={{ opacity: 0.85 }}>
            Supporting women, every day
          </p>
        </div>

        {/* Tagline block */}
        <div className="mt-4 mb-8">
          <p className="text-white font-light text-sm leading-relaxed" style={{ opacity: 0.7, maxWidth: 280 }}>
            Nurturing every season of your womanhood — from wellness to wisdom.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onContinue}
          className="btn-primary"
          style={{
            maxWidth: 320,
            background: 'rgba(255,255,255,0.22)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(255,255,255,0.5)',
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '0.04em',
          }}
        >
          Get Started
        </button>
      </div>

      {/* Decorative circles */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
