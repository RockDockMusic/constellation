'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ConstellationLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  verdict: string;
  index: number;
}

export function ConstellationLine({ x1, y1, x2, y2, verdict, index }: ConstellationLineProps) {
  const v = verdict.toUpperCase();
  const color = v === 'FORGED' ? 'rgba(232,192,106,0.55)' : 'rgba(207,227,255,0.34)';
  const width = v === 'FORGED' ? 1.5 : 1;

  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 1.2), ease: 'easeOut' }}
      style={{ filter: `drop-shadow(0 0 3px ${color})` }}
    />
  );
}
