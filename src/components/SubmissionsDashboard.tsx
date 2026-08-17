"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLocale } from "@/contexts/LocaleContext";

type Submission = {
  id: string;
  application_type: string;
  project_name: string | null;
  status: string;
  created_at: string;
  full_name: string;
};

function typeLabel(type: string, locale: string) {
  if (type === "accelerator") {
    return locale === "es" ? "Accelerator" : "Accelerator";
  }
  if (type === "hub_access") {
    return locale === "es" ? "Hub access" : "Hub access";
  }
  if (type === "insta_awards") {
    return "Insta Awards";
  }
  return type;
}

function statusLabel(status: string, locale: string) {
  if (status === "pending") {
    return locale === "es" ? "En revisión" : "Under review";
  }
  if (status === "approved") {
    return locale === "es" ? "Aprobada" : "Approved";
  }
  if (status === "rejected") {
    return locale === "es" ? "Rechazada" : "Rejected";
  }
  return status;
}

function statusClass(status: string) {
  if (status === "approved") {
    return "border-emerald-500/40 text-emerald-300";
  }
  if (status === "rejected") {
    return "border-red-500/40 text-red-300";
  }
  return "border-border text-muted";
}

export function SubmissionsDashboard() {
  const router = useRouter();
  const { locale, t } = useLocale();
  const [rows, setRows] = useState<Submission[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title =
      locale === "es" ? "Tus postulaciones | UNBLCK" : "Your submissions | UNBLCK";
  }, [locale]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await fetch("/api/submissions");
      if (res.status === 401) {
        router.push("/login?next=/submissions");
        return;
      }
      if (!res.ok) {
        if (!cancelled) setError(t.form.submissionFailed);
        return;
      }
      const json = (await res.json()) as { submissions: Submission[] };
      if (!cancelled) setRows(json.submissions);
    })();
    return () => {
      cancelled = true;
    };
  }, [router, t.form.submissionFailed]);

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
          href="/founders"
          className="text-sm text-muted transition hover:text-foreground"
        >
          {t.form.goToFounders}
        </Link>
      </header>

      <main className="mx-auto max-w-2xl px-6 pb-24 pt-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          UNBLCK
        </p>
        <h1 className="mt-3 text-3xl font-medium">
          {locale === "es" ? "Tus postulaciones" : "Your submissions"}
        </h1>
        <p className="mt-2 text-muted">
          {locale === "es"
            ? "Seguimiento de tus aplicaciones al accelerator y al hub."
            : "Track your accelerator and hub applications."}
        </p>

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

        {!rows ? (
          <p className="mt-8 text-sm text-muted">…</p>
        ) : rows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border p-6">
            <p className="text-muted">
              {locale === "es"
                ? "Aún no tienes postulaciones."
                : "No submissions yet."}
            </p>
            <Link
              href="/accelerator/apply"
              className="mt-4 inline-block rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
            >
              {t.notFound.acceleratorApply}
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {rows.map((row) => (
              <li
                key={row.id}
                className="rounded-2xl border border-border bg-surface/40 px-5 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted">
                      {typeLabel(row.application_type, locale)}
                    </p>
                    <p className="mt-1 truncate font-medium">
                      {row.project_name || row.full_name}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {new Date(row.created_at).toLocaleDateString(
                        locale === "es" ? "es-CL" : "en-US",
                        { year: "numeric", month: "short", day: "numeric" },
                      )}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs ${statusClass(row.status)}`}
                  >
                    {statusLabel(row.status, locale)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          {!rows?.some((row) => row.application_type === "accelerator") && (
            <Link
              href="/accelerator/apply"
              className="rounded-full border border-border px-5 py-2.5 text-sm text-muted transition hover:border-foreground hover:text-foreground"
            >
              {t.notFound.acceleratorApply}
            </Link>
          )}
          <Link
            href="/founders"
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            {t.form.goToFounders}
          </Link>
        </div>
      </main>
    </div>
  );
}
