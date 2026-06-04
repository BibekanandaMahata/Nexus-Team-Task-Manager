'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Metadata } from 'next';

// ─── OTP Login Page ─────────────────────────────────────────────────────────
// Step 1: enter email → send OTP
// Step 2: enter 6-digit code → verify → redirect
// Step 2b: if first-time user → also collect username

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [needsUsername, setNeedsUsername] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // ── Step 1: Send OTP ───────────────────────────────────────────────────
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setInfo('');

    startTransition(async () => {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
        return;
      }

      setInfo('Check your inbox — a 6-digit code is on its way.');
      setStep('otp');
    });
  }

  // ── Step 2: Verify OTP ─────────────────────────────────────────────────
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: code.trim(),
          username: needsUsername ? username.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requireUsername) {
          setNeedsUsername(true);
          setError(data.error);
          return;
        }
        setError(data.error ?? 'Verification failed.');
        return;
      }

      // Success → go to dashboard
      router.push('/dashboard');
      router.refresh();
    });
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'radial-gradient(ellipse at 60% 0%, rgba(129,140,248,0.08) 0%, transparent 60%), var(--color-bg)',
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '26.25rem', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                boxShadow: '0 0 24px rgba(129,140,248,0.4)',
                animation: 'pulse-glow 3s ease-in-out infinite',
              }}
            >
              ⚡
            </div>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Nexus
            </span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            {step === 'email'
              ? 'Enter your email to get a secure one-time code'
              : `Code sent to ${email}`}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '32px' }}>
          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="flex-col gap-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="email-input">Email address</label>
                <input
                  id="email-input"
                  type="email"
                  className="input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  disabled={isPending}
                />
              </div>

              {error && (
                <div
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#f87171',
                  }}
                >
                  {error}
                </div>
              )}

              <button id="send-otp-btn" type="submit" className="btn btn-primary w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <span className="spinner" />
                    Sending code…
                  </>
                ) : (
                  'Continue with email →'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {info && (
                <div
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(34,197,94,0.08)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#4ade80',
                  }}
                >
                  {info}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="otp-input">6-digit code</label>
                <input
                  id="otp-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  className="input"
                  placeholder="••••••"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  required
                  autoFocus
                  disabled={isPending}
                  style={{ letterSpacing: '6px', fontSize: '20px', textAlign: 'center' }}
                />
              </div>

              {needsUsername && (
                <div className="form-group">
                  <label htmlFor="username-input">Choose a username</label>
                  <input
                    id="username-input"
                    type="text"
                    className="input"
                    placeholder="yourname"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={2}
                    maxLength={32}
                    disabled={isPending}
                  />
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    First time here! Pick a unique username to continue.
                  </p>
                </div>
              )}

              {error && (
                <div
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#f87171',
                  }}
                >
                  {error}
                </div>
              )}

              <button id="verify-otp-btn" type="submit" className="btn btn-primary w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <span className="spinner" />
                    Verifying…
                  </>
                ) : (
                  'Sign in →'
                )}
              </button>

              <button
                id="back-to-email-btn"
                type="button"
                className="btn btn-secondary w-full"
                onClick={() => {
                  setStep('email');
                  setCode('');
                  setError('');
                  setInfo('');
                  setNeedsUsername(false);
                }}
                disabled={isPending}
              >
                ← Use a different email
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          No passwords. No account creation. Just your email.
        </p>
      </div>
    </div>
  );
}
