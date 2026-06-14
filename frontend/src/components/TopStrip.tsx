'use client';

import React from 'react';
import { Star, TrendingUp } from 'lucide-react';
import type { WalletState } from '@/hooks/useWallet';
import type { Stats } from '@/lib/contract';
import { figure } from '@/lib/format';
import { Mark } from './Mark';
import { WalletChip } from './WalletChip';

export interface TopStripProps {
  wallet: WalletState;
  stats: Stats | null;
  bestMomentum: number;
}

function Tally({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2" title={label} aria-label={`${label}: ${value}`}>
      <span style={{ color: 'var(--forged)' }} aria-hidden>
        {icon}
      </span>
      <span className="mono text-[14px]" style={{ color: 'var(--ink)' }}>
        {value}
      </span>
      <span className="hidden text-[11px] uppercase tracking-wider sm:inline" style={{ color: 'var(--muted)' }}>
        {label}
      </span>
    </div>
  );
}

export function TopStrip({ wallet, stats, bestMomentum }: TopStripProps) {
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between gap-3 px-4 py-3 sm:px-6"
      style={{
        background: 'rgba(7, 6, 15, 0.72)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <Mark size={28} className="drift" />
        <span
          className="text-[15px] font-semibold tracking-[0.18em] sm:text-[17px]"
          style={{ color: 'var(--ink)' }}
        >
          CONSTELLATION
        </span>
      </div>

      <div className="hidden items-center gap-6 md:flex">
        <Tally icon={<Star size={15} />} value={figure(stats?.stars ?? 0)} label="stars" />
        <Tally icon={<TrendingUp size={15} />} value={figure(bestMomentum)} label="best streak" />
      </div>

      <WalletChip wallet={wallet} />
    </header>
  );
}
