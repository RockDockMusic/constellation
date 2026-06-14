'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export interface CopyableProps {
  value: string;
  label?: string;
  display?: React.ReactNode;
  className?: string;
}

export function Copyable({ value, label, display, className }: CopyableProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard may be unavailable */
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={label ? `Copy ${label}` : 'Copy to clipboard'}
      title={copied ? 'Copied' : 'Copy'}
      className={`group relative inline-flex items-center gap-1.5 mono text-[13px] ${className ?? ''}`}
      style={{ color: 'var(--ink)' }}
    >
      <span>{display ?? value}</span>
      {copied ? (
        <Check size={13} style={{ color: 'var(--forged)' }} aria-hidden />
      ) : (
        <Copy size={13} style={{ color: 'var(--muted)' }} aria-hidden />
      )}
      {copied && (
        <span
          className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-2 py-0.5 text-[11px]"
          style={{ background: 'var(--raised)', color: 'var(--forged)' }}
        >
          Copied
        </span>
      )}
    </button>
  );
}
