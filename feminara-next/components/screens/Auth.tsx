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
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [signupStep, setSignupStep] = useState<'details' | 'verify'>('details');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setInfo('');

    if (!phone.trim()) { setError('Please enter your phone number'); return; }
    if (tab === 'signup' && signupStep === 'details' && !name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (tab === 'signup' && signupStep === 'verify' && !code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      const endpoint = tab === 'login'
        ? '/api/auth/login'
        : signupStep === 'details'
          ? '/api/auth/register'
          : '/api/auth/verify';

      const body = tab === 'login'
        ? { phone }
        : signupStep === 'details'
          ? { name, phone }
          : { phone, code };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); return; }

      if (tab === 'signup' && signupStep === 'details') {
        setSignupStep('verify');
        if (data?.simulatedCode) {
          setInfo(`Dev mode: use code ${data.simulatedCode} to verify.`);
        } else {
          setInfo('We sent a verification code to your phone.');
        }
        return;
      }

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
          Supporting women, every day
        </p>
      </div>

      {/* Card */}
      <div className="card w-full" style={{ maxWidth: 400, padding: '28px 24px' }}>
        {/* Tabs */}
        <div className="flex rounded-xl p-1 mb-6" style={{ background: '#EBF8FC' }}>
          {(['login', 'signup'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setError('');
                setInfo('');
                setSignupStep('details');
                setCode('');
              }}
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
            type="tel"
            inputMode="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />

          {tab === 'signup' && signupStep === 'verify' && (
            <input
              className="input-field"
              type="text"
              inputMode="numeric"
              placeholder="Verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          )}

          {info && (
            <p
              className="text-xs px-3 py-2 rounded-lg font-medium"
              style={{ background: '#E0F2FE', color: '#0C4A6E' }}
            >
              {info}
            </p>
          )}

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
            {loading
              ? 'Please wait…'
              : tab === 'login'
                ? 'Continue'
                : signupStep === 'details'
                  ? 'Send Code'
                  : 'Verify & Create Account'}
          </button>

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
