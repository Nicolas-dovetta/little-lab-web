import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-sage-200/70 bg-sage-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg font-semibold text-ink">Weekend Experiments</p>
          <p className="mt-1 max-w-sm text-sm text-ink-muted">
            Parent-tested activities for ages 1–5 — keepers our kids loved that show how the world
            works. Kits may come later.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href="/experiments" className="text-ink-muted hover:text-ink">
            Experiments
          </Link>
          <Link href="/about" className="text-ink-muted hover:text-ink">
            About
          </Link>
          <Link href="/#stay-in-touch" className="text-ink-muted hover:text-ink">
            Mailing list
          </Link>
          <Link href="/kits" className="text-ink-muted hover:text-ink">
            Kits
          </Link>
          <a
            href="https://www.etsy.com/shop/Engineerdadcoffee"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-muted hover:text-ink"
          >
            Merch
          </a>
        </div>
      </div>
      <div className="border-t border-sage-200/60 py-4 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} Weekend Experiments
      </div>
    </footer>
  );
}
