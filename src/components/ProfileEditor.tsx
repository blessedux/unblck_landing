"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { AuthScreenShell } from "@/components/AuthScreenShell";
import { GoogleAvatar } from "@/components/GoogleAvatar";
import { LogoutButton } from "@/components/LogoutButton";
import { useLocale } from "@/contexts/LocaleContext";
import { startViewTransition } from "@/lib/nav/start-view-transition";
import { useRouter } from "next/navigation";

type ProfilePayload = {
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export function ProfileEditor() {
  const { t } = useLocale();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.status === 401) {
          startViewTransition(() => {
            router.push("/login?next=/profile");
          });
          return;
        }
        if (!res.ok) {
          throw new Error(t.profile.loadFailed);
        }
        const data = (await res.json()) as ProfilePayload;
        if (cancelled) return;
        setProfile(data);
        setDisplayName(data.displayName ?? "");
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t.profile.loadFailed);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, t.profile.loadFailed]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
      });
      const json = (await res.json()) as ProfilePayload & { error?: string };
      if (!res.ok) {
        throw new Error(json.error || t.profile.saveFailed);
      }
      setProfile(json);
      setDisplayName(json.displayName ?? "");
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.profile.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthScreenShell
      onBack={() => {
        startViewTransition(() => {
          router.back();
        });
      }}
    >
      <div className="mx-auto w-full max-w-md">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
          UNBLCK
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-gray-900">
          {t.profile.title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">{t.profile.subtitle}</p>

        {loading ? (
          <p className="mt-8 text-sm text-gray-500">{t.profile.loading}</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-100">
                {profile?.avatarUrl ? (
                  <GoogleAvatar src={profile.avatarUrl} />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-lg font-semibold text-gray-500">
                    {(displayName || profile?.email || "?")
                      .slice(0, 1)
                      .toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {displayName || t.profile.cardFallback}
                </p>
                <p className="truncate text-xs text-gray-500">{profile?.email}</p>
              </div>
            </div>

            <div>
              <label
                htmlFor="profile-display-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                {t.profile.displayNameLabel}
              </label>
              <input
                id="profile-display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={80}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t.profile.emailLabel}
              </label>
              <input
                value={profile?.email ?? ""}
                disabled
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500"
              />
              <p className="mt-2 text-xs text-gray-400">
                {t.profile.emailHint}
              </p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {saved && (
              <p className="text-sm text-emerald-600">{t.profile.saved}</p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-900 disabled:opacity-50"
              >
                {saving ? t.profile.saving : t.profile.save}
              </button>
              <Link
                href="/apply"
                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                {t.profile.backToApply}
              </Link>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <LogoutButton redirectTo="/login" />
              <p className="mt-2 text-xs text-gray-400">
                {t.profile.useAnotherAccount}
              </p>
            </div>
          </form>
        )}
      </div>
    </AuthScreenShell>
  );
}
