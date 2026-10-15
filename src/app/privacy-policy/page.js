"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Database, 
  FileText, 
  UserCheck, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  Sparkles,
  Server,
  RefreshCw
} from "lucide-react";
import { SITE_CONFIG } from "@/data/siteConfig";

export default function PrivacyPolicyPage() {
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
            <span className="text-stone-500">Legal</span>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="text-stone-900">Privacy Policy</span>
          </nav>

          {/* Header Banner */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 text-[#3E0C15] text-[11px] font-bold uppercase tracking-widest border border-amber-300/60 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Data Protection & Trust Guarantee</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D0A10] leading-tight mb-3">
              Privacy &amp; Data Protection Policy
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
              At <strong>{SITE_CONFIG.brandName}</strong>, your trust is as sacred as our handloom traditions. Here is how we collect, safeguard, encrypt, and respect your personal information.
            </p>
            <p className="text-[11px] text-stone-400 mt-2">
              Last Updated: {lastUpdated} • Effective Date: {lastUpdated}
            </p>
          </div>

          {/* Core Highlights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="p-5 bg-white rounded-2xl border border-amber-900/10 shadow-sm flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-stone-900 text-xs sm:text-sm">256-Bit SSL Encryption</h3>
                <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">All transactions and credentials are encrypted through bank-grade security protocols.</p>
              </div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-amber-900/10 shadow-sm flex items-start gap-3">
              <Eye className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-stone-900 text-xs sm:text-sm">Zero Data Selling</h3>
                <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">Your personal details are never sold, rented, or traded to third-party telemarketers.</p>
              </div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-amber-900/10 shadow-sm flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-stone-900 text-xs sm:text-sm">RBI &amp; PCI-DSS Compliant</h3>
                <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">Processed securely via authorized gateways including Razorpay and UPI.</p>
              </div>
            </div>
          </div>

          {/* Main Policy Body Container */}
          <div className="bg-white rounded-3xl border border-amber-900/15 p-6 sm:p-12 shadow-sm space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
            
            {/* 1. Introduction */}
            <section className="space-y-3">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15] flex items-center gap-2">
                <span>1. Introduction &amp; Scope</span>
              </h2>
              <p>
                This Privacy Policy describes how <strong>Suratbazar Handlooms Pvt. Ltd.</strong> (&ldquo;Suratbazar&rdquo;, &ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, shares, and protects information about you when you visit our website <strong>suratbazar.com</strong>, utilize our online services, or purchase our authentic handloom sarees and drapes.
              </p>
              <p>
                By accessing or using our website, services, or making a purchase, you acknowledge and consent to the practices described in this policy.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section className="space-y-3 border-t border-stone-200/60 pt-6">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15]">
                2. Information We Collect
              </h2>
              <p>We only collect information strictly necessary to fulfill your orders, provide styling services, and offer an exceptional customer experience:</p>
              <div className="space-y-3 pl-2 sm:pl-4">
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-stone-900 block font-semibold">A. Personal Identification Information</strong>
                  <span className="text-stone-600 text-xs leading-relaxed block mt-0.5">
                    Your full name, billing address, shipping address, mobile phone number, and email address provided during account registration or checkout.
                  </span>
                </div>
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-stone-900 block font-semibold">B. Bespoke Tailoring &amp; Measurement Profiles</strong>
                  <span className="text-stone-600 text-xs leading-relaxed block mt-0.5">
                    Blouse stitching measurements (bust, waist, shoulder, armhole, neckline preferences) when custom tailoring options are commissioned.
                  </span>
                </div>
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-stone-900 block font-semibold">C. Payment &amp; Transaction Identifiers</strong>
                  <span className="text-stone-600 text-xs leading-relaxed block mt-0.5">
                    Transaction references, order IDs, and payment method used. <em>Important: We do NOT store credit/debit card numbers, CVVs, expiry dates, or net banking passwords on our servers.</em> All payment information is directly captured by certified, RBI-licensed payment gateways (such as Razorpay).
                  </span>
                </div>
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-stone-900 block font-semibold">D. Device &amp; Browsing Technical Data</strong>
                  <span className="text-stone-600 text-xs leading-relaxed block mt-0.5">
                    IP address, browser type, operating system, pages visited, and interaction logs captured through standard cookies to enhance website loading speed and navigation.
                  </span>
                </div>
              </div>
            </section>

            {/* 3. How We Use Your Information */}
            <section className="space-y-3 border-t border-stone-200/60 pt-6">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15]">
                3. Purpose of Processing &amp; Use of Information
              </h2>
              <p>We use your personal data strictly for legitimate business operations:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li><strong>Order Fulfillment:</strong> Processing transactions, weaving authentication, packaging, and dispatching sarees.</li>
                <li><strong>Logistics &amp; Courier Delivery:</strong> Sharing recipient shipping details with trusted delivery partners (BlueDart, Delhivery, DHL Express).</li>
                <li><strong>Customer Support &amp; Concierge:</strong> Answering sizing queries, blouse stitching consultation, and tracking support.</li>
                <li><strong>Order Updates &amp; Notifications:</strong> Transmitting automated order confirmations, dispatch tracking AWB numbers, and electronic invoices via SMS/Email/WhatsApp.</li>
                <li><strong>Fraud Detection &amp; Security:</strong> Preventing fraudulent financial transactions and verifying high-value bridal commissions.</li>
              </ul>
            </section>

            {/* 4. Payment Gateway Security */}
            <section className="space-y-3 border-t border-stone-200/60 pt-6">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15]">
                4. Payment Gateway Security &amp; Razorpay Compliance
              </h2>
              <p>
                Our store utilizes state-of-the-art encryption to protect customer payment credentials. Online payments are processed through <strong>Razorpay Software Private Limited</strong> and authorized banking networks:
              </p>
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 text-stone-700">
                <p>
                  • <strong>PCI-DSS Level 1 Certification:</strong> Razorpay adheres to the highest global payment industry standard (Payment Card Industry Data Security Standard).
                </p>
                <p>
                  • <strong>End-to-End Encryption:</strong> Card and UPI data is encrypted in transit using 256-bit TLS/SSL encryption.
                </p>
                <p>
                  • <strong>No Local Storage of Sensitive Financial Data:</strong> Suratbazar never sees or stores full credit/debit card numbers, CVVs, or banking PINs.
                </p>
              </div>
            </section>

            {/* 5. Disclosure & Sharing with Third Parties */}
            <section className="space-y-3 border-t border-stone-200/60 pt-6">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15]">
                5. Third-Party Disclosures &amp; Service Providers
              </h2>
              <p>
                We only share personal data with vetted third-party service providers who assist in operating our website and fulfilling your purchases under strict confidentiality agreements:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li><strong>Logistics Partners:</strong> BlueDart Aviation, Delhivery Express, DHL International (for delivery address and contact only).</li>
                <li><strong>Payment Processors:</strong> Razorpay, NPCI (UPI), and authorized banking gateways.</li>
                <li><strong>Cloud Infrastructure:</strong> Secure, encrypted cloud servers with access controls.</li>
                <li><strong>Legal Requirements:</strong> When mandated by court orders, statutory bodies, or government law enforcement under applicable Indian laws.</li>
              </ul>
              <p className="font-semibold text-stone-900 pt-1">
                We will NEVER sell, lease, or distribute your email or phone number to unauthorized marketing agencies.
              </p>
            </section>

            {/* 6. Cookies Policy */}
            <section className="space-y-3 border-t border-stone-200/60 pt-6">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15]">
                6. Cookies &amp; Tracking Technologies
              </h2>
              <p>
                Cookies are small data files placed on your browser to help us remember your shopping bag items, keep you logged into your account, and analyze website speed and performance. You may choose to disable cookies through your browser settings, though certain checkout features may require cookies to function correctly.
              </p>
            </section>

            {/* 7. Data Retention & User Rights */}
            <section className="space-y-3 border-t border-stone-200/60 pt-6">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15]">
                7. Your Privacy Rights &amp; Data Control
              </h2>
              <p>Under applicable Indian data protection regulations, you hold the following rights regarding your data:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li><strong>Right to Access:</strong> Review the personal data stored in your user profile at any time.</li>
                <li><strong>Right to Rectification:</strong> Edit or correct your saved addresses and telephone numbers directly in your account dashboard.</li>
                <li><strong>Right to Erasure:</strong> Request the deletion of your account and personal identifiers by emailing our grievance desk.</li>
                <li><strong>Opt-Out of Communications:</strong> Unsubscribe from marketing newsletters with one click.</li>
              </ul>
            </section>

            {/* 8. Grievance Officer Details */}
            <section className="space-y-4 border-t border-stone-200/60 pt-6">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15]">
                8. Grievance Officer &amp; Contact Details
              </h2>
              <p>
                In accordance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, the designated Grievance Officer for Suratbazar is:
              </p>
              
              <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-2.5">
                <p className="font-bold text-stone-900 text-sm">Grievance Redressal Desk</p>
                <p className="text-stone-700"><strong>Officer:</strong> Nodal Grievance Officer, Customer Redressal Cell</p>
                <p className="text-stone-700"><strong>Company:</strong> Suratbazar Handlooms Pvt. Ltd.</p>
                <p className="text-stone-700 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <span><strong>Registered Office:</strong> {SITE_CONFIG.contact.address}</span>
                </p>
                <p className="text-stone-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-800 shrink-0" />
                  <span><strong>Email:</strong> <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-[#3E0C15] underline font-semibold">{SITE_CONFIG.contact.email}</a></span>
                </p>
                <p className="text-stone-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-800 shrink-0" />
                  <span><strong>Telephone:</strong> {SITE_CONFIG.contact.phone} (10:00 AM – 7:00 PM IST, Monday to Saturday)</span>
                </p>
              </div>
            </section>

            {/* 9. Policy Amendments */}
            <section className="space-y-3 border-t border-stone-200/60 pt-6">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3E0C15]">
                9. Policy Updates &amp; Notifications
              </h2>
              <p>
                We reserve the right to update or amend this Privacy Policy periodically to reflect legal amendments, technology upgrades, or operational improvements. Any changes will become effective immediately upon posting to this URL.
              </p>
            </section>

          </div>

          {/* Quick Navigation Footer Links */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-stone-600">
            <Link href="/terms-and-conditions" className="hover:text-[#3E0C15] underline">Terms &amp; Conditions</Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-[#3E0C15] underline">Refund &amp; Cancellation Policy</Link>
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
