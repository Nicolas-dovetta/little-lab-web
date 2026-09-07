import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/experiments", label: "Experiments" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-sage-200/60 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
        <Link
          href="/"
          className="group flex min-w-0 shrink items-center"
          aria-label="Weekend Experiments home"
        >
          {/* Compact W·atom·E on phones; full wordmark from sm up */}
          <Image
            src="/brand/compact-horizontal.png"
            alt="Weekend Experiments"
            width={95}
            height={32}
            className="h-7 w-auto sm:hidden"
            priority
          />
          <Image
            src="/brand/wordmark-primary.png"
            alt="Weekend Experiments"
            width={243}
            height={24}
            className="hidden h-6 w-auto max-w-[min(100%,14rem)] sm:block md:h-7 md:max-w-none"
            priority
          />
        </Link>
        <nav className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-2 py-1.5 text-sm font-medium text-ink-muted transition hover:bg-sage-100 hover:text-ink sm:px-3"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
