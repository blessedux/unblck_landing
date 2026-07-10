"use client";

import { useState } from "react";
import Link from "next/link";
import { HubAccessApplicationsList } from "@/components/HubAccessApplicationsList";
import { AcceleratorApplicationsList } from "@/components/AcceleratorApplicationsList";
import { HubScheduleView } from "@/components/HubScheduleView";
import { NewsletterStatsCard } from "@/components/NewsletterStatsCard";

type Tab = "hub_access" | "accelerator" | "schedule";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("hub_access");

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
              href="/admin/event-requests"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Event Requests
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

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NewsletterStatsCard />
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-800">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("hub_access")}
              className={`pb-4 text-sm font-medium transition border-b-2 ${
                activeTab === "hub_access"
                  ? "border-white text-white"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              Hub Access Applications
            </button>
            <button
              onClick={() => setActiveTab("accelerator")}
              className={`pb-4 text-sm font-medium transition border-b-2 ${
                activeTab === "accelerator"
                  ? "border-white text-white"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              Accelerator Applications
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`pb-4 text-sm font-medium transition border-b-2 ${
                activeTab === "schedule"
                  ? "border-white text-white"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              Hub Schedule & Members
            </button>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "hub_access" && <HubAccessApplicationsList />}
        {activeTab === "accelerator" && <AcceleratorApplicationsList />}
        {activeTab === "schedule" && <HubScheduleView />}
      </div>
    </div>
  );
}
