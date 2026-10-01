import { MARQUEE_ITEMS } from "@/data/banners";

export default function MarqueeBanner({ items = MARQUEE_ITEMS }) {
  const highlights = items;

  return (
    <div className="w-full bg-[#3E0C15] text-[#F7EFCF] py-3.5 overflow-hidden border-y border-amber-500/30">
      <div className="flex w-max animate-marquee space-x-8 whitespace-nowrap">
        {[...highlights, ...highlights, ...highlights].map((item, index) => (
          <div key={index} className="flex items-center space-x-6 text-xs uppercase tracking-[0.25em] font-medium">
            <span>{item}</span>
            <span className="text-amber-400 text-sm">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
