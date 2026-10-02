import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import {
  formatClosesAt,
  hitRateLimit,
  isPollClosed,
  leadingOptionIds,
  POLL_CLOSES_AT_ISO,
  POLL_OPTIONS,
  POLL_SEED_TOTAL,
  POLL_VOTE_SEED,
  seededVoteCounts,
  splitSqlStatements,
  VOTE_RATE_LIMIT,
  votePercent,
} from "./vote";

const closesAt = new Date(POLL_CLOSES_AT_ISO);

test("starter votes are uneven, cover every option, and sum to 30", () => {
  const counts = seededVoteCounts();
  assert.deepEqual(counts, {
    "cartesian-diver": 6,
    "instant-ice": 4,
    "milk-fireworks": 8,
    "balloon-hovercraft": 7,
    "walking-water": 5,
  });
  assert.equal(
    Object.values(counts).reduce((sum, count) => sum + count, 0),
    POLL_SEED_TOTAL,
  );
  assert.equal(new Set(Object.values(counts)).size, POLL_OPTIONS.length);
  assert.equal(POLL_VOTE_SEED, 20261003);
});

test("voting stays open through 11:59:59 PM PT on Oct 3, 2026 and closes after", () => {
  assert.equal(formatClosesAt(closesAt), "Sat, Oct 3, 11:59 PM PDT");
  assert.equal(isPollClosed(closesAt, closesAt), false);
  assert.equal(isPollClosed(new Date("2026-10-04T06:59:58.000Z"), closesAt), false);
  assert.equal(isPollClosed(new Date("2026-10-04T07:00:00.000Z"), closesAt), true);
});

test("percentages and the leader come from the tallies", () => {
  assert.equal(votePercent(8, 30), 27);
  assert.equal(votePercent(0, 0), 0);
  const counts = seededVoteCounts();
  const leaders = leadingOptionIds(
    POLL_OPTIONS.map((option) => ({ id: option.id, votes: counts[option.id] ?? 0 })),
  );
  assert.deepEqual(leaders, ["milk-fireworks"]);
});

test("rate limit allows a short burst, then asks the next click to wait", () => {
  let hits: number[] = [];
  const now = 1_000_000;
  for (let i = 0; i < VOTE_RATE_LIMIT; i += 1) {
    const result = hitRateLimit(hits, now);
    assert.equal(result.allowed, true);
    hits = result.hits;
  }
  assert.equal(hitRateLimit(hits, now).allowed, false);
  assert.equal(hitRateLimit(hits, now + 10 * 60 * 1000).allowed, true);
});

test("vote migration SQL matches the seeded counts and the close timestamp", () => {
  const sql = readFileSync(join(process.cwd(), "scripts/migrate-vote.sql"), "utf8");
  const statements = splitSqlStatements(sql);
  const ballots = statements.find((statement) => statement.includes("INSERT INTO poll_ballots"));
  assert.ok(ballots);
  const counts = seededVoteCounts();
  for (const option of POLL_OPTIONS) {
    const mentions: number = ballots.split("'" + option.id + "'").length - 1;
    assert.equal(mentions, counts[option.id], option.id);
    assert.ok(sql.includes(option.challenge));
    assert.ok(sql.includes(option.blurb));
  }
  assert.match(sql, /2026-10-03 23:59:59 America\/Los_Angeles/);
  assert.equal(statements.filter((statement) => statement.includes("CREATE TABLE")).length, 3);
});
