import Link from "next/link";

const ETSY_SHOP = "https://www.etsy.com/shop/Engineerdadcoffee";

export const metadata = {
  title: "Merch",
  description: "Weekend Experiments merch via Engineerdadcoffee — logos, mugs, and more on Etsy.",
};

export default function MerchPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-sage-700">
            Merch
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Gear from Engineerdadcoffee
          </h1>
          <p className="mt-4 text-ink-muted">
            Stickers, logos, mugs, and dad-friendly merch live in the{" "}
            <span className="font-semibold text-ink">Engineerdadcoffee</span> Etsy
            shop — same family brand, separate from the free experiment ideas here.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-ink-muted">
            <li>• Experiment ideas on Weekend Experiments stay free</li>
            <li>• Merch is optional support / fun gear</li>
            <li>• Experiment kits (materials boxes) are still on a separate waitlist</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={ETSY_SHOP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sage-700"
            >
              Shop Engineerdadcoffee on Etsy
            </a>
            <Link
              href="/kits"
              className="inline-flex items-center justify-center rounded-full border border-sage-300 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-sage-50"
            >
              Experiment kits waitlist
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-sage-200/80 bg-white p-7 shadow-sm">
          <h2 className="font-display text-xl font-semibold">What you will find</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Logos and mugs fulfilled via Printify (and some Redbubble). Browse the
            live catalog on Etsy — inventory and designs update there.
          </p>
          <a
            href={ETSY_SHOP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block rounded-2xl border border-dashed border-sage-300 bg-sage-50/60 p-6 text-center transition hover:border-sage-400 hover:bg-sage-50"
          >
            <p className="font-semibold text-sage-800">etsy.com/shop/Engineerdadcoffee</p>
            <p className="mt-1 text-xs text-ink-muted">Opens in a new tab</p>
          </a>
        </div>
      </div>
    </div>
  );
}
