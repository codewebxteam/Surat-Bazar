import Link from "next/link";
import { Sparkles, ArrowRight, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="w-full bg-[#FAF7F2] min-h-[75vh] flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-3xl border border-amber-900/15 p-8 sm:p-14 text-center max-w-lg mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-6 border border-amber-200">
            <Sparkles className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase tracking-[0.3em] text-[#9E7D2E] font-bold block mb-1">
            404 • Page Not Found
          </span>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#2D0A10] mb-3">
            This Drape Has Departed
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm mx-auto mb-8">
            The page or saree collection you are searching for might have been archived or moved to a different vault.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs uppercase tracking-widest font-bold transition-all shadow-lg active:scale-95"
            >
              Return to Palace
            </Link>
            <Link
              href="/collections/sarees"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-stone-300 hover:border-stone-800 text-stone-800 text-xs uppercase tracking-widest font-bold hover:bg-stone-50 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Sarees</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
