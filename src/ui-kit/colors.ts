/**
 * Nexus Design System - Centralized Color Tokens
 * 
 * Gathered from:
 * - src/app/globals.css
 * - src/styles/landing.css
 * - src/styles/login.css
 * 
 * Centralizing these colors enables type-safety, auto-completion, and consistent themes
 * across React styles and inline properties.
 */

export const THEMES = {
  default: {
    brand: {
      start: '#3b82f6', // Primary Blue
      end: '#06b6d4',   // Cyan
      mid: '#0284c7',   // Sky Blue
      glowRgb: '59, 130, 246', // RGB values for drop-shadows and glows
    },
  },
  red: {
    brand: {
      start: '#ef4444', // Premium Red
      end: '#fb7185',   // Coral/Rose Accent
      mid: '#dc2626',   // Deep Red
      glowRgb: '239, 68, 68',
    },
  },
  green: {
    brand: {
      start: '#10b981', // Emerald Green
      end: '#34d399',   // Mint
      mid: '#059669',   // Forest Green
      glowRgb: '16, 185, 129',
    },
  },
  purple: {
    brand: {
      start: '#8b5cf6', // Violet
      end: '#a78bfa',   // Lavender
      mid: '#7c3aed',   // Deep Purple
      glowRgb: '139, 92, 246',
    },
  },
  sunset: {
    brand: {
      start: '#f59e0b', // Amber
      end: '#f97316',   // Orange
      mid: '#d97706',   // Deep Amber
      glowRgb: '245, 158, 11',
    },
  },
  pink: {
    brand: {
      start: '#ec4899', // Hot Pink
      end: '#f472b6',   // Soft Pink
      mid: '#db2777',   // Dark Pink
      glowRgb: '236, 72, 153',
    },
  },
  indigo: {
    brand: {
      start: '#6366f1', // Indigo Blue
      end: '#818cf8',   // Light Indigo
      mid: '#4f46e5',   // Royal Indigo
      glowRgb: '99, 102, 241',
    },
  },
  gray: {
    brand: {
      start: '#94a3b8', // Slate Gray
      end: '#cbd5e1',   // Light Slate
      mid: '#64748b',   // Dark Slate
      glowRgb: '148, 163, 184',
    },
  },
} as const;

export type ThemeName = keyof typeof THEMES;

export const THEME_OPTIONS: { id: ThemeName; label: string; color: string }[] = [
  { id: 'default', label: 'Blue', color: '#3b82f6' },
  { id: 'red', label: 'Red', color: '#ef4444' },
  { id: 'green', label: 'Green', color: '#10b981' },
  { id: 'purple', label: 'Purple', color: '#8b5cf6' },
  { id: 'sunset', label: 'Sunset', color: '#f59e0b' },
  { id: 'pink', label: 'Pink', color: '#ec4899' },
  { id: 'indigo', label: 'Indigo', color: '#6366f1' },
  { id: 'gray', label: 'Gray', color: '#94a3b8' },
];

