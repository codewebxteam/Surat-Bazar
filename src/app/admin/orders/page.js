"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  ShoppingBag, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  FileText, 
  MapPin, 
  Phone, 
  X,
  Loader2,
  RefreshCw,
  PackageCheck,
  CreditCard,
  Banknote,
  ShieldCheck,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Milestone status constants matching the tracking page
export const ORDER_STATUS_MILESTONES = [
  "Order Placed & Confirmed",
  "Quality Check & Artisan Packaging",
  "Dispatched & Express Transit",
  "Delivered to Doorstep",
  "Cancelled"
];

// Helper to normalize any existing database status to milestone name
export const canonicalStatus = (status = "") => {
  const s = (status || "").toLowerCase().trim();
  if (s.includes("cancel")) return "Cancelled";
  if (s.includes("deliver")) return "Delivered to Doorstep";
  if (s.includes("dispatch") || s.includes("transit")) return "Dispatched & Express Transit";
  if (s.includes("quality") || s.includes("packag") || s.includes("process")) return "Quality Check & Artisan Packaging";
  return "Order Placed & Confirmed";
};

// Helper: Online will ONLY be displayed when payment is verified & completed
export const isOnlinePaid = (order) => {
  if (!order) return false;
  const payStatus = String(order.paymentStatus || "").toLowerCase();
  const hasRzpId = Boolean(order.razorpayPaymentId);
  return payStatus === "paid" || hasRzpId;
};

// Helper: Cash on Delivery (pending doorstep collection)
export const isCod = (order) => {
  if (!order) return false;
  if (isOnlinePaid(order)) return false;
  const payMethod = String(order.paymentMethod || "").toLowerCase();
  const payStatus = String(order.paymentStatus || "").toLowerCase();
  if (payMethod.includes("cash") || payMethod.includes("cod") || payStatus.includes("pending")) {
    return true;
  }
  return true;
};

