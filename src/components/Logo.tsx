import React from 'react';

interface LogoProps {
  variant?: 'short' | 'full';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({
  variant = 'short',
  size = 'md',
  className = '',
  style,
}: LogoProps) {
  // Size mapping
  const badgeSize = {
    sm: '2rem',
    md: '2.25rem',
    lg: '2.5rem',
  }[size];

  const badgeFontSize = {
    sm: '1rem',
    md: '1.125rem',
    lg: '1.25rem',
  }[size];

  const textFontSize = {
    sm: '1.25rem',
    md: '1.375rem',
    lg: '1.75rem',
  }[size];

  const badgeRadius = {
    sm: '0.625rem',
    md: '0.6875rem',
    lg: '0.75rem',
  }[size];

  return (
    <div
      className={`logo-container-root ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '8px' : '10px',
        userSelect: 'none',
        ...style,
      }}
    >
      <div
        className="logo-badge-icon"
        style={{
          width: badgeSize,
          height: badgeSize,
          borderRadius: badgeRadius,
          background: 'linear-gradient(135deg, var(--color-brand-start), var(--color-brand-end))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: badgeFontSize,
          flexShrink: 0,
          boxShadow: '0 0 1.25rem rgba(var(--color-brand-glow-rgb), 0.25)',
          animation: size === 'lg' ? 'pulse-glow 3s ease-in-out infinite' : undefined,
        }}
      >
        ⚡
      </div>
      <span
        className="logo-text-title"
        style={{
          fontSize: textFontSize,
          fontWeight: 800,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.03em',
          whiteSpace: 'nowrap',
        }}
      >
        {variant === 'full' ? 'Nexus — Team Task Manager' : 'Nexus'}
      </span>
    </div>
  );
}
