'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import AppIcon from '../AppIcon';

interface Entry {
  id: string;
  content: string;
  mood: string | null;
  createdAt: string;
}

const MOODS = ['😔', '😐', '🙂', '😊', '😄'];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function Journal() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await apiFetch('/api/journal');
    if (res.ok) {
      const data = await res.json();
      setEntries(data.entries);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const shouldOpen = localStorage.getItem('feminara_journal_open') === 'true';
    if (shouldOpen) {
      const prompt = localStorage.getItem('feminara_journal_prompt');
      setEditingId(null);
      setText(prompt ? `${prompt}\n\n` : '');
      setMood(null);
      setComposing(true);
      localStorage.removeItem('feminara_journal_open');
    }
  }, []);

  const openNew = () => {
    setEditingId(null);
    setText('');
    setMood(null);
    setComposing(true);
  };

  const openEdit = (entry: Entry) => {
    setEditingId(entry.id);
    setText(entry.content);
    setMood(entry.mood);
    setComposing(true);
  };

  const cancel = () => {
    setComposing(false);
    setEditingId(null);
    setText('');
    setMood(null);
  };

  const save = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        const res = await apiFetch(`/api/journal/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({ content: text, mood }),
        });
        if (res.ok) {
          const data = await res.json();
          setEntries((prev) => prev.map((e) => (e.id === editingId ? data.entry : e)));
        }
      } else {
        const res = await apiFetch('/api/journal', {
          method: 'POST',
          body: JSON.stringify({ content: text, mood }),
        });
        if (res.ok) {
          const data = await res.json();
          setEntries((prev) => [data.entry, ...prev]);
        }
      }
      cancel();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    const res = await apiFetch(`/api/journal/${id}`, { method: 'DELETE' });
    if (res.ok) setEntries((prev) => prev.filter((e) => e.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="section-scroll">
      <div className="screen-hdr" style={{ paddingTop: 28 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#0B4F6C' }}>Journal</h1>
            <p className="text-xs" style={{ color: '#7CCFDE' }}>Your private space</p>
          </div>
          {!composing && (
            <button
              onClick={openNew}
              style={{
                background: '#2899B4', color: '#fff', border: 'none',
                borderRadius: 12, padding: '8px 16px', fontFamily: 'inherit',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              + New Entry
            </button>
          )}
        </div>

        {/* Compose / edit panel */}
        {composing && (
          <div className="card p-4 mb-5">
            <p className="text-xs font-semibold mb-2" style={{ color: '#7CCFDE' }}>
              {editingId ? 'Edit entry' : "What's on your mind?"}
            </p>

            {/* Mood picker */}
            <div className="flex gap-3 mb-3">
              {MOODS.map((m) => (
                <span
                  key={m}
                  onClick={() => setMood(mood === m ? null : m)}
                  style={{
                    fontSize: 24,
                    cursor: 'pointer',
                    padding: '4px 6px',
                    borderRadius: 10,
                    background: mood === m ? '#EBF8FC' : 'transparent',
                    border: mood === m ? '1.5px solid #2899B4' : '1.5px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  {m}
                </span>
              ))}
            </div>

            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write freely — this is just for you…"
              rows={5}
              style={{
                width: '100%', resize: 'none', border: '1.5px solid #B0E4EF',
                borderRadius: 12, padding: '12px 14px', fontFamily: 'inherit',
                fontSize: 14, color: '#0B4F6C', background: '#FAFEFF',
                outline: 'none', lineHeight: 1.6,
              }}
              onFocus={(e) => { e.target.style.borderColor = '#2899B4'; }}
              onBlur={(e) => { e.target.style.borderColor = '#B0E4EF'; }}
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={save}
                disabled={saving || !text.trim()}
                className="btn-primary"
                style={{ flex: 1, opacity: saving || !text.trim() ? 0.6 : 1 }}
              >
                {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Save Entry'}
              </button>
              <button
                onClick={cancel}
                style={{
                  border: '1.5px solid #B0E4EF', borderRadius: 12, padding: '12px 18px',
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: '#7CCFDE',
                  background: 'transparent', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Entries */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 animate-pulse" style={{ height: 80 }} />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <AppIcon name="book" size={48} className="text-[#B0E4EF]" />
            <p className="text-sm font-medium" style={{ color: '#7CCFDE' }}>
              No entries yet — start writing today
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map((entry) => (
              <div key={entry.id} className="card p-4">
                {/* Delete confirm overlay */}
                {deleteConfirm === entry.id ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium" style={{ color: '#0B4F6C' }}>
                      Delete this entry?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => remove(entry.id)}
                        style={{
                          background: '#EF4444', color: '#fff', border: 'none',
                          borderRadius: 10, padding: '8px 16px', fontFamily: 'inherit',
                          fontSize: 13, fontWeight: 600, cursor: 'pointer', flex: 1,
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        style={{
                          border: '1.5px solid #B0E4EF', background: 'transparent',
                          borderRadius: 10, padding: '8px 16px', fontFamily: 'inherit',
                          fontSize: 13, fontWeight: 600, color: '#7CCFDE', cursor: 'pointer', flex: 1,
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {entry.mood && <span style={{ fontSize: 20 }}>{entry.mood}</span>}
                        <div>
                          <p className="text-xs font-semibold" style={{ color: '#2899B4' }}>
                            {formatDate(entry.createdAt)}
                          </p>
                          <p className="text-xs" style={{ color: '#B0E4EF' }}>
                            {formatTime(entry.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(entry)}
                          style={{
                            border: 'none', background: '#EBF8FC', borderRadius: 8,
                            padding: '4px 10px', fontSize: 12, fontWeight: 600,
                            color: '#2899B4', cursor: 'pointer', fontFamily: 'inherit',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(entry.id)}
                          style={{
                            border: 'none', background: '#FEE2E2', borderRadius: 8,
                            padding: '4px 10px', fontSize: 12, fontWeight: 600,
                            color: '#EF4444', cursor: 'pointer', fontFamily: 'inherit',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: '#1A7A9A', whiteSpace: 'pre-wrap' }}
                    >
                      {entry.content}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
