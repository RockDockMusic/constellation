'use client';

import React from 'react';
import { CloudOff, ExternalLink, RotateCw } from 'lucide-react';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';
import { shortAddress } from '@/lib/format';

export interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="panel flex h-full min-h-[360px] flex-col items-center justify-center px-6 text-center"
      role="alert"
    >
      <CloudOff size={40} style={{ color: 'var(--nebula)' }} aria-hidden />
      <h2 className="mt-5 text-xl" style={{ color: 'var(--ink)' }}>
        The sky is clouded over
      </h2>
      <p className="mt-2 max-w-sm text-[14px]" style={{ color: 'var(--muted)' }}>
        {message}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="tap inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px]"
          style={{ background: 'var(--forged)', color: '#1a1405' }}
        >
          <RotateCw size={15} aria-hidden />
          Retry
        </button>
        <a
          href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mono inline-flex items-center gap-1.5 text-[13px]"
          style={{ color: 'var(--starlight)' }}
        >
          {shortAddress(CONTRACT_ADDRESS)}
          <ExternalLink size={12} aria-hidden />
        </a>
      </div>
    </div>
  );
}
