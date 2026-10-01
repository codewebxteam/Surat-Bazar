"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Sparkles, X, ChevronDown } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleQueryChange = (val) => {
    setQuery(val);
    if (val.trim()) {
      router.replace(`/search?q=${encodeURIComponent(val.trim())}`, { scroll: false });
    } else {
      router.replace(`/search`, { scroll: false });
    }
  };

  const results = useMemo(() => {
    let list = PRODUCTS;
    if (query.trim()) {
      const lower = query.toLowerCase();
      list = PRODUCTS.filter((item) => {
        return (
          item.name.toLowerCase().includes(lower) ||
          item.category.toLowerCase().includes(lower) ||
          item.categoryName.toLowerCase().includes(lower) ||
          item.fabric.toLowerCase().includes(lower) ||
          item.fabricName.toLowerCase().includes(lower) ||
          item.color.toLowerCase().includes(lower) ||
          item.colorName.toLowerCase().includes(lower) ||
          item.occasion.toLowerCase().includes(lower) ||
          item.occasionName.toLowerCase().includes(lower) ||
          item.description.toLowerCase().includes(lower)
        );
      });
    }

    return [...list].sort((a, b) => {
      if (sortBy === "price-low-high") return a.price - b.price;
      if (sortBy === "price-high-low") return b.price - a.price;
      if (sortBy === "newest") return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      if (sortBy === "best-selling") return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0) || b.reviewsCount - a.reviewsCount;
      if (sortBy === "rating") return b.rating - a.rating || b.reviewsCount - a.reviewsCount;
      return 0; // default "featured"
    });
  }, [query, sortBy]);

  // Popular search keywords explicitly requested: Silk Saree, Wedding Saree, Banarasi, Organza
  const popularKeywords = [
    "Silk Saree", 
    "Wedding Saree", 
    "Banarasi", 
    "Organza", 
    "Kanjeevaram", 
    "Georgette",
    "Rani Pink", 
    "Emerald Green"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
      
      {/* Search Header Bar */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-[#9E7D2E] font-semibold">
          Artisan Vault Search
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-medium text-[#2D0A10] mt-1.5 mb-6">
          Find Your Perfect Drape
        </h1>

        <div className="relative w-full shadow-md rounded-full">
          <input
            type="text"
            id="search-input-field"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search by weave, fabric, color, or occasion (e.g. Banarasi, Silk Saree, Organza)..."
            className="w-full bg-white border border-stone-300 rounded-full pl-12 pr-10 py-4 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#3E0C15] focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          {query && (
            <button
              onClick={() => handleQueryChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggested Popular Searches */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          <span className="text-xs text-stone-500 font-medium">Popular Searches:</span>
          {popularKeywords.map((tag) => (
            <button
              key={tag}
              onClick={() => handleQueryChange(tag)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all shadow-xs cursor-pointer ${
                query.toLowerCase() === tag.toLowerCase()
                  ? "bg-[#3E0C15] text-[#F7EFCF] border-[#3E0C15] font-semibold"
                  : "bg-white hover:bg-[#3E0C15] hover:text-[#F7EFCF] text-stone-700 border-stone-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header with Count & Sort */}
      <div className="pb-4 mb-8 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs sm:text-sm text-stone-600 font-medium">
          {query ? (
            <>Search results for &ldquo;<strong className="text-stone-950">{query}</strong>&rdquo;: </>
          ) : (
            <>All Handcrafted Collections: </>
          )}
          <strong className="text-stone-950 font-bold">{results.length} Sarees</strong>
        </span>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium hidden sm:inline">Sort By:</span>
          <div className="relative">
            <select
              aria-label="Sort search results"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-stone-300 hover:border-amber-700/50 rounded-xl text-xs font-semibold text-stone-800 pl-3.5 pr-8 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="best-selling">Best Selling</option>
              <option value="rating">Rating</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Grid: Desktop 4 products/row, Mobile 2 products/row */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 sm:p-16 text-center max-w-lg mx-auto my-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-serif-luxury text-2xl font-semibold text-stone-900">
            No matching sarees found
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-2.5 leading-relaxed max-w-sm mx-auto">
            Try searching with popular terms like &ldquo;Silk Saree&rdquo;, &ldquo;Banarasi&rdquo;, &ldquo;Wedding Saree&rdquo;, or &ldquo;Organza&rdquo;.
          </p>
          <button
            onClick={() => handleQueryChange("")}
            className="mt-6 px-8 py-3 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs font-semibold transition-all shadow cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <main className="w-full bg-[#FAF7F2] min-h-screen">
        <Suspense fallback={<div className="text-center py-20 text-stone-500">Loading search results...</div>}>
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
