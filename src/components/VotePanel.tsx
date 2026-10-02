"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { track } from "@vercel/analytics";
import {
  leadingOptionIds,
  votePercent,
  voteShare,
  VOTE_STORAGE_KEY,
  type VoteSnapshot,
} from "@/lib/vote";

type StoredPick = { weekId?: string; optionId?: string };

function readStoredPick(weekId: string): string | null {
  try {
    const raw = localStorage.getItem(VOTE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPick;
    if (parsed.weekId !== weekId || typeof parsed.optionId !== "string") return null;
    return parsed.optionId;
  } catch {
    return null;
  }
}

function writeStoredPick(weekId: string, optionId: string) {
  try {
    localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify({ weekId, optionId }));
  } catch {
    // Private mode and blocked storage still have the server cookie.
  }
}

function withOptimisticVote(snapshot: VoteSnapshot, optionId: string): VoteSnapshot {
  if (snapshot.votedOptionId || snapshot.closed) return snapshot;
  return {
    ...snapshot,
    total: snapshot.total + 1,
    options: snapshot.options.map((option) =>
      option.id === optionId ? { ...option, votes: option.votes + 1 } : option,
    ),
  };
}

function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function VotePanel({ initial }: { initial: VoteSnapshot }) {
  const [poll, setPoll] = useState(initial);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const voting = useRef(false);
  const storedPick = useSyncExternalStore(
    subscribeToStorage,
    () => readStoredPick(poll.weekId),
    () => null,
  );
  const storedOptionId =
    storedPick && poll.options.some((option) => option.id === storedPick) ? storedPick : null;
  const votedOptionId = poll.votedOptionId ?? storedOptionId;

  useEffect(() => {
    if (!poll.votedOptionId) return;
    writeStoredPick(poll.weekId, poll.votedOptionId);
  }, [poll.votedOptionId, poll.weekId]);

  const leaders = leadingOptionIds(poll.options);
  const voted = poll.options.find((option) => option.id === votedOptionId) ?? null;
  const locked = poll.closed || Boolean(votedOptionId);

  async function vote(optionId: string) {
    if (voting.current || locked) return;
    voting.current = true;
    setError("");
    const snapshot = poll;
    setPendingId(optionId);
    setPoll(withOptimisticVote(snapshot, optionId));

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });
      const data = (await res.json()) as {
        error?: string;
        alreadyVoted?: boolean;
        poll?: VoteSnapshot;
      };
      if (data.poll) setPoll(data.poll);
      if (!res.ok) {
        if (!data.poll) setPoll(snapshot);
        setError(data.error || "Could not save your vote. Try again.");
        return;
      }
      const picked = data.poll?.votedOptionId;
      if (picked) writeStoredPick(data.poll?.weekId ?? snapshot.weekId, picked);
      if (!data.alreadyVoted) track("vote", { option: optionId });
    } catch {
      setPoll(snapshot);
      setError("Network error — try again in a moment.");
    } finally {
      voting.current = false;
      setPendingId(null);
    }
  }

  return (
    <div>
      <section className="border-b border-sage-200/60 bg-gradient-to-b from-sage-50 to-cream">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-sage-700">This week</p>
          <h1 className="mt-3 text-balance font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Pick what we build next
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">
            Six kitchen challenges for a toddler or preschooler and a parent. The winner is what we
            build next weekend.
          </p>
          <p id="vote-deadline" className="mt-4 text-sm font-semibold text-sage-800">
            {poll.closed
              ? "Voting closed — we'll build the winner next."
              : `Vote closes Saturday night · ${poll.closesLabel}`}
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            One vote from this browser.
            {poll.total > 0 ? ` ${poll.total} ${poll.total === 1 ? "vote" : "votes"} so far.` : ""}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        {voted && !poll.closed && (
          <p
            role="status"
            aria-live="polite"
            className="mb-6 rounded-2xl border border-sage-200 bg-sage-50 px-4 py-3 text-sage-800"
          >
            You picked <span className="font-semibold text-ink">{voted.title}</span>. That&apos;s your
            vote.
          </p>
        )}
        {poll.closed && (
          <p
            role="status"
            className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950"
          >
            Voting closed — we&apos;ll build the winner next.
            {leaders.length === 1 && (
              <>
                {" "}
                It&apos;s{" "}
                <span className="font-semibold">
                  {poll.options.find((option) => option.id === leaders[0])?.title}
                </span>
                .
              </>
            )}
            {leaders.length > 1 && (
              <>
                {" "}
                Tie between{" "}
                <span className="font-semibold">
                  {leaders
                    .map((id) => poll.options.find((option) => option.id === id)?.title)
                    .filter(Boolean)
                    .join(" and ")}
                </span>
                .
              </>
            )}
          </p>
        )}
        {error && (
          <p role="alert" className="mb-6 text-sm text-red-700">
            {error}
          </p>
        )}

        <ul
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-describedby="vote-deadline"
          aria-label="This week's challenges"
        >
          {poll.options.map((option, index) => {
            const selected = option.id === votedOptionId || option.id === pendingId;
            const ahead = !poll.closed && leaders.length === 1 && leaders[0] === option.id;
            const winner = poll.closed && leaders.includes(option.id);
            const percent = votePercent(option.votes, poll.total);
            const width = voteShare(option.votes, poll.total);
            const busy = pendingId === option.id;

            return (
              <li key={option.id}>
                <article
                  className={`flex h-full flex-col rounded-3xl border bg-white p-5 shadow-sm transition ${
                    winner
                      ? "border-amber-300 ring-2 ring-amber-200"
                      : selected
                        ? "border-sage-600 ring-2 ring-sage-600/25"
                        : "border-sage-200/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-sage-700">
                      Challenge {index + 1}
                    </p>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {selected && (
                        <span className="rounded-full bg-sage-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                          Your pick
                        </span>
                      )}
                      {ahead && (
                        <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-semibold text-sage-800">
                          Ahead
                        </span>
                      )}
                      {winner && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>

                  <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-ink">
                    {option.title}
                  </h2>
                  <p className="mt-2 font-display text-lg font-medium leading-snug text-sage-800">
                    {option.challenge}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-pretty text-ink-muted">{option.blurb}</p>

                  <div className="mt-5">
                    <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs font-medium text-ink-muted">
                      <span>
                        {option.votes} {option.votes === 1 ? "vote" : "votes"}
                      </span>
                      <span>{percent}%</span>
                    </div>
                    <div
                      className="h-2.5 overflow-hidden rounded-full bg-sage-100"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={Math.max(poll.total, 1)}
                      aria-valuenow={option.votes}
                      aria-label={`${option.title}: ${option.votes} of ${poll.total} votes`}
                    >
                      <div
                        className={`h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none ${
                          winner ? "bg-amber-600" : "bg-sage-600"
                        }`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>

                  {!poll.closed && (
                    <button
                      type="button"
                      onClick={() => vote(option.id)}
                      disabled={locked || pendingId !== null}
                      aria-pressed={selected}
                      aria-label={selected ? `Your vote: ${option.title}` : `Vote for ${option.title}`}
                      className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-sage-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sage-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-700 disabled:cursor-default disabled:opacity-60 disabled:hover:bg-sage-600"
                    >
                      {busy ? "Voting…" : selected ? "Your vote" : "Vote"}
                    </button>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
