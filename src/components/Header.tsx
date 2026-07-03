import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-medium tracking-[0.15em]">
          UNBLCK
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <a href="#what-we-do" className="transition hover:text-foreground">
            What we do
          </a>
          <a href="#insta-awards" className="transition hover:text-foreground">
            Insta Awards
          </a>
          <Link
            href="/apply"
            className="bg-foreground px-4 py-1.5 text-xs font-medium text-background transition hover:bg-accent-soft"
          >
            Apply
          </Link>
        </nav>
      </div>
    </header>
  );
}
