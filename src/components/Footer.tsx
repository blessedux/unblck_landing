import { CursorDrivenParticleTypography } from "@/components/ui/cursor-driven-particles-typography";

const socialLinks = [
  {
    label: "X (Twitter)",
    href: "https://x.com/unblck_stgo",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/unblck",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.062 2.062 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/unblck_stgo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
        <circle cx="12" cy="12" r="4.25" />
        <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer id="contact" className="px-6 pb-12 pt-24">
      <div className="relative mx-auto max-w-3xl">
        <div className="absolute left-0 top-0 flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="text-muted transition-colors hover:text-foreground"
            >
              {link.icon}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center justify-end">
          <div className="relative h-24 w-full max-w-xs font-sans text-[#E1E0CC] sm:h-28 sm:max-w-sm">
            <CursorDrivenParticleTypography
              text="UNBLCK"
              fontSize={56}
              particleDensity={5}
              particleSize={1.25}
              dispersionStrength={18}
              color="#E1E0CC"
              className="min-h-0"
            />
          </div>
          <p className="mt-8 text-center text-xs text-muted">
            © {new Date().getFullYear()} UNBLCK · AI & blockchain accelerator · Santiago, Chile
          </p>
        </div>
      </div>
    </footer>
  );
}
