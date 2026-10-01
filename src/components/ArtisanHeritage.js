import Image from "next/image";
import { Sparkles, Award, HeartHandshake, Feather } from "lucide-react";

export default function ArtisanHeritage() {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Visual Grid */}
          <div className="relative">
            <div className="relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10">
              <Image
                src="/banners/hero-3.png"
                alt="Artisan Crafting Saree"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                  Preserving 400 Years of Weaving
                </span>
                <h4 className="font-serif-luxury text-2xl font-medium mt-1">
                  The Timeless Soul of Indian Handlooms
                </h4>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-amber-900/15 max-w-[220px] backdrop-blur-md">
              <div className="flex items-center gap-3 mb-1">
                <Award className="w-6 h-6 text-[#9E7D2E]" />
                <span className="text-xs font-bold text-stone-900">Silk Mark Certified</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-tight">
                Authentic 100% natural Mulberry & Katan silks guaranteed.
              </p>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/60 border border-amber-300/40 text-xs font-semibold uppercase tracking-wider text-[#9E7D2E]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Artisanal Legacy</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-medium text-[#2D0A10] leading-tight">
              Where Master Weavers Bring Dreams to Fabric
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              At <strong className="text-stone-900 font-semibold">SURATBAZAR</strong>, every drape is more than an attire — it is an heirloom crafted through weeks of meticulous patience on traditional pit looms. Sourced directly from Gujarat and master weaver families across India.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#F4EFE6] border border-amber-900/10">
                <HeartHandshake className="w-5 h-5 text-[#9E7D2E] mb-2" />
                <h5 className="font-serif-luxury text-lg font-semibold text-stone-900">Direct Fair Trade</h5>
                <p className="text-xs text-stone-500 mt-1">No middlemen, empowering over 450 artisan families directly.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F4EFE6] border border-amber-900/10">
                <Feather className="w-5 h-5 text-[#9E7D2E] mb-2" />
                <h5 className="font-serif-luxury text-lg font-semibold text-stone-900">Pure Gold & Silver Zari</h5>
                <p className="text-xs text-stone-500 mt-1">Authentic electroplated silver & gold threads that never tarnish.</p>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="#artisan-story"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Read Our Weaver Chronicle
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
