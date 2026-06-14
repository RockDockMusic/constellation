import React from 'react';

export interface MarkProps {
  size?: number;
  className?: string;
  title?: string;
}

// Bespoke hand-drawn constellation brand mark: linked star nodes.
export function Mark({ size = 30, className, title = 'Constellation' }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label={title}
    >
      <g stroke="var(--forged)" strokeWidth="1.3" strokeLinecap="round" opacity="0.8">
        <line x1="9" y1="34" x2="21" y2="22" />
        <line x1="21" y1="22" x2="33" y2="26" />
        <line x1="33" y1="26" x2="38" y2="12" />
      </g>
      <g fill="var(--starlight)">
        <circle cx="9" cy="34" r="2" />
        <circle cx="33" cy="26" r="1.8" />
      </g>
      <circle cx="21" cy="22" r="2.6" fill="var(--forged)" />
      <circle cx="38" cy="12" r="3.1" fill="var(--forged)" />
      <circle cx="38" cy="12" r="6" fill="var(--forged)" opacity="0.18" />
    </svg>
  );
}
