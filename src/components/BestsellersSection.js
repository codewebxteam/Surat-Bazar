import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/data/products";

export default function BestsellersSection() {
  // Filter distinct bestsellers sarees
  const allBestsellers = PRODUCTS.filter((p) => p.isBestseller).slice(0, 8);

  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2] border-t border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#9E7D2E] font-bold">
                Royal Spotlight
              </span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#2D0A10]">
              Bestselling Masterpieces
            </h2>
          </div>

          {/* View All Button -> /bestsellers */}
          <Link
            href="/bestsellers"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3E0C15] hover:text-[#571520] transition-colors group"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 
          Responsive Grid:
          - Desktop (lg): 4 products/row (8 products total across 2 rows)
          - Mobile: 2 products/row (6 initial products shown on mobile)
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6">
          {allBestsellers.map((product, index) => (
            <div 
              key={product.id}
              className={index >= 6 ? "hidden lg:block" : "block"}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile View All Bottom CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/bestsellers"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#3E0C15] text-[#F7EFCF] text-xs font-bold uppercase tracking-wider w-full shadow-md"
          >
            <span>View All Bestsellers ({PRODUCTS.filter((p) => p.isBestseller).length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
