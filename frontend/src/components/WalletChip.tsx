'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Wallet, AlertCircle } from 'lucide-react';
import type { WalletState } from '@/hooks/useWallet';
import { shortAddress } from '@/lib/format';
import { Copyable } from './Copyable';

export interface WalletChipProps {
  wallet: WalletState;
}

export function WalletChip({ wallet }: WalletChipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!wallet.address) {
    return (
      <button
        type="button"
        onClick={wallet.connect}
        disabled={wallet.connecting}
        className="tap glow-starlight inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium disabled:opacity-60"
        style={{ background: 'var(--raised)', color: 'var(--starlight)', border: '1px solid var(--line-strong)' }}
      >
        <Wallet size={15} aria-hidden />
        {wallet.connecting ? 'Connecting...' : 'Connect wallet'}
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="tap inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px]"
        style={{ background: 'var(--raised)', border: '1px solid var(--line-strong)', color: 'var(--ink)' }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{
            background: wallet.onChain ? 'var(--forged)' : 'var(--nebula)',
            boxShadow: wallet.onChain ? '0 0 8px var(--forged)' : '0 0 8px var(--nebula)',
          }}
          aria-hidden
        />
        <span className="mono">{shortAddress(wallet.address)}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            role="menu"
            className="panel absolute right-0 z-50 mt-2 w-64 p-4"
          >
            <p className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Address
            </p>
            <Copyable value={wallet.address} label="wallet address" className="mt-1 break-all" />

            <div className="my-3 h-px" style={{ background: 'var(--line)' }} />

            <div className="flex items-center justify-between">
              <span className="text-[12px]" style={{ color: 'var(--muted)' }}>
                Balance
              </span>
              <span className="mono text-[13px]" style={{ color: 'var(--forged)' }}>
                {wallet.balance ?? '0'} GEN
              </span>
            </div>

            {!wallet.onChain && (
              <div
                className="mt-3 flex items-start gap-2 rounded-lg p-2 text-[12px]"
                style={{ background: 'rgba(181,108,255,0.10)', color: 'var(--starlight)' }}
              >
                <AlertCircle size={14} aria-hidden style={{ marginTop: 1, flexShrink: 0 }} />
                Switch to Bradbury Testnet to cast stars.
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                wallet.disconnect();
                setOpen(false);
              }}
              role="menuitem"
              className="tap mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-[13px]"
              style={{ background: 'var(--raised)', color: 'var(--ink)' }}
            >
              <LogOut size={14} aria-hidden />
              Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
