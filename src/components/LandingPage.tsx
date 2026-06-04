'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import '../styles/landing.css';

export default function LandingPage() {
  return (
    <div className="landing-container">
      
      {/* Premium Ambient Background Glows */}
      <div className="landing-ambient-glow" />
      
      {/* Background Grid Pattern */}
      <div className="landing-bg-grid" />

      {/* Header */}
      <header className="landing-header">
        <Logo variant="full" size="sm" />
        <Link 
          href="/login" 
          className="landing-signin-link"
        >
          Sign In
        </Link>
      </header>

      {/* Main Hero & Content */}
      <main className="landing-main">
        
        {/* Hero Headline & Intro */}
        <div className="landing-hero">
          <h1 className="landing-hero-h1">
            Task management,<br />
            <span className="landing-hero-h1-span">
              simplified.
            </span>
          </h1>
          
          <p className="landing-hero-p">
            Nexus integrates visual Kanban layouts, secure passwordless email credentials, and automatic system audit feeds into one clean team workflow. No complexity, no bloat.
          </p>

          {/* Action CTA Buttons */}
          <div className="landing-cta-container">
            <Link 
              href="/login" 
              className="btn btn-primary landing-cta-btn animate-pulse"
            >
              Get Started Free ➔
            </Link>
          </div>
        </div>

        {/* High-Fidelity Browser Mockup (Kanban UI Teaser) */}
        <div className="landing-mockup-wrapper">
          {/* Mock Browser Header Bar */}
          <div className="landing-mockup-header">
            <span className="landing-mockup-dot red" />
            <span className="landing-mockup-dot orange" />
            <span className="landing-mockup-dot green" />
            <div className="landing-mockup-address">
              workspace-sandbox.nexus.io
            </div>
          </div>

          {/* Kanban Interactive Mockup Area */}
          <div className="landing-mockup-content">
            <div className="kanban-board">
              
              {/* Backlog Column */}
              <div className="landing-mockup-col">
                <div className="landing-mockup-col-header">
                  <span className="landing-mockup-col-title">Backlog</span>
                  <span className="landing-mockup-col-badge">1</span>
                </div>
                <div className="glass-card landing-mockup-card">
                  <div className="landing-mockup-card-header">
                    <span className="landing-mockup-card-tag db">Database</span>
                    <span className="landing-mockup-card-priority medium">Medium</span>
                  </div>
                  <p className="landing-mockup-card-title">Optimize postgres activity triggers</p>
                  <div className="landing-mockup-card-footer">
                    <div className="landing-mockup-avatar elena">E</div>
                    <span className="landing-mockup-user-name">Elena</span>
                  </div>
                </div>
              </div>

              {/* Active Column */}
              <div className="landing-mockup-col">
                <div className="landing-mockup-col-header">
                  <span className="landing-mockup-col-title">Active</span>
                  <span className="landing-mockup-col-badge">1</span>
                </div>
                <div className="glass-card landing-mockup-card">
                  <div className="landing-mockup-card-header">
                    <span className="landing-mockup-card-tag design">Design</span>
                    <span className="landing-mockup-card-priority high">High</span>
                  </div>
                  <p className="landing-mockup-card-title">Refactor landing page interface</p>
                  <div className="landing-mockup-card-footer">
                    <div className="landing-mockup-avatar sarah">S</div>
                    <span className="landing-mockup-user-name">Sarah</span>
                  </div>
                </div>
              </div>

              {/* Completed Column */}
              <div className="landing-mockup-col">
                <div className="landing-mockup-col-header">
                  <span className="landing-mockup-col-title">Completed</span>
                  <span className="landing-mockup-col-badge">1</span>
                </div>
                <div className="glass-card landing-mockup-card completed">
                  <div className="landing-mockup-card-header">
                    <span className="landing-mockup-card-tag auth">Auth</span>
                    <span className="landing-mockup-card-priority low">Low</span>
                  </div>
                  <p className="landing-mockup-card-title completed">Integrate passwordless email OTP</p>
                  <div className="landing-mockup-card-footer">
                    <div className="landing-mockup-avatar marcus">M</div>
                    <span className="landing-mockup-user-name">Marcus</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Short Key Features Grid */}
        <div className="kanban-board landing-features-grid">
          {/* Card 1 */}
          <div className="glass-card landing-feature-card">
            <div className="landing-feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
                <line x1="3" y1="9" x2="21" y2="9" />
              </svg>
            </div>
            <h3 className="landing-feature-title">Visual Kanban Boards</h3>
            <p className="landing-feature-desc">
              Track tasks seamlessly across customizable columns with priority tags and owner cards.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card landing-feature-card">
            <div className="landing-feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="landing-feature-title">Passwordless SMTP OTP</h3>
            <p className="landing-feature-desc">
              Sign in securely via a server-generated 6-digit passcode sent directly to your email inbox.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card landing-feature-card">
            <div className="landing-feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
            <h3 className="landing-feature-title">Automatic Audit Ledger</h3>
            <p className="landing-feature-desc">
              Immutable activity trails log every update, assignment, and action in real time.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div>&copy; {new Date().getFullYear()} Nexus. All rights reserved.</div>
        <div className="landing-footer-links">
          <span className="landing-footer-link">Privacy</span>
          <span className="landing-footer-link">Terms</span>
        </div>
      </footer>

    </div>
  );
}
