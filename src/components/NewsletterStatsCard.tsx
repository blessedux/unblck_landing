"use client";

import { useEffect, useState } from "react";

export function NewsletterStatsCard() {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/admin/newsletter/stats");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load stats");
        }
        if (!cancelled) {
          setCount(data.count ?? 0);
          setError(data.error ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load stats",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-lg border border-gray-800 bg-white/5 p-4">
      <p className="text-sm text-gray-400">Newsletter subscribers</p>
      {loading ? (
        <p className="mt-1 text-2xl font-bold text-gray-500">…</p>
      ) : error ? (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      ) : (
        <p className="mt-1 text-2xl font-bold text-emerald-400">
          {(count ?? 0).toLocaleString()}
        </p>
      )}
      <a
        href="https://buttondown.com/subscribers"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-xs text-gray-500 hover:text-white"
      >
        Open in Buttondown →
      </a>
    </div>
  );
}
