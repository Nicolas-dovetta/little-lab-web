import { ContactForm } from "@/components/ContactForm";
import { listFaqs } from "@/lib/experiments";

export const metadata = {
  title: "About",
  description:
    "Engineer, former professor and former aerospace researcher — Saturday experiments so curious kids stay excited about how the world works.",
};

export default async function AboutPage() {
  const faqs = await listFaqs();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">About</h1>
      <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-muted">
        <p>
          I&apos;m an engineer, a former professor, and a former aerospace researcher. One of the
          things I love most these days is my kids asking &ldquo;why&rdquo; about the most random
          things. It gives me a free pass to get as nerdy as I want on so many topics. &ldquo;Papa,
          why is the moon round?&rdquo; Let me tell you. &ldquo;Papa, how do you make glass?&rdquo;
          How much time before school do we have…
        </p>
        <p>
          I started a Saturday-morning tradition with them: we do experiments. I come up with
          something random and nerdy — sometimes with both kids, sometimes just my oldest — and then
          we make a mess and learn stuff.
        </p>

        <p>
          At this age their brains are like sponges — full of questions and hungry to see how
          things work. That&apos;s what I want to give my kids: curiosity and excitement, weird
          stuff with real explanations, and the idea that understanding is built through
          experiments. Play, mess around, get excited — and keep it fun, because it is.
        </p>
        <p>
          Some of the inspiration also came from a science book I read as a kid —{" "}
          <a
            href="https://www.amazon.fr/M%C3%A9ga-exp%C3%A9riences-Collectif/dp/2092770640"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sage-800 underline-offset-2 hover:underline"
          >
            Méga expériences
          </a>{" "}
          — the kind that made messy kitchen science and endless &ldquo;why&rdquo; questions feel
          completely normal.
        </p>
        <p>
          <strong className="text-ink">Weekend Experiments</strong> started as a notebook for me,
          then became an online folder, and now it&apos;s here so any parent with curious kids can
          run weekend experiments and make their kitchen extra messy while sharing surprising things
          about the world.
        </p>

        <p>
          There&apos;s also a{" "}
          <a href="/plan" className="font-semibold text-sage-800 underline-offset-2 hover:underline">
            Plan
          </a>
          . This is the plan I use for my kids. Steal what helps, ignore what doesn&apos;t. The most
          important thing is having fun with your kid, not following a curriculum from a random
          stranger (me). Also very WIP — I&apos;ll add a new one every week!
        </p>
        <p>
          I tried to put as much information as is helpful for you to do, manage, and explain the
          experiments. Reach out with comments, questions, or feedback — I love hearing from other
          parents, and I&apos;m happy to help if I can.
        </p>
        <p>
          The photos started as real, very messy home shots — I cleaned them up in post. Your
          experiment won&apos;t look this clean; mine didn&apos;t either. That&apos;s fine.
        </p>
        <p className="font-medium text-ink">Enjoy. And sorry for the mess.</p>
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
