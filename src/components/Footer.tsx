import Image from "next/image";
import Link from "next/link";
import { AMAZON_ASSOCIATES_DISCLOSURE } from "@/lib/amazon";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-sage-200/70 bg-sage-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <Image
            src="/brand/wordmark-primary.png"
            alt="Weekend Experiments"
            width={243}
            height={24}
            className="h-6 w-auto"
          />
          <p className="mt-3 max-w-sm text-sm text-ink-muted">
            Parent-tested activities for ages 1–5 — keepers our kids loved that show how the world
            works.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href="/experiments" className="text-ink-muted hover:text-ink">
            Experiments
          </Link>
          <Link href="/about" className="text-ink-muted hover:text-ink">
            About
          </Link>
          <Link href="/about#contact" className="text-ink-muted hover:text-ink">
            Ask a question
          </Link>
          <Link href="/#stay-in-touch" className="text-ink-muted hover:text-ink">
            Mailing list
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
      <div className="border-t border-sage-200/60 px-4 py-4 text-center text-xs text-ink-muted sm:px-6">
        <p>© {new Date().getFullYear()} Weekend Experiments</p>
        <p className="mt-1">{AMAZON_ASSOCIATES_DISCLOSURE}</p>
      </div>
    </footer>
  );
}
