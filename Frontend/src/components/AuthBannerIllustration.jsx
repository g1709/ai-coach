import React from 'react';

export default function AuthBannerIllustration() {
  return (
    <svg
      viewBox="0 0 380 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: '340px', height: 'auto' }}
    >
      <defs>
        <linearGradient id="deskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#4f46e5" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Background Soft Glow */}
      <circle cx="190" cy="140" r="110" fill="#e0e7ff" opacity="0.6" />

      {/* Floating Code Card 1 (Left) */}
      <g transform="translate(45, 60)" filter="url(#shadow)">
        <rect width="64" height="42" rx="8" fill="#4f46e5" />
        <text x="32" y="26" fill="white" fontFamily="JetBrains Mono, monospace" fontSize="14" fontWeight="bold" textAnchor="middle">&lt;/&gt;</text>
      </g>

      {/* Floating Code Card 2 (Right) */}
      <g transform="translate(240, 70)" filter="url(#shadow)">
        <rect width="90" height="52" rx="8" fill="#6366f1" />
        <rect x="12" y="14" width="46" height="4" rx="2" fill="white" opacity="0.9" />
        <rect x="12" y="24" width="66" height="4" rx="2" fill="white" opacity="0.6" />
        <rect x="12" y="34" width="34" height="4" rx="2" fill="white" opacity="0.6" />
      </g>

      {/* Desk Base */}
      <ellipse cx="190" cy="245" rx="160" ry="20" fill="url(#deskGrad)" opacity="0.5" />
      <path d="M70 240 L310 240" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />

      {/* Programmer Character */}
      {/* Hair */}
      <path d="M125 145 C122 130 132 112 152 110 C165 110 172 116 176 126 C176 130 168 135 168 140 C162 140 156 138 152 136 C148 138 138 145 125 145 Z" fill="#1e293b" />
      {/* Face & Neck */}
      <circle cx="152" cy="142" r="14" fill="#fed7aa" />
      <path d="M148 154 L154 154 L152 165 L146 165 Z" fill="#fdba74" />
      {/* Hair Back */}
      <path d="M136 134 C132 142 134 152 138 156" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />

      {/* Hoodie Body */}
      <path d="M120 220 C120 185 135 165 158 165 C178 165 190 185 194 220 Z" fill="url(#hoodieGrad)" />
      
      {/* Arms & Hands typing */}
      <path d="M145 185 L180 205 L215 210" stroke="#3730a3" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="215" cy="210" r="6" fill="#fed7aa" />

      {/* Laptop */}
      {/* Screen */}
      <polygon points="200,165 255,165 245,212 195,212" fill="#1e293b" />
      <polygon points="204,169 251,169 242,208 198,208" fill="#3b82f6" opacity="0.3" />
      {/* Laptop Base */}
      <polygon points="185,212 258,212 270,222 180,222" fill="#94a3b8" />

      {/* Code Sparkle */}
      <path d="M285 45 L288 53 L296 56 L288 59 L285 67 L282 59 L274 56 L282 53 Z" fill="#f59e0b" />
      <circle cx="95" cy="180" r="4" fill="#a5b4fc" />
      <circle cx="310" cy="170" r="5" fill="#c7d2fe" />
    </svg>
  );
}
