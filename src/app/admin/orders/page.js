"use client";

import { useState } from "react";
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
  Phone,
  MapPin,
  X
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: "SB-9842",
      customer: "Meera Singhania",
      phone: "+91 98201 45892",
      address: "B-402, Sea Green Apts, Worli, Mumbai - 400018",
      items: [
        { name: "Rani Gulabi Katan Banarasi Kadwa Saree", qty: 1, price: 38500 }
      ],
      totalAmount: 38500,
      paymentMethod: "Prepaid (Razorpay UPI)",
      status: "Processing",
      date: "02 Oct 2026, 02:40 PM"
    },
    {
      id: "SB-9841",
      customer: "Ananya Deshmukh",
      phone: "+91 97112 33419",
      address: "Plot 89, Jubilee Hills, Hyderabad - 500033",
      items: [
        { name: "Emerald Royale Scalloped Silk Georgette", qty: 1, price: 24999 }
      ],
      totalAmount: 24999,
      paymentMethod: "Prepaid (Credit Card)",
      status: "Dispatched",
      date: "02 Oct 2026, 11:15 AM"
    },
    {
      id: "SB-9840",
      customer: "Kavita Reddy",
      phone: "+91 94401 88321",
      address: "Flat 12A, Brigade Residency, Bangalore - 560001",
      items: [
        { name: "Heritage Crimson Kanjeevaram Silk", qty: 1, price: 42000 }
      ],
      totalAmount: 42000,
      paymentMethod: "Cash on Delivery",
      status: "Delivered",
      date: "01 Oct 2026, 04:10 PM"
    },
    {
      id: "SB-9839",
      customer: "Rituja Patil",
      phone: "+91 98810 54321",
      address: "45, Prabhat Road, Lane 9, Pune - 411004",
      items: [
        { name: "Pastel Lavender Tissue Organza Saree", qty: 1, price: 18750 }
      ],
      totalAmount: 18750,
      paymentMethod: "Prepaid (Net Banking)",
      status: "Pending",
      date: "01 Oct 2026, 09:20 PM"
    },
    {
      id: "SB-9838",
      customer: "Sunita Aggarwal",
      phone: "+91 99280 12345",
      address: "C-14, Civil Lines, Jaipur - 302006",
      items: [
        { name: "Royal Peacock Blue Paithani Silk", qty: 1, price: 36200 }
      ],
      totalAmount: 36200,
      paymentMethod: "Prepaid (UPI)",
      status: "Delivered",
      date: "29 Sep 2026, 01:00 PM"
    }
  ]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (orderId, newStatus) => {
    setOrders(orders.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
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
                      {order.items.map((it, idx) => (
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
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-stone-50 p-2.5 rounded-xl">
                      <div>
                        <p className="font-bold text-stone-900">{it.name}</p>
                        <p className="text-[11px] text-stone-500">Quantity: {it.qty}</p>
                      </div>
                      <p className="font-bold text-stone-900">₹{it.price.toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-stone-700">Payment Status</p>
                  <p className="text-stone-500">{selectedOrder.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-stone-700">Grand Total</p>
                  <p className="text-base font-bold text-[#571520]">₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 font-semibold text-xs text-stone-800 flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#571520] hover:bg-[#3A0D15] text-[#F3E5C8] font-semibold text-xs"
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
