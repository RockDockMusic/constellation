'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, DOCS, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddress } from '@/lib/format';
import { Copyable } from './Copyable';
import { Mark } from './Mark';

function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[13px] transition-colors"
      style={{ color: 'var(--muted)' }}
    >
      {children}
      <ExternalLink size={12} aria-hidden />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-8" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="mx-auto w-full max-w-[1320px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Mark size={26} />
              <span
                className="text-[15px] font-semibold tracking-[0.2em]"
                style={{ color: 'var(--ink)' }}
              >
                CONSTELLATION
              </span>
            </div>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
              A collaborative relay chain of stars, judged star by star by an AI Stargazer running
              under consensus on the GenLayer Bradbury Testnet.
            </p>
          </div>

          <div>
            <h4 className="text-[12px] uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>
              Resources
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Out href={DOCS}>GenLayer docs</Out>
              </li>
              <li>
                <Out href={FAUCET}>Testnet faucet</Out>
              </li>
              <li>
                <Out href={EXPLORER}>Block explorer</Out>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] uppercase tracking-[0.2em]" style={{ color: 'var(--muted)' }}>
              Contract
            </h4>
            <div className="mt-4 flex flex-col gap-3 text-[13px]" style={{ color: 'var(--muted)' }}>
              <Copyable
                value={CONTRACT_ADDRESS}
                label="contract address"
                display={
                  <a
                    href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono"
                    style={{ color: 'var(--starlight)' }}
                  >
                    {shortAddress(CONTRACT_ADDRESS)}
                  </a>
                }
              />
              <span>Deployed on Bradbury Testnet</span>
            </div>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col items-center justify-between gap-3 pt-6 text-[12px] sm:flex-row"
          style={{ borderTop: '1px solid var(--line)', color: 'var(--muted)' }}
        >
          <span>Constellation, built on GenLayer.</span>
          <span className="mono">Reads are open. Casting a star needs a wallet.</span>
        </div>
      </div>
    </footer>
  );
}
