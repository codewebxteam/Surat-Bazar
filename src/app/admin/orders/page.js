"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
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
  RefreshCw
} from "lucide-react";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [printWarning, setPrintWarning] = useState(false);

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

      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort manually in case fallback was used
      fetchedOrders.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const q = (searchQuery || "").toLowerCase().trim();
    const orderId = (o.id || "").toLowerCase();
    const customer = (o.customer || o.shippingDetails?.name || "").toLowerCase();
    const phone = String(o.phone || o.shippingDetails?.mobile || "");
    const matchesSearch = !q || orderId.includes(q) || customer.includes(q) || phone.includes(q);
    const orderStatus = (o.status || "").toLowerCase();
    const matchesStatus = statusFilter === "all" || orderStatus === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders(orders.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const getStatusBadge = (status = "") => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "dispatched":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "processing":
      case "confirmed":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "pending":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-stone-100 text-stone-800 border-stone-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-amber-900/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Orders & Fulfillment</h1>
          <p className="text-xs text-stone-500 mt-1">
            Track dispatches, print invoices, and update shipping statuses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchOrders}
            title="Refresh Orders"
            className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <span className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
            {orders.filter(o => (o.status || "").toLowerCase() === "pending" || (o.status || "").toLowerCase() === "processing" || (o.status || "").toLowerCase() === "confirmed").length} Orders to Ship
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Customer name, Phone..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["all", "Pending", "Processing", "Dispatched", "Delivered"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter.toLowerCase() === st.toLowerCase()
                  ? "bg-[#571520] text-[#F3E5C8] shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {st === "all" ? "All Orders" : st}
            </button>
          ))}

          {(searchQuery.trim() !== "" || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 whitespace-nowrap transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Clear All
            </button>
          )}
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
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Status & Update</th>
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
                        <div className="font-bold text-stone-900">
                          ₹{total.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-stone-400">{order.paymentMethod || "Online"}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={order.status || "Pending"}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(order.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
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

              {/* Payment Info */}
              <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-stone-700">Payment Status</p>
                  <p className="text-stone-600 font-medium">{selectedOrder.paymentMethod || "Online (Razorpay)"}</p>
                  {selectedOrder.razorpayPaymentId && (
                    <p className="text-[10px] text-emerald-800 font-mono mt-0.5 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                      Rzp ID: {selectedOrder.razorpayPaymentId}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-stone-700">Grand Total</p>
                  <p className="text-base font-bold text-[#571520]">
                    ₹{(Number(selectedOrder.totalAmount) || 0).toLocaleString("en-IN")}
                  </p>
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
                    Official Tax Invoices can only be printed or downloaded after the order has been delivered to the patron. Current status is <strong className="uppercase underline">{selectedOrder.status}</strong>. Please update the order status to &quot;Delivered&quot; before printing the invoice.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-stone-100 flex gap-2">
              <button
                onClick={() => {
                  if ((selectedOrder.status || "").toLowerCase() !== "delivered") {
                    setPrintWarning(true);
                  } else {
                    setPrintWarning(false);
                    window.print();
                  }
                }}
                className={`flex-1 py-2.5 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  (selectedOrder.status || "").toLowerCase() === "delivered"
                    ? "border-stone-300 hover:bg-stone-50 text-stone-800"
                    : "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                }`}
                title={(selectedOrder.status || "").toLowerCase() === "delivered" ? "Print invoice" : "Invoice requires Delivered status"}
              >
                <FileText className="w-4 h-4" />
                <span>{(selectedOrder.status || "").toLowerCase() === "delivered" ? "Print Invoice" : "Invoice (Delivery Pending)"}</span>
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
    </div>
  );
}
