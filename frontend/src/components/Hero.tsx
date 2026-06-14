'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Radio, Hash, Sparkles } from 'lucide-react';
import type { Stats } from '@/lib/contract';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';
import { figure, shortAddress } from '@/lib/format';
import { HeroSky } from './HeroSky';
import { Mark } from './Mark';

export interface HeroProps {
  stats: Stats | null;
  bestMomentum: number;
  online: boolean;
  onEnter: () => void;
}

function Chip({
  icon,
  label,
  value,
  href,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  valueColor?: string;
}) {
  const inner = (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px]"
      style={{ background: 'rgba(13,12,24,0.6)', border: '1px solid var(--line-strong)' }}
    >
      <span style={{ color: 'var(--forged)' }} aria-hidden>
        {icon}
      </span>
      <span className="uppercase tracking-[0.16em]" style={{ color: 'var(--muted)' }}>
        {label}
      </span>
      <span className="mono" style={{ color: valueColor ?? 'var(--ink)' }}>
        {value}
      </span>
    </span>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return inner;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero({ stats, bestMomentum, online, onEnter }: HeroProps) {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100vh-61px)] w-full items-center overflow-hidden"
      aria-label="Introduction"
    >
      <HeroSky />

      {/* keep text readable over the moving sky */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(1100px 620px at 50% 38%, rgba(7,6,15,0.10), rgba(7,6,15,0.62) 78%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-4 py-20 sm:px-6">
        <div className="max-w-3xl">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px]"
            style={{ background: 'var(--raised)', border: '1px solid var(--line-strong)', color: 'var(--muted)' }}
          >
            <Mark size={16} />
            <span className="uppercase tracking-[0.2em]">A collaborative relay chain</span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 text-[40px] leading-[1.05] sm:text-[58px] lg:text-[68px]"
            style={{ color: 'var(--ink)' }}
          >
            <span className="text-glow">Co-author the sky,</span>
            <br />
            <span style={{ color: 'var(--forged)' }}>one star at a time.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-xl text-[16px] leading-relaxed sm:text-[18px]"
            style={{ color: 'var(--muted)' }}
          >
            Every star is a single line that must connect to the one before it. An AI Stargazer
            judges each link under consensus, forging the strong ones into a growing constellation
            and letting the weak ones snap away.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              onClick={onEnter}
              className="tap glow-forged inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium"
              style={{ background: 'var(--forged)', color: '#1a1405' }}
            >
              <Sparkles size={17} aria-hidden />
              Enter the living sky
            </button>
            <a
              href="#how"
              className="tap inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px]"
              style={{ background: 'transparent', color: 'var(--starlight)', border: '1px solid var(--line-strong)' }}
            >
              How it grows
              <ArrowDown size={15} aria-hidden />
            </a>
          </motion.div>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-10 flex flex-wrap items-center gap-2.5"
          >
            <Chip
              icon={<Radio size={13} />}
              label="Network"
              value="Bradbury"
              valueColor={online ? 'var(--forged)' : 'var(--nebula)'}
            />
            <Chip
              icon={<Hash size={13} />}
              label="Contract"
              value={shortAddress(CONTRACT_ADDRESS)}
              href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
              valueColor="var(--starlight)"
            />
            <Chip icon={<Sparkles size={13} />} label="Stars" value={figure(stats?.stars ?? 0)} />
            <Chip icon={<Sparkles size={13} />} label="Best streak" value={figure(bestMomentum)} />
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center" aria-hidden>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ color: 'var(--muted)' }}
        >
          <ArrowDown size={20} />
        </motion.span>
      </div>
    </section>
  );
}
