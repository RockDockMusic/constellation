'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ConstellationSummary,
  Star,
  Stats,
  fetchAllStars,
  fetchConstellations,
  fetchStats,
} from '@/lib/contract';

const POLL_MS = 90_000;
const SLOW_MS = 5_000;

export interface ContractData {
  constellations: ConstellationSummary[];
  stats: Stats | null;
  selectedId: string | null;
  selected: ConstellationSummary | null;
  stars: Star[];
  loading: boolean;
  slow: boolean;
  starsLoading: boolean;
  error: string | null;
  select: (id: string) => void;
  refresh: () => Promise<void>;
  setPaused: (paused: boolean) => void;
}

function friendlyRead(e: unknown): string {
  const msg = String((e as { message?: string })?.message ?? e);
  if (/not found|no contract|reverted|does not exist/i.test(msg)) {
    return 'No contract exists at the configured address on Bradbury';
  }
  if (/rate limit|429|too many/i.test(msg)) {
    return 'The network is congested. The sky will clear shortly.';
  }
  if (/network|fetch|connection/i.test(msg)) {
    return 'Network error, check your connection';
  }
  return 'The sky is clouded over. The chain could not be read.';
}

// The "most active" chart: highest star_count, then best momentum, then newest.
function pickInitial(list: ConstellationSummary[]): string | null {
  if (list.length === 0) return null;
  const ranked = [...list].sort((a, b) => {
    if (b.star_count !== a.star_count) return b.star_count - a.star_count;
    if (b.best_momentum !== a.best_momentum) return b.best_momentum - a.best_momentum;
    return 0;
  });
  return ranked[0].id;
}

export function useContractData(): ContractData {
  const [constellations, setConstellations] = useState<ConstellationSummary[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false);
  const [starsLoading, setStarsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pausedRef = useRef(false);
  const selectedRef = useRef<string | null>(null);
  const userPicked = useRef(false);
  selectedRef.current = selectedId;

  const setPaused = useCallback((p: boolean) => {
    pausedRef.current = p;
  }, []);

  const loadStars = useCallback(async (id: string) => {
    setStarsLoading(true);
    try {
      const s = await fetchAllStars(id);
      setStars(s);
    } catch {
      setStars([]);
    } finally {
      setStarsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    const slowTimer = setTimeout(() => setSlow(true), SLOW_MS);
    try {
      const [list, st] = await Promise.all([fetchConstellations(0), fetchStats()]);
      setConstellations(list);
      setStats(st);
      setError(null);
      let active = selectedRef.current;
      if (!active || !list.some((c) => c.id === active)) {
        if (!userPicked.current || !active) active = pickInitial(list);
      }
      if (active && active !== selectedRef.current) {
        setSelectedId(active);
        selectedRef.current = active;
      }
      if (active) await loadStars(active);
    } catch (e) {
      setError(friendlyRead(e));
    } finally {
      clearTimeout(slowTimer);
      setSlow(false);
      setLoading(false);
    }
  }, [loadStars]);

  const select = useCallback(
    (id: string) => {
      userPicked.current = true;
      setSelectedId(id);
      selectedRef.current = id;
      void loadStars(id);
    },
    [loadStars],
  );

  useEffect(() => {
    void refresh();
    const tick = setInterval(() => {
      if (!pausedRef.current && typeof document !== 'undefined' && !document.hidden) {
        void refresh();
      }
    }, POLL_MS);
    return () => clearInterval(tick);
  }, [refresh]);

  const selected = constellations.find((c) => c.id === selectedId) ?? null;

  return {
    constellations,
    stats,
    selectedId,
    selected,
    stars,
    loading,
    slow,
    starsLoading,
    error,
    select,
    refresh,
    setPaused,
  };
}
