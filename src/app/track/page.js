"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Search, Truck, Package, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");
  const [orderId, setOrderId] = useState(queryId || "");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  // Extracted logic to allow programmatic calling
  const performTracking = async (idToTrack) => {
    if (!idToTrack.trim()) return;
    
    setLoading(true);
    setError("");
    setOrder(null);
    
    try {
      let formattedId = idToTrack.trim().toUpperCase();
      if (!formattedId.startsWith("SHR-")) {
        formattedId = `SHR-${formattedId}`;
      }
      
      const docRef = doc(db, "orders", formattedId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
      } else {
        const originalDocRef = doc(db, "orders", idToTrack.trim());
        const originalDocSnap = await getDoc(originalDocRef);
        
        if (originalDocSnap.exists()) {
          setOrder({ id: originalDocSnap.id, ...originalDocSnap.data() });
        } else {
          setError("We couldn't find an order with that ID. Please check and try again.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while tracking your order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      performTracking(queryId);
    }
  }, [queryId]);

  const handleTrack = async (e) => {
    e.preventDefault();
    performTracking(orderId);
  };

  return (
    <>
      <Navbar />

      <main className="w-full bg-[#FAF7F2] min-h-screen py-10 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#2D0A10]">
              Track Your Order
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto">
              Enter your Order ID (e.g., SHR-123456) to check the current status of your shipment.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Order ID (e.g., SHR-123456)"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#3E0C15]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-[#3E0C15] text-[#F7EFCF] font-bold rounded-xl hover:bg-[#571520] transition-colors disabled:opacity-70 whitespace-nowrap"
              >
                {loading ? "Tracking..." : "Track Order"}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
          </div>

          {order && (
            <div className="mt-8 bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <h3 className="font-serif font-bold text-xl text-stone-900">Order {order.id}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Placed on {order.date}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                  order.status === "Delivered" ? "bg-emerald-100 text-emerald-800" :
                  order.status === "Dispatched" ? "bg-sky-100 text-sky-800" :
                  "bg-amber-100 text-[#3E0C15]"
                }`}>
                  {order.status}
                </div>
              </div>

              <div className="py-6 border-b border-stone-100">
                <h4 className="font-bold text-stone-700 uppercase tracking-wider text-xs mb-4">Tracking Timeline</h4>
                
                <div className="relative pl-6 space-y-6">
                  {/* Vertical Line */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-stone-200"></div>

                  <div className="relative">
                    <div className="absolute -left-6 top-0 w-6 h-6 rounded-full border-4 border-white bg-emerald-500 z-10 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 text-sm">Order Placed</p>
                      <p className="text-xs text-stone-500">We have received your order.</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full border-4 border-white z-10 flex items-center justify-center ${
                      ["Processing", "Dispatched", "Delivered"].includes(order.status) ? "bg-emerald-500" : "bg-stone-200"
                    }`}>
                      {["Processing", "Dispatched", "Delivered"].includes(order.status) ? <CheckCircle2 className="w-3 h-3 text-white" /> : <div className="w-2 h-2 rounded-full bg-stone-400"></div>}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${["Processing", "Dispatched", "Delivered"].includes(order.status) ? "text-stone-900" : "text-stone-400"}`}>Processing</p>
                      <p className="text-xs text-stone-500">Your order is being prepared and packed.</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full border-4 border-white z-10 flex items-center justify-center ${
                      ["Dispatched", "Delivered"].includes(order.status) ? "bg-emerald-500" : "bg-stone-200"
                    }`}>
                      {["Dispatched", "Delivered"].includes(order.status) ? <CheckCircle2 className="w-3 h-3 text-white" /> : <Truck className="w-3 h-3 text-stone-400" />}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${["Dispatched", "Delivered"].includes(order.status) ? "text-stone-900" : "text-stone-400"}`}>Dispatched</p>
                      <p className="text-xs text-stone-500">Your order has been handed over to our delivery partner.</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full border-4 border-white z-10 flex items-center justify-center ${
                      order.status === "Delivered" ? "bg-emerald-500" : "bg-stone-200"
                    }`}>
                      {order.status === "Delivered" ? <CheckCircle2 className="w-3 h-3 text-white" /> : <Package className="w-3 h-3 text-stone-400" />}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${order.status === "Delivered" ? "text-stone-900" : "text-stone-400"}`}>Delivered</p>
                      <p className="text-xs text-stone-500">The package has been delivered to you.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <h4 className="font-bold text-stone-700 uppercase tracking-wider text-xs mb-4">Order Items</h4>
                <div className="space-y-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">No Img</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-stone-900 text-sm line-clamp-1">{item.name}</h5>
                        <p className="text-xs text-stone-500 mt-0.5">Qty: {item.qty || 1}</p>
                      </div>
                      <div className="font-bold text-[#3E0C15] text-sm whitespace-nowrap">
                        ₹{((item.price || 0) * (item.qty || 1)).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
