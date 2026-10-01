"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight, Trash2, Check, Sparkles } from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useCartWishlist();

  return (
    <>
      <Navbar />

      <main className="w-full bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#9E7D2E] font-semibold">
              Personal Vault
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-medium text-[#2D0A10] mt-1.5 mb-2.5">
              My Saved Sarees
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Heirloom treasures you have saved for your special celebrations.
            </p>
          </div>

          {wishlist.length > 0 ? (
            <div>
              {/* Counter and Header Bar */}
              <div className="flex items-center justify-between pb-4 mb-8 border-b border-stone-200 text-xs sm:text-sm text-stone-600">
                <span>
                  Showing <strong className="text-stone-950 font-bold">{wishlist.length}</strong> Saved Masterpieces
                </span>
                <Link
                  href="/collections/sarees"
                  className="text-xs font-semibold text-[#3E0C15] hover:text-[#571520] hover:underline flex items-center gap-1"
                >
                  <span>Explore More Sarees</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Grid: Desktop 4 products/row, Mobile 2 products/row */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {wishlist.map((product) => (
                  <div key={product.id} className="relative flex flex-col h-full group">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Empty State with EXPLORE SAREES CTA */
            <div className="bg-white rounded-3xl border border-amber-900/10 p-12 sm:p-16 text-center max-w-lg mx-auto shadow-sm">
              <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-5 border border-rose-100 shadow-inner">
                <Heart className="w-10 h-10" />
              </div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-stone-900">
                Your Wishlist is Empty
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-2.5 max-w-sm mx-auto leading-relaxed">
                Save your dream bridal and festive drapes by clicking the heart icon on any saree across our collections.
              </p>
              <Link
                href="/collections/sarees"
                id="empty-wishlist-explore-sarees"
                className="mt-8 inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs uppercase tracking-widest font-bold transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                <span>EXPLORE SAREES</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
