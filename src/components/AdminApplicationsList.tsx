"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Application = {
  id: string;
  full_name: string;
  email: string;
  project_name: string;
  status: string;
  application_type: string;
  created_at: string;
};

export function AdminApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await fetch("/api/admin/applications");
      if (!response.ok) throw new Error("Failed to load applications");
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const pending = applications.filter((a) => a.status === "pending") || [];
  const approved = applications.filter((a) => a.status === "approved") || [];
  const rejected = applications.filter((a) => a.status === "rejected") || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-400">Loading applications...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="border border-gray-800 p-6">
          <p className="text-sm text-gray-400">Pending</p>
          <p className="mt-2 text-3xl font-bold">{pending.length}</p>
        </div>
        <div className="border border-gray-800 p-6">
          <p className="text-sm text-gray-400">Approved</p>
          <p className="mt-2 text-3xl font-bold">{approved.length}</p>
        </div>
        <div className="border border-gray-800 p-6">
          <p className="text-sm text-gray-400">Rejected</p>
          <p className="mt-2 text-3xl font-bold">{rejected.length}</p>
        </div>
      </div>

      <div className="border border-gray-800">
        <div className="border-b border-gray-800 p-4">
          <h2 className="font-semibold">All Applications</h2>
        </div>

        {applications && applications.length > 0 ? (
          <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
            {applications.map((app) => (
              <Link
                key={app.id}
                href={`/admin/applications/${app.id}`}
                className="block p-4 hover:bg-white/5 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{app.full_name}</p>
                    <p className="text-sm text-gray-400">{app.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {app.project_name}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium ${
                        app.application_type === "accelerator"
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {app.application_type === "accelerator" ? "Accelerator" : "Hub Access"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium ${
                        app.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : app.status === "approved"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {app.status}
                    </span>
                    <p className="mt-2 text-xs text-gray-500">
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            No applications yet
          </div>
        )}
      </div>
    </div>
  );
}
