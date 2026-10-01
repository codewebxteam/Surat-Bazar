import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    title: "Banarasi Silks",
    subtitle: "Varanasi Antique Kadwa & Jangla",
    image: "/products/banarasi.jpg",
    count: "140+ Designs",
    tag: "Handloom Heirloom",
    href: "/collections/banarasi"
  },
  {
    title: "Kanjeevaram Pattu",
    subtitle: "Temple Borders & Pure Gold Zari",
    image: "/products/kanjeevaram.jpg",
    count: "95+ Designs",
    tag: "Bridal Muhurtham",
    href: "/collections/kanjeevaram"
  },
  {
    title: "Organza & Tissue",
    subtitle: "Featherlight Drapes with Resham",
    image: "/products/organza.jpg",
    count: "80+ Designs",
    tag: "Cocktail & Soirée",
    href: "/collections/organza"
  },
  {
    title: "Georgette & Scallops",
    subtitle: "Modern Silhouettes & Zardozi",
    image: "/products/georgette.jpg",
    count: "110+ Designs",
    tag: "Festive Glam",
    href: "/collections/georgette"
  }
];

export default function CuratedCategories() {
  return (
    <section id="collection" className="py-16 sm:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#9E7D2E] font-semibold">
            Curated Weaves
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-medium text-[#2D0A10] mt-2 mb-4">
            Explore Handcrafted Collections
          </h2>
          <div className="w-16 h-0.5 bg-[#C5A049] mx-auto mb-4" />
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Every saree tells a centuries-old story of master artisans, pure mulberry silk, and untarnished gold zari.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <a
              key={idx}
              href={cat.href}
              className="group relative h-[380px] sm:h-[420px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-6 border border-amber-900/10"
            >
              {/* Image */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:via-black/50 transition-colors" />

              {/* Top Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-black/60 text-amber-300 backdrop-blur-md border border-amber-500/30">
                  {cat.tag}
                </span>
              </div>

              {/* Bottom Details */}
              <div className="relative z-10 text-white">
                <span className="text-xs text-amber-300 font-mono">
                  {cat.count}
                </span>
                <h3 className="font-serif-luxury text-2xl font-medium mt-1 mb-1 text-white group-hover:text-amber-200 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-1 mb-3">
                  {cat.subtitle}
                </p>

                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Edit</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
