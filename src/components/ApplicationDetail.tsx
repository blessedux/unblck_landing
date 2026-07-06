"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ApplicationDetailProps = {
  application: {
    id: string;
    full_name: string;
    email: string;
    project_name: string;
    project_link: string | null;
    build_description: string;
    location: string;
    stage: string;
    motivation: string;
    passport_address: string;
    status: string;
    reviewer_notes: string | null;
    passport_verified: boolean;
    stellar_funded: boolean;
    created_at: string;
  };
};

export function ApplicationDetail({ application }: ApplicationDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.reviewer_notes || "");
  const [passportVerified, setPassportVerified] = useState(
    application.passport_verified
  );
  const [stellarFunded, setStellarFunded] = useState(
    application.stellar_funded
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (newStatus?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus || status,
          reviewer_notes: notes,
          passport_verified: passportVerified,
          stellar_funded: stellarFunded,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Update failed");
      }

      if (newStatus) {
        setStatus(newStatus);
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Full Name
          </label>
          <p className="text-white">{application.full_name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Email
          </label>
          <p className="text-white">{application.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Project Name
          </label>
          <p className="text-white">{application.project_name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Project Link
          </label>
          {application.project_link ? (
            <a
              href={application.project_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
              {application.project_link}
            </a>
          ) : (
            <p className="text-gray-500">Not provided</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            What are they building?
          </label>
          <p className="text-white whitespace-pre-wrap">
            {application.build_description}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Location
          </label>
          <p className="text-white">{application.location}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Stage
          </label>
          <p className="text-white">{application.stage}</p>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Why UNBLCK?
          </label>
          <p className="text-white whitespace-pre-wrap">
            {application.motivation}
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Stellar Passport Address
          </label>
          <p className="text-white font-mono text-sm break-all">
            {application.passport_address}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8">
        <h2 className="text-xl font-semibold mb-4">Review</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Internal Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-gray-800 text-white placeholder-gray-500 focus:border-white focus:outline-none"
              placeholder="Add any internal notes..."
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={passportVerified}
                onChange={(e) => setPassportVerified(e.target.checked)}
                className="h-5 w-5 cursor-pointer"
              />
              <span className="text-sm text-gray-300">Passport Verified</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={stellarFunded}
                onChange={(e) => setStellarFunded(e.target.checked)}
                className="h-5 w-5 cursor-pointer"
              />
              <span className="text-sm text-gray-300">Stellar Funded</span>
            </label>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => handleUpdate()}
              disabled={loading}
              className="px-6 py-2 rounded-full bg-white/10 text-white border border-gray-800 hover:bg-white/20 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Notes & Flags"}
            </button>

            {status === "pending" && (
              <>
                <button
                  onClick={() => handleUpdate("approved")}
                  disabled={loading}
                  className="px-6 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition disabled:opacity-50"
                >
                  {loading ? "Approving..." : "Approve"}
                </button>
                <button
                  onClick={() => handleUpdate("rejected")}
                  disabled={loading}
                  className="px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
                >
                  {loading ? "Rejecting..." : "Reject"}
                </button>
              </>
            )}
          </div>

          <div className="mt-4">
            <span
              className={`inline-block rounded-full px-4 py-2 text-sm font-medium ${
                status === "pending"
                  ? "bg-yellow-500/10 text-yellow-500"
                  : status === "approved"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
              }`}
            >
              Current Status: {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
