import type { Verdict } from './contract';

// Short address: 0x1234...abcd
export function shortAddress(addr: string | null | undefined, lead = 6, tail = 4): string {
  if (!addr) return '';
  const a = String(addr);
  if (a.length <= lead + tail + 2) return a;
  return `${a.slice(0, lead)}...${a.slice(-tail)}`;
}

// Group a figure with thin separators for readability.
export function figure(n: number | null | undefined): string {
  const v = typeof n === 'number' && Number.isFinite(n) ? n : 0;
  return v.toLocaleString('en-US');
}

export interface VerdictStyle {
  label: string;
  color: string;
  glow: string;
  dim: string;
}

// Verdict color maps. FORGED is the strong gold link, FRAYED a faint starlight,
// SNAPPED a magenta nebula flare.
const VERDICT_STYLES: Record<string, VerdictStyle> = {
  FORGED: {
    label: 'Forged',
    color: 'var(--forged)',
    glow: 'rgba(232, 192, 106, 0.55)',
    dim: 'rgba(232, 192, 106, 0.16)',
  },
  FRAYED: {
    label: 'Frayed',
    color: 'var(--starlight)',
    glow: 'rgba(207, 227, 255, 0.40)',
    dim: 'rgba(207, 227, 255, 0.12)',
  },
  SNAPPED: {
    label: 'Snapped',
    color: 'var(--nebula)',
    glow: 'rgba(181, 108, 255, 0.45)',
    dim: 'rgba(181, 108, 255, 0.12)',
  },
};

const FALLBACK: VerdictStyle = {
  label: 'Pending',
  color: 'var(--muted)',
  glow: 'rgba(138, 138, 163, 0.30)',
  dim: 'rgba(138, 138, 163, 0.10)',
};

export function verdictStyle(verdict: Verdict | null | undefined): VerdictStyle {
  if (!verdict) return FALLBACK;
  return VERDICT_STYLES[String(verdict).toUpperCase()] ?? FALLBACK;
}

export function isAccepted(verdict: Verdict | null | undefined): boolean {
  const v = String(verdict ?? '').toUpperCase();
  return v === 'FORGED' || v === 'FRAYED';
}

// Average resonance across a chain, rounded.
export function averageResonance(total: number, count: number): number {
  if (!count) return 0;
  return Math.round(total / count);
}

// Clamp a resonance into the 0-100 brightness range used by the star map.
export function brightness(resonance: number): number {
  return Math.max(0, Math.min(100, resonance)) / 100;
}
