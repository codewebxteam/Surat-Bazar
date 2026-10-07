"use client";

import { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export default function AdminLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#1F1815] flex">
      {/* Fixed Luxury Dark Admin Sidebar */}
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Admin Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Sticky Admin Header */}
        <AdminHeader setIsMobileOpen={setIsMobileOpen} />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
