'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Star } from '@/lib/contract';

export interface StarNodeProps {
  star: Star;
  x: number;
  y: number;
  selected: boolean;
  onSelect: (n: number) => void;
}

function tone(verdict: string): { core: string; glow: string } {
  const v = verdict.toUpperCase();
  if (v === 'FORGED') return { core: '#e8c06a', glow: 'rgba(232,192,106,0.9)' };
  if (v === 'FRAYED') return { core: '#cfe3ff', glow: 'rgba(207,227,255,0.7)' };
  return { core: '#b56cff', glow: 'rgba(181,108,255,0.7)' };
}

export function StarNode({ star, x, y, selected, onSelect }: StarNodeProps) {
  const t = tone(star.verdict);
  const r = 3.2 + (Math.max(0, Math.min(100, star.resonance)) / 100) * 4.2;
  const haloR = r + (selected ? 11 : 7);

  return (
    <g
      transform={`translate(${x}, ${y})`}
      role="button"
      tabIndex={0}
      aria-label={`Star ${star.n}, ${star.verdict.toLowerCase()}, resonance ${star.resonance}`}
      onClick={() => onSelect(star.n)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(star.n);
        }
      }}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      <motion.circle
        r={haloR}
        fill={t.glow}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: selected ? 0.35 : 0.16, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        style={{ filter: 'blur(3px)' }}
      />
      <motion.circle
        r={r}
        fill={t.core}
        stroke={selected ? '#fff' : 'transparent'}
        strokeWidth={selected ? 1.2 : 0}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        style={{ filter: `drop-shadow(0 0 6px ${t.glow})` }}
      />
      <text
        y={haloR + 12}
        textAnchor="middle"
        fontSize="9"
        fill="var(--muted)"
        style={{ fontFamily: 'var(--font-mono)', pointerEvents: 'none' }}
      >
        {star.n}
      </text>
    </g>
  );
}