export const COLORS = {
  // Brand / Accents
  brand: THEMES.default.brand,

  // Layout Surfaces & Borders
  surface: {
    bg: '#0b0f19',             // Page background (deep dark slate)
    card: '#111827',           // Main container surface
    cardSecondary: '#1f2937',  // Interactive elements / inputs surface
    cardTertiary: '#111827',   // Inactive states / hover container surface
    border: '#1e293b',         // Default border color
    borderHover: '#334155',    // Border color on hover
    glassBg: 'rgba(255, 255, 255, 0.03)', // Ambient transparency
  },

  // Typography
  text: {
    primary: '#f8fafc',   // Dominant high-contrast text
    secondary: '#94a3b8', // Muted details
    muted: '#475569',     // Inactive captions / placeholders
  },

  // Status Labels
  status: {
    todo: '#3b82f6',
    inprogress: '#f59e0b',
    done: '#22c55e',
  },

  // Semantic States
  semantic: {
    danger: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
  },

  // Scrollbar
  scrollbar: {
    track: '#111827',
    thumb: '#334155',
    thumbHover: '#52525b',
  },

  // Interactive UI Elements & Badges
  badge: {
    todo: {
      bg: 'rgba(59, 130, 246, 0.12)',
      text: '#60a5fa',
      border: 'rgba(59, 130, 246, 0.2)',
    },
    inprogress: {
      bg: 'rgba(245, 158, 11, 0.12)',
      text: '#fbbf24',
      border: 'rgba(245, 158, 11, 0.2)',
    },
    done: {
      bg: 'rgba(34, 197, 94, 0.12)',
      text: '#4ade80',
      border: 'rgba(34, 197, 94, 0.2)',
    },
    admin: {
      bg: 'rgba(59, 130, 246, 0.12)',
      text: '#3b82f6',
      border: 'rgba(59, 130, 246, 0.2)',
    },
    member: {
      bg: 'rgba(113, 113, 122, 0.15)',
      text: '#a1a1aa',
      border: 'rgba(113, 113, 122, 0.2)',
    },
  },

  // System Notifications
  toast: {
    success: {
      bg: 'rgba(34, 197, 94, 0.15)',
      text: '#4ade80',
      border: 'rgba(34, 197, 94, 0.3)',
    },
    error: {
      bg: 'rgba(239, 68, 68, 0.15)',
      text: '#f87171',
      border: 'rgba(239, 68, 68, 0.3)',
    },
  },

  // Landing Mockup Graphic Specs (if needed for canvas / inline logic)
  mockup: {
    dots: {
      red: '#ef4444',
      orange: '#fb923c',
      green: '#22c55e',
    },
    tag: {
      db: {
        text: '#3b82f6',
        bg: 'rgba(59, 130, 246, 0.1)',
      },
      design: {
        text: '#ec4899',
        bg: 'rgba(236, 72, 153, 0.1)',
      },
      auth: {
        text: '#10b981',
        bg: 'rgba(16, 185, 129, 0.1)',
      },
    },
    priority: {
      low: {
        text: '#475569',
        bg: 'rgba(255, 255, 255, 0.03)',
      },
      medium: {
        text: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.08)',
      },
      high: {
        text: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.08)',
      },
    },
    avatar: {
      elena: '#f43f5e',
      sarah: '#6366f1',
      marcus: '#3b82f6',
    },
  },
} as const;

export type ColorPalette = typeof COLORS;

