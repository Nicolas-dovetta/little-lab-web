import Link from "next/link";

const links = [
  { href: "/experiments", label: "Experiments" },
  { href: "/kits", label: "Kits" },
  { href: "/merch", label: "Merch" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/newsletter", label: "Newsletter" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-sage-200/60 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sage-600 text-sm font-bold text-white shadow-sm transition group-hover:bg-sage-700">
            WE
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Weekend Experiments
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-ink-muted transition hover:bg-sage-100 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/experiments"
          className="rounded-full bg-sage-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sage-700 md:hidden"
        >
          Browse
        </Link>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-sage-100 px-4 py-2 md:hidden">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="shrink-0 rounded-full bg-sage-50 px-3 py-1 text-xs font-medium text-ink-muted"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
