"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { collection, query, getDocs, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

function OccasionCard({ occ }) {
  const [imageUrl, setImageUrl] = useState(occ.image || "");

  useEffect(() => {
    if (!occ.image) {
      async function fetchProductImage() {
        try {
          const q = query(collection(db, "products"), where("occasions", "array-contains", occ.slug), limit(1));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const product = snap.docs[0].data();
            if (product.images && product.images.length > 0) {
              setImageUrl(product.images[0]);
            }
          }
        } catch (e) {
          console.error("Error fetching occasion image:", e);
        }
      }
      fetchProductImage();
    }
  }, [occ.image, occ.slug]);

  return (
    <Link
      href={`/collections/occasion/${occ.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-amber-900/10 hover:border-[#3E0C15] hover:shadow-xl transition-all duration-300 relative"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        <Image
          src={imageUrl || "/placeholder.jpg"}
          alt={occ.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 14vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
      </div>

      <div className="p-3 flex flex-col justify-between flex-1 bg-white text-center">
        <div>
          <h3 className="font-serif-luxury text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#3E0C15] transition-colors leading-tight">
            {occ.name}
          </h3>
          <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
            {occ.subtitle || "Explore Occasion"}
          </p>
        </div>
        <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#3E0C15] group-hover:text-amber-700 transition-colors">
          <span>Explore</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export default function ShopByOccasion() {
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOccasions() {
      try {
        const q = query(collection(db, "categories"), where("type", "==", "occasion"));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOccasions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchOccasions();
  }, []);

  if (loading || occasions.length === 0) {
    return null;
  }

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
            <OccasionCard key={occ.id} occ={occ} />
          ))}
        </div>

      </div>
    </section>
  );
}
