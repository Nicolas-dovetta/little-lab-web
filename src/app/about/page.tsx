import { listFaqs } from "@/lib/experiments";

export const metadata = {
  title: "About",
  description: "A dad running weekly experiments with kids ~1 and ~3. Winners only. Ideas free.",
};

export default async function AboutPage() {
  const faqs = await listFaqs();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">About</h1>
      <div className="mt-6 space-y-5 text-ink-muted">
        <p>
          Weekend Experiments is a small library of activity ideas for parents of kids ages 1–5.
          It started in our kitchen: almost every week with a ~1-year-old and a ~3-year-old.
        </p>
        <p>
          Most ideas never make the site. We keep <strong className="text-ink">winners</strong> —
          sessions that held attention and were worth the mess.
        </p>
        <p>
          <strong className="text-ink">Ideas stay free.</strong> Kits may come later as optional
          convenience — never required.
        </p>
      </div>

      <h2 id="faq" className="mt-14 font-display text-2xl font-semibold text-ink">
        FAQ
      </h2>
      <div className="mt-6 space-y-3">
        {faqs.map((f) => (
          <details
            key={f.id}
            className="group rounded-3xl border border-sage-200/80 bg-white p-5 shadow-sm open:shadow-md"
          >
            <summary className="cursor-pointer list-none font-semibold text-ink marker:content-none">
              <span className="flex items-start justify-between gap-4">
                {f.question}
                <span className="text-sage-600 transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{f.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
