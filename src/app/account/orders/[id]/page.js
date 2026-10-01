"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Download,
  RotateCcw
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OrderDetailPage({ params }) {
  const unwrapped = use(params);
  const { id } = unwrapped;

  const order = {
    id: id || "SHR-98421",
    date: "28 September 2026",
    status: "In Transit with BlueDart Aviation Express",
    trackingId: "AWB-BLUEDART-849201948",
    estimatedDelivery: "Thursday, 04 October 2026",
    customer: {
      name: "Sanskriti Sharma",
      mobile: "+91 98765 43210",
      email: "sanskriti.sharma@example.com",
    },
    shippingAddress: {
      name: "Sanskriti Sharma",
      address: "B-402, Heritage Imperial Towers, Golf Course Road, Sector 54",
      city: "Gurgaon",
      state: "Haryana",
      pincode: "122002",
    },
    payment: {
      method: "Prepaid UPI (Google Pay)",
      transactionId: "UPI-TXN-98421948201",
      status: "Payment Confirmed & Verified",
    },
    items: [
      {
        id: "sh-002",
        name: "Rani Gulabi Katan Banarasi Kadwa Silk Saree",
        fabric: "Pure Katan Silk • Authentic Kadwa Weave",
        blouse: "Custom Bridal Stitch (+₹2,500)",
        image: "/products/banarasi.jpg",
        price: 38500,
        qty: 1,
        slug: "rani-gulabi-katan-banarasi-kadwa-saree"
      }
    ],
    summary: {
      subtotal: 38500,
      blouseStitching: 2500,
      couponDiscount: 3850,
      shipping: 0,
      gst: 1855,
      total: 39005,
    }
  };

  return (
    <>
      <Navbar />

      <main className="w-full bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Return Navigation */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
            <Link href="/account/orders" className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#3E0C15]">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Orders</span>
            </Link>
            <span className="font-mono text-xs font-bold text-[#3E0C15] uppercase tracking-wider">
              {order.id}
            </span>
          </div>

          {/* Order Header Card */}
          <div className="bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-sm space-y-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#9E7D2E]">Heirloom Commission</span>
                <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2D0A10] mt-0.5">
                  Order #{order.id}
                </h1>
                <p className="text-xs text-stone-500 mt-1">Placed on {order.date}</p>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => alert("Downloading official royal GST invoice PDF...")}
                  className="px-4 py-2 rounded-full border border-stone-300 hover:border-stone-800 text-xs font-semibold text-stone-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Invoice PDF</span>
                </button>
              </div>
            </div>

            {/* Live Progress Tracker */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-700" />
                  <span>{order.status}</span>
                </span>
                <span className="text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px]">
                  Est. Delivery: {order.estimatedDelivery}
                </span>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center gap-3 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Order Placed & Silk Mark Authenticated (28 Sep)</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom Blouse Tailored by Master Drapers (29 Sep)</span>
                </div>
                <div className="flex items-center gap-3 text-amber-800 font-bold">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Dispatched via BlueDart Express Air • Tracking #{order.trackingId}</span>
                </div>
                <div className="flex items-center gap-3 text-stone-400">
                  <div className="w-4 h-4 rounded-full border-2 border-stone-300 shrink-0" />
                  <span>Out for Doorstep Delivery (Expected 04 Oct)</span>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs uppercase tracking-wider font-bold text-stone-900">Ordered Sarees</h3>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <Link href={`/product/${item.slug}`} className="font-serif-luxury text-base font-semibold text-stone-900 hover:underline">
                        {item.name}
                      </Link>
                      <p className="text-xs text-stone-500 mt-0.5">{item.fabric}</p>
                      <p className="text-xs text-amber-800 font-medium mt-0.5">{item.blouse}</p>
                      <p className="text-xs font-bold text-[#3E0C15] mt-1.5">
                        ₹{item.price.toLocaleString("en-IN")} (Qty: {item.qty})
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Address & Payment 2-Col Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-100 text-xs">
              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span>Delivery Address</span>
                </h4>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1 text-stone-700">
                  <strong className="block text-stone-900">{order.shippingAddress.name}</strong>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  <p className="text-stone-500 pt-1">Mobile: {order.customer.mobile}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-700" />
                  <span>Payment Information</span>
                </h4>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1.5 text-stone-700">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Method:</span>
                    <span className="font-semibold text-stone-900">{order.payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Txn Ref:</span>
                    <span className="font-mono text-stone-800">{order.payment.transactionId}</span>
                  </div>
                  <div className="flex justify-between text-emerald-800 font-bold pt-1">
                    <span>Status:</span>
                    <span>{order.payment.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="p-5 rounded-2xl bg-[#F5EFEB] border border-amber-900/10 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">₹{order.summary.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Custom Blouse Stitching</span>
                <span className="font-semibold text-stone-900">+₹{order.summary.blouseStitching.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>ROYAL10 Privilege Discount</span>
                <span>-₹{order.summary.couponDiscount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Express Air Shipping</span>
                <span className="text-emerald-800 font-bold uppercase">Free (₹0)</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-stone-300/80 text-sm font-bold text-[#3E0C15]">
                <span>Total Amount Paid</span>
                <span className="text-xl">₹{order.summary.total.toLocaleString("en-IN")}</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
