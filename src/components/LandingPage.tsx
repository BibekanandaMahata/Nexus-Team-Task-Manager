'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0b0f19',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        // Override theme colors specifically for the dark slate landing page
        ['--color-bg' as any]: '#0b0f19',
        ['--color-text-primary' as any]: '#f8fafc',
        ['--color-text-secondary' as any]: '#94a3b8',
        ['--color-text-muted' as any]: '#475569',
        ['--color-border' as any]: '#1e293b',
        ['--color-surface' as any]: '#111827',
        ['--color-surface-2' as any]: '#1f2937',
        ['--color-surface-3' as any]: '#111827',
        // Override brand colors specifically for the landing page to be blue
        ['--color-brand-start' as any]: '#3b82f6',
        ['--color-brand-end' as any]: '#06b6d4',
        ['--color-brand-glow-rgb' as any]: '59, 130, 246',
      }}
    >
      
      {/* Premium Ambient Background Glows */}
      <div 
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '50rem',
          maxWidth: '100%',
          height: '37.5rem',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(var(--color-brand-glow-rgb), 0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      
      {/* Background Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          backgroundPosition: 'center top',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header
        style={{
          width: '90%',
          maxWidth: '75rem',
          margin: '0 auto',
          padding: 0,
          height: '5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div 
            style={{ 
              width: '2rem', 
              height: '2rem', 
              borderRadius: '0.625rem', 
              background: 'linear-gradient(135deg, var(--color-brand-start), var(--color-brand-end))', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 0 1rem rgba(var(--color-brand-glow-rgb), 0.3)'
            }}
          >
            ⚡
          </div>
          <span style={{ fontWeight: 800, color: 'var(--color-text-primary)', fontSize: '1.25rem', letterSpacing: '-0.03em' }}>Nexus — Team Task Manager</span>
        </div>
        <Link 
          href="/login" 
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
        >
          Sign In
        </Link>
      </header>

      {/* Main Hero & Content */}
      <main
        style={{
          width: '90%',
          maxWidth: '75rem',
          margin: '0 auto',
          padding: '2.5rem 0 5rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        
        {/* Hero Headline & Intro */}
        <div style={{ maxWidth: '40rem', marginBottom: '3.5rem', textAlign: 'left' }}>

          <h1 
            style={{ 
              fontSize: '3rem', 
              fontWeight: 800, 
              letterSpacing: '-0.04em', 
              color: 'var(--color-text-primary)',
              lineHeight: 1.1,
              marginBottom: '1.25rem'
            }}
          >
            Task management,<br />
            <span style={{ background: 'linear-gradient(135deg, var(--color-brand-start), var(--color-brand-end))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              simplified.
            </span>
          </h1>
          
          <p 
            style={{ 
              color: 'var(--color-text-secondary)', 
              fontSize: '1.125rem', 
              lineHeight: 1.6,
              marginBottom: '2.25rem',
              fontWeight: 400
            }}
          >
            Nexus integrates visual Kanban layouts, secure passwordless email credentials, and automatic system audit feeds into one clean team workflow. No complexity, no bloat.
          </p>

          {/* Action CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link 
              href="/login" 
              className="btn btn-primary animate-pulse"
              style={{ 
                padding: '0.75rem 1.5rem', 
                borderRadius: '0.5rem', 
                fontSize: '0.875rem', 
                textDecoration: 'none',
                fontWeight: 600,
                boxShadow: '0 0 1.5rem rgba(var(--color-brand-glow-rgb), 0.3)'
              }}
            >
              Get Started Free ➔
            </Link>
          </div>
        </div>

        {/* High-Fidelity Browser Mockup (Kanban UI Teaser) */}
        <div 
          style={{ 
            width: '100%', 
            borderRadius: '1rem',
            border: '1px solid var(--color-border)',
            background: 'rgba(17, 17, 19, 0.7)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 1.25rem 3rem rgba(0, 0, 0, 0.5), 0 0 0.0625rem rgba(255, 255, 255, 0.08)',
            marginBottom: '5rem',
            overflow: 'hidden',
          }}
        >
          {/* Mock Browser Header Bar */}
          <div 
            style={{ 
              padding: '0.875rem 1.25rem', 
              borderBottom: '1px solid var(--color-border)', 
              background: 'rgba(24, 24, 27, 0.4)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem' 
            }}
          >
            <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: '#ef4444', opacity: 0.6 }} />
            <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: '#fb923c', opacity: 0.6 }} />
            <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: '#22c55e', opacity: 0.6 }} />
            <div 
              style={{ 
                marginLeft: '1rem',
                fontSize: '0.6875rem',
                color: 'var(--color-text-muted)',
                fontFamily: 'monospace',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '0.1875rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.03)'
              }}
            >
              workspace-sandbox.nexus.io
            </div>
          </div>

          {/* Kanban Interactive Mockup Area */}
          <div style={{ padding: '1.5rem' }}>
            <div className="kanban-board">
              
              {/* Backlog Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Backlog</span>
                  <span style={{ fontSize: '10px', background: 'rgba(var(--color-brand-glow-rgb), 0.06)', color: 'var(--color-text-secondary)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)' }}>1</span>
                </div>
                <div 
                  className="glass-card"
                  style={{ 
                    border: '1px solid var(--color-border)', 
                    background: 'var(--color-surface-2)', 
                    borderRadius: '0.5rem', 
                    padding: '1rem',
                    boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-brand-start)', background: 'rgba(var(--color-brand-glow-rgb), 0.1)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', textTransform: 'uppercase' }}>Database</span>
                    <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-inprogress)', background: 'rgba(245, 158, 11, 0.08)', padding: '0.125rem 0.3125rem', borderRadius: '0.1875rem' }}>Medium</span>
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.4 }}>Optimize postgres activity triggers</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.625rem', borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}>
                    <div style={{ width: '1.125rem', height: '1.125rem', borderRadius: '50%', background: '#f43f5e', color: '#fff', fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>E</div>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Elena</span>
                  </div>
                </div>
              </div>

              {/* Active Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active</span>
                  <span style={{ fontSize: '10px', background: 'rgba(var(--color-brand-glow-rgb), 0.06)', color: 'var(--color-text-secondary)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)' }}>1</span>
                </div>
                <div 
                  className="glass-card"
                  style={{ 
                    border: '1px solid var(--color-border)', 
                    background: 'var(--color-surface-2)', 
                    borderRadius: '0.5rem', 
                    padding: '1rem',
                    boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#ec4899', background: 'rgba(236, 72, 153, 0.1)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', textTransform: 'uppercase' }}>Design</span>
                    <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-danger)', background: 'rgba(239, 68, 68, 0.08)', padding: '0.125rem 0.3125rem', borderRadius: '0.1875rem' }}>High</span>
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.4 }}>Refactor landing page interface</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.625rem', borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}>
                    <div style={{ width: '1.125rem', height: '1.125rem', borderRadius: '50%', background: '#6366f1', color: '#fff', fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>S</div>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Sarah</span>
                  </div>
                </div>
              </div>

              {/* Completed Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed</span>
                  <span style={{ fontSize: '10px', background: 'rgba(var(--color-brand-glow-rgb), 0.06)', color: 'var(--color-text-secondary)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)' }}>1</span>
                </div>
                <div 
                  className="glass-card"
                  style={{ 
                    border: '1px solid var(--color-border)', 
                    background: 'var(--color-surface-2)', 
                    borderRadius: '0.5rem', 
                    padding: '1rem',
                    opacity: 0.5,
                    boxShadow: 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', textTransform: 'uppercase' }}>Auth</span>
                    <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-text-muted)', background: 'rgba(255, 255, 255, 0.03)', padding: '0.125rem 0.3125rem', borderRadius: '0.1875rem' }}>Low</span>
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', textDecoration: 'line-through', margin: 0, lineHeight: 1.4 }}>Integrate passwordless email OTP</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.625rem', borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}>
                    <div style={{ width: '1.125rem', height: '1.125rem', borderRadius: '50%', background: '#3b82f6', color: '#fff', fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>M</div>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Marcus</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Short Key Features Grid */}
        <div 
          className="kanban-board" 
          style={{ 
            borderTop: '1px solid var(--color-border)', 
            paddingTop: '3rem' 
          }}
        >
          {/* Card 1 */}
          <div 
            className="glass-card" 
            style={{ 
              padding: '1.5rem', 
              background: 'var(--color-surface)', 
              border: '1px solid var(--color-border)',
              borderRadius: '0.75rem'
            }}
          >
            <div style={{ color: 'var(--color-brand-start)', marginBottom: '1rem', display: 'flex' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
                <line x1="3" y1="9" x2="21" y2="9" />
              </svg>
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>Visual Kanban Boards</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
              Track tasks seamlessly across customizable columns with priority tags and owner cards.
            </p>
          </div>

          {/* Card 2 */}
          <div 
            className="glass-card" 
            style={{ 
              padding: '1.5rem', 
              background: 'var(--color-surface)', 
              border: '1px solid var(--color-border)',
              borderRadius: '0.75rem'
            }}
          >
            <div style={{ color: 'var(--color-brand-start)', marginBottom: '1rem', display: 'flex' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>Passwordless SMTP OTP</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
              Sign in securely via a server-generated 6-digit passcode sent directly to your email inbox.
            </p>
          </div>

          {/* Card 3 */}
          <div 
            className="glass-card" 
            style={{ 
              padding: '1.5rem', 
              background: 'var(--color-surface)', 
              border: '1px solid var(--color-border)',
              borderRadius: '0.75rem'
            }}
          >
            <div style={{ color: 'var(--color-brand-start)', marginBottom: '1rem', display: 'flex' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>Automatic Audit Ledger</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
              Immutable activity trails log every update, assignment, and action in real time.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer
        style={{
          width: '90%',
          maxWidth: '75rem',
          margin: '0 auto',
          padding: 0,
          height: '5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--color-border)',
          fontSize: '12px',
          color: 'var(--color-text-muted)',
          fontWeight: 500,
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div>&copy; {new Date().getFullYear()} Nexus. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span style={{ cursor: 'pointer' }}>Privacy</span>
          <span style={{ cursor: 'pointer' }}>Terms</span>
        </div>
      </footer>

    </div>
  );
}
