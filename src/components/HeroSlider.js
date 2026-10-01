"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { HERO_SLIDES } from "@/data/banners";

export const HERO_CAMPAIGN_SLIDES = HERO_SLIDES;

export default function HeroSlider({ slides = HERO_SLIDES, interval = 4000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-scroll slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, interval);
    return () => clearInterval(timer);
  }, [interval, nextSlide]);

  return (
    <section className="relative w-full bg-[#120B08] overflow-hidden select-none">
      
      {/* 
        Responsive Carousel Container:
        - Desktop: Widescreen campaign banner (aspect-[1024/341])
        - Mobile: Dedicated portrait artwork container (aspect-[3/4] / min-h-[500px])
      */}
      <div className="relative w-full md:aspect-[1024/341] h-[520px] sm:h-[580px] md:h-auto overflow-hidden bg-black">
        
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-[1.02] pointer-events-none"
              } transition-transform duration-1000`}
            >
              {/* 1. Desktop Artwork (Widescreen 1024:341) */}
              <div className="hidden md:block absolute inset-0 w-full h-full">
                <Image
                  src={slide.desktopBanner}
                  alt={`${slide.heading} - Desktop Campaign`}
                  fill
                  priority={index === 0}
                  className="w-full h-full object-fill"
                  sizes="100vw"
                  quality={95}
                />
              </div>

              {/* 2. Dedicated Mobile Artwork (Separate portrait 3:4 artwork, not cropped) */}
              <div className="block md:hidden absolute inset-0 w-full h-full">
                <Image
                  src={slide.mobileBanner}
                  alt={`${slide.heading} - Mobile Campaign`}
                  fill
                  priority={index === 0}
                  className="w-full h-full object-cover object-top"
                  sizes="100vw"
                  quality={95}
                />
              </div>

              {/* Gradient Scrim for text readability on mobile & desktop (darkens from right side on desktop) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 md:bg-gradient-to-l md:from-black/85 md:via-black/45 md:to-transparent" />

              {/* Content Overlay: Heading, Subheading, Badge, CTA (Right Aligned) */}
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col justify-end pb-16 sm:pb-20 md:justify-center items-end md:pb-0 z-20">
                <div className="max-w-xl text-white flex flex-col items-end text-right">
                  
                  {/* Badge */}
                  {slide.badge && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-black/60 text-amber-300 border border-amber-400/40 backdrop-blur-md mb-2.5 sm:mb-3 self-end">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>{slide.badge}</span>
                    </div>
                  )}

                  {/* Heading */}
                  <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-[1.15] tracking-tight text-[#FAF7F2] drop-shadow-md mb-2 sm:mb-3 text-right">
                    {slide.heading}
                  </h1>

                  {/* Subheading */}
                  <p className="text-xs sm:text-sm md:text-base text-stone-200 font-light leading-relaxed max-w-md mb-4 sm:mb-5 line-clamp-2 drop-shadow ml-auto text-right">
                    {slide.subheading}
                  </p>

                  {/* CTA Button -> Opens relevant collection URL */}
                  <div className="mt-1 self-end">
                    <Link
                      href={slide.ctaUrl}
                      className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-xl hover:shadow-amber-500/30 transition-all active:scale-95"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>

                </div>
              </div>

            </div>
          );
        })}

        {/* Navigation Left Arrow */}
        <button
          onClick={(e) => { e.preventDefault(); prevSlide(); }}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </button>

        {/* Navigation Right Arrow */}
        <button
          onClick={(e) => { e.preventDefault(); nextSlide(); }}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </button>

        {/* Bottom Slide Indicators & Counter */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 inset-x-0 z-30 flex justify-center items-center">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 sm:px-4 py-1.5 rounded-full border border-white/15">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? "w-6 sm:w-8 bg-amber-400"
                    : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}
