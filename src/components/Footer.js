"use client";

import Link from "next/link";
import { 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { FOOTER_COLUMNS } from "@/data/navigation";
import { SITE_CONFIG } from "@/data/siteConfig";
import VastraLogo from "@/components/VastraLogo";

export default function Footer({ 
  columns = FOOTER_COLUMNS, 
  config = SITE_CONFIG 
}) {
  return (
    <footer className="bg-[#120705] text-[#FAF7F2] border-t border-amber-900/40 relative overflow-hidden">
      
      {/* Subtle background luxury glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 pb-12 relative z-10">
        
        {/* Top Brand Banner Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 mb-12 border-b border-white/10">
          <div>
            <VastraLogo variant="light" size="large" />
            <p className="text-stone-400 text-xs mt-3 max-w-md leading-relaxed font-light">
              Preserving India&apos;s sacred master weaving heritage. From ancient Varanasi pit-looms to royal celebrations worldwide.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>100% Silk Mark Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Pit-Loom Authentic</span>
            </div>
          </div>
        </div>

        {/* Dynamic 5-Column Grid Layout: SHOP | CUSTOMER CARE | ABOUT | INFORMATION | SOCIAL */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-8 pb-12">
          {columns.map((col) => (
            <div key={col.id} className={col.id === "social" ? "col-span-2 sm:col-span-1" : ""}>
              <h4 className="text-xs uppercase tracking-[0.2em] text-amber-400 font-bold mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-300">
                {col.links.map((link, idx) => (
                  <li key={idx}>
                    {link.isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors group"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="w-3 h-3 text-stone-500 group-hover:text-amber-300 transition-colors" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className={`hover:text-amber-300 transition-colors ${
                          link.label === "Sale" ? "text-amber-400 font-semibold" : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Area: Copyright + Payment Icons */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-400">
          
          {/* Copyright & Entity */}
          <div className="text-center md:text-left space-y-1">
            <p>© 2026 {config.brandName} Handlooms Pvt. Ltd. All rights reserved.</p>
            <p className="text-[11px] text-stone-500 font-light">
              Crafted in reverence of the Indian Handloom Tradition. Silk Mark Registered.
            </p>
          </div>

          {/* Payment Methods Badges (UPI, Visa, Mastercard, RuPay, Amex) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            
            {/* UPI Badge */}
            <div className="px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1.5 text-stone-200">
              <span className="font-mono font-extrabold text-[11px] text-emerald-400">UPI</span>
            </div>

            {/* Visa Badge */}
            <div className="px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1 text-stone-200">
              <span className="font-serif text-[11px] font-extrabold italic tracking-wider text-amber-300">VISA</span>
            </div>

            {/* Mastercard Badge */}
            <div className="px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1">
              <div className="flex -space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 opacity-90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 opacity-90 inline-block" />
              </div>
              <span className="font-sans text-[10px] font-bold text-stone-200 ml-1">mastercard</span>
            </div>

            {/* RuPay Badge */}
            <div className="px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1">
              <span className="font-sans text-[10px] font-extrabold tracking-wider text-sky-400">RuPay</span>
            </div>

            {/* Amex Badge */}
            <div className="px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1">
              <span className="font-sans text-[10px] font-bold tracking-tight text-blue-300">AMEX</span>
            </div>

            {/* SSL Badge */}
            <div className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1 text-[10px] text-stone-400">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>256-Bit SSL</span>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}
