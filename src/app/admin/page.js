"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  Layers,
  RefreshCw,
  Loader2
} from "lucide-react";
import AdminStatsCard from "./components/AdminStatsCard";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PRODUCTS } from "@/data/products";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [allOrdersCount, setAllOrdersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [patronsCount, setPatronsCount] = useState(0);
  const [topSarees, setTopSarees] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Orders
      const ordersSnap = await getDocs(
        query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(12))
      );
      const recentOrdersList = ordersSnap.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(o => !o.isDeleted)
        .slice(0, 6);
      setOrders(recentOrdersList);

      // Fetch all orders for aggregate stats
      const allOrdersSnap = await getDocs(collection(db, "orders"));
      const validOrders = allOrdersSnap.docs
        .map(doc => doc.data())
        .filter(d => !d.isDeleted);
      setAllOrdersCount(validOrders.length);

      let revenueSum = 0;
      let pendingCount = 0;
      validOrders.forEach(data => {
        if (!data.status || !data.status.toLowerCase().includes("cancel")) {
          revenueSum += (Number(data.totalAmount) || 0);
        }
        const status = (data.status || "").toLowerCase();
        if (!status.includes("deliver") && !status.includes("cancel")) {
          pendingCount += 1;
        }
      });
      setTotalRevenue(revenueSum);
      setPendingOrdersCount(pendingCount);

      // 2. Fetch Products
      const productsSnap = await getDocs(collection(db, "products"));
      const productsList = productsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // If Firestore products exist, use them; otherwise fallback to static catalog for initial display
      const activeProducts = productsList.length > 0 ? productsList : PRODUCTS;
      setTotalProductsCount(activeProducts.length);

      // Calculate low stock items (stock <= 3)
      const lowStock = activeProducts.filter(p => (Number(p.stock) || 0) <= 3);
      setLowStockProducts(lowStock);

      // Top sarees
      setTopSarees(activeProducts.slice(0, 5));

      // 3. Fetch Registered Patrons
      const usersSnap = await getDocs(collection(db, "users"));
      const customers = usersSnap.docs.filter(doc => doc.data().role !== "admin");
      setPatronsCount(customers.length);

    } catch (err) {
      console.warn("Notice: Dashboard data fetching error:", err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statusBadge = (status = "") => {
    const s = (status || "").toLowerCase().trim();
    if (s.includes("cancel")) return "bg-rose-100 text-rose-800 border-rose-300";
    if (s.includes("deliver")) return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (s.includes("dispatch") || s.includes("transit")) return "bg-sky-100 text-sky-800 border-sky-300";
    if (s.includes("quality") || s.includes("packag") || s.includes("process")) return "bg-amber-100 text-amber-800 border-amber-300";
    return "bg-purple-100 text-purple-800 border-purple-300";
  };

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
            You currently have <span className="text-[#E8C574] font-semibold">{pendingOrdersCount} orders</span> awaiting dispatch and <span className="text-rose-400 font-semibold">{lowStockProducts.length} sarees</span> in low stock.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            type="button"
            onClick={fetchDashboardData}
            title="Refresh Dashboard"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C5832B] to-[#9B111E] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-[#E8C574]/40 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Saree</span>
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-all border border-white/20 flex items-center gap-2 backdrop-blur-xs cursor-pointer"
          >
            <span>View Orders</span>
            <ArrowUpRight className="w-4 h-4 text-[#E8C574]" />
          </Link>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AdminStatsCard
          title="Total Store Revenue"
          value={loading ? "..." : `₹${totalRevenue.toLocaleString("en-IN")}`}
          change="Real-time gross"
          isPositive={true}
          icon={DollarSign}
          subtext={`${allOrdersCount} total orders recorded`}
          color="amber"
        />
        <AdminStatsCard
          title="Orders Pipeline"
          value={loading ? "..." : `${allOrdersCount} Orders`}
          change={`${pendingOrdersCount} need action`}
          isPositive={pendingOrdersCount === 0}
          icon={ShoppingBag}
          subtext={`${pendingOrdersCount} pending dispatch`}
          color="rose"
        />
        <AdminStatsCard
          title="Active Inventory"
          value={loading ? "..." : `${totalProductsCount} Designs`}
          change={`${lowStockProducts.length} low stock`}
          isPositive={lowStockProducts.length === 0}
          icon={Package}
          subtext="Surat warehouse catalog"
          color="emerald"
        />
        <AdminStatsCard
          title="Registered Patrons"
          value={loading ? "..." : `${patronsCount} Customers`}
          change="Verified accounts"
          isPositive={true}
          icon={Users}
          subtext="Direct boutique patrons"
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
                  Recent Orders Feed
                </h2>
                <p className="text-xs text-stone-500">Live order transactions from Suratbazar storefront</p>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs font-bold text-[#571520] hover:text-[#9B111E] flex items-center gap-1 hover:underline"
              >
                <span>Manage all ({allOrdersCount})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-16 text-center text-stone-400 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#C5832B]" />
                <span className="text-xs">Fetching live orders...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center text-stone-400">
                <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 mb-2 stroke-1" />
                <p className="text-xs font-medium text-stone-600">No orders placed yet</p>
                <p className="text-[11px] text-stone-400 mt-1">Orders from the storefront checkout will appear here in real time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider font-semibold">
                      <th className="pb-3 pl-2">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Item Details</th>
                      <th className="pb-3">Amount & Mode</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {orders.map((order) => {
                      const firstItem = order.items && order.items[0];
                      const itemSummary = firstItem 
                        ? `${firstItem.name || 'Silk Saree'}${order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}`
                        : 'Saree Order';

                      return (
                        <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                          <td className="py-3.5 pl-2 font-mono font-bold text-stone-800">
                            #{order.id}
                          </td>
                          <td className="py-3.5">
                            <div className="font-semibold text-stone-900">{order.customer || order.shippingDetails?.name || "Patron"}</div>
                            <div className="text-[11px] text-stone-400">{order.shippingDetails?.city || "India"}</div>
                          </td>
                          <td className="py-3.5 text-stone-700 max-w-[160px] truncate" title={itemSummary}>
                            {itemSummary}
                          </td>
                          <td className="py-3.5">
                            <div className="font-semibold text-stone-900">
                              ₹{(Number(order.totalAmount) || 0).toLocaleString("en-IN")}
                            </div>
                            <div className="mt-0.5">
                              {(order.paymentStatus === "Paid" || Boolean(order.razorpayPaymentId)) ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <span className="w-1 h-1 rounded-full bg-emerald-600" />
                                  <span>Online (Paid)</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                  <span className="w-1 h-1 rounded-full bg-amber-600" />
                                  <span>COD</span>
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusBadge(order.status)}`}>
                              {order.status || "Confirmed"}
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Showing recent {orders.length} transactions</span>
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
                Catalog ({totalProductsCount})
              </Link>
            </div>

            <div className="space-y-3.5">
              {topSarees.map((saree, i) => {
                const img = (saree.images && saree.images.length > 0) ? saree.images[0] : saree.image || "";
                return (
                  <div key={saree.id || i} className="flex items-center gap-3 group">
                    <div className="w-12 h-14 rounded-xl overflow-hidden bg-stone-100 relative shrink-0 border border-stone-200">
                      {img ? (
                        <img
                          src={img}
                          alt={saree.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-200 text-[9px] text-stone-500">No Img</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 truncate" title={saree.name}>
                        {saree.name}
                      </h4>
                      <p className="text-[11px] text-[#C5832B] font-semibold">
                        ₹{(Number(saree.price) || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {saree.fabricName || saree.fabric || "Pure Silk"} • Stock: <span className={(Number(saree.stock) || 0) <= 3 ? "text-rose-600 font-bold" : "text-stone-600"}>{saree.stock ?? 8} pcs</span>
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-400">
                      #{i + 1}
                    </span>
                  </div>
                );
              })}
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
                  {lowStockProducts.length > 0 
                    ? `${lowStockProducts.length} Sarees are below minimum safe stock limit (3 pieces or less).`
                    : "All sarees are comfortably in stock above threshold."}
                </p>
                <Link
                  href="/admin/products"
                  className="inline-block mt-3 px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Manage Inventory →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
