"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminBookingsCalendar } from "@/components/AdminBookingsCalendar";

type MemberProfile = {
  auth_user_id: string;
  email: string;
  stellar_funded: boolean;
  passport_verified: boolean;
  created_at: string;
};

export function HubScheduleView() {
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/admin/members");
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const builders = members.filter((m) => !m.stellar_funded);
  const founders = members.filter((m) => m.stellar_funded);

  return (
    <div className="space-y-8">
      {/* Approved Members List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Approved Members</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border border-gray-800 bg-white/5 p-4">
            <p className="text-sm text-gray-400">Builders</p>
            <p className="text-2xl font-bold text-blue-400">{builders.length}</p>
            <p className="text-xs text-gray-500 mt-1">3 days/week access</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-white/5 p-4">
            <p className="text-sm text-gray-400">Founders</p>
            <p className="text-2xl font-bold text-purple-400">{founders.length}</p>
            <p className="text-xs text-gray-500 mt-1">Unlimited access</p>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading members...</p>
        ) : members.length === 0 ? (
          <p className="text-center text-gray-400 py-8 border border-gray-800 rounded-lg">
            No approved members yet
          </p>
        ) : (
          <div className="max-h-80 overflow-y-auto border border-gray-800 rounded-lg">
            <table className="w-full">
              <thead className="bg-white/5 sticky top-0">
                <tr className="text-left text-sm text-gray-400">
                  <th className="p-3">Email</th>
                  <th className="p-3">Tier</th>
                  <th className="p-3">Passport</th>
                  <th className="p-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {members.map((member) => (
                  <tr key={member.auth_user_id} className="hover:bg-white/5 transition">
                    <td className="p-3 text-sm text-white">{member.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          member.stellar_funded
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {member.stellar_funded ? "Founder" : "Builder"}
                      </span>
                    </td>
                    <td className="p-3">
                      {member.passport_verified ? (
                        <span className="text-green-400 text-sm">✓ Verified</span>
                      ) : (
                        <span className="text-gray-500 text-sm">Not verified</span>
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(member.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Calendar */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Scheduled Visitors</h2>
        <AdminBookingsCalendar />
      </div>
    </div>
  );
}
