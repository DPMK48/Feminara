'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import AppIcon, { type AppIconName } from '../AppIcon';

interface Stats {
  journalCount: number;
  postCount: number;
  streak: number;
}

const SETTINGS: { icon: AppIconName; label: string }[] = [
  { icon: 'bell', label: 'Notifications' },
  { icon: 'lock', label: 'Privacy & Security' },
  { icon: 'moon', label: 'Dark Mode' },
  { icon: 'upload', label: 'Export Data' },
  { icon: 'help', label: 'Help & Support' },
];

function initials(name: string) {
  return name.trim().split(' ')[0]?.[0]?.toUpperCase() ?? 'U';
}

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [stats, setStats] = useState<Stats>({ journalCount: 0, postCount: 0, streak: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const res = await apiFetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
      setLoading(false);
    };
    load();
  }, []);

  const startEdit = () => {
    setNewName(user?.name ?? '');
    setEditing(true);
    setError('');
  };

  const saveProfile = async () => {
    if (!newName.trim()) { setError('Name cannot be empty'); return; }
    setSaving(true);
    const res = await apiFetch('/api/profile', {
      method: 'PUT',
      body: JSON.stringify({ name: newName }),
    });
    if (res.ok) {
      const data = await res.json();
      updateUser(data.user);
      setEditing(false);
    } else {
      setError('Failed to save — try again');
    }
    setSaving(false);
  };

  if (!user) return null;

  return (
    <div className="section-scroll">
      <div className="screen-hdr" style={{ paddingTop: 28 }}>
        {/* Avatar & info */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg,#7CCFDE,#2899B4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 12,
            }}
          >
            {initials(user.name)}
          </div>

          {editing ? (
            <div className="flex flex-col gap-2 items-center w-full" style={{ maxWidth: 280 }}>
              <input
                autoFocus
                className="input-field text-center text-base font-semibold"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveProfile()}
                style={{ maxWidth: 280 }}
              />
              {error && (
                <p className="text-xs" style={{ color: '#EF4444' }}>{error}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  style={{
                    background: '#2899B4', color: '#fff', border: 'none',
                    borderRadius: 10, padding: '8px 20px', fontFamily: 'inherit',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  style={{
                    border: '1.5px solid #B0E4EF', background: 'transparent',
                    borderRadius: 10, padding: '8px 20px', fontFamily: 'inherit',
                    fontSize: 13, fontWeight: 600, color: '#7CCFDE', cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold" style={{ color: '#0B4F6C' }}>
                  {user.name}
                </h1>
                <button
                  onClick={startEdit}
                  style={{
                    border: 'none', background: '#EBF8FC', borderRadius: 8,
                    padding: '3px 8px', fontSize: 11, fontWeight: 600,
                    color: '#2899B4', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Edit
                </button>
              </div>
              <p className="text-sm mt-0.5" style={{ color: '#7CCFDE' }}>{user.email}</p>
            </>
          )}

          {/* Stats */}
          {!loading && (
            <div className="flex gap-3 mt-5">
              {[
                { value: stats.streak, label: 'Day Streak' },
                { value: stats.journalCount, label: 'Journals' },
                { value: stats.postCount, label: 'Posts' },
              ].map((stat) => (
                <div key={stat.label} className="card text-center px-4 py-3">
                  <p className="text-lg font-bold" style={{ color: '#0B4F6C' }}>
                    {stat.value}
                  </p>
                  <p className="text-xs" style={{ color: '#7CCFDE' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <h2 className="text-base font-semibold mb-3" style={{ color: '#0B4F6C' }}>Settings</h2>
        <div className="flex flex-col gap-2 mb-5">
          {SETTINGS.map((s) => (
            <div
              key={s.label}
              className="card flex items-center gap-3 p-4 cursor-pointer"
              style={{ justifyContent: 'space-between' }}
            >
              <div className="flex items-center gap-3">
                <AppIcon name={s.icon} size={20} className="text-[#0B4F6C]" />
                <span className="text-sm font-medium" style={{ color: '#0B4F6C' }}>
                  {s.label}
                </span>
              </div>
              <span style={{ color: '#B0E4EF', fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={logout}
          className="w-full rounded-2xl py-4 text-sm font-semibold mb-6"
          style={{
            border: '1.5px solid #FCA5A5', background: '#FFF5F5',
            color: '#EF4444', fontFamily: 'inherit', cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
