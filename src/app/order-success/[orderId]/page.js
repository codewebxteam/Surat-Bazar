"use client";

import { use } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Sparkles, 
  Truck, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck,
  Calendar,
  MapPin,
  HeartHandshake
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OrderSuccessPage({ params }) {
  const unwrapped = use(params);
  const { orderId } = unwrapped;

  const displayOrderId = orderId || `SHR-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <>
      <Navbar />

      <main className="w-full bg-[#FAF7F2] min-h-[85vh] flex items-center justify-center py-12 sm:py-20 px-4">
        <div className="bg-white rounded-3xl border border-amber-900/15 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
          
          {/* Subtle background celebratory glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-400/15 rounded-full blur-2xl pointer-events-none" />

          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20 animate-bounce duration-1000">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs uppercase font-bold tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Artisan Commission Confirmed</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#2D0A10] mb-2 leading-tight">
            Thank You For Your Order!
          </h1>
          
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Your royal heirloom order has been successfully placed and transmitted to our master weavers.
          </p>

          {/* Order ID Box */}
          <div className="my-6 p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-left">
              <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block">Your Order ID</span>
              <span className="font-mono text-base font-bold text-[#3E0C15]">{displayOrderId}</span>
            </div>
            <div className="text-right">
              <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block">Estimated Delivery</span>
              <span className="font-semibold text-emerald-800">Thursday, 3 Business Days</span>
            </div>
          </div>

          <p className="text-xs text-stone-500 mb-8 leading-relaxed">
            A confirmation receipt and live courier dispatch tracking link have been dispatched to your registered email and mobile number.
          </p>

          {/* Action CTAs: Track Order & Continue Shopping */}
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <Link
              href={`/account/orders/${displayOrderId}`}
              id="order-success-track-order"
              className="px-8 py-3.5 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs uppercase tracking-widest font-bold transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order</span>
            </Link>

            <Link
              href="/collections/sarees"
              id="order-success-continue-shopping"
              className="px-8 py-3.5 rounded-full border border-stone-300 hover:border-stone-800 text-stone-800 text-xs uppercase tracking-widest font-bold hover:bg-stone-50 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-center gap-2 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>100% Silk Mark Authenticated • Insured Express Transit</span>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
