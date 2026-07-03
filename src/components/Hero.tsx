import Link from "next/link";

export function Hero() {
  return (
    <section className="px-6 pb-24 pt-36">
      <div className="mx-auto max-w-3xl">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Santiago, Chile
        </p>
        <h1 className="text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
          A private club for founders building on blockchain.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          UNBLCK is a founder hub in Santiago — a place to work on your startup,
          get mentorship, and grow inside a community of builders shaping
          Chile&apos;s next generation of blockchain and AI companies.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/apply"
            className="bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-accent-soft"
          >
            Apply to join
          </Link>
          <a
            href="#what-we-do"
            className="border border-border px-5 py-2.5 text-sm font-medium text-muted transition hover:border-foreground hover:text-foreground"
          >
            What we do
          </a>
        </div>
      </div>
    </section>
  );
}
