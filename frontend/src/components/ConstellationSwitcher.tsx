'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Lock, TrendingUp, Star } from 'lucide-react';
import type { ConstellationSummary } from '@/lib/contract';

export interface ConstellationSwitcherProps {
  constellations: ConstellationSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function ConstellationSwitcher({
  constellations,
  selectedId,
  onSelect,
  onNew,
}: ConstellationSwitcherProps) {
  return (
    <section className="panel p-4" aria-label="Constellation switcher">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] uppercase tracking-[0.18em]" style={{ color: 'var(--muted)' }}>
          Constellations
        </h3>
        <button
          type="button"
          onClick={onNew}
          className="tap inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium"
          style={{ background: 'var(--forged)', color: '#1a1405' }}
        >
          <Plus size={14} aria-hidden />
          Chart new
        </button>
      </div>

      <ul className="mt-3 flex max-h-[280px] flex-col gap-2 overflow-y-auto pr-1">
        {constellations.map((c) => {
          const active = c.id === selectedId;
          const sealed = c.status === 'SEALED';
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                aria-current={active}
                className="w-full rounded-xl px-3 py-2.5 text-left transition-colors"
                style={{
                  background: active ? 'var(--raised)' : 'transparent',
                  border: active ? '1px solid var(--line-strong)' : '1px solid transparent',
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="truncate font-display text-[14px]"
                    style={{ color: active ? 'var(--ink)' : 'var(--starlight)' }}
                  >
                    {c.theme}
                  </span>
                  {sealed ? (
                    <Lock size={12} style={{ color: 'var(--muted)', flexShrink: 0 }} aria-label="Sealed" />
                  ) : (
                    <motion.span
                      className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ background: 'var(--forged)' }}
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      aria-label="Open"
                    />
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3 text-[11px]" style={{ color: 'var(--muted)' }}>
                  <span className="mono inline-flex items-center gap-1">
                    <Star size={10} aria-hidden /> {c.star_count}
                  </span>
                  <span className="mono inline-flex items-center gap-1">
                    <TrendingUp size={10} aria-hidden /> {c.momentum}
                  </span>
                  <span>{sealed ? 'Sealed' : 'Open'}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
