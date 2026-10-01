"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Quote, CheckCircle2, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { TESTIMONIALS } from "@/data/reviews";

export const TESTIMONIALS_DATA = TESTIMONIALS;

export default function CustomerTestimonials({ testimonials = TESTIMONIALS }) {
  const [mobileIndex, setMobileIndex] = useState(0);

  const nextMobile = useCallback(() => {
    setMobileIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevMobile = useCallback(() => {
    setMobileIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Auto-rotate mobile slider every 4.5s
  useEffect(() => {
    const timer = setInterval(() => {
      nextMobile();
    }, 4500);
    return () => clearInterval(timer);
  }, [nextMobile]);

  const renderCard = (t) => (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative">
      <div>
        {/* 5 Gold Stars Rating */}
        <div className="flex items-center gap-1 text-amber-500 mb-3.5">
          {[...Array(t.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>

        <Quote className="w-7 h-7 text-amber-400/30 mb-2" />

        {/* Review Text */}
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-6">
          "{t.review}"
        </p>
      </div>

      {/* Customer Name, Location & Verified Purchase Label */}
      <div className="pt-4 border-t border-stone-100">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h4 className="font-serif-luxury text-base font-bold text-stone-900 leading-tight">
              {t.name}
            </h4>
            <span className="text-[11px] text-stone-500">
              {t.location} • {t.occasion}
            </span>
          </div>

          {/* Optional Verified Purchase Label */}
          {t.isVerified && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Verified Purchase</span>
            </div>
          )}
        </div>

        <div className="text-[10px] sm:text-[11px] text-[#9E7D2E] font-medium mt-2">
          Draped in: <span className="font-semibold text-stone-800">{t.saree}</span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-14 sm:py-20 md:py-24 bg-[#F5EFE6]/60 border-t border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#9E7D2E] font-bold">
            Cherished Celebrations
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-medium text-[#2D0A10] mt-1 mb-2">
            Voices of Our Royal Brides
          </h2>
          <div className="w-12 h-0.5 bg-[#C5A049] mx-auto" />
        </div>

        {/* ================= DESKTOP VIEW: ~3 VISIBLE IN A ROW (md+) ================= */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t) => (
            <div key={t.id} className="h-full">
              {renderCard(t)}
            </div>
          ))}
        </div>

        {/* ================= MOBILE VIEW: 1 VISIBLE WITH SLIDER (< md) ================= */}
        <div className="block md:hidden relative px-2">
          
          {/* Active 1 Testimonial Slide */}
          <div className="min-h-[320px]">
            {renderCard(testimonials[mobileIndex])}
          </div>

          {/* Mobile Slider Navigation Controls */}
          <div className="flex items-center justify-between mt-6 px-2">
            {/* Prev Arrow */}
            <button
              onClick={prevMobile}
              aria-label="Previous testimonial"
              className="w-9 h-9 rounded-full bg-white border border-stone-300 text-stone-700 flex items-center justify-center shadow-sm active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Indicator Dots */}
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setMobileIndex(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === mobileIndex ? "w-6 bg-[#3E0C15]" : "w-2 bg-stone-300"
                  }`}
                />
              ))}
            </div>

            {/* Next Arrow */}
            <button
              onClick={nextMobile}
              aria-label="Next testimonial"
              className="w-9 h-9 rounded-full bg-white border border-stone-300 text-stone-700 flex items-center justify-center shadow-sm active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
