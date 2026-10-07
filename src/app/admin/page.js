"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  AlertTriangle,
  Plus,
  Eye,
  CheckCircle,
  Truck,
  Sparkles,
  Layers
} from "lucide-react";
import AdminStatsCard from "./components/AdminStatsCard";
import { PRODUCTS } from "@/data/products";

export default function AdminDashboardPage() {
  const [recentOrders, setRecentOrders] = useState([
    {
      id: "SB-9842",
      customer: "Meera Singhania",
      city: "New Delhi",
      items: "Rani Gulabi Katan Banarasi Kadwa Saree",
      amount: "₹38,500",
      status: "Processing",
      payment: "Online (Prepaid)",
      date: "Today, 02:40 PM"
    },
    {
      id: "SB-9841",
      customer: "Ananya Deshmukh",
      city: "Mumbai",
      items: "Emerald Royale Scalloped Silk Georgette",
      amount: "₹24,999",
      status: "Dispatched",
      payment: "Online (Prepaid)",
      date: "Today, 11:15 AM"
    },
    {
      id: "SB-9840",
      customer: "Kavita Reddy",
      city: "Hyderabad",
      items: "Heritage Crimson Kanjeevaram Silk",
      amount: "₹42,000",
      status: "Delivered",
      payment: "COD",
      date: "Yesterday"
    },
    {
      id: "SB-9839",
      customer: "Rituja Patil",
      city: "Pune",
      items: "Pastel Lavender Tissue Organza Saree",
      amount: "₹18,750",
      status: "Pending",
      payment: "Online (Prepaid)",
      date: "Yesterday"
    },
    {
      id: "SB-9838",
      customer: "Sunita Aggarwal",
      city: "Jaipur",
      items: "Royal Peacock Blue Paithani Silk",
      amount: "₹36,200",
      status: "Delivered",
      payment: "Online (Prepaid)",
      date: "Oct 01, 2026"
    }
  ]);

  const statusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Dispatched":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "Processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-stone-100 text-stone-800 border-stone-200";
    }
  };

  const topSarees = PRODUCTS.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#2A170F] to-[#451C12] p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(#E8C574_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#E8C574] text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Suratbazar Silk Management Hub</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FAF7F2]">
            Namaste, Store Manager 👋
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-xl">
            You have <span className="text-[#E8C574] font-semibold">8 new orders</span> today and 3 sarees needing urgent restock in the Surat warehouse.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C5832B] to-[#9B111E] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-[#E8C574]/40"
          >
            <Plus className="w-4 h-4" />
            <span>Add Saree</span>
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-all border border-white/20 flex items-center gap-2 backdrop-blur-xs"
          >
            <span>View Orders</span>
            <ArrowUpRight className="w-4 h-4 text-[#E8C574]" />
          </Link>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AdminStatsCard
          title="Total Month Sales"
          value="₹14,82,450"
          change="18.4% vs last month"
          isPositive={true}
          icon={DollarSign}
          subtext="342 sarees sold"
          color="amber"
        />
        <AdminStatsCard
          title="Orders (This Week)"
          value="86 Orders"
          change="12% growth"
          isPositive={true}
          icon={ShoppingBag}
          subtext="8 pending dispatch"
          color="rose"
        />
        <AdminStatsCard
          title="Active Inventory"
          value={`${PRODUCTS.length} Designs`}
          change="4 new added"
          isPositive={true}
          icon={Package}
          subtext="3 low stock"
          color="emerald"
        />
        <AdminStatsCard
          title="Registered Patrons"
          value="1,420 Users"
          change="94 new this month"
          isPositive={true}
          icon={Users}
          subtext="74% repeat rate"
          color="blue"
        />
      </div>

      {/* Main Tables Grid: Recent Orders & Top Selling Sarees */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2 Cols: Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-amber-900/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                  Recent Orders
                </h2>
                <p className="text-xs text-stone-500">Live order feed from Suratbazar storefront</p>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs font-bold text-[#571520] hover:text-[#9B111E] flex items-center gap-1 hover:underline"
              >
                <span>View all ({recentOrders.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3 pl-2">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Item Details</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3.5 pl-2 font-mono font-bold text-stone-800">
                        {order.id}
                      </td>
                      <td className="py-3.5">
                        <div className="font-semibold text-stone-900">{order.customer}</div>
                        <div className="text-[11px] text-stone-400">{order.city}</div>
                      </td>
                      <td className="py-3.5 text-stone-700 max-w-[160px] truncate" title={order.items}>
                        {order.items}
                      </td>
                      <td className="py-3.5 font-semibold text-stone-900">
                        {order.amount}
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <Link
                          href="/admin/orders"
                          className="inline-flex items-center justify-center p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                          title="Manage Order"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Showing recent 5 transactions</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <CheckCircle className="w-4 h-4" /> Razorpay & Cash on Delivery active
            </span>
          </div>
        </div>

        {/* Right Col: Top Selling Sarees & Quick Warehouse Inventory */}
        <div className="space-y-6">
          {/* Top Selling Sarees */}
          <div className="bg-white rounded-3xl p-6 border border-amber-900/10 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Top Trending Sarees
              </h2>
              <Link href="/admin/products" className="text-xs text-[#571520] font-semibold hover:underline">
                Catalog
              </Link>
            </div>

            <div className="space-y-3.5">
              {topSarees.map((saree, i) => (
                <div key={saree.id} className="flex items-center gap-3 group">
                  <div className="w-12 h-14 rounded-xl overflow-hidden bg-stone-100 relative shrink-0 border border-stone-200">
                    <img
                      src={saree.images[0]}
                      alt={saree.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 truncate" title={saree.name}>
                      {saree.name}
                    </h4>
                    <p className="text-[11px] text-[#C5832B] font-semibold">
                      ₹{saree.price?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-stone-400">
                      {saree.fabricName} • Stock: <span className={saree.stock <= 5 ? "text-rose-600 font-bold" : "text-stone-600"}>{saree.stock || 8} pcs</span>
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-stone-400">
                    #{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Warning Card */}
          <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-3xl p-5 border border-rose-200 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-bold text-sm text-rose-950">Low Stock Alert</h3>
                <p className="text-xs text-rose-800 mt-0.5">
                  3 Sarees are below minimum safe stock limit (less than 3 pieces).
                </p>
                <Link
                  href="/admin/inventory"
                  className="inline-block mt-3 px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  Restock Inventory →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
