export const metadata = {
  title: "About",
  description: "A dad running weekly experiments with kids ~1 and ~3. Winners only. Ideas free.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">About Little Lab</h1>
      <div className="mt-6 space-y-5 text-ink-muted">
        <p>
          Little Lab is a small, honest library of experiment ideas for parents of kids ages 1–5.
          It started in our kitchen: a dad running something almost every week with a ~1-year-old
          and a ~3-year-old.
        </p>
        <p>
          Most ideas never make the site. We keep <strong className="text-ink">winners</strong> —
          sessions that actually held attention, taught something tangible, and were worth the mess.
          Status labels (idea, draft, tested, winner) stay visible so you know how battle-tested
          each card is.
        </p>
        <p>
          <strong className="text-ink">Experiment ideas stay free.</strong> Always. Kits and
          physical products may come later as an optional paid layer for families who want less
          hunting for materials. You will never need a kit to use Little Lab.
        </p>
        <p>
          If you try something and it bombs (or becomes a new favorite), that feedback shapes what
          we publish next. Thanks for being here early.
        </p>
      </div>
    </div>
  );
}
