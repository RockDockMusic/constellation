'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { addStar, foundConstellation } from '@/lib/contract';
import { isAccepted } from '@/lib/format';
import { useWallet } from '@/hooks/useWallet';
import { useContractData } from '@/hooks/useContractData';
import { useTransaction } from '@/hooks/useTransaction';
import { ToastProvider, useToasts } from '@/components/Toast';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { StarMap } from '@/components/StarMap';
import { ReadingRail } from '@/components/ReadingRail';
import { ConstellationSwitcher } from '@/components/ConstellationSwitcher';
import { ContributePanel } from '@/components/ContributePanel';
import { NewConstellationModal } from '@/components/NewConstellationModal';
import { JudgingTheater } from '@/components/JudgingTheater';
import { MapSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Footer } from '@/components/Footer';
import { Starfield } from '@/components/Starfield';

type Pending = 'cast' | 'found' | null;

function Sky() {
  const wallet = useWallet();
  const data = useContractData();
  const tx = useTransaction();
  const toasts = useToasts();

  const [selectedStarN, setSelectedStarN] = useState<number | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [theaterOpen, setTheaterOpen] = useState(false);
  const [judgingText, setJudgingText] = useState('');

  const liveRef = useRef<HTMLElement | null>(null);
  const pending = useRef<Pending>(null);
  const toastId = useRef<string | null>(null);
  const lastRetry = useRef<(() => void) | null>(null);

  const busy = tx.state.phase === 'wallet' || tx.state.phase === 'submitted' || tx.state.phase === 'consensus';

  const selectedStar = useMemo(
    () => data.stars.find((s) => s.n === selectedStarN) ?? null,
    [data.stars, selectedStarN],
  );

  const bestMomentum = useMemo(
    () => data.constellations.reduce((m, c) => Math.max(m, c.best_momentum), 0),
    [data.constellations],
  );

  const scrollToSky = useCallback(() => {
    liveRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const cast = useCallback(
    (text: string) => {
      if (!wallet.address || !data.selectedId || busy) return;
      pending.current = 'cast';
      setJudgingText(text);
      setTheaterOpen(true);
      data.setPaused(true);
      const chartId = data.selectedId;
      lastRetry.current = () => cast(text);
      void tx.run({
        account: wallet.address,
        send: (client) => addStar(client, chartId, text),
      });
    },
    [wallet.address, data, busy, tx],
  );

  const found = useCallback(
    (theme: string, firstStar: string) => {
      if (!wallet.address || busy) return;
      pending.current = 'found';
      data.setPaused(true);
      lastRetry.current = () => found(theme, firstStar);
      void tx.run({
        account: wallet.address,
        send: (client) => foundConstellation(client, theme, firstStar),
      });
    },
    [wallet.address, data, busy, tx],
  );

  const prevPhase = useRef<string>('idle');
  const selectNewest = useRef(false);

  useEffect(() => {
    const phase = tx.state.phase;
    if (phase === prevPhase.current) return;
    prevPhase.current = phase;

    if (phase === 'submitted') {
      const msg =
        pending.current === 'found'
          ? 'Founding the constellation, awaiting the chain...'
          : 'Your star is cast. The Stargazer is reading...';
      if (toastId.current) toasts.update(toastId.current, { kind: 'loading', message: msg, hash: tx.state.hash });
      else toastId.current = toasts.push({ kind: 'loading', message: msg, hash: tx.state.hash });
    }

    if (phase === 'confirmed') {
      const draft = tx.state.draft;
      let kind: 'success' | 'info' = 'success';
      let message = 'New constellation charted.';
      if (pending.current === 'cast') {
        if (isAccepted(draft?.verdict)) message = 'The star is forged into the chain.';
        else {
          kind = 'info';
          message = 'The link snapped, the streak breaks.';
        }
      }
      if (toastId.current) toasts.update(toastId.current, { kind, message, hash: tx.state.hash });
      else toasts.push({ kind, message, hash: tx.state.hash });
      toastId.current = null;
      if (pending.current === 'found') {
        selectNewest.current = true;
        setNewOpen(false);
      }
      data.setPaused(false);
      void data.refresh();
      void wallet.refreshBalance();
      pending.current = null;
    }

    if (phase === 'error') {
      const retry = lastRetry.current;
      if (toastId.current)
        toasts.update(toastId.current, { kind: 'error', message: tx.state.error ?? 'Transaction failed', onRetry: retry });
      else toasts.push({ kind: 'error', message: tx.state.error ?? 'Transaction failed', onRetry: retry });
      toastId.current = null;
      data.setPaused(false);
      void wallet.refreshBalance();
      pending.current = null;
    }
  }, [tx.state.phase, tx.state.hash, tx.state.draft, tx.state.error, toasts, data, wallet]);

  // After founding, select the freshly created (newest) constellation.
  useEffect(() => {
    if (selectNewest.current && data.constellations.length > 0) {
      selectNewest.current = false;
      data.select(data.constellations[0].id);
      setSelectedStarN(null);
    }
  }, [data.constellations, data]);

  // Reset the selected star when switching constellations.
  const onSelectConstellation = useCallback(
    (id: string) => {
      data.select(id);
      setSelectedStarN(null);
    },
    [data],
  );

  const dismissTheater = useCallback(() => {
    setTheaterOpen(false);
    tx.reset();
  }, [tx]);

  const showEmpty = !data.loading && !data.error && data.constellations.length === 0;
  const showMap = !data.loading && !data.error && data.selected;

  return (
    <div className="relative">
      <Header wallet={wallet} />

      <main className="relative z-10">
        <Hero
          stats={data.stats}
          bestMomentum={bestMomentum}
          online={!wallet.address || wallet.onChain}
          onEnter={scrollToSky}
        />

        <HowItWorks />

        <section
          id="sky"
          ref={liveRef}
          className="relative mx-auto w-full max-w-[1320px] scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24"
          aria-label="The living sky"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="max-w-2xl">
              <p className="text-[12px] uppercase tracking-[0.24em]" style={{ color: 'var(--muted)' }}>
                The living sky
              </p>
              <h2 className="mt-3 text-[30px] leading-tight sm:text-[40px]" style={{ color: 'var(--ink)' }}>
                Trace a constellation, then add to it
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Pick a constellation to read its chain on the star map. Select any star for its full
                reading, then cast the next line onto the tail.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-[330px_1fr]"
          >
            <div className="flex flex-col gap-5">
              <ConstellationSwitcher
                constellations={data.constellations}
                selectedId={data.selectedId}
                onSelect={onSelectConstellation}
                onNew={() => setNewOpen(true)}
              />
              {showMap && (
                <ContributePanel
                  selected={data.selected}
                  hasWallet={!!wallet.address}
                  busy={busy}
                  onCast={cast}
                  onConnect={wallet.connect}
                />
              )}
            </div>

            <div className="relative min-h-[460px]">
              {data.loading && <MapSkeleton slow={data.slow} />}

              {data.error && !data.loading && (
                <div className="relative overflow-hidden rounded-2xl">
                  <Starfield />
                  <ErrorState message={data.error} onRetry={() => void data.refresh()} />
                </div>
              )}

              {showEmpty && (
                <div className="panel relative overflow-hidden">
                  <Starfield />
                  <div className="relative z-10">
                    <EmptyState onChart={() => setNewOpen(true)} />
                  </div>
                </div>
              )}

              {showMap && data.selected && (
                <>
                  <StarMap
                    stars={data.stars}
                    selectedStarN={selectedStarN}
                    onSelectStar={setSelectedStarN}
                    theme={data.selected.theme}
                    status={data.selected.status}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 sm:inset-y-0 sm:left-auto sm:right-0 sm:flex sm:w-[340px] sm:items-stretch">
                    <div className="pointer-events-auto w-full">
                      <ReadingRail star={selectedStar} onClose={() => setSelectedStarN(null)} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />

      <NewConstellationModal
        open={newOpen}
        busy={busy && pending.current === 'found'}
        onClose={() => setNewOpen(false)}
        onSubmit={found}
      />

      <JudgingTheater
        open={theaterOpen}
        phase={tx.state.phase}
        liveStatus={tx.state.liveStatus}
        draft={tx.state.draft}
        error={tx.state.error}
        hash={tx.state.hash}
        text={judgingText}
        onDismiss={dismissTheater}
      />
    </div>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <Sky />
    </ToastProvider>
  );
}