export function getCssVariablesString(): string {
  return `
    :root, [data-theme="default"] {
      /* Brand / Accents */
      --color-brand-start: ${THEMES.default.brand.start};
      --color-brand-end: ${THEMES.default.brand.end};
      --color-brand-mid: ${THEMES.default.brand.mid};
      --color-brand-glow-rgb: ${THEMES.default.brand.glowRgb};

      /* Layout Surfaces & Borders */
      --color-bg: ${COLORS.surface.bg};
      --color-surface: ${COLORS.surface.card};
      --color-surface-2: ${COLORS.surface.cardSecondary};
      --color-surface-3: ${COLORS.surface.cardTertiary};
      --color-border: ${COLORS.surface.border};
      --color-border-hover: ${COLORS.surface.borderHover};
      --color-glass-bg: ${COLORS.surface.glassBg};

      /* Typography */
      --color-text-primary: ${COLORS.text.primary};
      --color-text-secondary: ${COLORS.text.secondary};
      --color-text-muted: ${COLORS.text.muted};

      /* Status */
      --color-todo: ${COLORS.status.todo};
      --color-inprogress: ${COLORS.status.inprogress};
      --color-done: ${COLORS.status.done};

      /* Semantic States */
      --color-danger: ${COLORS.semantic.danger};
      --color-success: ${COLORS.semantic.success};

      /* Scrollbar */
      --color-scrollbar-track: ${COLORS.scrollbar.track};
      --color-scrollbar-thumb: ${COLORS.scrollbar.thumb};
      --color-scrollbar-thumb-hover: ${COLORS.scrollbar.thumbHover};

      /* Badges */
      --color-badge-todo-bg: ${COLORS.badge.todo.bg};
      --color-badge-todo-text: ${COLORS.badge.todo.text};
      --color-badge-todo-border: ${COLORS.badge.todo.border};

      --color-badge-inprogress-bg: ${COLORS.badge.inprogress.bg};
      --color-badge-inprogress-text: ${COLORS.badge.inprogress.text};
      --color-badge-inprogress-border: ${COLORS.badge.inprogress.border};

      --color-badge-done-bg: ${COLORS.badge.done.bg};
      --color-badge-done-text: ${COLORS.badge.done.text};
      --color-badge-done-border: ${COLORS.badge.done.border};

      --color-badge-admin-bg: rgba(var(--color-brand-glow-rgb), 0.12);
      --color-badge-admin-text: var(--color-brand-start);
      --color-badge-admin-border: rgba(var(--color-brand-glow-rgb), 0.2);

      --color-badge-member-bg: ${COLORS.badge.member.bg};
      --color-badge-member-text: ${COLORS.badge.member.text};
      --color-badge-member-border: ${COLORS.badge.member.border};

      /* Toasts */
      --color-toast-success-bg: ${COLORS.toast.success.bg};
      --color-toast-success-text: ${COLORS.toast.success.text};
      --color-toast-success-border: ${COLORS.toast.success.border};

      --color-toast-error-bg: ${COLORS.toast.error.bg};
      --color-toast-error-text: ${COLORS.toast.error.text};
      --color-toast-error-border: ${COLORS.toast.error.border};

      /* Mockup Graphic Colors */
      --color-mockup-dot-red: ${COLORS.mockup.dots.red};
      --color-mockup-dot-orange: ${COLORS.mockup.dots.orange};
      --color-mockup-dot-green: ${COLORS.mockup.dots.green};

      --color-mockup-tag-db-text: var(--color-brand-start);
      --color-mockup-tag-db-bg: rgba(var(--color-brand-glow-rgb), 0.1);

      --color-mockup-tag-design-text: ${COLORS.mockup.tag.design.text};
      --color-mockup-tag-design-bg: ${COLORS.mockup.tag.design.bg};

      --color-mockup-tag-auth-text: ${COLORS.mockup.tag.auth.text};
      --color-mockup-tag-auth-bg: ${COLORS.mockup.tag.auth.bg};

      --color-mockup-priority-low-text: ${COLORS.mockup.priority.low.text};
      --color-mockup-priority-low-bg: ${COLORS.mockup.priority.low.bg};

      --color-mockup-priority-medium-text: ${COLORS.mockup.priority.medium.text};
      --color-mockup-priority-medium-bg: ${COLORS.mockup.priority.medium.bg};

      --color-mockup-priority-high-text: ${COLORS.mockup.priority.high.text};
      --color-mockup-priority-high-bg: ${COLORS.mockup.priority.high.bg};

      --color-mockup-avatar-elena: ${COLORS.mockup.avatar.elena};
      --color-mockup-avatar-sarah: ${COLORS.mockup.avatar.sarah};
      --color-mockup-avatar-marcus: var(--color-brand-start);
    }

    [data-theme="red"] {
      /* Brand / Accents Override */
      --color-brand-start: ${THEMES.red.brand.start};
      --color-brand-end: ${THEMES.red.brand.end};
      --color-brand-mid: ${THEMES.red.brand.mid};
      --color-brand-glow-rgb: ${THEMES.red.brand.glowRgb};
    }

    [data-theme="green"] {
      /* Brand / Accents Override */
      --color-brand-start: ${THEMES.green.brand.start};
      --color-brand-end: ${THEMES.green.brand.end};
      --color-brand-mid: ${THEMES.green.brand.mid};
      --color-brand-glow-rgb: ${THEMES.green.brand.glowRgb};
    }

    [data-theme="purple"] {
      /* Brand / Accents Override */
      --color-brand-start: ${THEMES.purple.brand.start};
      --color-brand-end: ${THEMES.purple.brand.end};
      --color-brand-mid: ${THEMES.purple.brand.mid};
      --color-brand-glow-rgb: ${THEMES.purple.brand.glowRgb};
    }

    [data-theme="sunset"] {
      /* Brand / Accents Override */
      --color-brand-start: ${THEMES.sunset.brand.start};
      --color-brand-end: ${THEMES.sunset.brand.end};
      --color-brand-mid: ${THEMES.sunset.brand.mid};
      --color-brand-glow-rgb: ${THEMES.sunset.brand.glowRgb};
    }

    [data-theme="pink"] {
      /* Brand / Accents Override */
      --color-brand-start: ${THEMES.pink.brand.start};
      --color-brand-end: ${THEMES.pink.brand.end};
      --color-brand-mid: ${THEMES.pink.brand.mid};
      --color-brand-glow-rgb: ${THEMES.pink.brand.glowRgb};
    }

    [data-theme="indigo"] {
      /* Brand / Accents Override */
      --color-brand-start: ${THEMES.indigo.brand.start};
      --color-brand-end: ${THEMES.indigo.brand.end};
      --color-brand-mid: ${THEMES.indigo.brand.mid};
      --color-brand-glow-rgb: ${THEMES.indigo.brand.glowRgb};
    }

    [data-theme="gray"] {
      /* Brand / Accents Override */
      --color-brand-start: ${THEMES.gray.brand.start};
      --color-brand-end: ${THEMES.gray.brand.end};
      --color-brand-mid: ${THEMES.gray.brand.mid};
      --color-brand-glow-rgb: ${THEMES.gray.brand.glowRgb};
    }
  `;
}

export default COLORS;
