// src/components/Icons.jsx - Clean, accessible SVG vector icons (Zero external dependencies)
import React from 'react';

// Brand Logo Car Icon
export const IconCarLogo = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11 2 11.5 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

// Hatchback Silhouette Vector
export const IconHatchback = ({ size = 72, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="hatchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
    </defs>
    {/* Body */}
    <path
      d="M10 38 L16 26 C17 24 19 22 22 22 L38 22 C42 22 46 25 48 29 L54 36 C56 37 58 39 58 42 L58 46 C58 47 57 48 56 48 L52 48 M42 48 L22 48 M12 48 L8 48 C7 48 6 47 6 46 L6 42 C6 39 8 38 10 38 Z"
      fill="url(#hatchGrad)"
      opacity="0.9"
    />
    {/* Windshield */}
    <path
      d="M20 25 L34 25 C36 25 38 27 39 29 L43 35 L17 35 L19 27 C19.3 25.8 20.3 25 21.5 25 Z"
      fill="#0f172a"
      opacity="0.75"
    />
    {/* Wheels */}
    <circle cx="17" cy="48" r="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
    <circle cx="17" cy="48" r="2.5" fill="#38bdf8" />
    <circle cx="47" cy="48" r="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
    <circle cx="47" cy="48" r="2.5" fill="#38bdf8" />
    {/* Headlight & Tail light */}
    <rect x="54" y="38" width="3" height="3" rx="1" fill="#fef08a" />
    <rect x="7" y="39" width="2" height="3" rx="1" fill="#f87171" />
  </svg>
);

// Sedan Silhouette Vector
export const IconSedan = ({ size = 72, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="sedanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#7e22ce" />
      </linearGradient>
    </defs>
    {/* Body */}
    <path
      d="M6 40 L14 40 L20 28 C21 26 23 24 26 24 L42 24 C45 24 48 26 50 29 L56 36 L58 40 C59 41 60 42 60 44 L60 46 C60 47 59 48 58 48 L53 48 M43 48 L21 48 M11 48 L6 48 C5 48 4 47 4 46 L4 43 C4 41 5 40 6 40 Z"
      fill="url(#sedanGrad)"
      opacity="0.9"
    />
    {/* Windows */}
    <path
      d="M24 27 L33 27 L33 35 L19 35 L22.5 28.5 C23 27.6 23.9 27 24.9 27 Z"
      fill="#0f172a"
      opacity="0.75"
    />
    <path
      d="M36 27 L44 27 C45.5 27 46.8 28.1 47.4 29.5 L49.5 35 L36 35 Z"
      fill="#0f172a"
      opacity="0.75"
    />
    {/* Wheels */}
    <circle cx="16" cy="48" r="6" fill="#0f172a" stroke="#c084fc" strokeWidth="2" />
    <circle cx="16" cy="48" r="2.5" fill="#c084fc" />
    <circle cx="48" cy="48" r="6" fill="#0f172a" stroke="#c084fc" strokeWidth="2" />
    <circle cx="48" cy="48" r="2.5" fill="#c084fc" />
    {/* Headlight & Tail light */}
    <rect x="56" y="38" width="3" height="3" rx="1" fill="#fef08a" />
    <rect x="5" y="41" width="2" height="3" rx="1" fill="#f87171" />
  </svg>
);

// SUV Silhouette Vector
export const IconSUV = ({ size = 72, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="suvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#c2410c" />
      </linearGradient>
    </defs>
    {/* Roof rack */}
    <line x1="22" y1="18" x2="42" y2="18" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
    <line x1="26" y1="18" x2="26" y2="21" stroke="#94a3b8" strokeWidth="1.5" />
    <line x1="38" y1="18" x2="38" y2="21" stroke="#94a3b8" strokeWidth="1.5" />
    {/* Body */}
    <path
      d="M10 40 L16 23 C16.5 21.5 18 20.5 20 20.5 L44 20.5 C46.5 20.5 49 22 50.5 24.5 L56 34 L58 38 C59 39 60 41 60 43 L60 46 C60 47 59 48 58 48 L53 48 M43 48 L21 48 M11 48 L7 48 C5.5 48 4.5 47 4.5 45.5 L4.5 42 C4.5 40.5 5.5 39.5 7 39.5 Z"
      fill="url(#suvGrad)"
      opacity="0.9"
    />
    {/* Windows */}
    <path
      d="M20 23 L32 23 L32 34 L15 34 L18.5 24.5 C18.8 23.6 19.6 23 20.6 23 Z"
      fill="#0f172a"
      opacity="0.75"
    />
    <path
      d="M35 23 L45 23 C46.5 23 48 24.2 48.6 25.8 L51.5 34 L35 34 Z"
      fill="#0f172a"
      opacity="0.75"
    />
    {/* Heavy duty SUV Wheels */}
    <circle cx="16" cy="48" r="7" fill="#0f172a" stroke="#fb923c" strokeWidth="2" />
    <circle cx="16" cy="48" r="3" fill="#fb923c" />
    <circle cx="48" cy="48" r="7" fill="#0f172a" stroke="#fb923c" strokeWidth="2" />
    <circle cx="48" cy="48" r="3" fill="#fb923c" />
    {/* Headlight & Tail light */}
    <rect x="56" y="37" width="3" height="4" rx="1" fill="#fef08a" />
    <rect x="5" y="39" width="2.5" height="4" rx="1" fill="#f87171" />
  </svg>
);

// Lucide-style UI Icons
export const IconUser = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const IconCalendar = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export const IconKey = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1.5-1.5L8 9l-1.5-1.5L5 9l-3 3v4h4l1-1h2l1 1h2l1-1 3-3" />
    <circle cx="17.5" cy="6.5" r="2.5" />
  </svg>
);

export const IconCheck = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const IconAlert = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

export const IconTrendingUp = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export const IconShield = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);
