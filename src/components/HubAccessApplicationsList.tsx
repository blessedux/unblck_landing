"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Application = {
  id: string;
  full_name: string;
  email: string;
  project_name: string;
  location: string;
  status: string;
  application_type: string;
  created_at: string;
};

export function HubAccessApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/admin/applications");
      if (res.ok) {
        const data = await res.json();
        // Filter for hub_access applications only
        const hubApps = data.applications.filter(
          (app: Application) => app.application_type === "hub_access"
        );
        setApplications(hubApps);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading applications...</div>;
  }

  const pendingCount = applications.filter((app) => app.status === "pending").length;
  const approvedCount = applications.filter((app) => app.status === "approved").length;
  const rejectedCount = applications.filter((app) => app.status === "rejected").length;

  return (
    <div>
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-800 bg-white/5 p-4">
          <p className="text-sm text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-white/5 p-4">
          <p className="text-sm text-gray-400">Approved</p>
          <p className="text-2xl font-bold text-green-500">{approvedCount}</p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-white/5 p-4">
          <p className="text-sm text-gray-400">Rejected</p>
          <p className="text-2xl font-bold text-red-500">{rejectedCount}</p>
        </div>
      </div>

      <div className="space-y-3">
        {applications.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No hub access applications yet</p>
        ) : (
          applications.map((app) => (
            <Link
              key={app.id}
              href={`/admin/applications/${app.id}`}
              className="block rounded-lg border border-gray-800 bg-white/5 p-4 hover:bg-white/10 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium text-white">{app.full_name}</p>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        app.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : app.status === "approved"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{app.email}</p>
                  <p className="text-sm text-gray-500">
                    {app.project_name} • {app.location}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  {new Date(app.created_at).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
