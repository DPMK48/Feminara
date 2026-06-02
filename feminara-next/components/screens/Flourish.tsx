'use client';

import { useEffect, useState } from 'react';
import AppIcon, { type AppIconName } from '../AppIcon';

type Screen = 'home' | 'journal' | 'community' | 'flourish' | 'spark' | 'glow' | 'bloom' | 'profile';

interface FlourishProps {
  onNavigate: (s: Screen) => void;
}

const moods = ['😔', '😐', '🙂', '😊', '😄'];
const moodLabels = ['Low', 'Neutral', 'Good', 'Happy', 'Joyful'];

const mentalStates = [
  { value: 'low', label: 'Low energy', icon: 'moon' as AppIconName },
  { value: 'stressed', label: 'Stressed', icon: 'thermometer' as AppIconName },
  { value: 'anxious', label: 'Anxious', icon: 'sparkles' as AppIconName },
  { value: 'motivated', label: 'Motivated', icon: 'sun' as AppIconName },
  { value: 'calm', label: 'Calm', icon: 'leaf' as AppIconName },
];

const relationshipStates = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'complicated', label: 'Complicated' },
  { value: 'other', label: 'Other' },
];

const focusAreas = [
  { value: 'finance', label: 'Finance', icon: 'barChart' as AppIconName },
  { value: 'identity', label: 'Self-worth', icon: 'heart' as AppIconName },
  { value: 'relationships', label: 'Relationships', icon: 'users' as AppIconName },
  { value: 'career', label: 'Career', icon: 'briefcase' as AppIconName },
  { value: 'mindfulness', label: 'Mindfulness', icon: 'sprout' as AppIconName },
];

type BookItem = {
  title: string;
  author: string;
  readUrl?: string;
  downloadUrl?: string;
  source: string;
};

type PaidBookItem = {
  title: string;
  author: string;
  infoUrl: string;
  source: string;
};

type ArticleItem = {
  title: string;
  source: string;
  readUrl: string;
  minutes: string;
};

