'use client';

import React, { useEffect, useState } from 'react';

export interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return <div className={`skeleton ${className ?? ''}`} style={style} aria-hidden />;
}

// A faint nascent star-map placeholder used while the chain loads.
export function MapSkeleton({ slow }: { slow: boolean }) {
  const [late, setLate] = useState(false);
  useEffect(() => {
    if (slow) setLate(true);
  }, [slow]);

  return (
    <div
      className="relative flex h-full min-h-[360px] w-full items-center justify-center overflow-hidden rounded-2xl"
      style={{ background: 'var(--panel)', border: '1px solid var(--line)' }}
      aria-busy="true"
      aria-label="Loading the constellation"
    >
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-40">
        <g stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="3 5">
          <line x1="60" y1="220" x2="150" y2="150" />
          <line x1="150" y1="150" x2="240" y2="180" />
          <line x1="240" y1="180" x2="330" y2="90" />
        </g>
        {[
          [60, 220],
          [150, 150],
          [240, 180],
          [330, 90],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={4} fill="var(--starlight)" opacity={0.5} />
        ))}
      </svg>
      <div className="relative z-10 text-center">
        <Skeleton className="mx-auto h-3 w-40" />
        <p className="mt-3 text-[13px]" style={{ color: 'var(--muted)' }}>
          {late ? 'Still loading, the network may be slow.' : 'Charting the sky.'}
        </p>
      </div>
    </div>
  );
}
