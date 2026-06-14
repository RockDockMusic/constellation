'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export interface EmptyStateProps {
  onChart: () => void;
}

export function EmptyState({ onChart }: EmptyStateProps) {
  return (
    <div className="relative flex h-full min-h-[360px] flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="drift"
      >
        <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden>
          <circle cx="60" cy="60" r="40" fill="none" stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2 6" />
          <circle cx="60" cy="60" r="3.4" fill="var(--forged)" />
          <circle cx="60" cy="60" r="9" fill="var(--forged)" opacity="0.15" />
        </svg>
      </motion.div>
      <h2 className="mt-6 text-2xl" style={{ color: 'var(--ink)' }}>
        The sky is empty
      </h2>
      <p className="mt-2 max-w-sm text-[14px]" style={{ color: 'var(--muted)' }}>
        No constellations have been charted yet. Chart the first one and lay down its opening star.
      </p>
      <button
        type="button"
        onClick={onChart}
        className="tap glow-forged mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium"
        style={{ background: 'var(--forged)', color: '#1a1405' }}
      >
        <Sparkles size={16} aria-hidden />
        Chart the first constellation
      </button>
    </div>
  );
}
