'use client';

import React from 'react';
import type { WalletState } from '@/hooks/useWallet';
import { Mark } from './Mark';
import { WalletChip } from './WalletChip';

export interface HeaderProps {
  wallet: WalletState;
}

function NetworkBadge({ online }: { online: boolean }) {
  return (
    <span
      className="hidden items-center gap-2 rounded-full px-3 py-1.5 text-[12px] sm:inline-flex"
      style={{ background: 'var(--raised)', border: '1px solid var(--line-strong)', color: 'var(--muted)' }}
      title="GenLayer Bradbury Testnet"
    >
      <span
        className={online ? 'pulse-streak' : ''}
        style={{
          display: 'inline-block',
          height: 8,
          width: 8,
          borderRadius: 999,
          background: online ? 'var(--forged)' : 'var(--nebula)',
          boxShadow: online ? '0 0 8px var(--forged)' : '0 0 8px var(--nebula)',
        }}
        aria-hidden
      />
      <span style={{ color: 'var(--starlight)' }}>Bradbury</span>
      <span className="hidden md:inline">Testnet</span>
    </span>
  );
}

export function Header({ wallet }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: 'rgba(7, 6, 15, 0.72)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Constellation home">
          <Mark size={28} className="drift" />
          <span
            className="text-[15px] font-semibold tracking-[0.2em] sm:text-[16px]"
            style={{ color: 'var(--ink)' }}
          >
            CONSTELLATION
          </span>
        </a>

        <div className="flex items-center gap-3">
          <NetworkBadge online={!wallet.address || wallet.onChain} />
          <WalletChip wallet={wallet} />
        </div>
      </div>
    </header>
  );
}
