"use client";

import Link from "next/link";
import Image from "next/image";
import { Package, ArrowLeft, ChevronRight, ExternalLink, Truck, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OrdersPage() {
  const mockOrders = [
    {
      id: "SHR-98421",
      date: "28 Sep 2026",
      status: "In Transit (Express Air)",
      estimatedDelivery: "04 Oct 2026",
      total: 38500,
      paymentMethod: "UPI (Google Pay)",
      items: [
        {
          name: "Rani Gulabi Katan Banarasi Kadwa Silk Saree",
          image: "/products/banarasi.jpg",
          blouse: "Custom Bridal Stitch (+₹2,500)",
          qty: 1,
          price: 38500,
        }
      ]
    },
    {
      id: "SHR-91204",
      date: "14 Aug 2026",
      status: "Delivered",
      estimatedDelivery: "18 Aug 2026",
      total: 24999,
      paymentMethod: "Credit Card (HDFC Visa)",
      items: [
        {
          name: "Emerald Royale Scalloped Silk Georgette Saree",
          image: "/products/georgette.jpg",
          blouse: "Unstitched (Included)",
          qty: 1,
          price: 24999,
        }
      ]
    }
  ];

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
            {mockOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Order ID</span>
                    <strong className="font-mono text-sm text-[#3E0C15]">{order.id}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Placed On</span>
                    <span className="font-semibold text-stone-800">{order.date}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Grand Total</span>
                    <strong className="text-sm font-bold text-stone-900">₹{order.total.toLocaleString("en-IN")}</strong>
                  </div>
                  <div>
                    <span className="px-3.5 py-1 bg-amber-100 text-[#3E0C15] font-bold rounded-full text-xs">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="font-serif-luxury text-base font-semibold text-stone-900">{item.name}</h3>
                          <p className="text-xs text-stone-500 mt-0.5">{item.blouse}</p>
                          <p className="text-xs font-bold text-[#3E0C15] mt-1">₹{item.price.toLocaleString("en-IN")} (Qty: {item.qty})</p>
                        </div>
                      </div>

                      <Link
                        href={`/account/orders/${order.id}`}
                        className="px-6 py-2.5 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs font-bold transition-all shadow self-end sm:self-center"
                      >
                        View Order Details
                      </Link>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
