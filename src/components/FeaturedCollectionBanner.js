import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Award } from "lucide-react";

export default function FeaturedCollectionBanner({
  title = "THE WEDDING COLLECTION",
  subtitle = "Sacred Kanjeevaram Korvai Pattu, Varanasi Shikargah Brocades & 24k Gold Dipped Zari Drapes.",
  badge = "Exclusive Bridal Vault 2026",
  desktopArtwork = "/products/bridal.jpg",
  mobileArtwork = "/products/bridal.jpg",
  ctaText = "Explore The Wedding Collection",
  ctaUrl = "/collections/occasion/wedding",
  secondaryCtaText = "Book Bridal Consultation",
  secondaryCtaUrl = "/pages/contact-us",
}) {
  return (
    <section className="w-full bg-[#180E0B] py-12 sm:py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Main Large Campaign Container */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#2D0A10] via-[#3E0C15] to-[#1F070B] border border-amber-500/30 shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] sm:min-h-[520px] lg:min-h-[480px]">
            
            {/* Left Content Area (7 cols on lg) */}
            <div className="lg:col-span-7 p-6 sm:p-10 md:p-14 z-20 flex flex-col justify-center text-white space-y-4 sm:space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs uppercase font-bold tracking-widest w-fit">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{badge}</span>
              </div>

              {/* Campaign Heading */}
              <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.12] tracking-tight text-[#FAF7F2] drop-shadow-md">
                {title}
              </h2>

              {/* Subheading */}
              <p className="text-stone-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-light">
                {subtitle}
              </p>

              {/* Trust & Craft Marks */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-amber-200/90 pt-1">
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-amber-500/20 backdrop-blur-md">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Silk Mark 100% Certified</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-amber-500/20 backdrop-blur-md">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Solid 24k Gold Zari</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-3">
                {/* Primary CTA (Opens /collections/wedding or configured collection URL) */}
                <Link
                  href={ctaUrl}
                  className="inline-flex items-center gap-2 px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-xl hover:shadow-amber-500/30 transition-all active:scale-95 group"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                {/* Secondary Consultation Link */}
                <Link
                  href={secondaryCtaUrl}
                  className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs sm:text-sm font-semibold transition-all active:scale-95 backdrop-blur-md"
                >
                  <span>{secondaryCtaText}</span>
                </Link>
              </div>

            </div>

            {/* Right Artwork Area (5 cols on lg) with SEPARATE Desktop & Mobile Artwork */}
            <div className="lg:col-span-5 relative w-full h-72 sm:h-96 lg:h-full min-h-[320px] overflow-hidden">
              
              {/* 1. Desktop Artwork (Widescreen landscape orientation) */}
              <div className="hidden lg:block absolute inset-0 w-full h-full">
                <Image
                  src={desktopArtwork}
                  alt={`${title} - Desktop Campaign Artwork`}
                  fill
                  className="object-cover object-center"
                  sizes="45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#2D0A10] via-transparent to-transparent" />
              </div>

              {/* 2. Separate Mobile Artwork (Portrait vertical artwork, not cropped) */}
              <div className="block lg:hidden absolute inset-0 w-full h-full">
                <Image
                  src={mobileArtwork}
                  alt={`${title} - Mobile Campaign Artwork`}
                  fill
                  className="object-cover object-top"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D0A10] via-transparent to-transparent" />
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
