import Link from "next/link";

const links = [
  { href: "/experiments", label: "Experiments" },
  { href: "/about", label: "About" },
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
        <nav className="flex items-center gap-1">
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
      </div>
    </header>
  );
}
