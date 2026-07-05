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
    <footer
      id="contact"
      className="relative z-30 mt-auto border-t border-white/10 bg-black px-6 py-10 sm:px-8 sm:py-12"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-left">
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="text-white transition-opacity hover:opacity-70"
                >
                  {link.icon}
                </a>
              ))}
            </div>
            <p className="mt-3 text-sm text-white/75">Triana 861, Providencia</p>
            <p className="mt-1 text-sm text-white/75">Santiago, Chile</p>
          </div>

          <div className="relative h-20 w-full max-w-[220px] font-sans text-[#E1E0CC] sm:ml-auto sm:h-24 sm:max-w-xs">
            <CursorDrivenParticleTypography
              text="UNBLCK"
              fontSize={52}
              particleDensity={5}
              particleSize={1.25}
              dispersionStrength={18}
              color="#E1E0CC"
              className="min-h-0"
            />
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-white/50">
          © {new Date().getFullYear()} UNBLCK · AI & blockchain accelerator
        </p>
      </div>
    </footer>
  );
}
