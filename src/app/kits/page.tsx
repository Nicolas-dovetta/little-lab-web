import { WaitlistForm } from "@/components/WaitlistForm";
import Link from "next/link";

export const metadata = {
  title: "Kits",
  description: "Weekend Experiments kits may come later. Join the waitlist.",
};

export default function KitsPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-sage-700">Coming later</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Kits</h1>
      <p className="mt-4 text-ink-muted">
        We may offer optional materials boxes for favorite experiments — handy if you want less
        hunting for supplies. Leave your email and we&apos;ll tell you if that happens.
      </p>
      <div className="mt-8 rounded-3xl border border-sage-200/80 bg-white p-6 shadow-sm">
        <WaitlistForm />
      </div>
      <p className="mt-6 text-center text-sm text-ink-muted">
        <Link href="/experiments" className="font-semibold text-sage-800 underline-offset-2 hover:underline">
          ← Back to experiments
        </Link>
      </p>
    </div>
  );
}
