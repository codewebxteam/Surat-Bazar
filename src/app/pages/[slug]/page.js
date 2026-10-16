"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Mail, 
  Phone, 
  MapPin, 
  HelpCircle, 
  Scissors, 
  RotateCcw, 
  FileText, 
  Lock, 
  Clock, 
  CheckCircle2, 
  Award,
  ChevronRight,
  Check,
  MessageCircle,
  ExternalLink
} from "lucide-react";
import { useStoreConfig } from "@/context/StoreConfigContext";

// Dynamic Contact Us Content component reading live settings from StoreConfigContext
function DynamicContactUsContent({ config }) {
  const phone = config?.contact?.phone || "+91 82002 60300";
  const whatsapp = config?.contact?.whatsapp || config?.contact?.phone || "+91 82002 60300";
  const email = config?.contact?.email || "suratbazar360@gmail.com";
  const address = config?.contact?.address || "Hut No. 287, Mithi Khadi, Azad Chowk, Near Noorani Masjid, Limbayat, Surat, Gujarat - 394210";
  const workingHours = config?.contact?.workingHours || "Open All 7 Days: 10:00 AM – 9:00 PM IST";

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-8 text-stone-700">
      {/* Top 3 Direct Contact Channels Grid: WhatsApp | Direct Call | Official Email */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: WhatsApp Concierge */}
        <div className="p-6 bg-white rounded-3xl border border-emerald-500/30 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-all group bg-gradient-to-b from-white to-emerald-50/20">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
              Fastest Response
            </span>
            <h3 className="font-serif-luxury text-lg font-bold text-stone-900">WhatsApp Concierge</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Connect directly for live saree video drapes, blouse custom sizing, or quick order status.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-stone-500 block">WhatsApp Number:</span>
              <span className="font-bold text-base text-[#3E0C15]">{whatsapp}</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">1-on-1 Master Draper Support</p>
          </div>

          <a
            href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Suratbazar%2C%20I%20have%20an%20inquiry%20regarding%20sarees`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 text-center cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Card 2: Direct Call Helpline */}
        <div className="p-6 bg-white rounded-3xl border border-amber-900/15 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-700 transition-all group bg-gradient-to-b from-white to-amber-50/20">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block">
              Direct Helpline
            </span>
            <h3 className="font-serif-luxury text-lg font-bold text-stone-900">Direct Call Concierge</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Speak directly with our senior styling concierge and master textile advisors.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-stone-500 block">Helpline Number:</span>
              <span className="font-bold text-base text-[#3E0C15]">{phone}</span>
            </div>
            <p className="text-[11px] text-amber-800 font-medium">{workingHours}</p>
          </div>

          <a
            href={`tel:${cleanPhone}`}
            className="w-full py-3 px-4 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 text-center cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Call {phone}</span>
          </a>
        </div>

        {/* Card 3: Official Email Support */}
        <div className="p-6 bg-white rounded-3xl border border-amber-900/15 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-700 transition-all group bg-gradient-to-b from-white to-stone-50/40">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold text-stone-700 bg-stone-200 px-2.5 py-0.5 rounded-full inline-block">
              Official Desk
            </span>
            <h3 className="font-serif-luxury text-lg font-bold text-stone-900">Official Email Support</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              For order inquiries, custom bridal commissions, and corporate partnerships.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-stone-500 block">Email Address:</span>
              <span className="font-bold text-xs text-[#3E0C15] break-all block">{email}</span>
            </div>
            <p className="text-[11px] text-stone-500">Replies within 2 to 4 business hours</p>
          </div>

          <a
            href={`mailto:${email}`}
            className="w-full py-3 px-4 rounded-full bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 text-center cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Email Us</span>
          </a>
        </div>

      </div>

      {/* Surat Registered Office & Physical Flagship Experience Center */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-amber-900/15 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Registered Entity &amp; Boutique</span>
              <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
                Surat Main Head Office &amp; Experience Studio
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{workingHours}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="space-y-3">
            <h4 className="font-bold text-stone-900 uppercase tracking-wider text-xs">Official Physical Address:</h4>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-700 leading-relaxed font-mono text-xs">
              <p className="whitespace-pre-line">{address}</p>
            </div>
          </div>

          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="font-bold text-stone-900 uppercase tracking-wider text-xs">Operating Hours &amp; Visits:</h4>
              <div className="space-y-2 text-xs text-stone-600">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-800 shrink-0" />
                  <span><strong>Timings:</strong> {workingHours}</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Private bridal appointments available upon prior notice</span>
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>100% Silk Mark Authenticated collection preview</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View on Google Maps</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-amber-100 hover:bg-amber-200 text-[#3E0C15] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Office</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Self-Service Links: Track Order | Returns | FAQs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Link
          href="/track"
          className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-amber-700 transition-all shadow-xs flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-amber-800 shrink-0" />
            <div>
              <h5 className="font-bold text-stone-900 text-xs">Track Your Order</h5>
              <p className="text-[11px] text-stone-500">Live courier tracking</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/refund-policy"
          className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-amber-700 transition-all shadow-xs flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-amber-800 shrink-0" />
            <div>
              <h5 className="font-bold text-stone-900 text-xs">Easy 7-Day Returns</h5>
              <p className="text-[11px] text-stone-500">Doorstep reverse pickup</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/pages/faq"
          className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-amber-700 transition-all shadow-xs flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-amber-800 shrink-0" />
            <div>
              <h5 className="font-bold text-stone-900 text-xs">Read FAQs</h5>
              <p className="text-[11px] text-stone-500">Silk care, sizing &amp; orders</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

    </div>
  );
}

const STATIC_PAGES_DATA = {
  // 1. ABOUT US
  "about-us": {
    badge: "Heritage & Lineage",
    title: "The Suratbazar Chronicle: 400 Years of Loom Legacy",
    subtitle: "A royal tribute to Surat's master textile archives and India's sacred master weavers.",
    content: (
      <div className="space-y-8 text-stone-700 leading-relaxed text-sm sm:text-base">
        <p>
          Rooted in India&apos;s silk capital and nurtured through the royal courts of Varanasi, Kanchipuram, and Patan, <strong>SURATBAZAR</strong> was born with a singular mission: to resurrect, protect, and celebrate India’s most magnificent handloom textile traditions for the modern connoisseur.
        </p>
        <p>
          Each saree in our collection is not just a drape; it represents up to 45 days of unbroken concentration by master artisan families on wooden pit-looms. We exclusively source mulberry and katan silks, hand-twisted pure gold electroplated silver zari, and natural plant dyes.
        </p>

        {/* 3 Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
          <div className="p-6 bg-white rounded-3xl border border-amber-900/15 shadow-sm text-center">
            <span className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#3E0C15] block">450+</span>
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold mt-1 block">Master Artisan Families</span>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-amber-900/15 shadow-sm text-center">
            <span className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#3E0C15] block">100%</span>
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold mt-1 block">Silk Mark Certified Purity</span>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-amber-900/15 shadow-sm text-center">
            <span className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#3E0C15] block">60+</span>
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold mt-1 block">Global Countries Draped</span>
          </div>
        </div>

        <h3 className="font-serif-luxury text-2xl font-bold text-[#3E0C15] pt-4">Our Three Pillars of Purity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-5 bg-white rounded-2xl border border-stone-200">
            <h4 className="font-bold text-stone-900 text-sm mb-1">Authentic Pit-Looms</h4>
            <p className="text-stone-600">Zero power-loom compromise. Every warp and weft is tensioned manually by hand.</p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-stone-200">
            <h4 className="font-bold text-stone-900 text-sm mb-1">Direct Artisan Welfare</h4>
            <p className="text-stone-600">Fair-trade commissions ensuring sustainable livelihoods for weaving clusters.</p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-stone-200">
            <h4 className="font-bold text-stone-900 text-sm mb-1">Heirloom Longevity</h4>
            <p className="text-stone-600">Crafted to be cherished and passed down through generations with reverence.</p>
          </div>
        </div>
      </div>
    )
  },

  // 2. CONTACT US (Dynamic from Firestore)
  "contact-us": {
    badge: "Direct Patron Concierge",
    title: "Get in Touch with Suratbazar",
    subtitle: "Direct access to our master styling team, order assistance, and Surat flagship boutique. Connect instantly via WhatsApp, Phone, or Email without any waiting forms.",
    render: (config) => <DynamicContactUsContent config={config} />
  },

  // 3. SHIPPING POLICY
  "shipping-policy": {
    badge: "Logistics & Delivery",
    title: "Worldwide Shipping & Insured Transit Policy",
    subtitle: "Complimentary worldwide express shipping with full tamper-evident insurance and tracking.",
    content: (
      <div className="space-y-6 text-stone-700 leading-relaxed text-sm sm:text-base">
        <p>Every Suratbazar saree is hand-inspected, wrapped in archival muslin, and sealed in a velvet-lined heirloom box with 100% transit insurance.</p>
        
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-700" />
              <span>Domestic Deliveries (Across All India PIN Codes)</span>
            </h4>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              <strong>Free Express Air Shipping</strong> on all orders. Major metro deliveries (Delhi NCR, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad) arrive within 2 to 4 business days via BlueDart Air / Delhivery Express.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>International Deliveries (USA, UK, UAE, Canada, Australia, Singapore)</span>
            </h4>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              Dispatched via DHL Express International with tracking. Complimentary on all orders above ₹50,000 (approx $600 USD). Delivered in 4 to 7 business days worldwide.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Custom Tailored Orders</span>
            </h4>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              Orders requiring custom blouse stitching or customized falls/pico require an additional 3 working days for our master drapers before courier dispatch.
            </p>
          </div>
        </div>
      </div>
    )
  },

  // 4. RETURN POLICY
  "return-policy": {
    badge: "Client Satisfaction",
    title: "7-Day Complimentary Exchange & Return Policy",
    subtitle: "Effortless doorstep returns and exchanges to ensure total bridal peace of mind.",
    content: (
      <div className="space-y-6 text-stone-700 leading-relaxed text-sm sm:text-base">
        <p>
          At Suratbazar, your complete delight is our sacred commitment. If you are not completely enchanted by your saree, we provide a hassle-free 7-day return and exchange policy.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-5 bg-white rounded-2xl border border-stone-200 text-center">
            <RotateCcw className="w-6 h-6 text-[#3E0C15] mx-auto mb-2" />
            <h4 className="font-bold text-stone-900">7-Day Window</h4>
            <p className="text-stone-500 mt-1">Initiate return within 7 days of package delivery.</p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-stone-200 text-center">
            <Truck className="w-6 h-6 text-[#3E0C15] mx-auto mb-2" />
            <h4 className="font-bold text-stone-900">Free Doorstep Pickup</h4>
            <p className="text-stone-500 mt-1">We arrange reverse pickup from your home address.</p>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-stone-200 text-center">
            <CheckCircle2 className="w-6 h-6 text-[#3E0C15] mx-auto mb-2" />
            <h4 className="font-bold text-stone-900">Full 100% Refund</h4>
            <p className="text-stone-500 mt-1">Reimbursed to original payment method in 48 hours.</p>
          </div>
        </div>

        <h4 className="font-bold text-stone-900 text-sm pt-2">Return Guidelines</h4>
        <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-stone-600">
          <li>The saree must remain unwashed, unworn, and folded in its original condition.</li>
          <li>All original brand tags, Silk Mark certification holograms, and packaging must remain intact.</li>
          <li>Custom-stitched blouses and customized cut items are non-returnable unless a tailoring defect is identified.</li>
        </ul>
      </div>
    )
  },

  // 5. PRIVACY POLICY
  "privacy-policy": {
    badge: "Trust & Security",
    title: "Privacy & Data Protection Policy",
    subtitle: "How we protect, encrypt, and respect your personal information across all platforms.",
    content: (
      <div className="space-y-6 text-stone-700 leading-relaxed text-xs sm:text-sm">
        <p>
          SURATBAZAR Handlooms Pvt. Ltd. (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting the privacy, confidentiality, and security of all customers and website visitors.
        </p>
        
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-stone-200">
            <h4 className="font-bold text-stone-900 text-sm">1. Information We Collect</h4>
            <p className="text-stone-600 mt-1">We collect name, email address, mobile number, shipping destination, and blouse measurement profiles only to process and fulfill your bespoke textile commissions.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200">
            <h4 className="font-bold text-stone-900 text-sm">2. 256-Bit Payment Encryption</h4>
            <p className="text-stone-600 mt-1">We do not store credit card numbers, CVVs, or bank passwords. All financial transactions are processed through RBI-compliant, PCI-DSS Level 1 certified payment gateways.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200">
            <h4 className="font-bold text-stone-900 text-sm">3. No Third-Party Data Sharing</h4>
            <p className="text-stone-600 mt-1">Your contact data is never rented, monetized, or sold to third-party marketers. We only communicate regarding order status and private Saree Club privileges.</p>
          </div>
        </div>
      </div>
    )
  },

  // 6. TERMS & CONDITIONS
  "terms-conditions": {
    badge: "Legal Terms",
    title: "Terms of Service & Handloom Authenticities",
    subtitle: "Official terms governing orders, handloom variations, pricing, and warranties.",
    content: (
      <div className="space-y-6 text-stone-700 leading-relaxed text-xs sm:text-sm">
        <p>
          By accessing or ordering from SURATBAZAR, you agree to be bound by the following terms and authentic craftsmanship standards.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-stone-200">
            <h4 className="font-bold text-stone-900 text-sm">1. Handcrafted Nature of Sarees</h4>
            <p className="text-stone-600 mt-1">Because our sarees are woven by human hands on traditional looms, subtle variations in weft slubs, zari lock knots, or color dye depths are natural hallmarks of authentic artisan craft, not defects.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200">
            <h4 className="font-bold text-stone-900 text-sm">2. Pricing & Currency</h4>
            <p className="text-stone-600 mt-1">All prices displayed are in Indian Rupees (INR) inclusive of all applicable statutory GST (5%). International orders may be subject to destination import tariffs levied by local customs.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200">
            <h4 className="font-bold text-stone-900 text-sm">3. Intellectual Property</h4>
            <p className="text-stone-600 mt-1">All motifs, photography, brand imagery, and editorial chronicles are the registered intellectual property of SURATBAZAR Handlooms Pvt. Ltd.</p>
          </div>
        </div>
      </div>
    )
  },

  // 7. FAQ
  "faq": {
    badge: "Customer Help Desk",
    title: "Frequently Asked Questions",
    subtitle: "Answers to common inquiries regarding silk authenticity, orders, tailoring, and delivery.",
    render: (config) => {
      const whatsapp = config?.contact?.whatsapp || config?.contact?.phone || "+91 82002 60300";
      const email = config?.contact?.email || "suratbazar360@gmail.com";
      return (
        <div className="space-y-4 text-xs sm:text-sm text-stone-700">
          {[
            {
              q: "Are all Suratbazar sarees Silk Mark Certified?",
              a: "Yes. Every silk saree is certified by the Silk Mark Organisation of India (SMOI). An individual tamper-proof hologram tag with a verifiable QR code is affixed to each drape."
            },
            {
              q: "Do the sarees include fall and pico?",
              a: "Yes! Complimentary high-quality cotton fall stitching and delicate rolled-hem pico are included with every single saree order at no extra charge."
            },
            {
              q: "How does custom blouse stitching work?",
              a: "When selecting 'Custom Bridal Tailoring', you can provide your measurements online or connect with our master drapers via video call for personalized styling and neckline selection."
            },
            {
              q: "Can I cancel or modify my order?",
              a: `Orders can be modified or cancelled within 12 hours of placement before our looms dispatch the package. Simply contact our concierge on Call/WhatsApp at ${whatsapp} or email ${email}.`
            },
            {
              q: "What payment methods are accepted?",
              a: "We accept UPI (Google Pay, PhonePe, Paytm, CRED), Net Banking across 50+ Indian banks, Visa, MasterCard, American Express, RuPay, and Cash on Delivery."
            }
          ].map((faq, i) => (
            <div key={i} className="p-5 bg-white rounded-2xl border border-stone-200 space-y-1.5 shadow-sm">
              <h4 className="font-bold text-stone-900 text-sm sm:text-base font-serif-luxury">{faq.q}</h4>
              <p className="text-stone-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      );
    }
  },

  // 8. SIZE GUIDE
  "size-guide": {
    badge: "Drape & Blouse Sizing",
    title: "Saree Dimensions & Blouse Sizing Guide",
    subtitle: "Exact standard measurements for handloom lengths and custom blouse tailoring.",
    content: (
      <div className="space-y-6 text-stone-700 leading-relaxed text-xs sm:text-sm">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <h4 className="font-bold text-stone-900 text-sm">Standard Saree Dimensions</h4>
          <p><strong>Total Saree Length:</strong> 5.5 meters (approx 6 yards) • <strong>Width:</strong> 44 to 46 inches</p>
          <p><strong>Running Blouse Piece:</strong> 0.8 to 1.0 meter matching unstitched fabric included with borders.</p>
        </div>

        <h4 className="font-bold text-stone-900 text-sm pt-2">Standard Blouse Size Chart (Inches)</h4>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl border border-stone-200 text-xs text-left">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-900 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Size</th>
                <th className="p-3">Bust (in)</th>
                <th className="p-3">Waist (in)</th>
                <th className="p-3">Shoulder (in)</th>
                <th className="p-3">Front Neck Depth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              <tr><td className="p-3 font-bold text-stone-900">XS (34)</td><td className="p-3">34&quot;</td><td className="p-3">28&quot;</td><td className="p-3">13.5&quot;</td><td className="p-3">6.5&quot;</td></tr>
              <tr><td className="p-3 font-bold text-stone-900">S (36)</td><td className="p-3">36&quot;</td><td className="p-3">30&quot;</td><td className="p-3">14.0&quot;</td><td className="p-3">7.0&quot;</td></tr>
              <tr><td className="p-3 font-bold text-stone-900">M (38)</td><td className="p-3">38&quot;</td><td className="p-3">32&quot;</td><td className="p-3">14.5&quot;</td><td className="p-3">7.0&quot;</td></tr>
              <tr><td className="p-3 font-bold text-stone-900">L (40)</td><td className="p-3">40&quot;</td><td className="p-3">34&quot;</td><td className="p-3">15.0&quot;</td><td className="p-3">7.5&quot;</td></tr>
              <tr><td className="p-3 font-bold text-stone-900">XL (42)</td><td className="p-3">42&quot;</td><td className="p-3">36&quot;</td><td className="p-3">15.5&quot;</td><td className="p-3">7.5&quot;</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  },

  // 9. CARE GUIDE
  "care-guide": {
    badge: "Preservation",
    title: "Silk Care, Preservation & Zari Maintenance",
    subtitle: "Essential rituals to cherish and preserve your handcrafted sarees across generations.",
    content: (
      <div className="space-y-6 text-stone-700 leading-relaxed text-xs sm:text-sm">
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl">
          <h4 className="font-bold text-[#3E0C15] text-sm mb-1">Golden Rule of Pure Silk Care</h4>
          <p className="text-stone-700">Strictly Dry Clean Only. Never hand wash or machine wash authentic handloom zari sarees.</p>
        </div>
        <ul className="space-y-3 list-disc pl-5 text-stone-600">
          <li><strong>Storage:</strong> Wrap each saree in breathable, unbleached pure cotton muslin cloth. Avoid plastic bags.</li>
          <li><strong>Refolding:</strong> Change saree fold lines every 3 to 4 months to prevent stress along gold zari creases.</li>
          <li><strong>Airing:</strong> Air your sarees in cool indirect shade once every 6 months. Never expose to harsh noon sunlight.</li>
          <li><strong>Perfume & Water:</strong> Never spray perfumes or alcohol-based deodorants directly onto gold/silver zari borders.</li>
        </ul>
      </div>
    )
  },

  // 10. STORES
  "stores": {
    badge: "Flagship Boutiques",
    title: "Visit Our Flagship Salons & Showrooms",
    subtitle: "Experience the tactile majesty of authentic Indian handlooms in person.",
    render: (config) => {
      const whatsapp = config?.contact?.whatsapp || config?.contact?.phone || "+91 82002 60300";
      const email = config?.contact?.email || "suratbazar360@gmail.com";
      const address = config?.contact?.address || "Hut No. 287, Mithi Khadi, Azad Chowk, Near Noorani Masjid, Limbayat, Surat, Gujarat - 394210";
      const hours = config?.contact?.workingHours || "10:00 AM – 9:00 PM (All Days)";

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-700">
          <div className="p-6 bg-white rounded-3xl border border-amber-900/15 shadow-sm space-y-2 col-span-1 sm:col-span-2 bg-gradient-to-br from-white to-amber-50/40">
            <span className="text-[10px] font-bold text-[#9E7D2E] uppercase tracking-wider">Surat Headquarters &amp; Flagship Boutique</span>
            <h4 className="font-serif-luxury text-lg font-bold text-stone-900">Surat Main Loom &amp; Retail Studio</h4>
            <p className="text-stone-600">{address}</p>
            <p className="text-stone-500">Phone &amp; WhatsApp: {whatsapp} • Email: {email} • Hours: {hours}</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-amber-900/15 shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-[#9E7D2E] uppercase tracking-wider">New Delhi Flagship</span>
            <h4 className="font-serif-luxury text-lg font-bold text-stone-900">Mehrauli Heritage Salon</h4>
            <p className="text-stone-600">Heritage Lane, Near Qutub Minar, Mehrauli, New Delhi - 110030</p>
            <p className="text-stone-500">Phone: +91 11 4982 0001 • Hours: 10:30 AM – 8:30 PM (All Days)</p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-amber-900/15 shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-[#9E7D2E] uppercase tracking-wider">Mumbai Salon</span>
            <h4 className="font-serif-luxury text-lg font-bold text-stone-900">Kala Ghoda Art District</h4>
            <p className="text-stone-600">VB Gandhi Marg, Fort, Mumbai, Maharashtra - 400001</p>
            <p className="text-stone-500">Phone: +91 22 2284 5500 • Hours: 11:00 AM – 8:00 PM (All Days)</p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-amber-900/15 shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-[#9E7D2E] uppercase tracking-wider">Bengaluru Salon</span>
            <h4 className="font-serif-luxury text-lg font-bold text-stone-900">Lavelle Road Flagship</h4>
            <p className="text-stone-600">84/1 Lavelle Road, Shanthala Nagar, Bengaluru, Karnataka - 560001</p>
            <p className="text-stone-500">Phone: +91 80 4123 9900 • Hours: 10:30 AM – 8:00 PM (All Days)</p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-amber-900/15 shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-[#9E7D2E] uppercase tracking-wider">Hyderabad Salon</span>
            <h4 className="font-serif-luxury text-lg font-bold text-stone-900">Jubilee Hills Bridal Mansion</h4>
            <p className="text-stone-600">Road No. 36, Jubilee Hills, Hyderabad, Telangana - 500033</p>
            <p className="text-stone-500">Phone: +91 40 6677 8800 • Hours: 11:00 AM – 8:30 PM (All Days)</p>
          </div>
        </div>
      );
    }
  }
};

// Aliases mapping
STATIC_PAGES_DATA["silk-care"] = STATIC_PAGES_DATA["care-guide"];
STATIC_PAGES_DATA["returns"] = STATIC_PAGES_DATA["return-policy"];
STATIC_PAGES_DATA["refund-policy"] = STATIC_PAGES_DATA["return-policy"];
STATIC_PAGES_DATA["cancellation-policy"] = STATIC_PAGES_DATA["return-policy"];
STATIC_PAGES_DATA["terms-of-service"] = STATIC_PAGES_DATA["terms-conditions"];
STATIC_PAGES_DATA["terms-and-conditions"] = STATIC_PAGES_DATA["terms-conditions"];
STATIC_PAGES_DATA["terms"] = STATIC_PAGES_DATA["terms-conditions"];
STATIC_PAGES_DATA["privacy"] = STATIC_PAGES_DATA["privacy-policy"];
STATIC_PAGES_DATA["contact"] = STATIC_PAGES_DATA["contact-us"];

export default function StaticPage({ params }) {
  const unwrapped = use(params);
  const { slug } = unwrapped;
  const pageData = STATIC_PAGES_DATA[slug];
  const { config } = useStoreConfig();

  if (!pageData) {
    return notFound();
  }

  const contentToRender = pageData.render 
    ? pageData.render(config) 
    : pageData.content;

  return (
    <>
      <Navbar />

      <main className="w-full bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-amber-800 uppercase tracking-wider font-semibold mb-6">
            <Link href="/" className="hover:text-stone-900">Home</Link>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <Link href="/pages/about-us" className="hover:text-stone-900">Information</Link>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="text-stone-900">{pageData.badge || slug.replace("-", " ")}</span>
          </nav>

          {/* Page Header */}
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#9E7D2E] font-bold">
              {pageData.badge || "Suratbazar Handloom Archives"}
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-semibold text-[#2D0A10] mt-2 mb-3 leading-tight">
              {pageData.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
              {pageData.subtitle}
            </p>
          </div>

          {/* Page Content Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-amber-900/10 p-6 sm:p-12 shadow-sm">
            {contentToRender}
          </div>

          {/* Back to Sarees CTA footer */}
          <div className="mt-12 text-center">
            <Link
              href="/collections/sarees"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs uppercase tracking-widest font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Explore Handcrafted Sarees</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