export default function Flourish({ onNavigate }: FlourishProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedMental, setSelectedMental] = useState<string | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [freeBooks, setFreeBooks] = useState<BookItem[]>([]);
  const [paidBooks, setPaidBooks] = useState<PaidBookItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const hasSelection = Boolean(selectedMental || selectedRelationship || selectedFocus);

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

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!hasSelection) {
        setIsLoading(false);
        setErrorMsg(null);
        setFreeBooks([]);
        setPaidBooks([]);
        setArticles([]);
        return;
      }
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const params = new URLSearchParams();
        if (selectedMental) params.set('mental', selectedMental);
        if (selectedRelationship) params.set('relationship', selectedRelationship);
        if (selectedFocus) params.set('focus', selectedFocus);
        const response = await fetch(`/api/flourish/recommendations?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Unable to load recommendations');
        }
        const data = await response.json();
        setFreeBooks(data.freeBooks ?? []);
        setPaidBooks(data.paidBooks ?? []);
        setArticles(data.articles ?? []);
      } catch (err) {
        setErrorMsg('We could not load recommendations yet. Try again soon.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [selectedMental, selectedRelationship, selectedFocus, hasSelection]);

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

        {/* Personalization box */}
        <div className="card p-4 mb-5">
          <p className="text-sm font-semibold mb-3" style={{ color: '#0B4F6C' }}>
            Personalize your suggestions
          </p>
          <div className="mb-3">
            <p className="text-xs font-semibold mb-2" style={{ color: '#1A7A9A' }}>
              Mental health status
            </p>
            <div className="flex flex-wrap gap-2">
              {mentalStates.map((state) => (
                <button
                  key={state.value}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{
                    background: selectedMental === state.value ? '#2899B4' : '#EBF8FC',
                    color: selectedMental === state.value ? '#fff' : '#1A7A9A',
                    border: '1px solid #D4F1F8',
                  }}
                  onClick={() =>
                    setSelectedMental((current) => (current === state.value ? null : state.value))
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    <AppIcon name={state.icon} size={14} className="text-current" />
                    {state.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <p className="text-xs font-semibold mb-2" style={{ color: '#1A7A9A' }}>
              Relationship status
            </p>
            <div className="flex flex-wrap gap-2">
              {relationshipStates.map((state) => (
                <button
                  key={state.value}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{
                    background: selectedRelationship === state.value ? '#2899B4' : '#EBF8FC',
                    color: selectedRelationship === state.value ? '#fff' : '#1A7A9A',
                    border: '1px solid #D4F1F8',
                  }}
                  onClick={() =>
                    setSelectedRelationship((current) => (current === state.value ? null : state.value))
                  }
                >
                  {state.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#1A7A9A' }}>
              Focus area
            </p>
            <div className="flex flex-wrap gap-2">
              {focusAreas.map((area) => (
                <button
                  key={area.value}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{
                    background: selectedFocus === area.value ? '#2899B4' : '#EBF8FC',
                    color: selectedFocus === area.value ? '#fff' : '#1A7A9A',
                    border: '1px solid #D4F1F8',
                  }}
                  onClick={() => setSelectedFocus((current) => (current === area.value ? null : area.value))}
                >
                  <span className="inline-flex items-center gap-1">
                    <AppIcon name={area.icon} size={14} className="text-current" />
                    {area.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <h2 className="text-base font-semibold mb-3" style={{ color: '#0B4F6C' }}>
          Personalized recommendations
        </h2>
        {hasSelection && isLoading && (
          <div className="card p-4 mb-4">
            <p className="text-sm" style={{ color: '#1A7A9A' }}>
              Updating your suggestions...
            </p>
          </div>
        )}
        {errorMsg && (
          <div className="card p-4 mb-4">
            <p className="text-sm" style={{ color: '#C0392B' }}>
              {errorMsg}
            </p>
          </div>
        )}

        {!isLoading && !errorMsg && (
          <>
            <div className="flourish-reco-grid">
              <div className="flourish-reco-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
                    Free books to read now
                  </h3>
                </div>
                <div className="flex flex-col gap-3 mb-5">
                  {freeBooks.length === 0 && (
                    <div className="card p-4">
                      <p className="text-sm" style={{ color: '#7CCFDE' }}>
                        Try a different focus to see more free titles.
                      </p>
                    </div>
                  )}
                  {freeBooks.map((book, i) => (
                    <div key={i} className="card p-3">
                      <div className="flex items-center gap-3">
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
                          <AppIcon name="book" size={20} className="text-[#1A7A9A]" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
                            {book.title}
                          </p>
                          <p className="text-xs" style={{ color: '#7CCFDE' }}>
                            {book.author} • {book.source}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {book.readUrl && (
                          <a
                            href={book.readUrl}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full"
                            style={{ background: '#2899B4', color: '#fff' }}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Read
                          </a>
                        )}
                        {book.downloadUrl && (
                          <a
                            href={book.downloadUrl}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full"
                            style={{ background: '#EBF8FC', color: '#1A7A9A' }}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Download
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-sm font-semibold mb-2" style={{ color: '#0B4F6C' }}>
                  Suggested paid books
                </h3>
                <div className="flex flex-col gap-3 mb-5">
                  {paidBooks.length === 0 && (
                    <div className="card p-4">
                      <p className="text-sm" style={{ color: '#7CCFDE' }}>
                        Select a focus area for curated paid recommendations.
                      </p>
                    </div>
                  )}
                  {paidBooks.map((book, i) => (
                    <div key={i} className="card p-3">
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: '#FFF6E8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <AppIcon name="book" size={20} className="text-[#C98B2B]" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
                            {book.title}
                          </p>
                          <p className="text-xs" style={{ color: '#7CCFDE' }}>
                            {book.author} • {book.source}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <a
                          href={book.infoUrl}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full"
                          style={{ background: '#FFF1DA', color: '#A86810' }}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Learn more
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flourish-reco-col">
                <h3 className="text-sm font-semibold mb-2" style={{ color: '#0B4F6C' }}>
                  Articles to read in-app
                </h3>
                <div className="flex flex-col gap-3 mb-6">
                  {articles.length === 0 && (
                    <div className="card p-4">
                      <p className="text-sm" style={{ color: '#7CCFDE' }}>
                        No articles yet. Try another focus or status.
                      </p>
                    </div>
                  )}
                  {articles.map((article, i) => (
                    <div key={i} className="card flex items-center gap-3 p-3">
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
                        <AppIcon name="message" size={20} className="text-[#1A7A9A]" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
                          {article.title}
                        </p>
                        <div className="flex gap-2 mt-0.5">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: '#D4F1F8', color: '#1A7A9A' }}
                          >
                            {article.source}
                          </span>
                          <span className="text-xs" style={{ color: '#B0E4EF' }}>
                            {article.minutes}
                          </span>
                        </div>
                      </div>
                      <a
                        href={article.readUrl}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{ background: '#2899B4', color: '#fff' }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Read
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
