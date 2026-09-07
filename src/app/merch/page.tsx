import Link from "next/link";

export const metadata = {
  title: "Merch",
  description: "Weekend Experiments mug and shirt on Engineerdadcoffee.",
};

const items = [
  {
    name: "Weekend Experiments mug",
    price: "$14.99",
    href: "https://www.etsy.com/listing/4570456929",
    note: "Long wordmark banner",
  },
  {
    name: "Weekend Experiments shirt",
    price: "$27.99",
    href: "https://www.etsy.com/listing/4570456969",
    note: "Comfort Colors · light",
  },
];

export default function MerchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Merch</h1>
      <p className="mt-3 text-lg text-ink-muted">
        Sold next door at{" "}
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
      <ul className="mt-8 space-y-4">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-3xl border border-sage-200/80 bg-white p-5 shadow-sm transition hover:border-sage-300"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-xl font-semibold text-ink">{item.name}</h2>
                <span className="text-sm font-semibold text-sage-800">{item.price}</span>
              </div>
              <p className="mt-1 text-sm text-ink-muted">{item.note}</p>
              <p className="mt-3 text-sm font-semibold text-sage-700">View on Etsy →</p>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-ink-muted">
        <Link href="/experiments" className="font-semibold text-sage-700 hover:text-sage-800">
          ← Back to experiments
        </Link>
      </p>
    </div>
  );
}
