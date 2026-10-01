import Link from "next/link";
import { ArrowRight, Feather, Sparkles } from "lucide-react";

export const FABRICS_DATA = [
  {
    id: "silk",
    name: "Silk",
    fullname: "100% Pure Mulberry Silk",
    desc: "Silk Mark certified natural mulberry silks with unmatched natural sheen and durability.",
    badge: "100% Pure",
    count: "120+ Sarees",
    href: "/collections/fabric/silk",
  },
  {
    id: "banarasi",
    name: "Banarasi",
    fullname: "Pure Banarasi Katan Silk",
    desc: "Lustrous, high-twist pure yarn woven with gold kadwa brocade on Varanasi pit-looms.",
    badge: "Kadwa Weave",
    count: "95+ Sarees",
    href: "/collections/fabric/banarasi",
  },
  {
    id: "organza",
    name: "Organza",
    fullname: "Silk Organza & Tissue",
    desc: "Crisp yet fluid sheer fabrics with metallic zari woven directly into the base.",
    badge: "Featherlight",
    count: "70+ Sarees",
    href: "/collections/fabric/organza",
  },
  {
    id: "georgette",
    name: "Georgette",
    fullname: "Pure Silk Georgette",
    desc: "Flowy, crinkled texture that drapes like liquid royalty with hand-embroidered scallops.",
    badge: "Modern Glam",
    count: "85+ Sarees",
    href: "/collections/fabric/georgette",
  },
  {
    id: "chiffon",
    name: "Chiffon",
    fullname: "Khaddi Chiffon",
    desc: "Airy, breathable handloom chiffon adorned with authentic Kutch rai bandhej tie-dye.",
    badge: "Bandhej Craft",
    count: "50+ Sarees",
    href: "/collections/fabric/chiffon",
  },
  {
    id: "cotton",
    name: "Cotton",
    fullname: "Handloom Chanderi Cotton",
    desc: "Soft, breathable hand-spun cotton textiles with subtle zari borders for everyday grace.",
    badge: "Breathable",
    count: "45+ Sarees",
    href: "/collections/fabric/cotton",
  },
  {
    id: "chanderi",
    name: "Chanderi",
    fullname: "Chanderi Silk Cotton",
    desc: "Historical Madhya Pradesh handlooms woven with fine cotton warp and silk gold buttis.",
    badge: "Artisanal",
    count: "60+ Sarees",
    href: "/collections/fabric/chanderi",
  },
  {
    id: "tissue",
    name: "Tissue",
    fullname: "Molten Metallic Tissue",
    desc: "High-glamour metallic gold & silver threads reflecting royal luxury at every celebration.",
    badge: "Royal Zari",
    count: "40+ Sarees",
    href: "/collections/fabric/tissue",
  }
];

export default function ShopByFabric({ fabrics = FABRICS_DATA }) {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#F5EFE6]/60 border-t border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#9E7D2E] font-bold">
            Sacred Textile Archives
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-medium text-[#2D0A10] mt-1 mb-2">
            Shop By Fabric
          </h2>
          <div className="w-12 h-0.5 bg-[#C5A049] mx-auto" />
        </div>

        {/* 
          Fabric Grid:
          - Desktop (lg): Exactly 4 cards per row (8 cards total across 2 rows)
          - Mobile (sm/mobile): Exactly 2 cards per row (grid-cols-2)
        */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {fabrics.map((fab) => (
            <Link
              key={fab.id}
              href={fab.href}
              className="group p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-white border border-amber-900/10 hover:border-[#3E0C15] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-2.5">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-100 text-[#3E0C15]">
                    {fab.badge}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-stone-400">
                    {fab.count}
                  </span>
                </div>

                <h3 className="font-serif-luxury text-lg sm:text-xl md:text-2xl font-bold text-stone-900 group-hover:text-[#3E0C15] transition-colors mb-1">
                  {fab.name}
                </h3>
                
                <h4 className="text-[11px] font-semibold text-[#9E7D2E] mb-1.5">
                  {fab.fullname}
                </h4>

                <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed hidden xs:block">
                  {fab.desc}
                </p>
              </div>

              <div className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#3E0C15] group-hover:text-amber-700 mt-4 pt-3 border-t border-stone-100 transition-colors">
                <span>View Fabric Edit</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
