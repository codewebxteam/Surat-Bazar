import Link from "next/link";

/**
 * Suratbazar Luxury Heritage Brand Logo & Emblem Component
 * 
 * The emblem represents:
 * - The iconic royal letter "S" intertwined with flowing handloom silk drape pleats (सूरत बाज़ार)
 * - An authentic weaver's gold zari shuttle & diamond crest
 * - A sacred royal lotus crown flourish
 */
export function SuratbazarEmblem({ size = 38, variant = "maroon", className = "" }) {
  const isLight = variant === "light";

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
      aria-label="Suratbazar Royal Handloom Emblem"
    >
      <defs>
        {/* Luxury Gold Linear Gradient */}
        <linearGradient id="sbGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9E7D2E" />
          <stop offset="25%" stopColor="#D4AF37" />
          <stop offset="55%" stopColor="#FFF2D6" />
          <stop offset="80%" stopColor="#C5A049" />
          <stop offset="100%" stopColor="#8A6820" />
        </linearGradient>

        {/* Deep Royal Maroon Gradient */}
        <linearGradient id="sbMaroon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#571520" />
          <stop offset="50%" stopColor="#3E0C15" />
          <stop offset="100%" stopColor="#24070D" />
        </linearGradient>

        {/* Glow Filter for Gold Accents */}
        <filter id="sbGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#D4AF37" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* 1. Outer Royal Heritage Diamond / Medallion Ring */}
      <rect 
        x="12" 
        y="12" 
        width="76" 
        height="76" 
        rx="22" 
        transform="rotate(45 50 50)" 
        fill={isLight ? "rgba(255, 255, 255, 0.08)" : "#FAF7F2"} 
        stroke="url(#sbGold)" 
        strokeWidth="2.5" 
        strokeDasharray="4 2"
      />

      {/* 2. Inner Solid Crest Shield */}
      <rect 
        x="18" 
        y="18" 
        width="64" 
        height="64" 
        rx="18" 
        transform="rotate(45 50 50)" 
        fill={isLight ? "#24070D" : "url(#sbMaroon)"} 
        stroke="url(#sbGold)" 
        strokeWidth="1.5" 
        filter="url(#sbGlow)"
      />

      {/* 3. Royal Stylized "S" Interlaced with Flowing Saree Drapes */}
      <g stroke="url(#sbGold)" strokeLinecap="round" strokeLinejoin="round" fill="none">
        
        {/* Upper curve of the 'S' forming silk pleats */}
        <path 
          d="M 64 34 C 64 26, 42 24, 38 34 C 34 44, 66 48, 62 64 C 58 74, 36 72, 34 64" 
          strokeWidth="3.4" 
        />

        {/* Inner gold shimmer accent line */}
        <path 
          d="M 60 36 C 58 30, 44 28, 41 35 C 38 43, 62 48, 59 62 C 56 70, 40 68, 38 62" 
          strokeWidth="1.4" 
          strokeOpacity="0.85" 
        />

        {/* Traditional Handloom Shuttle Diamond at Center */}
        <path 
          d="M 50 44 L 54 50 L 50 56 L 46 50 Z" 
          fill="url(#sbGold)" 
          strokeWidth="0.8" 
        />

        {/* Top Royal Crown Lotus Crest */}
        <path 
          d="M 50 20 C 50 24, 53 27, 57 27 C 53 27, 50 30, 50 34 C 50 30, 47 27, 43 27 C 47 27, 50 24, 50 20 Z" 
          fill="url(#sbGold)" 
          stroke="none" 
        />
      </g>
    </svg>
  );
}

// Keep VastraEmblem as an alias for backwards compatibility
export const VastraEmblem = SuratbazarEmblem;

export default function SuratbazarLogo({ 
  variant = "dark", // "dark" (for light navbar background) | "light" (for dark footer background)
  size = "default", // "compact", "default", "large"
  showTagline = true,
  className = "" 
}) {
  const isLight = variant === "light";
  const emblemSize = size === "compact" ? 34 : size === "large" ? 48 : 42;

  return (
    <Link 
      href="/" 
      className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}
      aria-label="Suratbazar - Home"
    >
      {/* Royal Saree / Textile S Emblem */}
      <SuratbazarEmblem size={emblemSize} variant={isLight ? "light" : "maroon"} />

      {/* Brand Text Block */}
      <div className="flex flex-col text-left">
        <span 
          className={`font-serif-luxury font-bold tracking-[0.20em] uppercase transition-colors leading-none ${
            size === "compact" ? "text-xl sm:text-2xl" : size === "large" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
          } ${
            isLight 
              ? "text-white group-hover:text-amber-300" 
              : "text-[#3E0C15] group-hover:text-amber-800"
          }`}
        >
          Suratbazar
        </span>
        {showTagline && (
          <span 
            className={`uppercase tracking-[0.32em] font-semibold mt-1 transition-colors ${
              size === "compact" ? "text-[7px]" : "text-[8px] sm:text-[9px]"
            } ${
              isLight ? "text-amber-400/90" : "text-[#8C7355]"
            }`}
          >
            Surat Silk & Sarees
          </span>
        )}
      </div>
    </Link>
  );
}

// Keep VastraLogo as default export alias so all imports work seamlessly
export const VastraLogo = SuratbazarLogo;
