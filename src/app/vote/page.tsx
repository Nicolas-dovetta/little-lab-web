import { cookies } from "next/headers";
import { VotePanel } from "@/components/VotePanel";
import { loadCurrentPoll } from "@/lib/vote-store";
import { isVoteToken, VOTE_COOKIE } from "@/lib/vote";
import { canonicalMetadata } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = canonicalMetadata("/vote", {
  title: "Vote",
  description:
    "Pick the kitchen experiment we build next weekend. Six challenges, one vote, closes Saturday night.",
});

export default async function VotePage() {
  const jar = await cookies();
  const raw = jar.get(VOTE_COOKIE)?.value;
  const poll = await loadCurrentPoll(isVoteToken(raw) ? raw : null);

  if (!poll) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-sage-700">This week</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">Pick what we build next</h1>
        <p className="mt-4 text-lg text-ink-muted">
          The ballot isn&apos;t available right now. Try again in a minute.
        </p>
      </div>
    );
  }

  return <VotePanel initial={poll} />;
}
