"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function NewArrivalsSection() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const q = query(
          collection(db, "products"),
          where("isNewArrival", "==", true),
          limit(8)
        );
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNewArrivals(products);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchNewArrivals();
  }, []);

  if (loading || newArrivals.length === 0) {
    return null; // or a spinner
  }

  return (
    <section className="py-14 sm:py-20 bg-[#F5EFE6]/70 border-t border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#9E7D2E] font-bold">
                Fresh from Loom
              </span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#2D0A10]">
              New Arrivals Edit
            </h2>
          </div>

          <Link
            href="/new-arrivals"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3E0C15] hover:text-[#571520] transition-colors group"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
          {newArrivals.map((product, index) => (
            <div 
              key={product.id}
              className={index >= 6 ? "hidden lg:block" : "block"}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/new-arrivals"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#3E0C15] text-[#F7EFCF] text-xs font-bold uppercase tracking-wider w-full shadow-md"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
