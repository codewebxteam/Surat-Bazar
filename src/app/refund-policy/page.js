"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  RotateCcw, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Banknote, 
  ShieldCheck, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  Sparkles,
  PackageCheck,
  CreditCard
} from "lucide-react";
import { SITE_CONFIG } from "@/data/siteConfig";

export default function RefundPolicyPage() {
  const lastUpdated = "October 13, 2026";

  return (
    <>
      <Navbar />

      <main className="w-full bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-amber-800 uppercase tracking-wider font-semibold mb-6">
            <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="text-stone-500">Customer Care</span>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="text-stone-900">Refund &amp; Cancellation Policy</span>
          </nav>

          {/* Header Banner */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 text-emerald-900 text-[11px] font-bold uppercase tracking-widest border border-emerald-300/60 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>100% Patron Delight &amp; Trust Guarantee</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D0A10] leading-tight mb-3">
              Refund, Return &amp; Cancellation Policy
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
              At <strong>{SITE_CONFIG.brandName}</strong>, our sacred commitment is your absolute delight. If a drape does not surpass your highest bridal expectations, we offer transparent cancellations, easy 7-day returns, and rapid 5–7 business days refunds.
            </p>
            <p className="text-[11px] text-stone-400 mt-2">
              Last Updated: {lastUpdated} • Compliant with Consumer Protection (E-Commerce) Rules
            </p>
          </div>

          {/* 3 Step Key Pillars Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="p-5 bg-white rounded-2xl border border-amber-900/10 shadow-sm text-center space-y-1.5">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-xs sm:text-sm">24-Hr Cancellation</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">Cancel within 24 hours of placement or before courier dispatch for a 100% instant full refund.</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-amber-900/10 shadow-sm text-center space-y-1.5">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-xs sm:text-sm">7-Day Doorstep Returns</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">Complimentary reverse courier pickup arranged from your home across all serviceable Indian PIN codes.</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-amber-900/10 shadow-sm text-center space-y-1.5">
              <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-800 flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-xs sm:text-sm">5–7 Days Refund Credit</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">Reimbursed directly back to your original source of payment (Card, UPI, Net Banking, or Bank NEFT).</p>
            </div>
          </div>

          {/* Main Policy Content Container */}
          <div className="bg-white rounded-3xl border border-amber-900/15 p-6 sm:p-12 shadow-sm space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
            
            {/* 1. Order Cancellation Policy */}
            <section className="space-y-3">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15] flex items-center gap-2">
                <span>1. Order Cancellation Policy &amp; Timelines</span>
              </h2>
              <p>
                We understand that wedding dates, styling choices, and color themes can change. You may cancel your order according to the following windows:
              </p>
              <div className="space-y-3 pl-2 sm:pl-4">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <strong className="text-stone-900 text-sm block">A. Prior to Dispatch / Within 24 Hours (100% Full Refund)</strong>
                  <p className="text-stone-600 text-xs mt-1 leading-relaxed">
                    You can cancel your order within <strong>24 hours of placement</strong> or anytime before the package is handed over to our logistics partner. To cancel, simply reach out to our concierge via WhatsApp at <strong>{SITE_CONFIG.contact.phone}</strong> or email <strong>{SITE_CONFIG.contact.email}</strong> with your Order ID (e.g. <em>SHR-123456</em>). We will cancel the order immediately and issue a 100% full refund.
                  </p>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <strong className="text-stone-900 text-sm block">B. After Dispatch (Transit in Progress)</strong>
                  <p className="text-stone-600 text-xs mt-1 leading-relaxed">
                    Once an order has been dispatched from our Surat vault with an active tracking AWB, the shipment cannot be intercepted mid-air. In this scenario, you may simply decline doorstep delivery or receive the parcel and initiate an effortless return under our 7-day return policy.
                  </p>
                </div>
              </div>
            </section>

            {/* 2. 7-Day Return & Exchange Window */}
            <section className="space-y-3 border-t border-stone-200/60 pt-6">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15]">
                2. 7-Day Complimentary Return &amp; Exchange Window
              </h2>
              <p>
                We provide a hassle-free <strong>7-day return and exchange window</strong> starting from the exact date of physical doorstep delivery (as confirmed by courier tracking delivery status).
              </p>
              <p>
                You may request an exchange for another heirloom saree or request a 100% monetary refund credited back to your original payment method.
              </p>
            </section>

            {/* 3. Return Eligibility Criteria */}
            <section className="space-y-3 border-t border-stone-200/60 pt-6">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15]">
                3. Return Eligibility Criteria
              </h2>
              <p>To qualify for a full refund or exchange, the returned drape must meet our preservation standards:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li><strong>Unworn &amp; Unwashed:</strong> The saree must be completely unworn, unstained, unperfumed, and folded in its original state.</li>
                <li><strong>Original Tags &amp; Holograms:</strong> The individual <strong>Silk Mark Organisation of India (SMOI)</strong> certification hologram and brand tags must be firmly attached and untampered.</li>
                <li><strong>Original Packaging:</strong> The drape must be returned inside the protective archival muslin wrap and Suratbazar presentation trunk.</li>
                <li><strong>Complimentary Blouse Fabric:</strong> The running 0.8m unstitched matching blouse fabric piece attached to the saree must remain uncut and intact.</li>
              </ul>
            </section>

            {/* 4. Non-Returnable / Non-Refundable Items */}
            <section className="space-y-3 border-t border-stone-200/60 pt-6">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15]">
                4. Non-Returnable / Non-Refundable Exceptions
              </h2>
              <p>The following items are exempt from returns and refunds:</p>
              <div className="p-4 bg-amber-50/70 border border-amber-300/60 rounded-2xl space-y-2 text-stone-700">
                <p>
                  • <strong>Custom Tailored Blouses:</strong> Once our master drapers have cut and stitched a custom bridal blouse to your personalized body measurements, the blouse portion cannot be returned or refunded (unless there is a verified tailoring defect).
                </p>
                <p>
                  • <strong>Cut Fabrics:</strong> Saree running blouse pieces that have already been detached or scissor-cut by the customer.
                </p>
                <p>
                  • <strong>Clearance Vault Sales:</strong> Items marked with a non-returnable &ldquo;Final Clearance&rdquo; badge on rare warehouse events.
                </p>
              </div>
            </section>

            {/* 5. Damaged, Defective or Incorrect Items */}
            <section className="space-y-3 border-t border-stone-200/60 pt-6">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15]">
                5. Damaged, Defective or Incorrect Product Received
              </h2>
              <p>
                Every parcel dispatched from Surat undergoes a rigorous multi-stage quality examination. In the unlikely event that your saree arrives physically damaged in transit, or if an incorrect design was shipped:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li>Please notify our concierge within <strong>48 hours of delivery</strong> via WhatsApp or email at <strong>{SITE_CONFIG.contact.email}</strong>.</li>
                <li>Kindly share a brief unboxing video or photographs highlighting the courier outer box condition and the damage.</li>
                <li>We will arrange a priority immediate reverse pickup and dispatch a brand-new identical replacement drape, or issue a 100% full refund as per your preference.</li>
              </ul>
            </section>

            {/* 6. Step-by-Step Return Process */}
            <section className="space-y-3 border-t border-stone-200/60 pt-6">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15]">
                6. Step-by-Step Return Process
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <span className="font-mono text-xs font-bold text-[#3E0C15] uppercase block">Step 1 • Request</span>
                  <p className="font-bold text-stone-900 text-xs">Contact Concierge</p>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    Email <em>{SITE_CONFIG.contact.email}</em> or message WhatsApp with your Order ID and reason for return.
                  </p>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <span className="font-mono text-xs font-bold text-[#3E0C15] uppercase block">Step 2 • Pickup</span>
                  <p className="font-bold text-stone-900 text-xs">Free Doorstep Pickup</p>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    Our logistics partner (BlueDart/Delhivery) will collect the securely packed parcel from your doorstep in 24–48 hours.
                  </p>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <span className="font-mono text-xs font-bold text-[#3E0C15] uppercase block">Step 3 • Refund</span>
                  <p className="font-bold text-stone-900 text-xs">Quality Check &amp; Refund</p>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    Upon arrival at our Surat studio, refund is triggered to your original bank/card/UPI within 24 hours.
                  </p>
                </div>
              </div>
            </section>

            {/* 7. Refund Mode & Timeline (Razorpay Compliant) */}
            <section className="space-y-4 border-t border-stone-200/60 pt-6">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15]">
                7. Refund Processing Timeline &amp; Payment Modes
              </h2>
              <div className="p-5 bg-emerald-50/70 border border-emerald-300/80 rounded-2xl space-y-3">
                <h3 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Razorpay &amp; Banking Standard Refund Timelines:</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-800">• Prepaid Online Payments (Credit Card / Debit Card / Net Banking / Wallets):</span>
                    <span>Refunds are initiated directly back to the original source card or bank account via the Razorpay payment gateway. Funds reflect in your account within <strong>5 to 7 business days</strong> depending on your issuing bank&apos;s settlement schedule.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-800">• UPI Payments (Google Pay, PhonePe, Paytm, BHIM, CRED):</span>
                    <span>Refunds reflect directly in the linked bank account within <strong>24 to 48 hours</strong> (maximum up to 5 business days).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-800">• Cash on Delivery (COD) Orders:</span>
                    <span>For COD orders, our accounts team will request your verified Bank Account Details (Account Number, IFSC, Account Holder Name) or verified UPI VPA via email. The refund will be credited via secure NEFT/IMPS/UPI transfer within <strong>5 to 7 business days</strong>.</span>
                  </li>
                </ul>
              </div>
              <p className="text-stone-500 text-[11px]">
                Note: Original outward standard shipping charges, if any, are 100% free; hence no deduction is made for shipping. The entire purchase price of the returned product is refunded in full.
              </p>
            </section>

            {/* 8. Dedicated Help Desk */}
            <section className="space-y-4 border-t border-stone-200/60 pt-6">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15]">
                8. Need Assistance with Returns or Refunds?
              </h2>
              <p>Our dedicated patron concierge is at your service 7 days a week:</p>
              
              <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-2 text-stone-700">
                <p className="font-bold text-stone-900 text-sm">Suratbazar Returns &amp; Customer Care Cell</p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-800 shrink-0" />
                  <span><strong>Email:</strong> <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-[#3E0C15] underline font-semibold">{SITE_CONFIG.contact.email}</a></span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-800 shrink-0" />
                  <span><strong>Helpline &amp; WhatsApp:</strong> {SITE_CONFIG.contact.phone} (10:00 AM – 8:00 PM IST, Monday to Sunday)</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <span><strong>Returns Processing Studio:</strong> {SITE_CONFIG.contact.address}</span>
                </p>
              </div>
            </section>

          </div>

          {/* Quick Navigation Footer Links */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-stone-600">
            <Link href="/privacy-policy" className="hover:text-[#3E0C15] underline">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms-and-conditions" className="hover:text-[#3E0C15] underline">Terms &amp; Conditions</Link>
            <span>•</span>
            <Link href="/pages/shipping-policy" className="hover:text-[#3E0C15] underline">Shipping Policy</Link>
            <span>•</span>
            <Link href="/pages/contact-us" className="hover:text-[#3E0C15] underline">Contact Concierge</Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
