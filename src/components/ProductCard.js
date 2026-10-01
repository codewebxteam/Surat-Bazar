"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Eye, 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Layers
} from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist, addToCart } = useCartWishlist();
  const wishlisted = isInWishlist(product.id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedBlouse, setSelectedBlouse] = useState("unstitched");
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colorName || "Primary");

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  // Handle Quick Add to Bag
  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedBlouse);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  // Handle Wishlist Click - strictly prevents card link navigation
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Handle Quick View trigger
  const handleOpenQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsQuickViewOpen(false);
  };

  // Available variant colors palette for demonstration
  const variantColors = [
    { name: product.colorName || "Default", hex: product.colorHex || "#3E0C15" },
    ...(product.color === "emerald-green" ? [
      { name: "Royal Wine", hex: "#4A0E17" },
      { name: "Midnight Blue", hex: "#1A2A6C" }
    ] : product.color === "pink" ? [
      { name: "Crimson Red", hex: "#B71C1C" },
      { name: "Royal Purple", hex: "#6A1B9A" }
    ] : [
      { name: "Antique Gold", hex: "#D4AF37" },
      { name: "Emerald Green", hex: "#0D593F" }
    ])
  ];

  return (
    <>
      <div className="group bg-white rounded-2xl overflow-hidden border border-amber-900/10 hover:border-amber-500/30 hover:shadow-2xl transition-all duration-300 flex flex-col h-full relative">
        
        {/* Top Image Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
          <Link 
            href={`/product/${product.slug}`} 
            className="block w-full h-full relative cursor-pointer"
          >
            {/* Primary Image */}
            <Image
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {/* Secondary Image on Hover (if available) */}
            {product.images[1] && activeImageIndex === 0 && (
              <Image
                src={product.images[1]}
                alt={`${product.name} alternate angle`}
                fill
                className="object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
          </Link>

          {/* Badges (New / Bestseller / Sale / Discount) */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
            {product.isBestseller && (
              <span className="bg-[#3E0C15] text-[#F3E5C8] text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-sm border border-amber-500/30">
                Bestseller
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full shadow-md">
                New
              </span>
            )}
            {discountPercent > 0 && (
              <span className="bg-emerald-700/90 text-white text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full shadow-md">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Wishlist Button - strictly stops propagation */}
          <button
            onClick={handleWishlistClick}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
            className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
              wishlisted 
                ? "bg-rose-50 text-rose-600 border border-rose-200 shadow-md scale-105" 
                : "bg-white/80 hover:bg-white text-stone-700 hover:text-rose-600 shadow-sm hover:scale-105"
            }`}
          >
            <Heart 
              className={`w-4 h-4 transition-transform duration-200 ${
                wishlisted ? "fill-rose-600 text-rose-600 scale-110" : ""
              }`} 
            />
          </button>

          {/* Desktop Hover Floating Action Bar (Quick View + Quick Add) */}
          <div className="absolute inset-x-2.5 bottom-2.5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:flex gap-1.5">
            <button
              onClick={handleOpenQuickView}
              className="flex-1 bg-white/95 hover:bg-white text-stone-900 backdrop-blur-md text-[11px] font-bold py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg active:scale-95 cursor-pointer border border-stone-200/80"
            >
              <Eye className="w-3.5 h-3.5 text-amber-800" />
              <span>Quick View</span>
            </button>

            <button
              onClick={handleQuickAdd}
              className="flex-1 bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-[11px] font-bold py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg active:scale-95 cursor-pointer"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Quick Add Pill Button */}
          <div className="absolute right-2 bottom-2 z-20 sm:hidden">
            <button
              onClick={handleQuickAdd}
              aria-label="Quick Add to Bag"
              className="w-8 h-8 rounded-full bg-[#3E0C15] text-[#F7EFCF] flex items-center justify-center shadow-lg active:scale-90"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Product Information Details */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
          <div>
            {/* Category & Color / Variant Indicators */}
            <div className="flex items-center justify-between gap-1.5 mb-1.5">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#9E7D2E] font-semibold">
                {product.categoryName || product.category}
              </span>

              {/* Color Swatches */}
              <div 
                className="flex items-center gap-1 shrink-0" 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                {variantColors.slice(0, 3).map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(v.name)}
                    title={v.name}
                    className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                      selectedColor === v.name
                        ? "ring-2 ring-[#9E7D2E] ring-offset-1 scale-110"
                        : "opacity-75 hover:opacity-100 hover:scale-105"
                    }`}
                    style={{ backgroundColor: v.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Product Name (Clickable link) */}
            <Link href={`/product/${product.slug}`} className="block">
              <h3 className="font-serif-luxury text-sm sm:text-base font-medium text-stone-900 line-clamp-2 hover:text-[#571520] transition-colors leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* Fabric Subtitle */}
            <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
              {product.fabricName || product.fabric}
            </p>

            {/* Rating & Review Count */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex items-center gap-0.5 text-amber-500">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-[11px] font-bold text-stone-800">{product.rating}</span>
              <span className="text-[11px] text-stone-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Pricing Row (Selling Price, MRP, Discount %) */}
          <div className="flex items-baseline justify-between mt-3 pt-2.5 border-t border-stone-100">
            <div className="flex items-baseline flex-wrap gap-1.5">
              <span className="text-sm sm:text-base font-bold text-[#3E0C15]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>

              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}

              {discountPercent > 0 && (
                <span className="text-[10px] font-bold text-emerald-700">
                  ({discountPercent}% OFF)
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* QUICK VIEW MODAL */}
      {isQuickViewOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleCloseQuickView}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-amber-900/20 relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={handleCloseQuickView}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors shadow cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
                
                {/* Left: Gallery in Quick View */}
                <div className="space-y-3">
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-100 shadow-inner">
                    <Image
                      src={product.images[activeImageIndex] || product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                          activeImageIndex === idx ? "border-[#3E0C15] scale-105" : "border-stone-200 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Product Info & Actions */}
                <div className="flex flex-col justify-between">
                  <div>
                    {/* Eyebrow & Badges */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#9E7D2E]">
                        {product.categoryName || product.category}
                      </span>
                      {product.isBestseller && (
                        <span className="bg-[#3E0C15] text-[#F3E5C8] text-[9px] uppercase font-bold px-2 py-0.5 rounded">
                          Bestseller
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                      {product.name}
                    </h2>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-stone-800">{product.rating}</span>
                      <span className="text-xs text-stone-400">({product.reviewsCount} customer reviews)</span>
                    </div>

                    {/* Price Block */}
                    <div className="flex items-baseline gap-2.5 mt-3 pt-3 border-t border-stone-100">
                      <span className="text-2xl font-bold text-[#3E0C15]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-stone-400 line-through">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Tagline / Excerpt */}
                    <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                      {product.tagline || product.description?.slice(0, 140) + "..."}
                    </p>

                    {/* Specifications List */}
                    <div className="bg-stone-50 rounded-xl p-3 mt-4 space-y-1 text-xs text-stone-600">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Fabric:</span>
                        <span className="font-medium text-stone-800">{product.fabricName || product.fabric}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Weave:</span>
                        <span className="font-medium text-stone-800">{product.details?.weave || "Authentic Handloom"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Authenticity:</span>
                        <span className="font-medium text-amber-700 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                          100% Silk Mark Certified
                        </span>
                      </div>
                    </div>

                    {/* Blouse Stitching Option */}
                    <div className="mt-4">
                      <label className="text-xs font-semibold text-stone-800 block mb-1.5">
                        Blouse Preference
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedBlouse("unstitched")}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            selectedBlouse === "unstitched"
                              ? "border-[#3E0C15] bg-[#3E0C15]/5 font-semibold text-stone-900"
                              : "border-stone-200 text-stone-600 hover:border-stone-300"
                          }`}
                        >
                          <span>Unstitched Piece</span>
                          <span className="block text-[10px] text-stone-400">Included</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedBlouse("custom-stitched")}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            selectedBlouse === "custom-stitched"
                              ? "border-[#3E0C15] bg-[#3E0C15]/5 font-semibold text-stone-900"
                              : "border-stone-200 text-stone-600 hover:border-stone-300"
                          }`}
                        >
                          <span>Custom Tailored</span>
                          <span className="block text-[10px] text-amber-700">+₹1,499</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleQuickAdd}
                      className="flex-1 py-3 px-4 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs font-bold transition-all shadow flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      {addedAnimation ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Added to Bag!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Shopping Bag</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/product/${product.slug}`}
                      onClick={handleCloseQuickView}
                      className="py-3 px-5 rounded-full border border-stone-300 hover:border-stone-800 text-stone-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>View Full Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
