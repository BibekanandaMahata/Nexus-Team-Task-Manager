'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Logo from './Logo';

export default function UsernameOnboarding() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters.');
      return;
    }
    if (firstName.trim().length === 0) {
      setError('First name is required.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/auth/set-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username: username.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim() || null
          }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setError(data?.error ?? 'Failed to update profile.');
          return;
        }

        // Successfully updated. Hard reload to refresh session in server layout
        window.location.reload();
      } catch (err) {
        setError('Network error. Please try again.');
      }
    });
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'var(--color-bg)',
        zIndex: 9999,
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      {/* Background glow effect */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          position: 'relative',
        }}
      >
        <Logo variant="full" size="md" />

        <div className="glass-card" style={{ width: '100%', padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
            Complete your profile
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px', textAlign: 'center', lineHeight: 1.5 }}>
            You&apos;re logged in! Please provide your name and pick a unique username to unlock all features.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <label htmlFor="onboarding-firstname" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                  First Name
                </label>
                <input
                  id="onboarding-firstname"
                  type="text"
                  className="input"
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={isPending}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    color: 'var(--color-text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <label htmlFor="onboarding-lastname" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                  Last Name
                </label>
                <input
                  id="onboarding-lastname"
                  type="text"
                  className="input"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isPending}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    color: 'var(--color-text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="onboarding-username" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Username
              </label>
              <input
                id="onboarding-username"
                type="text"
                className="input"
                placeholder="e.g. jane_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                required
                minLength={2}
                maxLength={32}
                disabled={isPending}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                Only lowercase letters, numbers, underscores, and hyphens. Min 2 characters.
              </p>
            </div>

            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#f87171',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
              style={{
                width: '100%',
                padding: '12px',
                fontWeight: 600,
                fontSize: '14px',
                marginTop: '8px',
                cursor: isPending ? 'default' : 'pointer',
              }}
            >
              {isPending ? 'Saving profile…' : 'Let\'s get started ➔'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
