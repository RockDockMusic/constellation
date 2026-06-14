'use client';

import React, { useState } from 'react';
import { Sparkles, Lock, Wallet } from 'lucide-react';
import type { ConstellationSummary } from '@/lib/contract';
import { ConfirmDialog } from './ConfirmDialog';

export interface ContributePanelProps {
  selected: ConstellationSummary | null;
  hasWallet: boolean;
  busy: boolean;
  onCast: (text: string) => void;
  onConnect: () => void;
}

const STAR_MIN = 4;
const STAR_MAX = 200;

export function ContributePanel({ selected, hasWallet, busy, onCast, onConnect }: ContributePanelProps) {
  const [text, setText] = useState('');
  const [confirm, setConfirm] = useState(false);

  if (!selected) return null;

  const len = text.trim().length;
  const valid = len >= STAR_MIN && len <= STAR_MAX;

  if (selected.status === 'SEALED') {
    return (
      <section className="panel p-5" aria-label="Contribute">
        <div className="flex items-center gap-2">
          <Lock size={16} style={{ color: 'var(--forged)' }} aria-hidden />
          <h3 className="text-[15px]" style={{ color: 'var(--ink)' }}>
            This constellation is complete
          </h3>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
          It reached its full span of stars and is now sealed. Trace its chain on the map, or chart a
          new constellation of your own.
        </p>
      </section>
    );
  }

  const submit = () => {
    setConfirm(false);
    const t = text.trim();
    onCast(t);
    setText('');
  };

  return (
    <section className="panel p-5" aria-label="Contribute the next star">
      <h3 className="text-[15px]" style={{ color: 'var(--ink)' }}>
        Cast the next star
      </h3>
      <p className="mt-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--muted)' }}>
        Connect to this tail
      </p>
      <blockquote
        className="mt-1.5 rounded-lg border-l-2 px-3 py-2 font-display text-[15px] leading-relaxed"
        style={{ borderColor: 'var(--forged)', background: 'var(--raised)', color: 'var(--starlight)' }}
      >
        {selected.tail}
      </blockquote>

      <label className="mt-4 block" htmlFor="cast-text">
        <span className="flex items-center justify-between text-[12px]">
          <span style={{ color: 'var(--starlight)' }}>Your star</span>
          <span className="mono" style={{ color: valid || !text ? 'var(--muted)' : 'var(--nebula)' }}>
            {len}/{STAR_MAX}
          </span>
        </span>
        <textarea
          id="cast-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={STAR_MAX + 20}
          rows={3}
          placeholder="Continue the line. Build on the tail, keep the theme."
          className="mt-1.5 w-full resize-none rounded-lg px-3 py-2.5 text-[14px] leading-relaxed outline-none"
          style={{ background: 'var(--space)', border: '1px solid var(--line-strong)', color: 'var(--ink)' }}
        />
      </label>

      {len > 0 && !valid && (
        <p className="mt-1.5 text-[12px]" style={{ color: 'var(--nebula)' }}>
          A star must be {STAR_MIN} to {STAR_MAX} characters.
        </p>
      )}

      {hasWallet ? (
        <button
          type="button"
          disabled={!valid || busy}
          onClick={() => setConfirm(true)}
          className="tap glow-forged mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium disabled:opacity-50"
          style={{ background: 'var(--forged)', color: '#1a1405' }}
        >
          <Sparkles size={16} aria-hidden />
          {busy ? 'The Stargazer is reading...' : 'Cast the next star'}
        </button>
      ) : (
        <button
          type="button"
          onClick={onConnect}
          className="tap mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium"
          style={{ background: 'var(--raised)', color: 'var(--starlight)', border: '1px solid var(--line-strong)' }}
        >
          <Wallet size={16} aria-hidden />
          Connect a wallet to cast
        </button>
      )}

      <ConfirmDialog
        open={confirm}
        title="Cast this star?"
        body="This submits a transaction on Bradbury Testnet. Network fees apply. Continue?"
        confirmLabel="Cast it"
        busy={busy}
        onConfirm={submit}
        onCancel={() => setConfirm(false)}
      />
    </section>
  );
}
