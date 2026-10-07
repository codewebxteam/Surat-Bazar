export default function AdminStatsCard({ title, value, change, isPositive, icon: Icon, subtext, color = "amber" }) {
  const colorMap = {
    amber: {
      iconBg: "bg-amber-100 text-amber-900 border-amber-200",
      accent: "text-amber-700",
    },
    rose: {
      iconBg: "bg-[#571520]/10 text-[#571520] border-[#571520]/20",
      accent: "text-[#571520]",
    },
    emerald: {
      iconBg: "bg-emerald-100 text-emerald-900 border-emerald-200",
      accent: "text-emerald-700",
    },
    blue: {
      iconBg: "bg-sky-100 text-sky-900 border-sky-200",
      accent: "text-sky-700",
    }
  };

  const scheme = colorMap[color] || colorMap.amber;

  return (
    <div className="bg-white rounded-2xl p-5 border border-amber-900/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-stone-500 tracking-wide uppercase">{title}</p>
          <h3 className="text-2xl font-serif font-bold text-stone-900 mt-1.5">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl border ${scheme.iconBg} transition-transform group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-stone-100">
        {change && (
          <span className={`font-semibold flex items-center gap-0.5 ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
            {isPositive ? "↑" : "↓"} {change}
          </span>
        )}
        <span className="text-stone-400 font-normal">{subtext}</span>
      </div>
    </div>
  );
}
