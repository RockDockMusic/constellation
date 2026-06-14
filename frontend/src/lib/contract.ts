import { createClient } from 'genlayer-js';
import { testnetBradbury } from 'genlayer-js/chains';

// Live Constellation contract on GenLayer Bradbury Testnet.
export const CONTRACT_ADDRESS =
  '0xA945A4217c58D04128C4378BD5C08ed3dF3575B3' as const;
export const DEPLOY_TX =
  '0xa219cc0646d6a903d5ce6a859277ba0bd54bcd969fd0e35e6142bea5cbebfecd' as const;
export const EXPLORER = 'https://explorer-bradbury.genlayer.com';
export const FAUCET = 'https://testnet-faucet.genlayer.foundation/';
export const DOCS = 'https://docs.genlayer.com';

export const readClient = createClient({ chain: testnetBradbury });

export const makeWalletClient = (account: `0x${string}`) =>
  createClient({ chain: testnetBradbury, account });

export type WalletClient = ReturnType<typeof makeWalletClient>;

const ADDRESS = CONTRACT_ADDRESS as `0x${string}`;

// ---- shapes returned by the contract views -----------------------------

export type Verdict = 'FORGED' | 'FRAYED' | 'SNAPPED' | string;
export type ChartStatus = 'OPEN' | 'SEALED' | string;

export interface Attempt {
  author: string;
  text: string;
  verdict: Verdict;
  resonance: number;
  note: string;
}

export interface ConstellationSummary {
  id: string;
  theme: string;
  founder: string;
  star_count: number;
  attempts: number;
  momentum: number;
  best_momentum: number;
  total_resonance: number;
  tail: string;
  status: ChartStatus;
  last_attempt: Attempt | null;
}

export interface Star {
  n: number;
  author: string;
  text: string;
  verdict: Verdict;
  resonance: number;
  note: string;
}

export interface Stats {
  charts: number;
  stars: number;
  attempts: number;
}

// ---- resilient reads ----------------------------------------------------

export async function withRpcRetry<T>(fn: () => Promise<T>, tries = 4): Promise<T> {
  let last: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (!/rate limit|429|timeout|network|fetch|too many/i.test(String(e))) throw e;
      // backoff: 2.5s, 5s, 10s, 20s
      await new Promise((r) => setTimeout(r, 2500 * 2 ** i));
    }
  }
  throw last;
}

function toRecord<T>(value: unknown): T {
  if (value instanceof Map) {
    const obj: Record<string, unknown> = {};
    for (const [k, v] of value.entries()) obj[String(k)] = normalize(v);
    return obj as T;
  }
  return value as T;
}

function normalize(value: unknown): unknown {
  if (value instanceof Map) return toRecord(value);
  if (Array.isArray(value)) return value.map(normalize);
  if (typeof value === 'bigint') return value.toString();
  return value;
}

function num(v: unknown): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'bigint') return Number(v);
  const n = Number(String(v ?? '0'));
  return Number.isFinite(n) ? n : 0;
}

function str(v: unknown): string {
  return String(v ?? '');
}

function asAttempt(raw: unknown): Attempt | null {
  const r = toRecord<Record<string, unknown>>(normalize(raw));
  if (!r || typeof r !== 'object') return null;
  // An empty {} means no attempt has been recorded yet.
  if (!('verdict' in r) && !('text' in r) && !('author' in r)) return null;
  if (str(r.verdict) === '' && str(r.text) === '' && str(r.author) === '') return null;
  return {
    author: str(r.author),
    text: str(r.text),
    verdict: str(r.verdict),
    resonance: num(r.resonance),
    note: str(r.note),
  };
}

function asSummary(raw: unknown): ConstellationSummary {
  const r = toRecord<Record<string, unknown>>(normalize(raw));
  return {
    id: str(r.id),
    theme: str(r.theme),
    founder: str(r.founder),
    star_count: num(r.star_count),
    attempts: num(r.attempts),
    momentum: num(r.momentum),
    best_momentum: num(r.best_momentum),
    total_resonance: num(r.total_resonance),
    tail: str(r.tail),
    status: str(r.status) || 'OPEN',
    last_attempt: asAttempt(r.last_attempt),
  };
}

function asStar(raw: unknown): Star {
  const r = toRecord<Record<string, unknown>>(normalize(raw));
  return {
    n: num(r.n),
    author: str(r.author),
    text: str(r.text),
    verdict: str(r.verdict),
    resonance: num(r.resonance),
    note: str(r.note),
  };
}

export async function fetchConstellations(start = 0): Promise<ConstellationSummary[]> {
  const raw = await withRpcRetry(() =>
    readClient.readContract({
      address: ADDRESS,
      functionName: 'get_constellations',
      args: [start],
    }),
  );
  const arr = (normalize(raw) as unknown[]) ?? [];
  return arr.map(asSummary);
}

