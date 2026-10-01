import { Truck, RotateCcw, ShieldCheck, Award } from "lucide-react";

export default function PromotionalStrip() {
  const items = [
    { label: "FREE SHIPPING", icon: Truck },
    { label: "100% SILK MARK", icon: Award },
    { label: "EASY RETURNS", icon: RotateCcw },
    { label: "SECURE PAYMENTS", icon: ShieldCheck },
  ];

  return (
    <section 
      aria-label="Promotional Perks"
      className="w-full bg-[#1C0F0C] text-[#F7EFCF] h-[36px] sm:h-[38px] md:h-[42px] border-b border-amber-900/40 flex items-center justify-center overflow-x-auto whitespace-nowrap scrollbar-none px-3 select-none"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between sm:justify-center sm:gap-6 md:gap-10 lg:gap-14 text-[10px] sm:text-[11px] md:text-xs font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em]">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
              <span>{item.label}</span>
              {idx < items.length - 1 && (
                <span className="text-amber-500/40 ml-3 sm:ml-6 md:ml-10 hidden xs:inline">|</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
