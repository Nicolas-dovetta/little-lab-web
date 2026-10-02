/** This week's ballot. Copy here is the seed source; live tallies come from Neon. */

export const VOTE_COOKIE = "we_vote_token";
export const VOTE_STORAGE_KEY = "we_vote";

/** Weekend we build the winner: Saturday Oct 10, 2026. */
export const POLL_WEEK_ID = "2026-10-10";

/**
 * Saturday Oct 3, 2026, 11:59:59 PM America/Los_Angeles (PDT, UTC-7).
 * Voting is open through this instant and closed after it.
 */
export const POLL_CLOSES_AT_ISO = "2026-10-04T06:59:59.000Z";

/** mulberry32 seed used to scatter the starter votes. */
export const POLL_VOTE_SEED = 20261003;
export const POLL_SEED_TOTAL = 30;

export const VOTE_RATE_LIMIT = 20;
export const VOTE_RATE_WINDOW_MS = 10 * 60 * 1000;

const VOTE_TOKEN_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type PollOptionSeed = {
  id: string;
  title: string;
  challenge: string;
  blurb: string;
};

export const POLL_OPTIONS: readonly PollOptionSeed[] = [
  {
    id: "cartesian-diver",
    title: "Cartesian diver",
    challenge: "Sink a diver without touching it",
    blurb: "Squeeze a closed bottle and watch an eyedropper dive and float. Pressure + buoyancy.",
  },
  {
    id: "instant-ice",
    title: "Instant ice",
    challenge: "Freeze water by pouring it",
    blurb: "Supercooled bottle water turns to ice the moment it hits ice or you slap it. Phase change drama.",
  },
  {
    id: "milk-fireworks",
    title: "Milk fireworks",
    challenge: "Make colors explode on milk",
    blurb: "Food coloring dots on milk, then a soap drop — colors race as surface tension collapses.",
  },
  {
    id: "balloon-hovercraft",
    title: "Balloon hovercraft",
    challenge: "Ride a CD on air",
    blurb: "Balloon + old CD + bottle cap = a hovercraft that glides on a cushion of air.",
  },
  {
    id: "walking-water",
    title: "Walking-water rainbow",
    challenge: "Make water climb between cups",
    blurb: "Paper towels bridge colored cups; water walks and mixes into a rainbow. Capillary action.",
  },
];

export type VoteOptionPublic = PollOptionSeed & {
  votes: number;
};

export type VoteSnapshot = {
  weekId: string;
  closesAt: string;
  closesLabel: string;
  closed: boolean;
  total: number;
  votedOptionId: string | null;
  options: VoteOptionPublic[];
};

export function isVoteToken(value: string | undefined | null): value is string {
  return typeof value === "string" && VOTE_TOKEN_RE.test(value);
}

/** Closed strictly after `closesAt`, so 11:59:59 PM PT is still open. */
export function isPollClosed(now: Date, closesAt: Date): boolean {
  return now.getTime() > closesAt.getTime();
}

export function formatClosesAt(closesAt: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(closesAt);
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Starter tallies. Each option begins at 2, then the rest of `total` is
 * scattered with mulberry32 so the race is uneven and sums to `total`.
 */
export function seededVoteCounts(
  ids: readonly string[] = POLL_OPTIONS.map((option) => option.id),
  total = POLL_SEED_TOTAL,
  seed = POLL_VOTE_SEED,
): Record<string, number> {
  if (ids.length === 0) return {};
  const base = Math.min(2, Math.floor(total / ids.length));
  const counts = ids.map(() => base);
  let remaining = total - base * ids.length;
  const rng = mulberry32(seed);
  while (remaining > 0) {
    const index = Math.floor(rng() * ids.length);
    counts[index] = (counts[index] ?? 0) + 1;
    remaining -= 1;
  }
  return Object.fromEntries(ids.map((id, index) => [id, counts[index] ?? 0]));
}

export function voteShare(votes: number, total: number): number {
  if (total <= 0 || votes <= 0) return 0;
  return (votes / total) * 100;
}

export function votePercent(votes: number, total: number): number {
  return Math.round(voteShare(votes, total));
}

/** Option ids tied for the most votes. Empty when nobody has a vote yet. */
export function leadingOptionIds(options: readonly { id: string; votes: number }[]): string[] {
  const max = options.reduce((highest, option) => Math.max(highest, option.votes), 0);
  if (max <= 0) return [];
  return options.filter((option) => option.votes === max).map((option) => option.id);
}

export function hitRateLimit(
  hits: readonly number[],
  now: number,
  limit = VOTE_RATE_LIMIT,
  windowMs = VOTE_RATE_WINDOW_MS,
): { allowed: boolean; hits: number[] } {
  const recent = hits.filter((stamp) => now - stamp < windowMs);
  if (recent.length >= limit) return { allowed: false, hits: recent };
  recent.push(now);
  return { allowed: true, hits: recent };
}

/** Split a SQL script on semicolons that are not inside single-quoted strings. */
export function splitSqlStatements(sqlText: string): string[] {
  const statements: string[] = [];
  let current = "";
  let inString = false;

  for (let i = 0; i < sqlText.length; i += 1) {
    const ch = sqlText[i];
    if (ch === "'") {
      if (inString && sqlText[i + 1] === "'") {
        current += "''";
        i += 1;
        continue;
      }
      inString = !inString;
      current += ch;
      continue;
    }
    if (ch === ";" && !inString) {
      const statement = stripSqlComments(current).trim();
      if (statement) statements.push(statement);
      current = "";
      continue;
    }
    current += ch;
  }

  const tail = stripSqlComments(current).trim();
  if (tail) statements.push(tail);
  return statements;
}

function stripSqlComments(input: string): string {
  return input
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
}
