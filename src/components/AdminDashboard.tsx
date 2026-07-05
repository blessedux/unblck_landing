"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminApplicationsList } from "@/components/AdminApplicationsList";
import { AdminBookingsCalendar } from "@/components/AdminBookingsCalendar";

type Tab = "applications" | "bookings";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("applications");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Link
              href="/admin/rooms"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Hub Rooms
            </Link>
            <Link
              href="/admin/tour"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Tour Locations
            </Link>
            <Link
              href="/admin/schedule"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Hub Schedule
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Back to home
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-800">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("applications")}
              className={`pb-4 text-sm font-medium transition border-b-2 ${
                activeTab === "applications"
                  ? "border-white text-white"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              UNBLCK Applications
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`pb-4 text-sm font-medium transition border-b-2 ${
                activeTab === "bookings"
                  ? "border-white text-white"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              Hub Scheduled Visitors
            </button>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "applications" && <AdminApplicationsList />}
        {activeTab === "bookings" && <AdminBookingsCalendar />}
      </div>
    </div>
  );
}