export async function fetchConstellation(chartId: string): Promise<ConstellationSummary> {
  const raw = await withRpcRetry(() =>
    readClient.readContract({
      address: ADDRESS,
      functionName: 'get_constellation',
      args: [chartId],
    }),
  );
  return asSummary(normalize(raw));
}

export async function fetchStars(chartId: string, start = 0): Promise<Star[]> {
  const raw = await withRpcRetry(() =>
    readClient.readContract({
      address: ADDRESS,
      functionName: 'get_stars',
      args: [chartId, start],
    }),
  );
  const arr = (normalize(raw) as unknown[]) ?? [];
  return arr.map(asStar);
}

export async function fetchAllStars(chartId: string, max = 80): Promise<Star[]> {
  const out: Star[] = [];
  let start = 0;
  // The contract pages by 20 in chain order (oldest first).
  while (out.length < max) {
    const page = await fetchStars(chartId, start);
    if (page.length === 0) break;
    out.push(...page);
    if (page.length < 20) break;
    start += page.length;
  }
  return out;
}

export async function fetchStats(): Promise<Stats> {
  const raw = await withRpcRetry(() =>
    readClient.readContract({ address: ADDRESS, functionName: 'get_stats', args: [] }),
  );
  const r = toRecord<Record<string, unknown>>(normalize(raw));
  return {
    charts: num(r.charts),
    stars: num(r.stars),
    attempts: num(r.attempts),
  };
}

// ---- writes -------------------------------------------------------------

export function foundConstellation(client: WalletClient, theme: string, firstStar: string) {
  return client.writeContract({
    address: ADDRESS,
    functionName: 'found_constellation',
    args: [theme, firstStar],
    value: 0n,
  });
}

export function addStar(client: WalletClient, chartId: string, text: string) {
  return client.writeContract({
    address: ADDRESS,
    functionName: 'add_star',
    args: [chartId, text],
    value: 0n,
  });
}

// ---- transaction polling ------------------------------------------------

const STATUS_NAME: Record<string, string> = {
  '1': 'PENDING',
  '2': 'PROPOSING',
  '3': 'COMMITTING',
  '4': 'REVEALING',
  '5': 'ACCEPTED',
  '6': 'UNDETERMINED',
  '7': 'FINALIZED',
  '8': 'CANCELED',
  '12': 'VALIDATORS_TIMEOUT',
  '13': 'LEADER_TIMEOUT',
};

export const statusName = (s: unknown): string =>
  STATUS_NAME[String(s)] ?? String(s ?? 'PENDING').toUpperCase();

// LEADER_TIMEOUT / VALIDATORS_TIMEOUT are intentionally absent: the network
// rotates the leader and retries, so keep polling through them.
const TERMINAL = new Set(['ACCEPTED', 'FINALIZED', 'UNDETERMINED', 'CANCELED']);

export interface LeaderDraft {
  verdict: string;
  resonance?: number;
  note?: string;
}

function pick(obj: unknown, key: string): unknown {
  if (obj instanceof Map) return obj.get(key);
  if (obj && typeof obj === 'object') return (obj as Record<string, unknown>)[key];
  return undefined;
}

export function extractLeaderDraft(tx: unknown): LeaderDraft | null {
  try {
    const receipts = pick(pick(tx, 'consensus_data'), 'leader_receipt');
    const first = Array.isArray(receipts) ? receipts[0] : receipts;
    const b64 = pick(pick(first, 'eq_outputs'), '0');
    if (typeof b64 !== 'string' || b64.length === 0) return null;
    const text = atob(b64);
    for (let i = text.length - 1; i >= 0; i--) {
      if (text[i] !== '{') continue;
      try {
        const obj = JSON.parse(text.slice(i));
        if (obj && typeof obj === 'object' && 'verdict' in obj) return obj as LeaderDraft;
      } catch {
        /* keep scanning toward the start for a parseable object */
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function pollUntilDecided(
  client: WalletClient,
  hash: `0x${string}`,
  onUpdate?: (status: string, draft: LeaderDraft | null) => void,
): Promise<{ status: string; draft: LeaderDraft | null }> {
  let draft: LeaderDraft | null = null;
  for (let i = 0; i < 150; i++) {
    const tx = await client
      .getTransaction({ hash } as Parameters<typeof client.getTransaction>[0])
      .catch(() => null);
    const status = statusName(tx ? (tx as { status?: unknown }).status : 'PENDING');
    draft = extractLeaderDraft(tx) ?? draft;
    onUpdate?.(status, draft);
    if (TERMINAL.has(status)) return { status, draft };
    await new Promise((r) => setTimeout(r, 8000));
  }
  return { status: 'TIMEOUT', draft };
}
