"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  Globe, 
  X,
  Check,
  ShoppingBag,
  UserPlus,
  Clock,
  Trash2,
  CheckCheck
} from "lucide-react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const STORAGE_KEY = "sb_admin_dismissed_notifications_v1";

function getMillis(val) {
  if (!val) return 0;
  if (typeof val.toMillis === "function") return val.toMillis();
  if (typeof val.toDate === "function") return val.toDate().getTime();
  if (typeof val.seconds === "number") return val.seconds * 1000;
  const parsed = Date.parse(val);
  return isNaN(parsed) ? 0 : parsed;
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return "Just now";
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export default function AdminHeader({ setIsMobileOpen }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [rawOrders, setRawOrders] = useState([]);
  const [rawUsers, setRawUsers] = useState([]);
  const [dismissedIds, setDismissedIds] = useState([]);
  const dropdownRef = useRef(null);

  // 1. Load dismissed notification IDs from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setDismissedIds(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not read dismissed notifications from localStorage:", e);
    }
  }, []);

  // 2. Real-time Firestore Listeners for Orders & User Registrations
  useEffect(() => {
    let unsubOrders = () => {};
    let unsubUsers = () => {};

    try {
      const ordersRef = collection(db, "orders");
      const qOrders = query(ordersRef, orderBy("createdAt", "desc"), limit(25));
      unsubOrders = onSnapshot(
        qOrders,
        (snapshot) => {
          const list = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((o) => !o.isDeleted);
          setRawOrders(list);
        },
        (err) => {
          console.warn("Orders ordered query failed, trying un-ordered snapshot:", err);
          unsubOrders = onSnapshot(ordersRef, (snapshot) => {
            const list = snapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }))
              .filter((o) => !o.isDeleted);
            setRawOrders(list);
          });
        }
      );
    } catch (err) {
      console.warn("Error setting up orders listener:", err);
    }

    try {
      const usersRef = collection(db, "users");
      const qUsers = query(usersRef, orderBy("createdAt", "desc"), limit(25));
      unsubUsers = onSnapshot(
        qUsers,
        (snapshot) => {
          const list = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((u) => u.role !== "admin");
          setRawUsers(list);
        },
        (err) => {
          console.warn("Users ordered query failed, trying un-ordered snapshot:", err);
          unsubUsers = onSnapshot(usersRef, (snapshot) => {
            const list = snapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }))
              .filter((u) => u.role !== "admin");
            setRawUsers(list);
          });
        }
      );
    } catch (err) {
      console.warn("Error setting up users listener:", err);
    }

    return () => {
      unsubOrders();
      unsubUsers();
    };
  }, []);

  // 3. Handle click-outside and Escape key to close the notification popup
  useEffect(() => {
    if (!showNotifications) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showNotifications]);

  // 4. Construct live notifications list
  const orderNotifications = rawOrders.map((order) => {
    const timeMs = getMillis(order.createdAt) || getMillis(order.date) || 0;
    const firstItem = Array.isArray(order.items) && order.items.length > 0 ? order.items[0] : null;
    const itemsCount = Array.isArray(order.items) ? order.items.length : 1;
    const itemsSnippet = firstItem 
      ? `${firstItem.name || 'Handloom Saree'}${itemsCount > 1 ? ` (+${itemsCount - 1} more)` : ''}`
      : 'Handcrafted Saree';
    const amountStr = Number(order.totalAmount || 0).toLocaleString('en-IN');
    const customerName = order.customer || order.shippingDetails?.name || 'Customer';

    return {
      id: `order_${order.id}`,
      type: "order",
      title: `New Order #${order.id || order.id?.slice?.(-6)?.toUpperCase() || 'SB'}`,
      desc: `${customerName} • ${itemsSnippet} (₹${amountStr})`,
      time: formatRelativeTime(timeMs),
      timestamp: timeMs,
      link: "/admin/orders"
    };
  });

  const userNotifications = rawUsers.map((user) => {
    const timeMs = getMillis(user.createdAt) || 0;
    const name = user.name || "New Patron";
    const contact = user.email || user.phone || "Store customer";

    return {
      id: `user_${user.id}`,
      type: "customer",
      title: "New Customer Registered",
      desc: `${name} (${contact})`,
      time: formatRelativeTime(timeMs),
      timestamp: timeMs,
      link: "/admin/customers"
    };
  });

  // Combine and sort newest first
  const allNotifications = [...orderNotifications, ...userNotifications];
  allNotifications.sort((a, b) => b.timestamp - a.timestamp);

  // Filter out any dismissed / deleted notifications
  const activeNotifications = allNotifications.filter((n) => !dismissedIds.includes(n.id));

  // Dismiss / Delete single notification
  const handleDismiss = (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const next = [...new Set([...dismissedIds, id])];
    setDismissedIds(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (_) {}
  };

  // Clear / Delete all notifications
  const handleClearAll = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const allIds = allNotifications.map((n) => n.id);
    const next = [...new Set([...dismissedIds, ...allIds])];
    setDismissedIds(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (_) {}
  };

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
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-stone-700 hover:bg-stone-200/60 transition-colors"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {activeNotifications.length > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#FAF7F2] shadow-sm animate-pulse">
                {activeNotifications.length > 9 ? "9+" : activeNotifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200/90 py-0 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
              
              {/* Header with Title, Count, Clear All, and (X) Close Button */}
              <div className="px-4 py-3 bg-gradient-to-r from-[#FAF7F2] to-amber-50/40 border-b border-stone-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-sm text-stone-900 tracking-wide">
                    Notifications
                  </h3>
                  {activeNotifications.length > 0 ? (
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-200">
                      {activeNotifications.length} Unread
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      All Caught Up
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {activeNotifications.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                      title="Clear All Notifications"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Clear all</span>
                    </button>
                  )}

                  {/* Close (X) Button */}
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-200/70 transition-colors ml-1"
                    aria-label="Close notifications box"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notification Items List */}
              <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto overscroll-contain">
                {activeNotifications.length === 0 ? (
                  <div className="py-10 px-4 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-800 mb-2.5">
                      <Bell className="w-5 h-5 text-amber-700 opacity-60" />
                    </div>
                    <p className="text-xs font-bold text-stone-800">No New Notifications</p>
                    <p className="text-[11px] text-stone-500 mt-1 max-w-xs mx-auto">
                      Real-time alerts for new orders and user registrations will appear here automatically.
                    </p>
                  </div>
                ) : (
                  activeNotifications.map((n) => (
                    <div 
                      key={n.id} 
                      className="group relative p-3 sm:p-3.5 hover:bg-amber-50/40 transition-colors flex items-start gap-2.5"
                    >
                      {/* Notification Icon Badge */}
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        n.type === "order" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80" 
                          : "bg-amber-50 text-amber-800 border border-amber-200/80"
                      }`}>
                        {n.type === "order" ? (
                          <ShoppingBag className="w-4 h-4" />
                        ) : (
                          <UserPlus className="w-4 h-4" />
                        )}
                      </div>

                      {/* Content Link */}
                      <Link
                        href={n.link}
                        onClick={() => setShowNotifications(false)}
                        className="flex-1 min-w-0 pr-1 group-hover:text-[#571520]"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-stone-900 group-hover:text-[#571520] transition-colors truncate">
                            {n.title}
                          </p>
                          <span className="text-[10px] text-stone-400 shrink-0 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {n.time}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5 line-clamp-2 leading-relaxed">
                          {n.desc}
                        </p>
                      </Link>

                      {/* OK / Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDismiss(n.id, e)}
                        className="shrink-0 self-center px-2 py-1 rounded-lg text-xs font-semibold bg-stone-100/90 hover:bg-emerald-50 active:bg-emerald-100 text-stone-600 hover:text-emerald-700 border border-stone-200 hover:border-emerald-300 transition-all flex items-center gap-1 shadow-2xs group/btn"
                        title="OK - Delete notification"
                        aria-label="Dismiss notification"
                      >
                        <Check className="w-3.5 h-3.5 text-stone-500 group-hover/btn:text-emerald-600 transition-colors" />
                        <span className="text-[11px] font-bold">OK</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer View Orders link */}
              <div className="px-4 py-2.5 bg-stone-50/80 border-t border-stone-100 text-center flex items-center justify-between">
                <Link 
                  href="/admin/orders" 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-[#571520] font-semibold hover:underline"
                >
                  All Orders →
                </Link>
                <Link 
                  href="/admin/customers" 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-[#C5832B] font-semibold hover:underline"
                >
                  All Customers →
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
