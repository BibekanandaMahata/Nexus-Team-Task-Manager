'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '../../components/Logo';
import '../../styles/login.css';

// ─── OTP Login Page (Split Screen Premium layout) ───────────────────────────
// Left Column: Brand illustrations & features (hidden on mobile)
// Right Column: sleek glassmorphism login form
export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Verification failed.');
        return;
      }

      // Success → force full page reload to sync cookies and go to dashboard
      window.location.href = '/dashboard';
    });
  }

  return (
    <div className="login-split-container">

      {/* Floating Back Link (Globally positioned) */}
      <Link
        href="/"
        className="login-back-link"
      >
        ← Back to home
      </Link>

      {/* Floating Logo (Globally positioned in top-right) */}
      <Logo variant="full" size="sm" className="login-top-logo" />

      {/* Background Grid Pattern */}
      <div className="login-bg-grid" />


      {/* RIGHT COLUMN: Slick glassmorphism form */}
      <div className="login-form-side">
        {/* Ambient background glow behind form */}
        <div className="login-glow-right" />

        <div style={{ width: '100%', maxWidth: '26.25rem', position: 'relative', zIndex: 1 }}>
          {/* Logo & Header */}
          <div className="login-form-header">
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '20px' }}>
              Welcome,
            </p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
              {step === 'email'
                ? 'Enter your email to get a secure one-time code'
                : `Code sent to ${email}`}
            </p>
          </div>

          {/* Form Card */}
          <div className="login-form-card glass-card">
            {step === 'email' ? (
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

                <button id="send-otp-btn" type="submit" className="btn btn-primary w-full" style={{ padding: '0.75rem 1.5rem', fontWeight: 600, fontSize: '14px' }} disabled={isPending}>
                  {isPending ? (
                    <>
                      <span className="spinner" />
                      Sending code…
                    </>
                  ) : (
                    'Continue with email ➔'
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                    className="input login-input-otp"
                    placeholder="••••••"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
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

                <button id="verify-otp-btn" type="submit" className="btn btn-primary w-full" style={{ padding: '0.75rem 1.5rem', fontWeight: 600, fontSize: '14px' }} disabled={isPending}>
                  {isPending ? (
                    <>
                      <span className="spinner" />
                      Verifying…
                    </>
                  ) : (
                    'Sign in ➔'
                  )}
                </button>

                <button
                  id="back-to-email-btn"
                  type="button"
                  className="btn btn-secondary w-full"
                  style={{ padding: '0.75rem 1.5rem', fontWeight: 600, fontSize: '14px' }}
                  onClick={() => {
                    setStep('email');
                    setCode('');
                    setError('');
                    setInfo('');
                  }}
                  disabled={isPending}
                >
                  ← Use a different email
                </button>
              </form>
            )}
          </div>

          <p className="login-disclaimer">
            Log in instantly with a one-time password—no registration required.
          </p>
        </div>
      </div>
    </div>
  );
}
