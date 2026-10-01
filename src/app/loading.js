import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-[#FAF7F2] px-4 py-16">
      <div className="relative flex items-center justify-center mb-6">
        {/* Animated pulsing golden ring */}
        <div className="w-16 h-16 rounded-full border-2 border-amber-400/30 border-t-[#3E0C15] animate-spin" />
        <Sparkles className="w-6 h-6 text-amber-600 absolute animate-pulse" />
      </div>

      <div className="text-center space-y-2">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#9E7D2E] font-bold block">
          SURATBAZAR LOOM ARCHIVES
        </span>
        <h2 className="font-serif-luxury text-2xl font-bold text-[#2D0A10]">
          Preparing Royal Drapes...
        </h2>
        <p className="text-xs text-stone-500 max-w-xs mx-auto">
          Fetching authentic handloom weaves, Silk Mark certifications, and artisan details.
        </p>
      </div>

      {/* Subtle Skeleton Placeholder Grid */}
      <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 opacity-40 pointer-events-none">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-stone-200/60 rounded-2xl h-64 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
