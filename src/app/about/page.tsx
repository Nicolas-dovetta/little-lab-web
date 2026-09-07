import { ContactForm } from "@/components/ContactForm";
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
          I love going deep on the physics when I explain things to my 3-year-old. On each card I try
          to give you that same level of understanding — what&apos;s really happening, in plain
          words — not just the wow. If you have questions, use the email form below; I&apos;d happily
          dig in further.
        </p>
        <p>
          Most ideas never make the cut. What you see here are the keepers. Kits may come later if
          they help families gather materials — join the mailing list if you want that news.
        </p>
        <p>
          The photos started as real, very messy home shots — I cleaned them up in post. Your
          experiment won&apos;t look this clean; mine didn&apos;t either. That&apos;s fine.
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

      <section id="contact" className="mt-14 scroll-mt-24">
        <h2 className="font-display text-2xl font-semibold text-ink">Questions?</h2>
        <p className="mt-3 text-base leading-relaxed text-ink-muted">
          Curious about an age range, mess level, materials, or the physics behind a keeper? Ask
          here — I read every message and I&apos;m happy to go deeper.
        </p>
        <div className="mt-6">
          <ContactForm source="about" />
        </div>
      </section>

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
