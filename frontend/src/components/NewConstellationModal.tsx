'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

export interface NewConstellationModalProps {
  open: boolean;
  busy: boolean;
  onClose: () => void;
  onSubmit: (theme: string, firstStar: string) => void;
}

const THEME_MIN = 4;
const THEME_MAX = 80;
const STAR_MIN = 4;
const STAR_MAX = 200;

export function NewConstellationModal({ open, busy, onClose, onSubmit }: NewConstellationModalProps) {
  const [theme, setTheme] = useState('');
  const [firstStar, setFirstStar] = useState('');
  const [confirm, setConfirm] = useState(false);

  const themeOk = theme.trim().length >= THEME_MIN && theme.trim().length <= THEME_MAX;
  const starOk = firstStar.trim().length >= STAR_MIN && firstStar.trim().length <= STAR_MAX;
  const valid = themeOk && starOk;

  const close = () => {
    if (busy) return;
    setConfirm(false);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-0 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Chart a new constellation"
          >
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(3,2,10,0.78)', backdropFilter: 'blur(4px)' }}
              onClick={close}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="panel relative z-10 flex h-full w-full flex-col overflow-y-auto p-6 sm:h-auto sm:max-w-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl" style={{ color: 'var(--ink)' }}>
                    Chart a new constellation
                  </h2>
                  <p className="mt-1 text-[13px]" style={{ color: 'var(--muted)' }}>
                    Name a theme and lay its first star. The seed star opens the chain.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="rounded p-1"
                  style={{ color: 'var(--muted)' }}
                >
                  <X size={18} aria-hidden />
                </button>
              </div>

              <label className="mt-5 block" htmlFor="nc-theme">
                <span className="flex items-center justify-between text-[12px]">
                  <span style={{ color: 'var(--starlight)' }}>Theme</span>
                  <span className="mono" style={{ color: themeOk || !theme ? 'var(--muted)' : 'var(--nebula)' }}>
                    {theme.trim().length}/{THEME_MAX}
                  </span>
                </span>
                <input
                  id="nc-theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  maxLength={THEME_MAX + 10}
                  placeholder="A journey across the dying stars"
                  className="mono mt-1.5 w-full rounded-lg px-3 py-2.5 text-[14px] outline-none"
                  style={{ background: 'var(--space)', border: '1px solid var(--line-strong)', color: 'var(--ink)' }}
                />
              </label>

              <label className="mt-4 block" htmlFor="nc-star">
                <span className="flex items-center justify-between text-[12px]">
                  <span style={{ color: 'var(--starlight)' }}>First star</span>
                  <span className="mono" style={{ color: starOk || !firstStar ? 'var(--muted)' : 'var(--nebula)' }}>
                    {firstStar.trim().length}/{STAR_MAX}
                  </span>
                </span>
                <textarea
                  id="nc-star"
                  value={firstStar}
                  onChange={(e) => setFirstStar(e.target.value)}
                  maxLength={STAR_MAX + 20}
                  rows={3}
                  placeholder="A lone ship leaves the cold sun behind."
                  className="mt-1.5 w-full resize-none rounded-lg px-3 py-2.5 text-[14px] leading-relaxed outline-none"
                  style={{ background: 'var(--space)', border: '1px solid var(--line-strong)', color: 'var(--ink)' }}
                />
              </label>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={close}
                  className="tap rounded-full px-5 py-2.5 text-[14px]"
                  style={{ background: 'var(--raised)', color: 'var(--ink)' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!valid}
                  onClick={() => setConfirm(true)}
                  className="tap glow-forged rounded-full px-5 py-2.5 text-[14px] font-medium disabled:opacity-50"
                  style={{ background: 'var(--forged)', color: '#1a1405' }}
                >
                  Found constellation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirm}
        title="Found this constellation?"
        body="This submits a transaction on Bradbury Testnet. Network fees apply. Continue?"
        confirmLabel="Found it"
        busy={busy}
        onConfirm={() => onSubmit(theme.trim(), firstStar.trim())}
        onCancel={() => setConfirm(false)}
      />
    </>
  );
}
