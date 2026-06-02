'use client';

import { useState } from 'react';
import AppIcon, { type AppIconName } from '../AppIcon';

type LessonMedia = 'video' | 'image' | 'text';

type Lesson = {
  id: string;
  title: string;
  summary: string;
  category: string;
  level: string;
  duration: string;
  languages: string[];
  media: LessonMedia[];
  accent: string;
  icon: AppIconName;
};

const availableLanguages = ['English', 'Hausa', 'Yoruba', 'Igbo'];

const lessons: Lesson[] = [
  {
    id: 'spark-1',
    title: 'Safe Money, Safe Family',
    summary: 'Simple steps to plan for food, school, and savings.',
    category: 'Money',
    level: 'Beginner',
    duration: '6 min',
    languages: ['English', 'Igbo'],
    media: ['video', 'text'],
    accent: '#1E88E5',
    icon: 'briefcase',
  },
  {
    id: 'spark-2',
    title: 'Healthy Cooking on a Small Budget',
    summary: 'Watch, see, and read quick meal ideas with local foods.',
    category: 'Wellness',
    level: 'Beginner',
    duration: '8 min',
    languages: ['English', 'Hausa'],
    media: ['video', 'image', 'text'],
    accent: '#2A9D8F',
    icon: 'leaf',
  },
  {
    id: 'spark-3',
    title: 'Speak with Confidence',
    summary: 'Short speaking tips you can practice right away.',
    category: 'Communication',
    level: 'Starter',
    duration: '5 min',
    languages: ['English', 'Yoruba'],
    media: ['video', 'text'],
    accent: '#F4A261',
    icon: 'mic',
  },
  {
    id: 'spark-4',
    title: 'Phone Skills for Work',
    summary: 'Learn calls, messages, and safe internet steps.',
    category: 'Digital',
    level: 'Starter',
    duration: '7 min',
    languages: ['English', 'Igbo'],
    media: ['image', 'text'],
    accent: '#6D597A',
    icon: 'laptop',
  },
  {
    id: 'spark-5',
    title: 'Know Your Rights',
    summary: 'Clear guidance on safety, respect, and support.',
    category: 'Safety',
    level: 'All',
    duration: '4 min',
    languages: ['English', 'Hausa', 'Yoruba'],
    media: ['text'],
    accent: '#3A86FF',
    icon: 'lock',
  },
];

const mediaLabels: Record<LessonMedia, { label: string; color: string; bg: string; icon: AppIconName }> = {
  video: { label: 'Video', color: '#1E88E5', bg: '#E7F2FF', icon: 'upload' },
  image: { label: 'Image', color: '#2A9D8F', bg: '#E6FAF4', icon: 'sparkles' },
  text: { label: 'Text', color: '#6D597A', bg: '#F1E9F8', icon: 'book' },
};

export default function Spark() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(availableLanguages[0]);

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
              Learn in your language with video, images, and text
            </p>
          </div>
        </div>

        {/* Language row */}
        <div className="card p-4 mb-4" style={{ position: 'relative', zIndex: 1 }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#0B4F6C' }}>
            Choose your language
          </p>
          <div className="flex flex-wrap gap-2">
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  background: selectedLanguage === lang ? '#1565C0' : '#E7F2FF',
                  color: selectedLanguage === lang ? '#fff' : '#1565C0',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: '#7CCFDE' }}>
            More languages will be added soon.
          </p>
        </div>

        {/* Featured lesson */}
        <div
          className="card p-5 mb-5 spark-reveal"
          style={{
            background: 'linear-gradient(135deg, #E7F2FF 0%, #F6FBFF 100%)',
            border: '1px solid #DCEEFF',
          }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div style={{ flex: 1 }}>
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#7CCFDE' }}>
                Featured lesson
              </p>
              <h2 className="text-lg font-bold mt-1" style={{ color: '#0B4F6C' }}>
                Build a Simple Budget
              </h2>
              <p className="text-sm mt-2" style={{ color: '#4E7C8A' }}>
                Watch a short video, view picture steps, and read a clear guide. Simple words, real examples.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['English', 'Igbo'].map((lang) => (
                  <span
                    key={lang}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: '#DCEEFF', color: '#1565C0' }}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            <div
              className="rounded-2xl p-4"
              style={{
                width: '100%',
                maxWidth: 240,
                background: 'linear-gradient(135deg, #1565C0 0%, #1E88E5 100%)',
                color: '#fff',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AppIcon name="upload" size={18} className="text-white" />
                <span className="text-xs font-semibold">Video preview</span>
              </div>
              <div
                className="rounded-xl"
                style={{
                  height: 120,
                  background: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Play when ready
              </div>
              <button
                className="mt-3 w-full text-xs font-semibold"
                style={{
                  background: '#fff',
                  color: '#1565C0',
                  borderRadius: 10,
                  padding: '8px 12px',
                  border: 'none',
                }}
              >
                Start lesson
              </button>
            </div>
          </div>
        </div>

        {/* Lesson cards */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold" style={{ color: '#0B4F6C' }}>
            Lesson cards
          </h2>
          <button
            className="text-xs font-semibold"
            style={{ border: 'none', background: 'transparent', color: '#2899B4', cursor: 'pointer' }}
          >
            See all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="card p-4 spark-reveal"
              style={{
                borderLeft: `4px solid ${lesson.accent}`,
                animationDelay: `${index * 90}ms`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: `${lesson.accent}1A`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AppIcon name={lesson.icon} size={20} className="text-[#0B4F6C]" />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
                      {lesson.title}
                    </p>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: '#F2F7F9', color: '#7CCFDE' }}
                    >
                      {lesson.category}
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#4E7C8A' }}>
                    {lesson.summary}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {lesson.media.map((item) => (
                  <span
                    key={`${lesson.id}-${item}`}
                    className="text-[11px] font-semibold px-2 py-1 rounded-full inline-flex items-center gap-1"
                    style={{ background: mediaLabels[item].bg, color: mediaLabels[item].color }}
                  >
                    <AppIcon name={mediaLabels[item].icon} size={12} className="text-current" />
                    {mediaLabels[item].label}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {lesson.languages
                  .filter((lang) => lang === selectedLanguage)
                  .map((lang) => (
                  <span
                    key={`${lesson.id}-${lang}`}
                    className="text-[11px] font-semibold px-2 py-1 rounded-full"
                    style={{ background: '#E7F2FF', color: '#1565C0' }}
                  >
                    {lang}
                  </span>
                  ))}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-xs" style={{ color: '#7CCFDE' }}>
                  {lesson.level} · {lesson.duration}
                </div>
                <button
                  className="text-xs font-semibold"
                  style={{
                    border: 'none',
                    background: 'linear-gradient(135deg,#2899B4,#1565C0)',
                    color: '#fff',
                    borderRadius: 10,
                    padding: '6px 12px',
                  }}
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
