"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-900">
      <Sidebar />
      {/* Main content area — offset by sidebar width */}
      <div className="pl-[260px] transition-all duration-250">
        <TopBar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
