'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PenLine, Sparkles, Link2 } from 'lucide-react';

interface Step {
  n: string;
  title: string;
  body: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Lay down a star',
    body: 'Read the tail of an open constellation, then write a single line of 4 to 200 characters that continues it. You can also found a brand new constellation from a theme and a seed star.',
    icon: <PenLine size={18} aria-hidden />,
  },
  {
    n: '02',
    title: 'The Stargazer reads',
    body: 'Your line is submitted on chain. Validators run an AI Stargazer under consensus that rules the link FORGED, FRAYED or SNAPPED and scores its resonance from 0 to 100.',
    icon: <Sparkles size={18} aria-hidden />,
  },
  {
    n: '03',
    title: 'The chain grows',
    body: 'A forged or frayed link joins the chain and the momentum streak climbs. A snapped link is rejected and the streak breaks. The constellation seals once it reaches its full span.',
    icon: <Link2 size={18} aria-hidden />,
  },
];

const NODES = [
  { x: 80, y: 64 },
  { x: 300, y: 30 },
  { x: 540, y: 70 },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative mx-auto w-full max-w-[1320px] scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28"
      aria-label="How the sky grows"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl"
      >
        <p className="text-[12px] uppercase tracking-[0.24em]" style={{ color: 'var(--muted)' }}>
          How the sky grows
        </p>
        <h2 className="mt-3 text-[30px] leading-tight sm:text-[40px]" style={{ color: 'var(--ink)' }}>
          Three steps, one growing chain
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed" style={{ color: 'var(--muted)' }}>
          Constellation is a relay. Each contribution depends on the last, so the sky is written
          together, link by link, with the Stargazer keeping every line honest.
        </p>
      </motion.div>

      {/* Hand drawn constellation connector across the steps */}
      <div className="relative mt-14">
        <svg
          className="pointer-events-none absolute left-0 top-0 hidden h-[120px] w-full lg:block"
          viewBox="0 0 620 120"
          preserveAspectRatio="none"
          aria-hidden
        >
          <motion.polyline
            points={NODES.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="var(--forged)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="3 7"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.55 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          />
          {NODES.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={4.2}
              fill="var(--forged)"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.35 }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            />
          ))}
        </svg>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.article
              key={s.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="panel relative flex flex-col p-6"
            >
              <div className="flex items-center justify-between">
                <span
                  className="mono text-[13px] tracking-[0.2em]"
                  style={{ color: 'var(--forged)' }}
                >
                  {s.n}
                </span>
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: 'var(--raised)', border: '1px solid var(--line-strong)', color: 'var(--starlight)' }}
                  aria-hidden
                >
                  {s.icon}
                </span>
              </div>
              <h3 className="mt-5 text-[19px]" style={{ color: 'var(--ink)' }}>
                {s.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                {s.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
