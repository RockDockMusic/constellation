'use client';

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, Loader2, X, AlertTriangle, ExternalLink } from 'lucide-react';
import { EXPLORER } from '@/lib/contract';

export type ToastKind = 'loading' | 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  kind: ToastKind;
  message: string;
  hash?: string | null;
  onRetry?: (() => void) | null;
}

interface ToastApi {
  push: (t: Omit<ToastItem, 'id'>) => string;
  update: (id: string, patch: Partial<Omit<ToastItem, 'id'>>) => void;
  dismiss: (id: string) => void;
}

const Ctx = createContext<ToastApi | null>(null);

export function useToasts(): ToastApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToasts must be used inside ToastProvider');
  return ctx;
}

const TONE: Record<ToastKind, { color: string; Icon: typeof Info }> = {
  loading: { color: 'var(--starlight)', Icon: Loader2 },
  success: { color: 'var(--forged)', Icon: CheckCircle2 },
  error: { color: 'var(--nebula)', Icon: AlertTriangle },
  info: { color: 'var(--muted)', Icon: Info },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    setItems((xs) => xs.filter((x) => x.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const push = useCallback(
    (t: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).slice(2);
      setItems((xs) => [...xs, { ...t, id }]);
      if (t.kind === 'info') timers.current[id] = setTimeout(() => dismiss(id), 8000);
      return id;
    },
    [dismiss],
  );

  const update = useCallback(
    (id: string, patch: Partial<Omit<ToastItem, 'id'>>) => {
      setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch } : x)));
      if (patch.kind === 'info') timers.current[id] = setTimeout(() => dismiss(id), 8000);
    },
    [dismiss],
  );

  return (
    <Ctx.Provider value={{ push, update, dismiss }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2.5"
        role="region"
        aria-label="Notifications"
      >
        <AnimatePresence initial={false}>
          {items.map((t) => {
            const tone = TONE[t.kind];
            const Icon = tone.Icon;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="panel p-3 shadow-2xl"
                style={{ borderColor: 'var(--line-strong)' }}
                role={t.kind === 'error' ? 'alert' : 'status'}
              >
                <div className="flex items-start gap-2.5">
                  <Icon
                    size={16}
                    className={t.kind === 'loading' ? 'animate-spin' : ''}
                    style={{ color: tone.color, marginTop: 1, flexShrink: 0 }}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-snug" style={{ color: 'var(--ink)' }}>
                      {t.message}
                    </p>
                    {t.hash && (
                      <a
                        href={`${EXPLORER}/tx/${t.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mono mt-1 inline-flex items-center gap-1 text-[11px]"
                        style={{ color: 'var(--starlight)' }}
                      >
                        View on explorer
                        <ExternalLink size={11} aria-hidden />
                      </a>
                    )}
                    {t.onRetry && (
                      <button
                        type="button"
                        onClick={t.onRetry}
                        className="mt-1.5 block rounded px-2 py-1 text-[12px]"
                        style={{ background: 'var(--raised)', color: 'var(--forged)' }}
                      >
                        Retry
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(t.id)}
                    aria-label="Dismiss notification"
                    className="rounded p-0.5"
                    style={{ color: 'var(--muted)' }}
                  >
                    <X size={14} aria-hidden />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}
