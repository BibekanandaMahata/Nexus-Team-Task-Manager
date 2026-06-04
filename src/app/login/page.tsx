'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ─── OTP Login Page (Split Screen Premium layout) ───────────────────────────
// Left Column: Brand illustrations & features (hidden on mobile)
// Right Column: sleek glassmorphism login form
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
      className="login-split-container"
      style={{
        backgroundColor: '#0b0f19',
        color: '#f8fafc',
        // Override theme colors specifically for the login page
        ['--color-bg' as any]: '#0b0f19',
        ['--color-text-primary' as any]: '#f8fafc',
        ['--color-text-secondary' as any]: '#94a3b8',
        ['--color-text-muted' as any]: '#475569',
        ['--color-border' as any]: '#1e293b',
        ['--color-surface' as any]: '#111827',
        ['--color-surface-2' as any]: '#1f2937',
        ['--color-surface-3' as any]: '#111827',
        // Override brand colors specifically for the login page to be blue
        ['--color-brand-start' as any]: '#3b82f6',
        ['--color-brand-end' as any]: '#06b6d4',
        ['--color-brand-glow-rgb' as any]: '59, 130, 246',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .login-split-container {
          display: flex;
          height: 100vh;
          height: 100dvh;
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        .login-form-side {
          flex: 1.1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          z-index: 10;
          height: 100%;
          overflow: hidden;
        }
        .login-info-side {
          flex: 0.9;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 4rem 3.5rem;
          background: rgba(17, 17, 19, 0.45);
          border-right: 1px solid var(--color-border);
          position: relative;
          overflow: hidden;
          height: 100%;
        }
        .login-back-link {
          position: absolute;
          top: 2rem;
          left: 2rem;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--color-text-secondary);
          text-decoration: none;
          font-weight: 500;
          z-index: 50;
          transition: all 0.15s ease;
        }
        .login-back-link:hover {
          color: var(--color-text-primary);
          transform: translateX(-2px);
        }
        .login-illustration-container {
          width: 100%;
          max-width: 25rem;
          margin: 0 0 1.5rem;
          position: relative;
          z-index: 1;
        }
        .login-illustration-container img {
          width: 100%;
          max-height: 25vh;
          height: auto;
          display: block;
        }
        .login-form-header {
          text-align: center;
          margin-bottom: 2.25rem;
        }
        .login-form-card {
          padding: 2rem;
          background: rgba(17, 17, 19, 0.7);
          border: 1px solid var(--color-border);
          border-radius: 1rem;
          box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.4);
        }
        .login-disclaimer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 12px;
          color: var(--color-text-muted);
        }

        /* Responsive Styles (Width) */
        @media (max-width: 900px) {
          .login-info-side {
            display: none;
          }
          .login-back-link {
            top: 1.5rem;
            left: 1.5rem;
          }
          .login-form-side {
            flex: 1;
            padding: 1.5rem;
          }
        }

        /* Responsive Styles (Height) */
        @media (max-height: 720px) {
          .login-info-side {
            padding: 2.5rem;
          }
          .login-slogan-wrap h1 {
            font-size: 1.75rem !important;
            margin-bottom: 0.5rem !important;
          }
          .login-slogan-wrap p {
            font-size: 13px !important;
            margin-bottom: 1rem !important;
          }
          .login-illustration-container {
            margin-bottom: 1rem !important;
          }
          .login-benefits-list {
            gap: 0.5rem !important;
          }
          .login-form-header {
            margin-bottom: 1.5rem !important;
          }
          .login-form-card {
            padding: 1.5rem !important;
          }
        }

        @media (max-height: 600px) {
          .login-illustration-container {
            display: none !important;
          }
          .login-benefits-list {
            display: none !important;
          }
          .login-slogan-wrap p {
            margin-bottom: 0 !important;
          }
          .login-form-header {
            margin-bottom: 1rem !important;
          }
          .login-form-header p {
            font-size: 12px !important;
          }
          .login-form-card {
            padding: 1.25rem !important;
          }
          .login-form-card form {
            gap: 1rem !important;
          }
        }

        @media (max-height: 495px) {
          .login-back-link {
            top: 1rem;
            left: 1rem;
          }
          .login-form-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 0.75rem !important;
            text-align: left !important;
          }
          .login-form-header div {
            margin-bottom: 0 !important;
          }
          .login-form-header p {
            display: none;
          }
          .login-form-card {
            padding: 1rem !important;
            border-radius: 0.75rem !important;
          }
          .login-form-card form {
            gap: 0.75rem !important;
          }
          .login-disclaimer {
            margin-top: 0.75rem !important;
            font-size: 11px !important;
          }
        }
      `}} />

      {/* Floating Back Link (Globally positioned) */}
      <Link 
        href="/" 
        className="login-back-link"
      >
        ← Back to home
      </Link>

      {/* Background Grid Pattern */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* LEFT COLUMN: Premium Info pane */}
      <div className="login-info-side">
        {/* Soft Ambient Glow */}
        <div 
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '30rem',
            height: '30rem',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(var(--color-brand-glow-rgb), 0.08) 0%, transparent 75%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div className="login-slogan-wrap" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          {/* Slogan */}
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.2, marginBottom: '1rem' }}>
            Focus on what matters.<br />
            We&apos;ll handle the alignment.
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: '28rem', marginBottom: '2rem' }}>
            Manage tasks dynamically, verify team sessions securely, and maintain an immutable ledger audit trail automatically.
          </p>
        </div>

        {/* Illustration */}
        <div className="login-illustration-container">
          <img 
            src="/assets/login-illustration.svg" 
            alt="Nexus Kanban Illustration" 
          />
        </div>

        {/* Bulleted Benefits list */}
        <div className="login-benefits-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: 'var(--color-brand-start)', fontSize: '15px', fontWeight: 700 }}>⚡</span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Visual task board lanes with custom tag metrics</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: 'var(--color-brand-start)', fontSize: '15px', fontWeight: 700 }}>🔒</span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Secure passwordless email OTP validation</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: 'var(--color-brand-start)', fontSize: '15px', fontWeight: 700 }}>◉</span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Automated immutable audit trail tracking</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Slick glassmorphism form */}
      <div className="login-form-side">
        {/* Ambient background glow behind form */}
        <div 
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '24rem',
            height: '24rem',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(var(--color-brand-glow-rgb), 0.05) 0%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ width: '100%', maxWidth: '26.25rem', position: 'relative', zIndex: 1 }}>
          {/* Logo & Header */}
          <div className="login-form-header">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, var(--color-brand-start), var(--color-brand-end))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  boxShadow: '0 0 1.5rem rgba(var(--color-brand-glow-rgb), 0.3)',
                  animation: 'pulse-glow 3s ease-in-out infinite',
                }}
              >
                ⚡
              </div>
              <span
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, var(--color-brand-start), var(--color-brand-end))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em',
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
                    setNeedsUsername(false);
                  }}
                  disabled={isPending}
                >
                  ← Use a different email
                </button>
              </form>
            )}
          </div>

          <p className="login-disclaimer">
            No passwords. No account creation. Just your email.
          </p>
        </div>
      </div>
    </div>
  );
}
