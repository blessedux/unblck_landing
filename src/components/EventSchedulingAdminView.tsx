"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

type EventSchedulingRequest = {
  id: string;
  member_id: string;
  room_id: string;
  event_description: string;
  project_name: string;
  requested_date: string;
  requested_time: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  member_email: string | null;
  room_name: string | null;
};

export function EventSchedulingAdminView() {
  const [requests, setRequests] = useState<EventSchedulingRequest[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const query =
        filter === "all" ? "" : `?status=${encodeURIComponent(filter)}`;
      const res = await fetch(`/api/admin/event-scheduling${query}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setRequests(data.requests || []);
      setNotesDraft(
        Object.fromEntries(
          (data.requests || []).map((r: EventSchedulingRequest) => [
            r.id,
            r.admin_notes || "",
          ]),
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleUpdate = async (
    id: string,
    updates: { status?: string; admin_notes?: string },
  ) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/event-scheduling/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update failed");
      await loadRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  const tabs: { id: StatusFilter; label: string }[] = [
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
    { id: "all", label: "All" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`pb-3 text-sm font-medium transition border-b-2 ${
              filter === tab.id
                ? "border-white text-white"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="rounded-lg border border-gray-800 py-8 text-center text-gray-400">
          No event scheduling requests
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const isExpanded = expandedId === req.id;
            const truncated =
              req.event_description.length > 80
                ? `${req.event_description.slice(0, 80)}…`
                : req.event_description;

            return (
              <div
                key={req.id}
                className="rounded-2xl border border-gray-800 bg-white/5 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          req.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : req.status === "approved"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {req.status}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-medium text-white">
                      {req.project_name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {req.member_email || req.member_id} ·{" "}
                      {req.room_name || "Room"}
                    </p>
                    <p className="mt-1 text-sm text-gray-300">
                      {req.requested_date} · {req.requested_time.slice(0, 5)}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : req.id)
                      }
                      className="mt-2 text-left text-sm text-gray-400 hover:text-white"
                    >
                      {isExpanded ? req.event_description : truncated}
                      {req.event_description.length > 80 && !isExpanded && (
                        <span className="ml-1 text-white/60">(ver más)</span>
                      )}
                    </button>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {req.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          disabled={savingId === req.id}
                          onClick={() =>
                            handleUpdate(req.id, { status: "approved" })
                          }
                          className="rounded-full bg-green-600 text-white hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={savingId === req.id}
                          onClick={() =>
                            handleUpdate(req.id, { status: "rejected" })
                          }
                          className="rounded-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-800 pt-4">
                  <label className="mb-2 block text-sm text-gray-400">
                    Admin notes
                  </label>
                  <textarea
                    value={notesDraft[req.id] ?? ""}
                    onChange={(e) =>
                      setNotesDraft((prev) => ({
                        ...prev,
                        [req.id]: e.target.value,
                      }))
                    }
                    rows={2}
                    className="w-full rounded-lg border border-gray-800 bg-black/40 px-3 py-2 text-sm text-white"
                    placeholder="Internal notes..."
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={savingId === req.id}
                    onClick={() =>
                      handleUpdate(req.id, {
                        admin_notes: notesDraft[req.id] ?? "",
                      })
                    }
                    className="mt-2 rounded-full border-white/20 text-white hover:bg-white/10"
                  >
                    {savingId === req.id ? "Saving..." : "Save notes"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
