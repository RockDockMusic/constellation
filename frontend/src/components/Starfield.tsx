'use client';

import React, { useEffect, useRef } from 'react';

export interface StarfieldProps {
  className?: string;
  density?: number;
}

interface Spark {
  x: number;
  y: number;
  r: number;
  base: number;
  phase: number;
  speed: number;
  hue: 'star' | 'gold' | 'neb';
}

const COLORS: Record<Spark['hue'], string> = {
  star: '207, 227, 255',
  gold: '232, 192, 106',
  neb: '181, 108, 255',
};

export function Starfield({ className, density = 0.00016 }: StarfieldProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let sparks: Spark[] = [];
    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const build = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      const count = Math.max(40, Math.floor(w * h * density));
      sparks = Array.from({ length: count }, () => {
        const roll = Math.random();
        const hue: Spark['hue'] = roll > 0.94 ? 'gold' : roll > 0.88 ? 'neb' : 'star';
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.3 + 0.3,
          base: Math.random() * 0.5 + 0.2,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.8 + 0.3,
          hue,
        };
      });
    };

    const draw = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const s of sparks) {
        const tw = reduced ? s.base : s.base + Math.sin(t * 0.001 * s.speed + s.phase) * 0.35;
        const a = Math.max(0.05, Math.min(0.95, tw));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLORS[s.hue]}, ${a})`;
        if (s.r > 1 || s.hue !== 'star') {
          ctx.shadowBlur = 6;
          ctx.shadowColor = `rgba(${COLORS[s.hue]}, ${a * 0.7})`;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    const stop = () => cancelAnimationFrame(raf);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!reduced) start();
    };

    build();
    if (reduced) draw(0);
    else start();

    window.addEventListener('resize', build);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      window.removeEventListener('resize', build);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      className={className}
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
