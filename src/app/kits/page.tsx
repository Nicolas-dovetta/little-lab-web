import { WaitlistForm } from "@/components/WaitlistForm";

export const metadata = {
  title: "Kits",
  description: "Little Lab kits are coming soon. Join the waitlist.",
};

export default function KitsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-sage-700">Coming soon</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Kits for the winners
          </h1>
          <p className="mt-4 text-ink-muted">
            We are designing optional kits that ship the materials for our tested favorites —
            starting with experiments like Density Layers. The store is not open yet.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-ink-muted">
            <li>• Ideas on the site stay free forever</li>
            <li>• Kits are optional convenience, not a paywall</li>
            <li>• Waitlist members hear first when preorders open</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-sage-200/80 bg-white p-7 shadow-sm">
          <h2 className="font-display text-xl font-semibold">Join the waitlist</h2>
          <p className="mt-2 mb-5 text-sm text-ink-muted">No spam — just a launch note.</p>
          <WaitlistForm />
        </div>
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {["Curated materials", "Parent-ready cards", "Mess-aware packing"].map((t) => (
          <div key={t} className="rounded-3xl border border-dashed border-sage-300 bg-sage-50/50 p-5 text-center">
            <p className="font-semibold text-sage-800">{t}</p>
            <p className="mt-1 text-xs text-ink-muted">Placeholder — store coming soon</p>
          </div>
        ))}
      </div>
    </div>
  );
}
