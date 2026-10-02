import { readFileSync } from "node:fs";
import { join } from "node:path";
import { and, asc, desc, eq } from "drizzle-orm";
import { getDb, getSql } from "@/db";
import { pollBallots, pollOptions, pollWeeks } from "@/db/schema";
import {
  formatClosesAt,
  isPollClosed,
  POLL_OPTIONS,
  POLL_WEEK_ID,
  splitSqlStatements,
  type VoteSnapshot,
} from "@/lib/vote";

const MIGRATION_SQL_PATH = join(process.cwd(), "scripts/migrate-vote.sql");

let ballotReady: Promise<void> | null = null;

function isMissingPollTable(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return /does not exist|42P01/i.test(message) && /poll_weeks|poll_options|poll_ballots/i.test(message);
}

/** Create and seed the ballot once when this week's rows are not in Neon yet. */
export function ensureVoteBallot(): Promise<void> {
  if (!ballotReady) {
    ballotReady = seedVoteBallotIfNeeded().catch((err) => {
      ballotReady = null;
      throw err;
    });
  }
  return ballotReady;
}

async function seedVoteBallotIfNeeded(): Promise<void> {
  const sql = getSql();
  try {
    const rows = (await sql`
      SELECT COUNT(*)::int AS options, COALESCE(SUM(vote_count), 0)::int AS votes
      FROM poll_options
      WHERE week_id = ${POLL_WEEK_ID}
    `) as { options: number | string; votes: number | string }[];
    const options = Number(rows[0]?.options ?? 0);
    const votes = Number(rows[0]?.votes ?? 0);
    if (options >= POLL_OPTIONS.length && votes > 0) return;
  } catch (err) {
    if (!isMissingPollTable(err)) throw err;
  }

  const statements = splitSqlStatements(readFileSync(MIGRATION_SQL_PATH, "utf8"));
  for (const statement of statements) {
    await sql.query(statement);
  }
}

export async function loadCurrentPoll(token: string | null): Promise<VoteSnapshot | null> {
  try {
    await ensureVoteBallot();
    const db = getDb();
    const weeks = await db.select().from(pollWeeks).orderBy(desc(pollWeeks.closesAt)).limit(1);
    const week = weeks[0];
    if (!week) return null;

    const options = await db
      .select()
      .from(pollOptions)
      .where(eq(pollOptions.weekId, week.id))
      .orderBy(asc(pollOptions.sortOrder), asc(pollOptions.id));
    if (options.length === 0) return null;

    let votedOptionId: string | null = null;
    if (token) {
      const ballots = await db
        .select({ optionId: pollBallots.optionId })
        .from(pollBallots)
        .where(and(eq(pollBallots.weekId, week.id), eq(pollBallots.voterToken, token)))
        .limit(1);
      votedOptionId = ballots[0]?.optionId ?? null;
    }

    const closesAt =
      week.closesAt instanceof Date ? week.closesAt : new Date(String(week.closesAt));
    const viewOptions = options.map((option) => ({
      id: option.id,
      title: option.title,
      challenge: option.challenge,
      blurb: option.blurb,
      votes: Number(option.voteCount),
    }));

    return {
      weekId: week.id,
      closesAt: closesAt.toISOString(),
      closesLabel: formatClosesAt(closesAt),
      closed: isPollClosed(new Date(), closesAt),
      total: viewOptions.reduce((sum, option) => sum + option.votes, 0),
      votedOptionId,
      options: viewOptions,
    };
  } catch (err) {
    console.error("load poll failed:", err instanceof Error ? err.message : "error");
    return null;
  }
}

export type CastVoteResult =
  | { ok: true; alreadyVoted: boolean; poll: VoteSnapshot }
  | { ok: false; status: number; error: string; poll: VoteSnapshot | null };

export async function castVote(optionId: string, token: string): Promise<CastVoteResult> {
  if (!/^[a-z0-9-]{1,64}$/.test(optionId)) {
    return {
      ok: false,
      status: 400,
      error: "That isn't one of this week's options.",
      poll: await loadCurrentPoll(token),
    };
  }

  const before = await loadCurrentPoll(token);
  if (!before) {
    return {
      ok: false,
      status: 503,
      error: "The ballot isn't available right now.",
      poll: null,
    };
  }
  if (before.closed) {
    return { ok: false, status: 403, error: "Voting is closed.", poll: before };
  }
  if (!before.options.some((option) => option.id === optionId)) {
    return {
      ok: false,
      status: 400,
      error: "That isn't one of this week's options.",
      poll: before,
    };
  }
  if (before.votedOptionId) {
    return { ok: true, alreadyVoted: true, poll: before };
  }

  try {
    const sql = getSql();
    const rows = (await sql`
      WITH open_week AS (
        SELECT id
        FROM poll_weeks
        WHERE id = ${before.weekId}
          AND closes_at >= now()
      ),
      known AS (
        SELECT id
        FROM poll_options
        WHERE id = ${optionId}
          AND week_id = ${before.weekId}
      ),
      inserted AS (
        INSERT INTO poll_ballots (week_id, option_id, voter_token)
        SELECT ${before.weekId}, ${optionId}, ${token}
        FROM open_week
        WHERE EXISTS (SELECT 1 FROM known)
        ON CONFLICT (week_id, voter_token) DO NOTHING
        RETURNING option_id
      ),
      bumped AS (
        UPDATE poll_options
        SET vote_count = vote_count + 1
        WHERE id = ${optionId}
          AND week_id = ${before.weekId}
          AND EXISTS (SELECT 1 FROM inserted)
        RETURNING vote_count
      )
      SELECT
        (SELECT option_id FROM inserted) AS inserted_option,
        (SELECT vote_count FROM bumped) AS bumped_count
    `) as { inserted_option: string | null }[];

    const didInsert = Boolean(rows[0]?.inserted_option);
    const poll = await loadCurrentPoll(token);
    if (!poll) {
      return {
        ok: false,
        status: 503,
        error: "The ballot isn't available right now.",
        poll: null,
      };
    }
    if (didInsert) return { ok: true, alreadyVoted: false, poll };
    if (poll.votedOptionId) return { ok: true, alreadyVoted: true, poll };
    if (poll.closed) return { ok: false, status: 403, error: "Voting is closed.", poll };
    return {
      ok: false,
      status: 400,
      error: "That isn't one of this week's options.",
      poll,
    };
  } catch (err) {
    console.error("cast vote failed:", err instanceof Error ? err.message : "error");
    return {
      ok: false,
      status: 500,
      error: "Could not save your vote. Try again.",
      poll: before,
    };
  }
}
