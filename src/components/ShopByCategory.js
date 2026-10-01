import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const CATEGORIES_DATA = [
  {
    id: "banarasi",
    name: "Banarasi Silks",
    subtitle: "Kadwa & Katan",
    image: "/products/banarasi.jpg",
    href: "/collections/banarasi",
    badge: "Varanasi Heritage"
  },
  {
    id: "kanjeevaram",
    name: "Kanjeevaram Pattu",
    subtitle: "Temple Korvai",
    image: "/products/kanjeevaram.jpg",
    href: "/collections/kanjeevaram",
    badge: "Pure Zari"
  },
  {
    id: "paithani",
    name: "Yeola Paithani",
    subtitle: "Muniya Gold Pallu",
    image: "/products/paithani.jpg",
    href: "/collections/paithani",
    badge: "Maharashtra"
  },
  {
    id: "patola",
    name: "Patan Patola",
    subtitle: "Double Ikat Silk",
    image: "/products/patola.jpg",
    href: "/collections/patola",
    badge: "Rare Weave"
  },
  {
    id: "organza",
    name: "Organza & Tissue",
    subtitle: "Rose Gold Sheen",
    image: "/products/rose-tissue.jpg",
    href: "/collections/organza",
    badge: "Featherlight"
  },
  {
    id: "georgette",
    name: "Silk Georgette",
    subtitle: "Scalloped & Chikankari",
    image: "/products/georgette.jpg",
    href: "/collections/georgette",
    badge: "Festive Glam"
  },
  {
    id: "chiffon",
    name: "Gharchola & Bandhej",
    subtitle: "Hand-Tied Dots",
    image: "/products/gharchola-bandhani.jpg",
    href: "/collections/chiffon",
    badge: "Tie-Dye"
  },
  {
    id: "chanderi",
    name: "Chanderi & Tussar",
    subtitle: "Handloom Weaves",
    image: "/products/chanderi.jpg",
    href: "/collections/chanderi",
    badge: "Artisanal"
  }
];

export default function ShopByCategory({ categories = CATEGORIES_DATA }) {
  return (
    <section className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#9E7D2E] font-bold">
            Sacred Weaving Heritage
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-medium text-[#2D0A10] mt-1 mb-2">
            Shop By Category
          </h2>
          <div className="w-12 h-0.5 bg-[#C5A049] mx-auto" />
        </div>

        {/* 
          Category Grid:
          - Desktop (lg): 4 cards per row across 2 rows (8 categories total)
          - Mobile (grid-cols-2): 2 cards per row
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-amber-900/10 hover:border-[#3E0C15] hover:shadow-xl transition-all duration-300 relative"
            >
              {/* Category Image Box */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Micro Badge */}
                {cat.badge && (
                  <span className="absolute top-2.5 left-2.5 text-[8px] sm:text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-black/60 text-amber-300 backdrop-blur-md border border-amber-500/30">
                    {cat.badge}
                  </span>
                )}
              </div>

              {/* Category Label & CTA */}
              <div className="p-3.5 flex flex-col justify-between flex-1 bg-white text-center">
                <div>
                  <h3 className="font-serif-luxury text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#3E0C15] transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                    {cat.subtitle}
                  </p>
                </div>

                {/* Shop Now Action */}
                <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#3E0C15] group-hover:text-amber-700 transition-colors">
                  <span>Shop Collection</span>
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
