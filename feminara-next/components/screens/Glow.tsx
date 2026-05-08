'use client';

import AppIcon, { type AppIconName } from '../AppIcon';

const nutrition: { icon: AppIconName; name: string; benefit: string; tag: string }[] = [
  { icon: 'leaf', name: 'Avocado', benefit: 'Healthy fats & folate', tag: 'Hormone support' },
  { icon: 'apple', name: 'Blueberries', benefit: 'Antioxidants & vitamins', tag: 'Skin glow' },
  { icon: 'sprout', name: 'Broccoli', benefit: 'Iron & calcium', tag: 'Bone health' },
];

const bodyRoutine: { icon: AppIconName; time: string; steps: string[] }[] = [
  { icon: 'sun', time: 'Morning', steps: ['Hydrate with lemon water', 'SPF moisturizer', '10-min stretch'] },
  { icon: 'moon', time: 'Evening', steps: ['Double cleanse', 'Facial massage', 'Sleep 8 hours'] },
];

export default function Glow() {
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

        {/* Water tracker */}
        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: '#0B4F6C', display: 'flex', alignItems: 'center', gap: 6 }}>
              Hydration Today
              <AppIcon name="droplets" size={16} className="text-[#2899B4]" />
            </p>
            <span className="text-sm font-bold" style={{ color: '#2899B4' }}>
              5 / 8 glasses
            </span>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 32,
                  borderRadius: 8,
                  background: i < 5 ? 'linear-gradient(180deg,#2899B4,#00838F)' : '#EBF8FC',
                  transition: 'background 0.2s',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>

        {/* Nutrition picks */}
        <h2 className="text-base font-semibold mb-3" style={{ color: '#0B4F6C' }}>
          Nutrition Picks for You
        </h2>
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

        {/* Body routine */}
        <h2 className="text-base font-semibold mb-3" style={{ color: '#0B4F6C' }}>
          Your Body Routine
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {bodyRoutine.map((r, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <AppIcon name={r.icon} size={18} className="text-[#0B4F6C]" />
                <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
                  {r.time}
                </p>
              </div>
              <ul className="flex flex-col gap-1.5">
                {r.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: '#2899B4',
                        marginTop: 6,
                        flexShrink: 0,
                      }}
                    />
                    <span className="text-xs" style={{ color: '#1A7A9A' }}>
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
