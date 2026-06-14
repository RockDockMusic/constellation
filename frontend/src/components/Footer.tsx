'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, DOCS, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddress } from '@/lib/format';
import { Copyable } from './Copyable';

function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[12px]"
      style={{ color: 'var(--muted)' }}
    >
      {children}
      <ExternalLink size={11} aria-hidden />
    </a>
  );
}

export function Footer() {
  return (
    <footer
      className="mt-10 flex flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6"
      style={{ borderTop: '1px solid var(--line)' }}
    >
      <div className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--muted)' }}>
        <span>Contract</span>
        <Copyable
          value={CONTRACT_ADDRESS}
          label="contract address"
          display={
            <a
              href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--starlight)' }}
            >
              {shortAddress(CONTRACT_ADDRESS)}
            </a>
          }
        />
      </div>
      <div className="flex items-center gap-5">
        <Out href={FAUCET}>Faucet</Out>
        <Out href={EXPLORER}>Explorer</Out>
        <Out href={DOCS}>Docs</Out>
      </div>
    </footer>
  );
}