export const getStatusBadgeStyle = (status = "") => {
  const s = (status || "").toLowerCase().trim();
  if (s.includes("cancel")) {
    return "bg-rose-100 text-rose-800 border-rose-300";
  }
  if (s.includes("deliver")) {
    return "bg-emerald-100 text-emerald-800 border-emerald-300";
  }
  if (s.includes("dispatch") || s.includes("transit")) {
    return "bg-sky-100 text-sky-800 border-sky-300";
  }
  if (s.includes("quality") || s.includes("packag") || s.includes("process")) {
    return "bg-amber-100 text-amber-800 border-amber-300";
  }
  return "bg-purple-100 text-purple-800 border-purple-300";
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all"); // "all" | "online" | "cod"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [printWarning, setPrintWarning] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null); // { type: 'single' | 'all', orderId?: string, customer?: string, count?: number }
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let snapshot;
      try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        snapshot = await getDocs(q);
      } catch (queryErr) {
        console.warn("Ordered query fallback:", queryErr);
        snapshot = await getDocs(collection(db, "orders"));
      }

      const fetchedOrders = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(o => !o.isDeleted);

      // Sort manually in case fallback was used
      fetchedOrders.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setOrders(fetchedOrders);
    } catch (error) {
      console.warn("Notice: Fetching orders from Firestore:", error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    setIsDeleting(true);
    try {
      try {
        await deleteDoc(doc(db, "orders", orderId));
      } catch (delErr) {
        console.warn("DeleteDoc direct error, falling back to soft delete:", delErr);
        await updateDoc(doc(db, "orders", orderId), {
          isDeleted: true,
          deletedAt: new Date().toISOString(),
          status: "Cancelled"
        });
      }
      setOrders(prev => prev.filter(o => o.id !== orderId));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
      setDeleteModal(null);
    } catch (err) {
      console.error("Failed to delete order:", err);
      alert("Failed to delete order: " + (err?.message || ""));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearAllOrders = async () => {
    if (orders.length === 0) return;
    setIsDeleting(true);
    try {
      for (const order of orders) {
        try {
          await deleteDoc(doc(db, "orders", order.id));
        } catch (delErr) {
          await updateDoc(doc(db, "orders", order.id), {
            isDeleted: true,
            deletedAt: new Date().toISOString(),
            status: "Cancelled"
          });
        }
      }
      setOrders([]);
      setSelectedOrder(null);
      setDeleteModal(null);
    } catch (err) {
      console.error("Failed to clear all orders:", err);
      alert("Failed to clear all orders: " + (err?.message || ""));
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = (searchQuery || "").toLowerCase().trim();
    const orderId = (o.id || "").toLowerCase();
    const customer = (o.customer || o.shippingDetails?.name || "").toLowerCase();
    const phone = String(o.phone || o.shippingDetails?.mobile || "");
    const matchesSearch = !q || orderId.includes(q) || customer.includes(q) || phone.includes(q);
    
    if (!matchesSearch) return false;

    // Filter by Payment Mode: Online (Paid) vs Cash on Delivery
    if (paymentFilter === "online" && !isOnlinePaid(o)) return false;
    if (paymentFilter === "cod" && !isCod(o)) return false;

    if (statusFilter === "all") return true;

    const normOrder = canonicalStatus(o.status);
    const matchesStatus = normOrder.toLowerCase() === statusFilter.toLowerCase();
    return matchesStatus;
  });

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      setOrders(orders.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please check your network or permissions.");
    }
  };

  const activeFulfillmentCount = orders.filter(o => {
    const s = (o.status || "").toLowerCase();
    return !s.includes("deliver") && !s.includes("cancel");
  }).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-amber-900/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Orders & Fulfillment</h1>
          <p className="text-xs text-stone-500 mt-1">
            Track dispatches, update delivery milestones, and issue tax invoices
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {orders.length > 0 && (
            <button
              type="button"
              onClick={() => setDeleteModal({ type: "all", count: orders.length })}
              className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Clear All Test Orders ({orders.length})</span>
            </button>
          )}
          <button
            type="button"
            onClick={fetchOrders}
            title="Refresh Orders"
            className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <span className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1.5">
            <PackageCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>{activeFulfillmentCount} Active Shipments</span>
          </span>
        </div>
      </div>

      {/* Search & Milestone Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-center gap-3 justify-between">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Customer name, Phone..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-[#571520] text-[#F3E5C8] shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              All Milestones ({orders.length})
            </button>

            {ORDER_STATUS_MILESTONES.map((milestone) => {
              const count = orders.filter(o => canonicalStatus(o.status).toLowerCase() === milestone.toLowerCase()).length;
              const isSelected = statusFilter.toLowerCase() === milestone.toLowerCase();
              return (
                <button
                  key={milestone}
                  onClick={() => setStatusFilter(milestone)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#571520] text-[#F3E5C8] shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  <span>{milestone}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? "bg-[#3E0C15] text-[#E8C574]" : "bg-stone-200 text-stone-700"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}

            {(searchQuery.trim() !== "" || statusFilter !== "all" || paymentFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setPaymentFilter("all");
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 whitespace-nowrap transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Payment Mode Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-stone-100 text-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-1">Filter Payment:</span>
          <button
            type="button"
            onClick={() => setPaymentFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              paymentFilter === "all"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            All Methods ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setPaymentFilter("online")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              paymentFilter === "online"
                ? "bg-emerald-800 text-emerald-50 shadow-xs ring-2 ring-emerald-600/30"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Online (Paid Only: {orders.filter(isOnlinePaid).length})</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentFilter("cod")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              paymentFilter === "cod"
                ? "bg-amber-800 text-amber-50 shadow-xs ring-2 ring-amber-600/30"
                : "bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            <span>Cash on Delivery (COD: {orders.filter(isCod).length})</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Saree Items</th>
                <th className="py-3.5 px-4">Amount & Payment Mode</th>
                <th className="py-3.5 px-4">Delivery Milestone (Update)</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-stone-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C5832B] mb-2" />
                    <span>Loading live orders from Firestore...</span>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-stone-400">
                    <ShoppingBag className="w-8 h-8 mx-auto text-stone-300 mb-2 stroke-1" />
                    <p className="font-semibold text-stone-600">No orders found matching the filter.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const custName = order.customer || order.shippingDetails?.name || "Patron";
                  const phoneNum = order.phone || order.shippingDetails?.mobile || "N/A";
                  const total = Number(order.totalAmount) || 0;
                  const orderDate = order.date || (order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("en-IN") : "Recent");
                  const currentMilestone = canonicalStatus(order.status);
                  const isPaidOnline = isOnlinePaid(order);
                  const isCashDelivery = isCod(order);

                  return (
                    <tr key={order.id} className="hover:bg-amber-50/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-stone-900">#{order.id}</div>
                        <div className="text-[11px] text-stone-400">{orderDate}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{custName}</div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <span>{phoneNum}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-[200px]">
                        {Array.isArray(order.items) && order.items.length > 0 ? (
                          order.items.map((it, idx) => (
                            <div key={idx} className="truncate text-stone-700" title={it.name}>
                              {it.name || "Saree"} (x{it.qty || 1})
                            </div>
                          ))
                        ) : (
                          <span className="text-stone-400 italic">No item details</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900 text-sm">
                          ₹{total.toLocaleString("en-IN")}
                        </div>
                        <div className="mt-1">
                          {isPaidOnline ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                              <span>Online (Paid)</span>
                            </span>
                          ) : isCashDelivery ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                              <span>Cash on Delivery (COD)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              <span>Payment Incomplete</span>
                            </span>
                          )}
                        </div>
                        {order.razorpayPaymentId && (
                          <div className="text-[10px] font-mono text-stone-400 mt-0.5 truncate max-w-[130px]" title={order.razorpayPaymentId}>
                            ID: {order.razorpayPaymentId}
                          </div>
                        )}
                      </td>

                      {/* Dropdown with Delivery Milestone Progress Options */}
                      <td className="py-3.5 px-4">
                        <select
                          value={currentMilestone}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none transition-all shadow-xs ${getStatusBadgeStyle(order.status)}`}
                        >
                          {ORDER_STATUS_MILESTONES.map((milestone) => (
                            <option key={milestone} value={milestone} className="bg-white text-stone-900 py-1">
                              {milestone}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteModal({ type: "single", orderId: order.id, customer: custName })}
                            title="Delete this order"
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-4 border-b border-stone-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5832B] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Suratbazar Dispatch Slip
              </span>
              <h3 className="font-serif font-bold text-xl text-stone-900 mt-2">
                Order #{selectedOrder.id}
              </h3>
              <p className="text-xs text-stone-500">
                Placed on {selectedOrder.date || (selectedOrder.createdAt?.seconds ? new Date(selectedOrder.createdAt.seconds * 1000).toLocaleString("en-IN") : "Recent")}
              </p>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Delivery Milestone Status in Details Modal */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Current Milestone</span>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyle(selectedOrder.status)}`}>
                    {canonicalStatus(selectedOrder.status)}
                  </span>
                </div>
                <div>
                  <select
                    value={canonicalStatus(selectedOrder.status)}
                    onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-800 cursor-pointer focus:outline-none"
                  >
                    {ORDER_STATUS_MILESTONES.map((milestone) => (
                      <option key={milestone} value={milestone}>
                        {milestone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer & Shipping */}
              <div>
                <h4 className="font-bold text-stone-700 uppercase tracking-wider mb-1">Customer Details</h4>
                <p className="font-bold text-stone-900 text-sm">
                  {selectedOrder.customer || selectedOrder.shippingDetails?.name || "Valued Patron"}
                </p>
                <p className="text-stone-600 flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{selectedOrder.phone || selectedOrder.shippingDetails?.mobile || "N/A"}</span>
                </p>
                <p className="text-stone-600 mt-1 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>{selectedOrder.address || selectedOrder.shippingDetails?.address || "Address on file"}</span>
                </p>
              </div>

              {/* Items Ordered */}
              <div className="pt-2 border-t border-stone-100">
                <h4 className="font-bold text-stone-700 uppercase tracking-wider mb-2">Ordered Drapes</h4>
                <div className="space-y-2">
                  {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        <div>
                          <p className="font-bold text-stone-900">{it.name || "Silk Saree"}</p>
                          <p className="text-[11px] text-stone-500">Quantity: {it.qty || 1} {it.blouseOption ? `• ${it.blouseOption}` : ""}</p>
                        </div>
                        <p className="font-bold text-stone-900">₹{(Number(it.price) || 0).toLocaleString("en-IN")}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-stone-400 italic">No item list available</p>
                  )}
                </div>
              </div>

              {/* Payment Mode & Verification Card */}
              <div className="pt-3 border-t border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-800">Payment Verification</h4>
                  {Number(selectedOrder.discount) > 0 && (
                    <span className="text-[11px] text-emerald-700 font-bold">
                      Coupon {selectedOrder.couponCode ? `(${selectedOrder.couponCode})` : ""}: -₹{(Number(selectedOrder.discount) || 0).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {isOnlinePaid(selectedOrder) ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Online Prepaid (Razorpay)</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900 uppercase">
                        PAID & VERIFIED
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      100% verified online payment. Funds collected and verified prior to order placement.
                    </p>
                    {selectedOrder.razorpayPaymentId && (
                      <div className="text-[11px] font-mono text-emerald-950 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                        <span className="font-sans font-bold text-emerald-900">Payment ID: </span>
                        {selectedOrder.razorpayPaymentId}
                      </div>
                    )}
                    {selectedOrder.razorpayOrderId && (
                      <div className="text-[11px] font-mono text-emerald-950 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                        <span className="font-sans font-bold text-emerald-900">Razorpay Order ID: </span>
                        {selectedOrder.razorpayOrderId}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Cash on Delivery (COD)</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
                        PAY ON DELIVERY
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      Collect <strong>₹{(Number(selectedOrder.totalAmount) || 0).toLocaleString("en-IN")}</strong> in cash or UPI QR from patron at doorstep delivery.
                    </p>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-bold text-stone-700 text-xs">Total Order Value:</span>
                  <span className="text-lg font-bold text-[#571520]">
                    ₹{(Number(selectedOrder.totalAmount) || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Invoice Print Warning if not delivered */}
            {printWarning && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start gap-2.5 animate-in fade-in my-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Tax Invoice Restricted:</span>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    Official Tax Invoices can only be printed or downloaded after the order has been delivered to the patron. Current status is <strong className="uppercase underline">{canonicalStatus(selectedOrder.status)}</strong>. Please update the order status to &quot;Delivered to Doorstep&quot; before printing the invoice.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ type: "single", orderId: selectedOrder.id, customer: selectedOrder.customer || selectedOrder.shippingDetails?.name || "Patron" })}
                className="py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Delete</span>
              </button>
              <button
                onClick={() => {
                  if (!(selectedOrder.status || "").toLowerCase().includes("deliver")) {
                    setPrintWarning(true);
                  } else {
                    setPrintWarning(false);
                    window.print();
                  }
                }}
                className={`flex-1 py-2.5 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  (selectedOrder.status || "").toLowerCase().includes("deliver")
                    ? "border-stone-300 hover:bg-stone-50 text-stone-800"
                    : "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                }`}
                title={(selectedOrder.status || "").toLowerCase().includes("deliver") ? "Print invoice" : "Invoice requires Delivered status"}
              >
                <FileText className="w-4 h-4" />
                <span>{(selectedOrder.status || "").toLowerCase().includes("deliver") ? "Print Invoice" : "Invoice (Delivery Pending)"}</span>
              </button>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setPrintWarning(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#571520] hover:bg-[#3A0D15] text-[#F3E5C8] font-semibold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  {deleteModal.type === "all" ? "Clear All Test Orders?" : "Delete Order?"}
                </h3>
                <p className="text-xs text-stone-500">
                  {deleteModal.type === "all" ? "Remove all test data from database" : `Order #${deleteModal.orderId}`}
                </p>
              </div>
            </div>

            <div className="py-4 text-xs text-stone-600 leading-relaxed">
              {deleteModal.type === "all" ? (
                <p>
                  Are you sure you want to permanently remove all <strong className="text-stone-900">{deleteModal.count} orders</strong> from the admin panel and database? This action cannot be undone.
                </p>
              ) : (
                <p>
                  Are you sure you want to remove order <strong className="text-stone-900">#{deleteModal.orderId}</strong> for patron <strong className="text-stone-900">{deleteModal.customer}</strong>?
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  if (deleteModal.type === "all") {
                    handleClearAllOrders();
                  } else {
                    handleDeleteOrder(deleteModal.orderId);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{deleteModal.type === "all" ? "Yes, Clear All Orders" : "Yes, Delete Order"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
