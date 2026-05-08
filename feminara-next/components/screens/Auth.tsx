'use client';

import { useState } from 'react';
import FlowerLogo from '../FlowerLogo';
import { useAuth } from '@/contexts/AuthContext';

interface AuthProps {
  onAuth: () => void;
}

export default function Auth({ onAuth }: AuthProps) {
  const { login } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !password) { setError('Please fill in all fields'); return; }
    if (tab === 'signup' && !name.trim()) { setError('Please enter your name'); return; }

    setLoading(true);
    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = tab === 'login'
        ? { email, password }
        : { name, email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); return; }

      login(data.token, data.user);
      onAuth();
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center px-6 py-10"
      style={{ minHeight: '100dvh', background: '#F5FBFD' }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#2899B4,#0B4F6C)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FlowerLogo size={48} color="white" centerColor="rgba(255,255,255,0.3)" />
        </div>
        <h1 className="font-bold text-xl tracking-widest" style={{ color: '#0B4F6C' }}>
          FEMINARA
        </h1>
        <p className="text-sm font-light" style={{ color: '#2899B4' }}>
          your everyday companion
        </p>
      </div>

      {/* Card */}
      <div className="card w-full" style={{ maxWidth: 400, padding: '28px 24px' }}>
        {/* Tabs */}
        <div className="flex rounded-xl p-1 mb-6" style={{ background: '#EBF8FC' }}>
          {(['login', 'signup'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: tab === t ? '#2899B4' : 'transparent',
                color: tab === t ? '#fff' : '#1A7A9A',
                border: 'none',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              {t === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {tab === 'signup' && (
            <input
              className="input-field"
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            className="input-field"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />

          {error && (
            <p
              className="text-xs px-3 py-2 rounded-lg font-medium"
              style={{ background: '#FEE2E2', color: '#B91C1C' }}
            >
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary mt-1"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          {tab === 'login' && (
            <p className="text-center text-xs" style={{ color: '#7CCFDE' }}>
              Forgot password?{' '}
              <span className="font-semibold cursor-pointer" style={{ color: '#2899B4' }}>
                Reset
              </span>
            </p>
          )}
          {tab === 'signup' && (
            <p className="text-center text-xs" style={{ color: '#7CCFDE' }}>
              By signing up you agree to our{' '}
              <span className="font-semibold cursor-pointer" style={{ color: '#2899B4' }}>
                Terms & Privacy
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
