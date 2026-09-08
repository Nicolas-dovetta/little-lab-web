import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/experiments", label: "Experiments" },
  { href: "/plan", label: "Plan" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-sage-200/60 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-3 sm:gap-2.5 sm:px-6 sm:py-4">
        <Link href="/" className="flex justify-center" aria-label="Weekend Experiments home">
          <Image
            src="/brand/wordmark-primary.png"
            alt="Weekend Experiments"
            width={486}
            height={48}
            className="h-7 w-auto max-w-[min(100%,20rem)] sm:h-8 sm:max-w-[24rem] md:h-9 md:max-w-none"
            priority
          />
        </Link>
        <nav className="flex items-center justify-center gap-1">
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
