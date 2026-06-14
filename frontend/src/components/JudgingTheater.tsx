'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import type { TxPhase } from '@/hooks/useTransaction';
import type { LeaderDraft } from '@/lib/contract';
import { EXPLORER } from '@/lib/contract';
import { statusName as _statusName } from '@/lib/contract';
import { isAccepted, verdictStyle } from '@/lib/format';

export interface JudgingTheaterProps {
  open: boolean;
  phase: TxPhase;
  liveStatus: string;
  draft: LeaderDraft | null;
  error: string | null;
  hash: `0x${string}` | null;
  text: string;
  onDismiss: () => void;
}

function phaseLine(phase: TxPhase, status: string): string {
  if (phase === 'wallet') return 'Awaiting your signature';
  if (phase === 'submitted') return 'The link is cast into the dark';
  if (status === 'LEADER_TIMEOUT') return 'The Stargazer looks again';
  if (status === 'VALIDATORS_TIMEOUT') return 'The watchers reconsider';
  if (phase === 'consensus') return 'The Stargazer weighs the link';
  if (phase === 'confirmed') return 'The reading is sealed';
  return 'Working';
}

const STAGES: { key: string; label: string }[] = [
  { key: 'wallet', label: 'Signature' },
  { key: 'submitted', label: 'Cast on chain' },
  { key: 'consensus', label: 'Consensus reading' },
  { key: 'confirmed', label: 'Sealed' },
];

function stageState(stage: string, phase: TxPhase): 'done' | 'active' | 'idle' {
  const order = ['wallet', 'submitted', 'consensus', 'confirmed'];
  const ci = order.indexOf(phase === 'error' ? 'consensus' : phase);
  const si = order.indexOf(stage);
  if (si < ci) return 'done';
  if (si === ci) return 'active';
  return 'idle';
}

function DraftPeek({ draft }: { draft: LeaderDraft }) {
  const vs = verdictStyle(draft.verdict);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-5 rounded-xl p-4"
      style={{ background: 'var(--raised)', border: `1px solid ${vs.dim}` }}
    >
      <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>
        The Stargazer&apos;s reading, sealing under consensus
      </p>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-display text-lg" style={{ color: vs.color }}>
          {vs.label}
        </span>
        {typeof draft.resonance === 'number' && (
          <span className="mono text-[13px]" style={{ color: vs.color }}>
            resonance {draft.resonance}
          </span>
        )}
      </div>
      {draft.note && (
        <p className="mt-2 text-[13px] italic leading-relaxed" style={{ color: 'var(--starlight)' }}>
          {draft.note}
        </p>
      )}
    </motion.div>
  );
}

function Outcome({ draft }: { draft: LeaderDraft | null }) {
  const accepted = isAccepted(draft?.verdict);
  const snapped = !!draft && !accepted;
  const vs = verdictStyle(draft?.verdict);
  return (
    <div className="mt-5 text-center">
      <AnimatePresence mode="wait">
        {accepted && (
          <motion.div
            key="ignite"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          >
            <div
              className="mx-auto h-12 w-12 rounded-full"
              style={{ background: vs.color, boxShadow: `0 0 30px ${vs.glow}, 0 0 60px ${vs.glow}` }}
              aria-hidden
            />
            <p className="mt-4 font-display text-lg" style={{ color: vs.color }}>
              {vs.label}. The star ignites and the line is drawn.
            </p>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--muted)' }}>
              Momentum rises.
            </p>
          </motion.div>
        )}
        {snapped && (
          <motion.div
            key="snap"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [1.4, 1, 0.9], opacity: [1, 1, 0.55] }}
            transition={{ duration: 1.1, times: [0, 0.5, 1] }}
          >
            <div
              className="mx-auto h-12 w-12 rounded-full"
              style={{ background: vs.color, boxShadow: `0 0 40px ${vs.glow}` }}
              aria-hidden
            />
            <p className="mt-4 font-display text-lg" style={{ color: vs.color }}>
              The link snapped, the streak breaks.
            </p>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--muted)' }}>
              The tail holds. Try another line.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function JudgingTheater(props: JudgingTheaterProps) {
  const { open, phase, liveStatus, draft, error, hash, text, onDismiss } = props;
  const finished = phase === 'confirmed' || phase === 'error';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="The Stargazer is judging your star"
        >
          <div className="absolute inset-0" style={{ background: 'rgba(3,2,10,0.86)', backdropFilter: 'blur(6px)' }} />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="panel relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-y-auto p-6"
          >
            {finished && (
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Close"
                className="absolute right-4 top-4 rounded p-1"
                style={{ color: 'var(--muted)' }}
              >
                <X size={18} aria-hidden />
              </button>
            )}

            <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>
              {_statusName(liveStatus) && phase === 'consensus' ? `Status: ${liveStatus}` : 'The judging moment'}
            </p>
            <h2 className="mt-2 font-display text-2xl text-glow" style={{ color: 'var(--ink)' }}>
              {phaseLine(phase, liveStatus)}
            </h2>

            <blockquote
              className="mt-4 rounded-lg border-l-2 px-3 py-2 text-[14px] leading-relaxed"
              style={{ borderColor: 'var(--starlight)', background: 'var(--raised)', color: 'var(--starlight)' }}
            >
              {text}
            </blockquote>

            <ol className="mt-5 flex items-center justify-between gap-1">
              {STAGES.map((s) => {
                const st = stageState(s.key, phase);
                return (
                  <li key={s.key} className="flex flex-1 flex-col items-center gap-1.5 text-center">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        background:
                          st === 'done' ? 'var(--forged)' : st === 'active' ? 'var(--starlight)' : 'var(--raised)',
                        boxShadow: st === 'active' ? '0 0 10px var(--starlight)' : 'none',
                      }}
                      aria-hidden
                    />
                    <span
                      className="text-[10px] uppercase tracking-wide"
                      style={{ color: st === 'idle' ? 'var(--muted)' : 'var(--ink)' }}
                    >
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ol>

            {!finished && draft && <DraftPeek draft={draft} />}

            {phase === 'confirmed' && <Outcome draft={draft} />}

            {phase === 'error' && (
              <div
                className="mt-5 rounded-xl p-4 text-[13px] leading-relaxed"
                style={{ background: 'rgba(181,108,255,0.10)', color: 'var(--starlight)' }}
                role="alert"
              >
                {error ?? 'The transaction did not complete.'}
              </div>
            )}

            {!finished && (
              <p className="mt-5 text-center text-[12px]" style={{ color: 'var(--muted)' }}>
                An AI write under consensus can take 1 to 5 minutes. You can keep this open.
              </p>
            )}

            <div className="mt-5 flex items-center justify-between">
              {hash ? (
                <a
                  href={`${EXPLORER}/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono inline-flex items-center gap-1 text-[12px]"
                  style={{ color: 'var(--starlight)' }}
                >
                  View transaction
                  <ExternalLink size={11} aria-hidden />
                </a>
              ) : (
                <span />
              )}
              {finished && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className="tap rounded-full px-5 py-2 text-[13px] font-medium"
                  style={{ background: 'var(--forged)', color: '#1a1405' }}
                >
                  Back to the map
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
