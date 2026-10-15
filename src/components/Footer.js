"use client";

import Link from "next/link";
import { 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  MessageCircle
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 mb-8 border-b border-white/10">
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

        {/* Surat Headquarter & Concierge Strip */}
        <div className="mb-10 p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs text-stone-300">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Surat Flagship Studio &amp; Head Office:</span>
              <span className="text-stone-400 text-[11px] leading-relaxed">{config.contact.address}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 shrink-0">
            <a 
              href={`tel:${config.contact.phone.replace(/[^0-9+]/g, '')}`} 
              className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{config.contact.phone}</span>
            </a>
            <a 
              href={`https://wa.me/${config.contact.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Suratbazar%2C%20I%20have%20an%20inquiry`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Concierge</span>
            </a>
            <a 
              href={`mailto:${config.contact.email}`} 
              className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{config.contact.email}</span>
            </a>
          </div>
        </div>

        {/* 4-Column Balanced Grid Layout: SHOP | CUSTOMER CARE | ABOUT & LEGAL | FOLLOW US */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pb-12">
          {columns.map((col) => (
            <div key={col.id}>
              <h4 className="text-xs uppercase tracking-[0.2em] text-amber-400 font-bold mb-4">
                {col.title}
              </h4>
              
              {col.id === "social" ? (
                <ul className="space-y-3 text-xs text-stone-300">
                  {col.links.map((link, idx) => {
                    const isInsta = link.label.toLowerCase().includes("instagram");
                    return (
                      <li key={idx}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-amber-400/40 text-stone-300 hover:text-amber-300 transition-all group w-full"
                        >
                          {isInsta ? (
                            <svg className="w-4 h-4 fill-current text-pink-400 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 fill-current text-blue-400 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          )}
                          <span className="font-medium">{link.label}</span>
                          <ArrowUpRight className="w-3 h-3 text-stone-500 group-hover:text-amber-300 transition-colors ml-auto" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul className="space-y-2.5 text-xs text-stone-300">
                  {col.links.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        href={link.href}
                        className={`hover:text-amber-300 transition-colors ${
                          link.label === "Sale" ? "text-amber-400 font-semibold" : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Area: Copyright + Payment Icons */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-400">
          
          {/* Copyright & Entity */}
          <div className="text-center md:text-left space-y-1">
            <p>© 2026 {config.brandName} Handlooms Pvt. Ltd. All rights reserved. <Link href="/admin" className="inline-block ml-2 text-stone-700 hover:text-stone-400 opacity-50 transition-colors text-[10px]">Admin</Link></p>
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
