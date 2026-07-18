"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/contexts/LocaleContext";

type ChannelLink = {
  id: string;
  channel: "telegram" | "whatsapp";
  channel_user_id: string;
  linked_at: string;
};

export function ChannelLinks() {
  const { t } = useLocale();
  const copy = t.memberHub.connect;
  const [links, setLinks] = useState<ChannelLink[]>([]);
  const [linkCode, setLinkCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    try {
      const res = await fetch("/api/member/channel-links");
      if (!res.ok) throw new Error("Failed to fetch links");
      const data = await res.json();
      setLinks(data.links);
    } catch (err) {
      console.error("Error fetching links:", err);
    }
  }

  async function generateCode() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/member/channel-links/code", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to generate code");
      const data = await res.json();
      setLinkCode(data.code);
      setExpiresAt(data.expires_at);
    } catch (err) {
      setError(copy.generateFailed);
      console.error("Error generating code:", err);
    } finally {
      setLoading(false);
    }
  }

  async function revokeLink(linkId: string) {
    if (!confirm(copy.disconnectConfirm)) {
      return;
    }

    try {
      const res = await fetch("/api/member/channel-links", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link_id: linkId }),
      });
      if (!res.ok) throw new Error("Failed to revoke link");
      await fetchLinks();
    } catch (err) {
      console.error("Error revoking link:", err);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  useEffect(() => {
    if (!expiresAt) return;

    function tick() {
      const remaining = Math.max(
        0,
        Math.floor((new Date(expiresAt!).getTime() - Date.now()) / 1000)
      );
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      setTimeRemaining(
        `${minutes}:${seconds.toString().padStart(2, "0")}`
      );
      if (remaining === 0) {
        setLinkCode(null);
        setExpiresAt(null);
      }
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="w-full max-w-md space-y-6">
      {linkCode ? (
        <div className="rounded-lg border border-black/10 bg-white p-4">
          <div className="mb-2 text-sm font-medium text-black">
            {copy.yourLinkCode}
          </div>
          <div className="mb-3 rounded bg-black/5 px-4 py-3 font-mono text-2xl tracking-wider text-black">
            {linkCode}
          </div>
          <div className="text-sm text-black/60">
            {copy.sendCodeHint}
            <br />
            {copy.expiresIn}{" "}
            <span className="font-medium">{timeRemaining}</span>
          </div>
        </div>
      ) : (
        <button
          onClick={generateCode}
          disabled={loading}
          className="rounded-lg border border-black bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/90 disabled:opacity-50"
        >
          {loading ? copy.generating : copy.generateCode}
        </button>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {links.length > 0 && (
        <div>
          <div className="mb-3 text-sm font-medium text-black">
            {copy.connectedChannels}
          </div>
          <div className="space-y-2">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-3"
              >
                <div>
                  <div className="text-sm font-medium capitalize text-black">
                    {link.channel}
                  </div>
                  <div className="text-xs text-black/60">
                    {copy.linkedOn.replace("{date}", formatDate(link.linked_at))}
                  </div>
                </div>
                <button
                  onClick={() => revokeLink(link.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  {copy.disconnect}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
