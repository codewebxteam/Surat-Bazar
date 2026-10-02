import Image from "next/image";
import Link from "next/link";
import { Sparkles, Award, HeartHandshake, Feather, ArrowRight } from "lucide-react";

export default function BrandStory() {
  return (
    <section className="py-14 sm:py-20 md:py-24 bg-[#FAF7F2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* 
          Two-column grid on Desktop (lg:grid-cols-2).
          Sequential order on Mobile: Image (1st) -> Content (2nd) -> CTA (3rd).
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* 1. Image (Mobile 1st, Desktop Left Column) */}
          <div className="relative w-full">
            <div className="relative h-[340px] sm:h-[440px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-amber-900/15">
              <Image
                src="/products/banarasi.jpg"
                alt="Vastra Master Weaver Heritage"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              
              <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 right-5 sm:right-6 text-white">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-300 font-bold block mb-1">
                  Preserving 400 Years of Loom Artistry
                </span>
                <h4 className="font-serif-luxury text-xl sm:text-2xl md:text-3xl font-medium leading-snug">
                  "Every warp and weft carries the sacred heartbeat of India."
                </h4>
              </div>
            </div>

            {/* Floating Silk Mark Certified Badge */}
            <div className="absolute bottom-3 right-3 sm:-bottom-4 sm:right-6 bg-white/95 sm:bg-white p-3 sm:p-5 rounded-2xl shadow-xl border border-amber-900/15 max-w-[190px] sm:max-w-[230px] backdrop-blur-md z-10">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#9E7D2E] shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold text-stone-900">Silk Mark Certified</span>
              </div>
              <p className="text-[9px] sm:text-[11px] text-stone-500 leading-tight">
                Authentic 100% natural Mulberry & Katan silks guaranteed.
              </p>
            </div>
          </div>

          {/* 2. Content & 3. CTA (Mobile 2nd & 3rd, Desktop Right Column) */}
          <div className="space-y-5 sm:space-y-6 pt-4 lg:pt-0">
            
            {/* Pre-title Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/70 border border-amber-300/50 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#9E7D2E]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Artisanal Legacy</span>
            </div>

            {/* Heading */}
            <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#2D0A10] leading-tight">
              Where Master Weavers Bring Dreams to Fabric
            </h2>

            {/* Story Paragraph */}
            <p className="text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed font-light">
              At <strong className="text-stone-950 font-semibold">Suratbazar</strong>, every drape is an heirloom crafted through weeks of unbroken patience on traditional looms. Sourced directly from Surat&apos;s master textile archives and heritage artisan hubs across India with zero middlemen.
            </p>

            {/* USPs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-1">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F4EFE6] border border-amber-900/10">
                <HeartHandshake className="w-5 h-5 text-[#9E7D2E] mb-2" />
                <h5 className="font-serif-luxury text-base sm:text-lg font-bold text-stone-900">Direct Fair Trade</h5>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-1">Empowering 450+ weaver families with living wages and healthcare.</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#F4EFE6] border border-amber-900/10">
                <Feather className="w-5 h-5 text-[#9E7D2E] mb-2" />
                <h5 className="font-serif-luxury text-base sm:text-lg font-bold text-stone-900">Untarnished Gold Zari</h5>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-1">Real silver electroplated gold zari that retains its luster forever.</p>
              </div>
            </div>

            {/* 3. CTA Button: OUR STORY -> /pages/about-us */}
            <div className="pt-2">
              <Link
                href="/pages/about-us"
                className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs sm:text-sm font-bold uppercase tracking-widest shadow-md hover:shadow-xl transition-all active:scale-95 group"
              >
                <span>OUR STORY</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
