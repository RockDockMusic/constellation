'use client';

import React, { useEffect, useRef } from 'react';

export interface HeroSkyProps {
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

interface Cloud {
  x: number;
  y: number;
  r: number;
  rgb: string;
  alpha: number;
  vx: number;
  vy: number;
  phase: number;
  drift: number;
}

const COLORS: Record<Spark['hue'], string> = {
  star: '207, 227, 255',
  gold: '232, 192, 106',
  neb: '181, 108, 255',
};

// A handcrafted animated sky for the hero: a faint drifting nebula behind a
// twinkling starfield. requestAnimationFrame driven, devicePixelRatio aware,
// paused while the tab is hidden, and reduced to a single static frame when the
// visitor prefers reduced motion.
export function HeroSky({ className, density = 0.00022 }: HeroSkyProps) {
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
    let clouds: Cloud[] = [];
    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const build = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));

      const count = Math.max(70, Math.floor(w * h * density));
      sparks = Array.from({ length: count }, () => {
        const roll = Math.random();
        const hue: Spark['hue'] = roll > 0.93 ? 'gold' : roll > 0.86 ? 'neb' : 'star';
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.4 + 0.3,
          base: Math.random() * 0.5 + 0.2,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.8 + 0.25,
          hue,
        };
      });

      const palette: Array<[string, number]> = [
        ['181, 108, 255', 0.16],
        ['70, 110, 200', 0.16],
        ['232, 192, 106', 0.08],
        ['120, 80, 200', 0.13],
      ];
      clouds = palette.map(([rgb, alpha], i) => ({
        x: (0.18 + 0.62 * (i / Math.max(1, palette.length - 1))) * w + (Math.random() - 0.5) * 120,
        y: (0.2 + 0.5 * Math.random()) * h,
        r: Math.max(w, h) * (0.42 + Math.random() * 0.28),
        rgb,
        alpha,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.035,
        phase: Math.random() * Math.PI * 2,
        drift: 0.12 + Math.random() * 0.12,
      }));
    };

    const drawClouds = (w: number, h: number, t: number) => {
      ctx.globalCompositeOperation = 'lighter';
      for (const c of clouds) {
        const ox = reduced ? 0 : Math.sin(t * 0.00006 * c.drift + c.phase) * 40;
        const oy = reduced ? 0 : Math.cos(t * 0.00005 * c.drift + c.phase) * 26;
        const cx = c.x + (reduced ? 0 : c.vx * t * 0.05) + ox;
        const cy = c.y + (reduced ? 0 : c.vy * t * 0.05) + oy;
        const wrapX = ((cx % (w + c.r * 2)) + (w + c.r * 2)) % (w + c.r * 2) - c.r;
        const grad = ctx.createRadialGradient(wrapX, cy, 0, wrapX, cy, c.r);
        grad.addColorStop(0, `rgba(${c.rgb}, ${c.alpha})`);
        grad.addColorStop(0.55, `rgba(${c.rgb}, ${c.alpha * 0.35})`);
        grad.addColorStop(1, `rgba(${c.rgb}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(wrapX, cy, c.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const draw = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      drawClouds(w, h, t);

      for (const s of sparks) {
        const tw = reduced ? s.base : s.base + Math.sin(t * 0.001 * s.speed + s.phase) * 0.4;
        const a = Math.max(0.05, Math.min(0.96, tw));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLORS[s.hue]}, ${a})`;
        if (s.r > 1 || s.hue !== 'star') {
          ctx.shadowBlur = 7;
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
