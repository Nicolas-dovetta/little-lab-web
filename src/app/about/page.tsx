import { listFaqs } from "@/lib/experiments";

export const metadata = {
  title: "About",
  description: "Experiments we ran with our kids — the ones they loved that show how the world works.",
};

export default async function AboutPage() {
  const faqs = await listFaqs();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">About</h1>
      <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-muted">
        <p>
          I&apos;m a former engineer with two kids (about 1 and 3). We explore the world together —
          I want fun things to show them, and ways for them to notice how stuff actually works.
        </p>
        <p>
          <strong className="text-ink">Weekend Experiments</strong> is the list of activities we
          ran at home that worked: the kids particularly enjoyed them, and each one demonstrates a
          physical phenomenon (or another clear bit of how the world behaves).
        </p>
        <p>
          Most ideas never make the cut. What you see here are the keepers. Kits may come later if
          they help families gather materials — join the mailing list if you want that news.
        </p>
        <p>
          A quick note on the photos: they started as real, very messy home shots. I cleaned them up
          in post so the page looks inviting. They look a little too perfect — that&apos;s the edit,
          not a studio set. Don&apos;t worry; the experiments themselves are the messy kitchen kind.
        </p>
        <p className="text-base">
          Merch lives next door at{" "}
          <a
            href="https://www.etsy.com/shop/Engineerdadcoffee"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sage-800 underline-offset-2 hover:underline"
          >
            Engineerdadcoffee
          </a>
          .
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
