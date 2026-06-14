'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Star } from '@/lib/contract';
import { shortAddress, verdictStyle } from '@/lib/format';
import { Copyable } from './Copyable';

export interface ReadingRailProps {
  star: Star | null;
  onClose: () => void;
}

export function ReadingRail({ star, onClose }: ReadingRailProps) {
  return (
    <AnimatePresence>
      {star && (
        <motion.aside
          key={star.n}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="panel flex flex-col p-5"
          aria-label={`Reading for star ${star.n}`}
        >
          <ReadingBody star={star} onClose={onClose} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function ReadingBody({ star, onClose }: { star: Star; onClose: () => void }) {
  const vs = verdictStyle(star.verdict);
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>
            Star {star.n}
          </p>
          <span
            className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[12px] font-medium"
            style={{ background: vs.dim, color: vs.color }}
          >
            {vs.label}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close reading"
          className="rounded p-1"
          style={{ color: 'var(--muted)' }}
        >
          <X size={18} aria-hidden />
        </button>
      </div>

      <p className="mt-4 font-display text-[17px] leading-relaxed" style={{ color: 'var(--ink)' }}>
        {star.text}
      </p>

      {star.note && (
        <p className="mt-3 text-[13px] italic leading-relaxed" style={{ color: 'var(--muted)' }}>
          {star.note}
        </p>
      )}

      <div className="mt-5 space-y-3">
        <div>
          <div className="flex items-center justify-between text-[12px]">
            <span style={{ color: 'var(--muted)' }}>Resonance</span>
            <span className="mono" style={{ color: vs.color }}>
              {star.resonance}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--raised)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: vs.color }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, Math.min(100, star.resonance))}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <span style={{ color: 'var(--muted)' }}>Author</span>
          <Copyable value={star.author} label="author address" display={shortAddress(star.author)} />
        </div>
      </div>
    </>
  );
}
