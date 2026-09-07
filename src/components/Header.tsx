import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/experiments", label: "Experiments" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-sage-200/60 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center" aria-label="Weekend Experiments home">
          <Image
            src="/brand/wordmark-primary.png"
            alt="Weekend Experiments"
            width={243}
            height={24}
            className="h-6 w-auto sm:h-7"
            priority
          />
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
