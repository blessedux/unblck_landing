import Link from "next/link";

const fundingJourney = [
  {
    phase: "Build",
    title: "Get grant capital",
    description:
      "Start with non-dilutive funding to validate your idea and ship your first version. No equity taken, just capital to accelerate.",
  },
  {
    phase: "Launch",
    title: "Go to market",
    description:
      "Work with our team to refine positioning, build your go-to-market strategy, and prepare for your first users and customers.",
  },
  {
    phase: "Scale",
    title: "Demo day & next rounds",
    description:
      "Present to investors at our demo days. Get introductions to VCs, angels, and follow-on capital to scale your startup.",
  },
];

const instaAwardsSteps = [
  {
    step: "01",
    title: "Attend StellarBarrio",
    description:
      "Come to a StellarBarrio event at Tellus Blockchain Hub STGO. You'll receive an exclusive referral code to apply.",
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
          Funding & Founder Journey
        </p>
        <h2 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl">
          From first check to demo day.
        </h2>
        <p className="mt-4 max-w-xl text-muted leading-relaxed">
          UNBLCK supports founders through the entire journey — from grant
          capital to get you started, through go-to-market strategy, to demo day
          presentations for follow-on funding.
        </p>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {fundingJourney.map((item) => (
            <article key={item.phase} className="py-6">
              <p className="text-xs text-muted">{item.phase}</p>
              <h3 className="mt-1 text-sm font-medium">{item.title}</h3>
              <p className="mt-1 text-sm text-muted leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-24 border-t border-border pt-16">
          <div className="border border-border bg-white/[0.02] p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
                  Current Fund · Stellar SCF
                </p>
                <h3 className="mt-3 text-xl font-medium tracking-tight sm:text-2xl">
                  Stellar Insta Awards
                </h3>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-3xl font-medium">$5,000</span>
                <span className="text-sm text-muted">non-dilutive grant</span>
              </div>
              <p className="text-sm text-muted leading-relaxed max-w-2xl">
                No equity taken, no ownership stake — just capital and
                acceleration to push your Stellar startup from prototype to market.
              </p>
            </div>

            <ul className="mb-8 flex flex-wrap gap-2 text-sm text-muted">
              <li className="border border-border px-3 py-1.5">No equity taken</li>
              <li className="border border-border px-3 py-1.5">Demo day pipeline</li>
              <li className="border border-border px-3 py-1.5">
                StellarBarrio exclusive
              </li>
            </ul>

            <div className="mb-8">
              <h4 className="text-sm font-medium mb-4">How to apply</h4>
              <div className="space-y-4">
                {instaAwardsSteps.map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <span className="text-xs text-muted font-medium min-w-[2rem]">
                      {item.step}
                    </span>
                    <div>
                      <h5 className="text-sm font-medium">{item.title}</h5>
                      <p className="mt-1 text-sm text-muted leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/insta-awards/apply"
              className="group inline-flex items-center gap-2 bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:gap-3 hover:bg-accent-soft"
            >
              Apply to fund
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
