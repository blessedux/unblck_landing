import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Attend StellarBarrio",
    description:
      "Come to a StellarBarrio event at UNBLCK STGO. You'll receive an exclusive referral code to apply.",
  },
  {
    step: "02",
    title: "Submit your application",
    description:
      "Use your referral code to apply. Tell us about your Stellar build, on-chain use case, and what the grant unlocks.",
  },
  {
    step: "03",
    title: "Join the pipeline",
    description:
      "Selected teams receive the $5,000 grant, acceleration support, and a path to demo day.",
  },
];

export function InstaAwards() {
  return (
    <section id="insta-awards" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Insta Awards Fund · Stellar SCF
        </p>
        <h2 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl">
          $5,000 non-dilutive grant for Stellar builders.
        </h2>
        <p className="mt-4 max-w-xl text-muted leading-relaxed">
          Insta Awards is UNBLCK&apos;s inaugural funding program. No equity
          taken, no ownership stake — just capital and acceleration to push your
          startup from prototype to market.
        </p>

        <ul className="mt-8 flex flex-wrap gap-2 text-sm text-muted">
          <li className="border border-border px-3 py-1.5">$5,000 grant</li>
          <li className="border border-border px-3 py-1.5">No equity taken</li>
          <li className="border border-border px-3 py-1.5">Demo day pipeline</li>
          <li className="border border-border px-3 py-1.5">StellarBarrio exclusive</li>
        </ul>

        <div className="mt-16">
          <h3 className="text-sm font-medium">How to apply</h3>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {steps.map((item) => (
              <article key={item.step} className="py-6">
                <p className="text-xs text-muted">{item.step}</p>
                <h4 className="mt-1 text-sm font-medium">{item.title}</h4>
                <p className="mt-1 text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <Link
          href="/insta-awards/apply"
          className="mt-10 inline-block bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-accent-soft"
        >
          Apply to Insta Awards
        </Link>
      </div>
    </section>
  );
}
