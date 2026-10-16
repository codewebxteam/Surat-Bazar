"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Search, Truck, Package, CheckCircle2, MapPin, CreditCard, ShieldCheck, ShoppingBag, Phone, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");
  const [orderId, setOrderId] = useState(queryId || "");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  // Robust order search logic: ID match, SHR- prefix, or Phone Number
  const performTracking = async (idToTrack) => {
    const cleanId = idToTrack?.trim();
    if (!cleanId) return;
    
    setLoading(true);
    setError("");
    setOrder(null);
    
    try {
      let foundOrder = null;

      // 1. Direct document ID match
      const docSnap = await getDoc(doc(db, "orders", cleanId));
      if (docSnap.exists()) {
        foundOrder = { id: docSnap.id, ...docSnap.data() };
      }

      // 2. Uppercase formatted SHR- match
      if (!foundOrder) {
        let formattedId = cleanId.toUpperCase();
        if (!formattedId.startsWith("SHR-")) {
          formattedId = `SHR-${formattedId}`;
        }
        const formattedSnap = await getDoc(doc(db, "orders", formattedId));
        if (formattedSnap.exists()) {
          foundOrder = { id: formattedSnap.id, ...formattedSnap.data() };
        }
      }

      // 3. Query field `id`
      if (!foundOrder) {
        const qId = query(collection(db, "orders"), where("id", "==", cleanId), limit(1));
        const snapId = await getDocs(qId);
        if (!snapId.empty) {
          foundOrder = { id: snapId.docs[0].id, ...snapId.docs[0].data() };
        }
      }

      // 4. Query field `phone` (if customer enters their 10 digit mobile number)
      if (!foundOrder && cleanId.replace(/\D/g, "").length === 10) {
        const cleanPhone = cleanId.replace(/\D/g, "");
        const qPhone = query(collection(db, "orders"), where("phone", "==", cleanPhone), limit(1));
        const snapPhone = await getDocs(qPhone);
        if (!snapPhone.empty) {
          foundOrder = { id: snapPhone.docs[0].id, ...snapPhone.docs[0].data() };
        }
      }

      if (foundOrder && !foundOrder.isDeleted) {
        setOrder(foundOrder);
      } else {
        setError(`No active shipment found for "${cleanId}". Please check your Order ID or registered mobile number.`);
      }
    } catch (err) {
      console.error("Order tracking error:", err);
      setError("An error occurred while tracking your order. Please try again.");
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
            <div className="mt-8 bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 space-y-6">
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E7D2E]">Shipment Status</span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 mt-0.5">Order #{order.id}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Placed on {order.date || "Recent"}</p>
                </div>
                {(() => {
                  const s = (order.status || "").toLowerCase().trim();
                  let badgeClass = "bg-purple-100 text-purple-800 border-purple-200";
                  let label = order.status || "Order Placed & Confirmed";

                  if (s.includes("cancel")) {
                    badgeClass = "bg-rose-100 text-rose-800 border-rose-200";
                    label = "Cancelled";
                  } else if (s.includes("deliver")) {
                    badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
                    label = "Delivered to Doorstep";
                  } else if (s.includes("dispatch") || s.includes("transit")) {
                    badgeClass = "bg-sky-100 text-sky-800 border-sky-200";
                    label = "Dispatched & Express Transit";
                  } else if (s.includes("quality") || s.includes("packag") || s.includes("process")) {
                    badgeClass = "bg-amber-100 text-amber-800 border-amber-200";
                    label = "Quality Check & Artisan Packaging";
                  } else {
                    badgeClass = "bg-purple-100 text-purple-800 border-purple-200";
                    label = "Order Placed & Confirmed";
                  }

                  return (
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${badgeClass}`}>
                      {label}
                    </div>
                  );
                })()}
              </div>

              {/* Cancelled Banner if applicable */}
              {(order.status || "").toLowerCase().includes("cancel") && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-rose-200 text-rose-800 mt-0.5 font-bold text-[10px]">✕</div>
                  <div>
                    <h5 className="font-bold">Shipment Cancelled</h5>
                    <p className="text-[11px] text-rose-700 mt-0.5">
                      This order has been cancelled. For refunds or any inquiries, please contact our concierge concierge team.
                    </p>
                  </div>
                </div>
              )}

              {/* Tracking Timeline */}
              {(() => {
                const s = (order.status || "").toLowerCase().trim();
                const isCancelled = s.includes("cancel");
                let milestoneLevel = 1;
                if (s.includes("deliver")) milestoneLevel = 4;
                else if (s.includes("dispatch") || s.includes("transit")) milestoneLevel = 3;
                else if (s.includes("quality") || s.includes("packag") || s.includes("process")) milestoneLevel = 2;
                else milestoneLevel = 1;

                return (
                  <div className="py-2 border-b border-stone-100">
                    <h4 className="font-bold text-stone-800 uppercase tracking-wider text-xs mb-6">Delivery Milestone Progress</h4>
                    
                    <div className="relative pl-6 space-y-6 pb-2">
                      {/* Vertical Line */}
                      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-stone-200" />

                      {/* 1. Order Placed & Confirmed */}
                      <div className="relative">
                        <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full border-4 border-white z-10 flex items-center justify-center ${
                          isCancelled ? "bg-rose-500" : "bg-emerald-500"
                        }`}>
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-stone-900 text-sm">Order Placed & Confirmed</p>
                          <p className="text-xs text-stone-500">
                            {order.paymentStatus === "Paid" 
                              ? "Payment verified via Razorpay. Order confirmed." 
                              : "Order confirmed with Cash on Delivery."}
                          </p>
                        </div>
                      </div>

                      {/* 2. Quality Check & Artisan Packaging */}
                      <div className="relative">
                        <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full border-4 border-white z-10 flex items-center justify-center ${
                          !isCancelled && milestoneLevel >= 2 ? "bg-emerald-500" : "bg-stone-200"
                        }`}>
                          {!isCancelled && milestoneLevel >= 2 ? (
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-stone-400" />
                          )}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${!isCancelled && milestoneLevel >= 2 ? "text-stone-900" : "text-stone-400"}`}>
                            Quality Check & Artisan Packaging
                          </p>
                          <p className="text-xs text-stone-500">Inspecting silk mark authenticity and fall/pico finishing.</p>
                        </div>
                      </div>

                      {/* 3. Dispatched & Express Transit */}
                      <div className="relative">
                        <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full border-4 border-white z-10 flex items-center justify-center ${
                          !isCancelled && milestoneLevel >= 3 ? "bg-emerald-500" : "bg-stone-200"
                        }`}>
                          {!isCancelled && milestoneLevel >= 3 ? (
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          ) : (
                            <Truck className="w-3 h-3 text-stone-400" />
                          )}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${!isCancelled && milestoneLevel >= 3 ? "text-stone-900" : "text-stone-400"}`}>
                            Dispatched & Express Transit
                          </p>
                          <p className="text-xs text-stone-500">
                            {order.trackingId ? `AWB Tracking #${order.trackingId} • ` : ""}
                            Package handed over to our insured air courier partner.
                          </p>
                        </div>
                      </div>

                      {/* 4. Delivered to Doorstep */}
                      <div className="relative">
                        <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full border-4 border-white z-10 flex items-center justify-center ${
                          !isCancelled && milestoneLevel >= 4 ? "bg-emerald-500" : "bg-stone-200"
                        }`}>
                          {!isCancelled && milestoneLevel >= 4 ? (
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          ) : (
                            <Package className="w-3 h-3 text-stone-400" />
                          )}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${!isCancelled && milestoneLevel >= 4 ? "text-stone-900" : "text-stone-400"}`}>
                            Delivered to Doorstep
                          </p>
                          <p className="text-xs text-stone-500">Delivered directly to your shipping destination.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Shipping & Payment Meta Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                {/* Shipping info */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                  <span className="font-bold text-stone-900 uppercase flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    <span>Shipping Destination</span>
                  </span>
                  <p className="font-semibold text-stone-800">
                    {order.shippingDetails?.name || order.customer}
                  </p>
                  <p className="text-stone-600">
                    {order.shippingDetails?.address || order.address}
                    {order.shippingDetails?.city ? `, ${order.shippingDetails.city}` : ""}
                    {order.shippingDetails?.state ? `, ${order.shippingDetails.state}` : ""}
                    {order.shippingDetails?.pincode ? ` - ${order.shippingDetails.pincode}` : ""}
                  </p>
                  <p className="text-stone-500 font-mono">
                    Phone: +91 {order.shippingDetails?.mobile || order.phone}
                  </p>
                </div>

                {/* Payment info */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                  <span className="font-bold text-stone-900 uppercase flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                    <span>Payment Information</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {(order.paymentStatus === "Paid" || Boolean(order.razorpayPaymentId)) ? (
                      <>
                        <span className="font-semibold text-stone-900 text-xs">Online Payment (Razorpay)</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                          100% Paid & Verified
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-stone-900 text-xs">Cash on Delivery (COD)</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold border border-amber-300">
                          Pay on Doorstep Delivery
                        </span>
                      </>
                    )}
                  </div>
                  {order.razorpayPaymentId && (
                    <p className="text-[11px] text-stone-500 font-mono">
                      Ref: {order.razorpayPaymentId}
                    </p>
                  )}
                  <p className="text-sm font-bold text-[#3E0C15] pt-1">
                    Total Amount: ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="pt-2">
                <h4 className="font-bold text-stone-700 uppercase tracking-wider text-xs mb-3">Ordered Heirlooms ({order.items?.length || 0})</h4>
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-stone-50 border border-stone-200/60">
                      <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                        {item.image || (item.images && item.images[0]) ? (
                          <Image src={item.image || item.images[0]} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">No Img</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-stone-900 text-xs sm:text-sm truncate">{item.name}</h5>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {item.blouseOption ? `${item.blouseOption} • ` : ""}Qty: {item.qty || item.quantity || 1}
                        </p>
                      </div>
                      <div className="font-bold text-[#3E0C15] text-xs sm:text-sm whitespace-nowrap">
                        ₹{((item.price || 0) * (item.qty || item.quantity || 1)).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  href="/collections/sarees"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-stone-300 hover:border-stone-800 text-stone-800 text-xs font-bold uppercase tracking-wider transition-all text-center"
                >
                  Continue Shopping
                </Link>

                <Link
                  href={`/account/orders/${order.id}`}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all text-center ${
                    order.status?.toLowerCase() === "delivered"
                      ? "bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] shadow"
                      : "bg-amber-100 hover:bg-amber-200 text-[#3E0C15] border border-amber-300"
                  }`}
                >
                  {order.status?.toLowerCase() === "delivered"
                    ? "View & Print Official Invoice"
                    : "View Order (Invoice on Delivery)"}
                </Link>
              </div>

              {order.status?.toLowerCase() !== "delivered" && (
                <p className="text-center text-[11px] text-amber-800 font-medium pt-1">
                  ℹ️ Note: Official GST Tax Invoice will be unlocked for download once parcel is marked as &apos;Delivered&apos;.
                </p>
              )}

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
