import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const OCCASIONS_DATA = [
  {
    id: "wedding",
    name: "Wedding",
    subtitle: "Bridal Pattu & Zari",
    image: "/products/bridal.jpg",
    href: "/collections/occasion/wedding",
    badge: "Royal Bride"
  },
  {
    id: "engagement",
    name: "Engagement",
    subtitle: "Pastels & Shimmer",
    image: "/products/pistachio-pattu.jpg",
    href: "/collections/occasion/engagement",
    badge: "Roka Special"
  },
  {
    id: "haldi",
    name: "Haldi",
    subtitle: "Sunshine Silks",
    image: "/products/chiffon.jpg",
    href: "/collections/occasion/haldi",
    badge: "Auspicious"
  },
  {
    id: "mehendi",
    name: "Mehendi",
    subtitle: "Leheriya & Bandhej",
    image: "/products/leheriya.jpg",
    href: "/collections/occasion/mehendi",
    badge: "Celebration"
  },
  {
    id: "reception",
    name: "Reception",
    subtitle: "Molten Gold Weaves",
    image: "/products/tissue.jpg",
    href: "/collections/occasion/reception",
    badge: "Evening Glam"
  },
  {
    id: "festive",
    name: "Festive",
    subtitle: "Diwali & Navratri",
    image: "/products/paithani.jpg",
    href: "/collections/occasion/festive",
    badge: "Utsav Edit"
  },
  {
    id: "party",
    name: "Cocktail Party",
    subtitle: "Midnight & Brocades",
    image: "/products/black-brocade.jpg",
    href: "/collections/occasion/party",
    badge: "Soirée"
  }
];

export default function ShopByOccasion({ occasions = OCCASIONS_DATA }) {
  return (
    <section className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#9E7D2E] font-bold">
            Celebration Moments
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-medium text-[#2D0A10] mt-1 mb-2">
            Shop By Occasion
          </h2>
          <div className="w-12 h-0.5 bg-[#C5A049] mx-auto" />
        </div>

        {/* 
          Occasion Grid:
          - Desktop: 4–7 cards in clean responsive grid (grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7)
          - Mobile: 2-column layout (grid-cols-2)
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {occasions.map((occ) => (
            <Link
              key={occ.id}
              href={occ.href}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-amber-900/10 hover:border-[#3E0C15] hover:shadow-xl transition-all duration-300 relative"
            >
              {/* Image Box */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
                <Image
                  src={occ.image}
                  alt={occ.name}
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 14vw"
                />

                {/* Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Badge */}
                {occ.badge && (
                  <span className="absolute top-2 left-2 text-[8px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-amber-300 backdrop-blur-md border border-amber-500/30">
                    {occ.badge}
                  </span>
                )}
              </div>

              {/* Title & Link */}
              <div className="p-3 flex flex-col justify-between flex-1 bg-white text-center">
                <div>
                  <h3 className="font-serif-luxury text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#3E0C15] transition-colors leading-tight">
                    {occ.name}
                  </h3>
                  <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                    {occ.subtitle}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#3E0C15] group-hover:text-amber-700 transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
