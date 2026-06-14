'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import type { Star } from '@/lib/contract';
import { Starfield } from './Starfield';
import { StarNode } from './StarNode';
import { ConstellationLine } from './ConstellationLine';

export interface StarMapProps {
  stars: Star[];
  selectedStarN: number | null;
  onSelectStar: (n: number) => void;
  theme: string;
  status: string;
}

const PAD = 60;
const SPACING = 112;
const HEIGHT = 340;
const MID = HEIGHT / 2;

interface Placed {
  star: Star;
  x: number;
  y: number;
}

export function StarMap({ stars, selectedStarN, onSelectStar, theme, status }: StarMapProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const placed: Placed[] = useMemo(
    () =>
      stars.map((star, i) => ({
        star,
        x: PAD + i * SPACING,
        y: MID + Math.sin(i * 0.55) * 76 + Math.cos(i * 0.27) * 18,
      })),
    [stars],
  );

  const width = Math.max(320, PAD * 2 + Math.max(0, stars.length - 1) * SPACING);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
  }, [stars.length]);

  return (
    <div
      className="panel relative h-full min-h-[420px] overflow-hidden"
      role="figure"
      aria-label={`Star map for ${theme}`}
    >
      <Starfield />
      <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[70%]">
        <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>
          {status === 'SEALED' ? 'Sealed constellation' : 'Live constellation'}
        </p>
        <h2 className="mt-1 text-lg leading-tight text-glow sm:text-xl" style={{ color: 'var(--ink)' }}>
          {theme}
        </h2>
      </div>

      <div
        ref={scrollRef}
        className="relative z-[5] h-full w-full overflow-x-auto overflow-y-hidden"
        style={{ paddingTop: 64 }}
      >
        <svg
          width={width}
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          style={{ display: 'block', minWidth: '100%' }}
        >
          {placed.slice(1).map((p, i) => {
            const prev = placed[i];
            return (
              <ConstellationLine
                key={`line-${p.star.n}`}
                x1={prev.x}
                y1={prev.y}
                x2={p.x}
                y2={p.y}
                verdict={p.star.verdict}
                index={i}
              />
            );
          })}
          {placed.map((p) => (
            <StarNode
              key={`node-${p.star.n}`}
              star={p.star}
              x={p.x}
              y={p.y}
              selected={selectedStarN === p.star.n}
              onSelect={onSelectStar}
            />
          ))}
        </svg>
      </div>

      <div
        className="pointer-events-none absolute bottom-3 right-4 z-10 flex items-center gap-4 text-[11px]"
        style={{ color: 'var(--muted)' }}
      >
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: '#e8c06a' }} aria-hidden />
          Forged
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: '#cfe3ff' }} aria-hidden />
          Frayed
        </span>
      </div>
    </div>
  );
}
