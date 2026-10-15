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
  X
} from "lucide-react";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map(doc => ({
          id: doc.id, // This will be our SHR-xxxxx or similar
          ...doc.data()
        }));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [printWarning, setPrintWarning] = useState(false);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Dispatched":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "Processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Pending":
        return "bg-purple-100 text-purple-800 border-purple-200";
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
          <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
            {orders.filter(o => o.status === "Pending" || o.status === "Processing").length} Orders to Ship
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-stone-400">
                    No orders found matching the filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-stone-900">{order.id}</div>
                      <div className="text-[11px] text-stone-400">{order.date}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{order.customer}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{order.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-[200px]">
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="truncate text-stone-700" title={it.name}>
                          {it.name} (x{it.qty})
                        </div>
                      ))}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-stone-400">{order.paymentMethod}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(order.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-4 border-b border-stone-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5832B] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Suratbazar Dispatch Slip
              </span>
              <h3 className="font-serif font-bold text-xl text-stone-900 mt-2">
                Order {selectedOrder.id}
              </h3>
              <p className="text-xs text-stone-500">Placed on {selectedOrder.date}</p>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Customer & Shipping */}
              <div>
                <h4 className="font-bold text-stone-700 uppercase tracking-wider mb-1">Customer Details</h4>
                <p className="font-bold text-stone-900 text-sm">{selectedOrder.customer}</p>
                <p className="text-stone-600">{selectedOrder.phone}</p>
                <p className="text-stone-600 mt-1 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>{selectedOrder.address}</span>
                </p>
              </div>

              {/* Items Ordered */}
              <div className="pt-2 border-t border-stone-100">
                <h4 className="font-bold text-stone-700 uppercase tracking-wider mb-2">Ordered Drapes</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-stone-50 p-2.5 rounded-xl">
                      <div>
                        <p className="font-bold text-stone-900">{it.name}</p>
                        <p className="text-[11px] text-stone-500">Quantity: {it.qty}</p>
                      </div>
                      <p className="font-bold text-stone-900">₹{(it.price || 0).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-stone-700">Payment Status</p>
                  <p className="text-stone-600 font-medium">{selectedOrder.paymentMethod}</p>
                  {selectedOrder.razorpayPaymentId && (
                    <p className="text-[10px] text-emerald-800 font-mono mt-0.5 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                      Rzp ID: {selectedOrder.razorpayPaymentId}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-stone-700">Grand Total</p>
                  <p className="text-base font-bold text-[#571520]">₹{selectedOrder.totalAmount?.toLocaleString("en-IN") || 0}</p>
                </div>
              </div>
            </div>

            {/* Invoice Print Warning if not delivered */}
            {printWarning && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start gap-2.5 animate-in fade-in">
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
                  if (selectedOrder.status?.toLowerCase() !== "delivered") {
                    setPrintWarning(true);
                  } else {
                    setPrintWarning(false);
                    window.print();
                  }
                }}
                className={`flex-1 py-2.5 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  selectedOrder.status?.toLowerCase() === "delivered"
                    ? "border-stone-300 hover:bg-stone-50 text-stone-800"
                    : "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                }`}
                title={selectedOrder.status?.toLowerCase() === "delivered" ? "Print invoice" : "Invoice requires Delivered status"}
              >
                <FileText className="w-4 h-4" />
                <span>{selectedOrder.status?.toLowerCase() === "delivered" ? "Print Invoice" : "Invoice (Delivery Pending)"}</span>
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
