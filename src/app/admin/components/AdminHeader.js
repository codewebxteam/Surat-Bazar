"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  Sparkles, 
  Globe, 
  SlidersHorizontal,
  CheckCircle2,
  Database
} from "lucide-react";

export default function AdminHeader({ setIsMobileOpen }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: "New Order #SB-8924", time: "5 mins ago", desc: "Rani Gulabi Katan Silk (₹38,500)", unread: true },
    { id: 2, title: "Low Stock Warning", time: "25 mins ago", desc: "Emerald Georgette Saree (Only 2 left)", unread: true },
    { id: 3, title: "New Customer Registered", time: "2 hours ago", desc: "Pooja Sharma from Mumbai", unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-amber-900/10 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Breadcrumb / Search */}
      <div className="flex items-center gap-3 lg:gap-6 flex-1 max-w-xl">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="p-2 -ml-2 rounded-xl text-stone-700 hover:bg-stone-200/60 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Admin Search */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search sarees, orders, customers, SKU..."
            className="w-full bg-white/80 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 focus:border-[#C5832B] transition-all placeholder:text-stone-400 shadow-2xs"
          />
        </div>
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Firebase Sync Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System Online</span>
        </div>

        {/* Quick Add Saree CTA */}
        <Link
          href="/admin/products/new"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#571520] to-[#3A0D15] text-[#F3E5C8] hover:text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all border border-[#9B111E]/40"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Saree</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-stone-700 hover:bg-stone-200/60 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-600 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm text-stone-900">Notifications</h3>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                  2 Unread
                </span>
              </div>
              <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3.5 hover:bg-stone-50 transition-colors ${n.unread ? "bg-amber-50/40" : ""}`}>
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-xs font-bold text-stone-900">{n.title}</p>
                      <span className="text-[10px] text-stone-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 pt-2 border-t border-stone-100 text-center">
                <Link href="/admin/orders" className="text-xs text-[#571520] font-semibold hover:underline">
                  View All Orders & Alerts →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Live Store link */}
        <Link
          href="/"
          target="_blank"
          title="Open Customer Front"
          className="p-2 rounded-xl text-stone-700 hover:bg-stone-200/60 transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          <Globe className="w-4 h-4 text-[#C5832B]" />
          <span className="hidden md:inline">Storefront</span>
        </Link>
      </div>
    </header>
  );
}
