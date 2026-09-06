import { listFaqs } from "@/lib/experiments";

export const metadata = {
  title: "About",
  description: "Engineer dad, two little kids, weekly experiments that actually get kept.",
};

export default async function AboutPage() {
  const faqs = await listFaqs();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">About</h1>
      <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-muted">
        <p>
          I&apos;m a 40-year-old former engineer with two wonderful kids (1 and 3). Life changes a
          lot — career, jobs, sleep, country, houses. Two things stay constant: curiosity, and a
          love for figuring out how stuff works.
        </p>
        <p>
          Need help with a door? Coming up. Bike broke? I can help. Wonder how a 2-stroke works?
          Let me tell you. But first — have you got ten minutes and a wipeable table? Haven&apos;t
          slept in three nights: a nightmare (not mine), a monster (also not mine), but the kid
          didn&apos;t sleep and neither did I. Anyway… want to pour colored water and watch it climb?
        </p>
        <p>
          So I started running tiny experiments for our weekends. Then I realized it would be a
          shame to keep the winners in a notes app.{" "}
          <strong className="text-ink">Weekend Experiments</strong> is that collection: honest,
          mood-matching activities for tired parents, engineers, fixers, thinkers, and anyone who
          needs a little wonder to get through Saturday morning.
        </p>
        <p>
          Most ideas never make the site. We keep <strong className="text-ink">winners</strong> —
          the ones that held attention and were worth the mess. Ideas stay free. Kits may come later
          as optional convenience — never required.
        </p>
        <p className="text-base">
          Merch and dad-gear live next door at{" "}
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
