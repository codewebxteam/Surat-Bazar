"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Feather, Sparkles } from "lucide-react";
import { collection, query, getDocs, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

function FabricCard({ fab }) {
  const [imageUrl, setImageUrl] = useState(fab.image || "");
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const q = query(collection(db, "products"), where("fabric", "==", fab.slug));
        const snap = await getDocs(q);
        setProductCount(snap.size);

        if (!fab.image && !snap.empty) {
          const product = snap.docs[0].data();
          if (product.images && product.images.length > 0) {
            setImageUrl(product.images[0]);
          }
        }
      } catch (e) {
        console.error("Error fetching fabric data:", e);
      }
    }
    fetchData();
  }, [fab.image, fab.slug]);

  return (
    <Link
      href={`/collections/fabric/${fab.slug}`}
      className="group p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-white border border-amber-900/10 hover:border-[#3E0C15] hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden min-h-[200px]"
    >
      {/* Background Image Scrim */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl || "/placeholder.jpg"}
          alt={fab.name}
          fill
          className="object-cover object-center opacity-10 group-hover:opacity-20 transition-opacity duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/60" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-100 text-[#3E0C15]">
            Pure Fabric
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono text-stone-500 font-semibold">
            {productCount} Items
          </span>
        </div>

        <h3 className="font-serif-luxury text-lg sm:text-xl md:text-2xl font-bold text-stone-900 group-hover:text-[#3E0C15] transition-colors mb-1">
          {fab.name}
        </h3>
        
        <h4 className="text-[11px] font-semibold text-[#9E7D2E] mb-1.5">
          {fab.description || "Authentic Weave"}
        </h4>
      </div>

      <div className="relative z-10 inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#3E0C15] group-hover:text-amber-700 mt-4 pt-3 border-t border-amber-900/10 transition-colors">
        <span>View Fabric Edit</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

export default function ShopByFabric() {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFabrics() {
      try {
        const q = query(collection(db, "categories"), where("type", "==", "fabric"));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFabrics(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchFabrics();
  }, []);

  if (loading || fabrics.length === 0) {
    return null;
  }

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
            <FabricCard key={fab.id} fab={fab} />
          ))}
        </div>

      </div>
    </section>
  );
}
