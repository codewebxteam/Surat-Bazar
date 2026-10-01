"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Heart, ShoppingBag, Eye, Sparkles } from "lucide-react";

const PRODUCTS = [
  {
    id: 1,
    name: "Emerald Royale Scalloped Georgette",
    category: "Festive Ready",
    price: 24999,
    originalPrice: 32000,
    rating: 4.9,
    reviews: 42,
    image: "/banners/hero-1.png",
    fabric: "Silk Georgette with Scalloped Zari",
    tag: "Trending"
  },
  {
    id: 2,
    name: "Rani Gulabi Katan Banarasi Silk",
    category: "Banarasi Heritage",
    price: 38500,
    originalPrice: 45000,
    rating: 5.0,
    reviews: 68,
    image: "/banners/hero-2.png",
    fabric: "Pure Katan Silk with Kadwa Gold Zari",
    tag: "Bestseller"
  },
  {
    id: 3,
    name: "Midnight Indigo Floral Resham Tissue",
    category: "Cocktail Organza",
    price: 28900,
    originalPrice: 35000,
    rating: 4.8,
    reviews: 29,
    image: "/banners/hero-3.png",
    fabric: "Silver Zari Woven Tissue Organza",
    tag: "Limited Edit"
  },
  {
    id: 4,
    name: "Olive & Rust Korvai Kanjeevaram",
    category: "Bridal Pattu",
    price: 54000,
    originalPrice: 65000,
    rating: 5.0,
    reviews: 51,
    image: "/banners/hero-4.png",
    fabric: "Handwoven 3-ply Mulberry Silk",
    tag: "Artisan Heirloom"
  }
];

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState("all");
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (id) => {
    setWishlist((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="festive-edit" className="py-16 sm:py-24 bg-[#F5EFE6]/60 border-t border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#9E7D2E] font-semibold">
                Royal Spotlight
              </span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-medium text-[#2D0A10]">
              Signature Masterpieces
            </h2>
          </div>

          <p className="text-stone-600 text-sm max-w-md mt-4 md:mt-0">
            Hand-inspected by master drapers, delivered with silk-mark authentication and complimentary custom tailoring.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {PRODUCTS.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            return (
              <div 
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden border border-amber-900/10 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Product Image Box */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-stone-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-[#3E0C15] text-[#F3E5C8] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow">
                    {product.tag}
                  </span>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Add to Wishlist"
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                      isWishlisted 
                        ? "bg-rose-500 text-white" 
                        : "bg-white/80 hover:bg-white text-stone-700 hover:text-rose-500 shadow-sm"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
                  </button>

                  {/* Quick View Button on Hover */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <button className="flex-1 bg-stone-950/80 hover:bg-stone-950 text-white backdrop-blur-md text-xs font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Quick Add</span>
                    </button>
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#9E7D2E] font-medium">
                      {product.category}
                    </span>
                    <h3 className="font-serif-luxury text-lg font-semibold text-stone-900 mt-1 line-clamp-1 group-hover:text-[#571520] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                      {product.fabric}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-stone-800">{product.rating}</span>
                      <span className="text-xs text-stone-400">({product.reviews})</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline justify-between mt-4 pt-3 border-t border-stone-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-[#3E0C15]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-stone-400 line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
