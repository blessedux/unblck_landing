"use client";

import Link from "next/link";
import { useEffect } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLocale } from "@/contexts/LocaleContext";

const PLAYLISTS = [
  {
    id: "yc-startup-school",
    title: "Y Combinator — Startup School",
    description:
      "Core lectures on starting up, product, growth, and fundraising.",
    href: "https://www.youtube.com/playlist?list=PLQ-uHSnMahXM4JGfGVaLR0n-T9B_LFlTF",
    embed: "https://www.youtube.com/embed/videoseries?list=PLQ-uHSnMahXM4JGfGVaLR0n-T9B_LFlTF",
  },
  {
    id: "yc-how-to-start",
    title: "How to Start a Startup (Stanford / YC)",
    description: "Classic semester series with Sam Altman, PG, and operators.",
    href: "https://www.youtube.com/playlist?list=PL5q_lef6zVkaTY_cT1k7qFNF2TidHCe-1",
    embed: "https://www.youtube.com/embed/videoseries?list=PL5q_lef6zVkaTY_cT1k7qFNF2TidHCe-1",
  },
  {
    id: "yc-office-hours",
    title: "YC Office Hours / Advice",
    description: "Short, practical founder advice from the YC channel.",
    href: "https://www.youtube.com/@ycombinator",
    embed: null,
  },
] as const;

const READS = [
  {
    title: "Paul Graham essays",
    href: "https://www.paulgraham.com/articles.html",
  },
  {
    title: "YC Startup Library",
    href: "https://www.ycombinator.com/library",
  },
  {
    title: "Tellus Cooperative Hub",
    href: "https://telluscoop.org/hub",
  },
] as const;

export function FoundersSchoolPage() {
  const { locale, t } = useLocale();
  const notionUrl = process.env.NEXT_PUBLIC_FOUNDERS_NOTION_URL?.trim();

  useEffect(() => {
    document.title =
      locale === "es" ? "Founder school | UNBLCK" : "Founder school | UNBLCK";
  }, [locale]);

  return (
    <div className="min-h-dvh bg-black text-white">
      <LanguageToggle />
      <header className="flex items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-sm font-medium tracking-[0.15em] text-muted transition hover:text-foreground"
        >
          UNBLCK
        </Link>
        <Link
          href="/submissions"
          className="text-sm text-muted transition hover:text-foreground"
        >
          {t.form.goToSubmissions}
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Founder school
        </p>
        <h1 className="mt-3 text-3xl font-medium sm:text-4xl">
          {locale === "es"
            ? "Material útil mientras revisamos tu postulación"
            : "Useful material while we review your application"}
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          {locale === "es"
            ? "Playlists de YC, lecturas clásicas y el hub de Tellus — un atajo tipo founder school."
            : "YC playlists, classic essays, and the Tellus hub — a founder-school style shortcut."}
        </p>

        {notionUrl && (
          <section className="mt-10">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-medium">
                {locale === "es" ? "Notion" : "Notion"}
              </h2>
              <a
                href={notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted underline underline-offset-2 hover:text-foreground"
              >
                {locale === "es" ? "Abrir en Notion" : "Open in Notion"}
              </a>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-white">
              <iframe
                title="Founders Notion"
                src={notionUrl}
                className="h-[70vh] w-full"
              />
            </div>
          </section>
        )}

        <section className="mt-12 space-y-8">
          <h2 className="text-lg font-medium">
            {locale === "es" ? "YouTube / YC" : "YouTube / YC"}
          </h2>
          {PLAYLISTS.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-border"
            >
              <div className="border-b border-border px-5 py-4">
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm underline decoration-white/30 underline-offset-2 hover:text-foreground"
                >
                  {locale === "es" ? "Abrir playlist" : "Open playlist"}
                </a>
              </div>
              {item.embed && (
                <div className="aspect-video bg-black">
                  <iframe
                    title={item.title}
                    src={item.embed}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </article>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-medium">
            {locale === "es" ? "Lecturas" : "Reads"}
          </h2>
          <ul className="mt-4 space-y-2">
            {READS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted underline decoration-white/30 underline-offset-2 transition hover:text-foreground"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
