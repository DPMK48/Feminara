'use client';

import AppIcon, { type AppIconName } from '../AppIcon';

const courses: { icon: AppIconName; title: string; tag: string; progress: number }[] = [
  { icon: 'briefcase', title: 'Personal Finance Basics', tag: 'Finance', progress: 40 },
  { icon: 'mic', title: 'Confident Public Speaking', tag: 'Communication', progress: 70 },
  { icon: 'laptop', title: 'Digital Skills for Work', tag: 'Technology', progress: 20 },
];

const goals = [
  { text: 'Complete finance module', done: true },
  { text: 'Practice 10-min meditation', done: true },
  { text: 'Read 15 minutes', done: false },
  { text: 'Network with one person', done: false },
];

export default function Spark() {
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
              background: 'linear-gradient(135deg,#1565C0,#1E88E5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppIcon name="zap" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#0B4F6C' }}>
              Spark
            </h1>
            <p className="text-xs" style={{ color: '#7CCFDE' }}>
              Skills & Empowerment
            </p>
          </div>
        </div>

        {/* Daily goals */}
        <div className="card p-4 mb-4">
          <p className="text-sm font-semibold mb-3" style={{ color: '#0B4F6C' }}>
            Today&apos;s Goals
          </p>
          <div className="flex flex-col gap-2">
            {goals.map((g, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: g.done ? '#2899B4' : 'transparent',
                    border: `2px solid ${g.done ? '#2899B4' : '#B0E4EF'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 11,
                    color: '#fff',
                  }}
                >
                  {g.done && '✓'}
                </div>
                <span
                  className="text-sm"
                  style={{
                    color: g.done ? '#B0E4EF' : '#0B4F6C',
                    textDecoration: g.done ? 'line-through' : 'none',
                  }}
                >
                  {g.text}
                </span>
              </div>
            ))}
          </div>
          <div
            className="mt-3 rounded-full overflow-hidden"
            style={{ height: 6, background: '#EBF8FC' }}
          >
            <div
              className="rounded-full h-full"
              style={{
                width: '50%',
                background: 'linear-gradient(90deg,#2899B4,#1565C0)',
              }}
            />
          </div>
          <p className="text-xs mt-1 font-medium" style={{ color: '#7CCFDE' }}>
            2 of 4 completed
          </p>
        </div>

        {/* Courses */}
        <h2 className="text-base font-semibold mb-3" style={{ color: '#0B4F6C' }}>
          My Courses
        </h2>
        <div className="flex flex-col gap-3 mb-5">
          {courses.map((c, i) => (
            <div key={i} className="card p-4 cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: '#DDEEFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AppIcon name={c.icon} size={20} className="text-[#1565C0]" />
                </div>
                <div style={{ flex: 1 }}>
                  <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
                    {c.title}
                  </p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: '#DDEEFF', color: '#1565C0' }}
                  >
                    {c.tag}
                  </span>
                </div>
                <span className="text-sm font-bold" style={{ color: '#2899B4' }}>
                  {c.progress}%
                </span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: 5, background: '#EBF8FC' }}>
                <div
                  className="rounded-full h-full"
                  style={{
                    width: `${c.progress}%`,
                    background: 'linear-gradient(90deg,#1E88E5,#1565C0)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Empowerment tip */}
        <div
          className="rounded-2xl p-4 mb-6"
          style={{ background: 'linear-gradient(135deg,#1565C0,#1E88E5)' }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-1 text-white opacity-70">
            Empowerment Tip
          </p>
          <p className="text-sm font-medium text-white leading-relaxed">
            &ldquo;Invest in your skills today — every new thing you learn is a door you can open tomorrow.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
