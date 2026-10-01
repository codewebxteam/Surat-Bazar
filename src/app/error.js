"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, AlertTriangle, ArrowRight } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global runtime error caught:", error);
  }, [error]);

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center bg-[#FAF7F2] py-16 px-4">
      <div className="bg-white rounded-3xl border border-rose-900/20 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center mx-auto border border-rose-200">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-rose-800 font-bold block mb-1">
            Application Interruption
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold text-[#2D0A10]">
            Unable to Load Royal Collection
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-sm mx-auto leading-relaxed">
            An unexpected glitch occurred while loading our handcrafted artisan archive. Please try refreshing.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-stone-300 text-stone-800 text-xs uppercase tracking-widest font-bold hover:bg-stone-50 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Return Home</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
