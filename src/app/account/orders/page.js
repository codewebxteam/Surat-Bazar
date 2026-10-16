"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ArrowLeft, ChevronRight, ExternalLink, Truck, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserOrders() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const fetched = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(d => !d.isDeleted);

        // Sort in memory by createdAt / date descending (newest first)
        fetched.sort((a, b) => {
          const timeA = a.createdAt?.seconds 
            ? a.createdAt.seconds * 1000 
            : a.createdAt?.toDate 
            ? a.createdAt.toDate().getTime() 
            : (new Date(a.date || 0).getTime() || 0);
          const timeB = b.createdAt?.seconds 
            ? b.createdAt.seconds * 1000 
            : b.createdAt?.toDate 
            ? b.createdAt.toDate().getTime() 
            : (new Date(b.date || 0).getTime() || 0);
          return timeB - timeA;
        });

        setOrders(fetched);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserOrders();
  }, [user]);


  return (
    <>
      <Navbar />

      <main className="w-full bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
            <Link href="/account" className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#3E0C15]">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Account Dashboard</span>
            </Link>
            <span className="text-xs text-[#9E7D2E] font-bold uppercase tracking-wider">My Orders</span>
          </div>

          <div className="mb-8">
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#2D0A10]">
              My Orders & Heirloom Drapes
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Track active shipments, view invoices, or re-order your cherished handcrafted weaves.
            </p>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12 text-stone-500">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-amber-900/10 p-8 sm:p-12 text-center shadow-sm">
                <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <h3 className="font-serif-luxury text-xl font-bold text-stone-900 mb-2">No Orders Found</h3>
                <p className="text-stone-500 text-sm mb-6">You haven't placed any orders with us yet.</p>
                <Link href="/collections" className="inline-flex px-6 py-2.5 bg-[#3E0C15] text-[#F7EFCF] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#571520] transition-colors">
                  Explore Collections
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const orderDateDisplay = order.date 
                  ? order.date 
                  : order.createdAt?.seconds 
                  ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) 
                  : order.createdAt?.toDate 
                  ? order.createdAt.toDate().toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) 
                  : "Recent";

                return (
                  <div key={order.id} className="bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-sm space-y-6">
                    
                    {/* Header info */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100 text-xs">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Order ID</span>
                        <strong className="font-mono text-sm text-[#3E0C15]">{order.id}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Placed On</span>
                        <span className="font-semibold text-stone-800">{orderDateDisplay}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Grand Total</span>
                        <strong className="text-sm font-bold text-stone-900">₹{(order.totalAmount || 0).toLocaleString("en-IN")}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Payment Mode</span>
                        {(order.paymentStatus === "Paid" || Boolean(order.razorpayPaymentId)) ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            <span>Online (Paid)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            <span>Cash on Delivery (COD)</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {(() => {
                          const s = (order.status || "").toLowerCase().trim();
                          let badgeClass = "bg-purple-100 text-purple-900 border border-purple-200";
                          let label = order.status || "Order Placed & Confirmed";
                          if (s.includes("cancel")) {
                            badgeClass = "bg-rose-100 text-rose-800 border border-rose-200";
                            label = "Cancelled";
                          } else if (s.includes("deliver")) {
                            badgeClass = "bg-emerald-100 text-emerald-800 border border-emerald-200";
                            label = "Delivered to Doorstep";
                          } else if (s.includes("dispatch") || s.includes("transit")) {
                            badgeClass = "bg-sky-100 text-sky-800 border border-sky-200";
                            label = "Dispatched & Express Transit";
                          } else if (s.includes("quality") || s.includes("packag") || s.includes("process")) {
                            badgeClass = "bg-amber-100 text-amber-900 border border-amber-200";
                            label = "Quality Check & Artisan Packaging";
                          } else {
                            badgeClass = "bg-purple-100 text-purple-900 border border-purple-200";
                            label = "Order Placed & Confirmed";
                          }
                          return (
                            <span className={`px-3.5 py-1 font-bold rounded-full text-xs ${badgeClass}`}>
                              {label}
                            </span>
                          );
                        })()}
                        <Link 
                          href={`/account/orders/${order.id}`} 
                          onClick={() => {
                            try {
                              sessionStorage.setItem("suratbazar_view_order", JSON.stringify(order));
                            } catch (e) {}
                          }}
                          className="px-4 py-1.5 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs font-bold transition-all shadow"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                              {item.image || (item.images && item.images[0]) ? (
                                <Image src={item.image || item.images[0]} alt={item.name} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">No Img</div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-serif-luxury text-base font-semibold text-stone-900">{item.name}</h3>
                              <p className="text-xs text-stone-500 mt-0.5">
                                {item.blouseOption ? `${item.blouseOption} • ` : item.fabric ? `${item.fabric} • ` : ""}Qty: {item.qty || item.quantity || 1}
                              </p>
                              <p className="text-xs font-bold text-[#3E0C15] mt-1">₹{(item.price || 0).toLocaleString("en-IN")}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
