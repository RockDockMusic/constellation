'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, busy, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(3, 2, 10, 0.78)', backdropFilter: 'blur(4px)' }}
            onClick={() => !busy && onCancel()}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="panel relative z-10 flex h-full w-full flex-col p-6 sm:h-auto sm:max-w-md"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl" style={{ color: 'var(--ink)' }}>
                {title}
              </h3>
              <button
                type="button"
                onClick={() => !busy && onCancel()}
                aria-label="Close dialog"
                className="rounded p-1"
                style={{ color: 'var(--muted)' }}
              >
                <X size={18} aria-hidden />
              </button>
            </div>
            <div className="mt-3 flex-1 text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
              {body}
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                disabled={busy}
                className="tap rounded-full px-5 py-2.5 text-[14px] disabled:opacity-50"
                style={{ background: 'var(--raised)', color: 'var(--ink)' }}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                className="tap glow-forged rounded-full px-5 py-2.5 text-[14px] font-medium disabled:opacity-60"
                style={{ background: 'var(--forged)', color: '#1a1405' }}
              >
                {busy ? 'Working...' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
