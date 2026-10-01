"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Truck, 
  Tag, 
  ShieldCheck, 
  Copy, 
  Check, 
  X 
} from "lucide-react";
import { ANNOUNCEMENT_MESSAGES } from "@/data/banners";

export const DEFAULT_ANNOUNCEMENTS = ANNOUNCEMENT_MESSAGES;

export default function AnnouncementBar({
  messages = DEFAULT_ANNOUNCEMENTS,
  autoRotate = true,
  interval = 4000,
  showControls = true,
  dismissible = false,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const timerRef = useRef(null);

  const nextMessage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  }, [messages.length]);

  const prevMessage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
  }, [messages.length]);

  // Auto-rotation effect
  useEffect(() => {
    if (autoRotate && !isPaused && messages.length > 1) {
      timerRef.current = setInterval(() => {
        nextMessage();
      }, interval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoRotate, isPaused, messages.length, interval, nextMessage]);

  const copyPromo = (e, code) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  if (isDismissed || messages.length === 0) return null;

  const currentMsg = messages[currentIndex];

  const renderIcon = (type) => {
    switch (type) {
      case "truck": return <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case "tag": return <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case "shield": return <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    }
  };

  return (
    <div 
      className="relative w-full bg-[#24070D] text-[#F7EFCF] text-[11px] sm:text-xs font-medium border-b border-amber-900/50 py-2 sm:py-2.5 px-3 select-none overflow-hidden transition-all duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left Mini Prev Arrow (if multiple messages) */}
        {showControls && messages.length > 1 && (
          <button
            onClick={prevMessage}
            aria-label="Previous promotional message"
            className="p-1 text-stone-400 hover:text-amber-300 transition-colors shrink-0 cursor-pointer hidden xs:flex items-center"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Center Animated Message Strip */}
        <div className="flex-1 flex items-center justify-center text-center overflow-hidden min-h-[20px]">
          <div 
            key={currentMsg.id || currentIndex}
            className="flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1 duration-500 max-w-full px-2"
          >
            {/* Icon */}
            {renderIcon(currentMsg.icon)}

            {/* Badge (Optional) */}
            {currentMsg.badge && (
              <span className="hidden md:inline-block bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm shrink-0">
                {currentMsg.badge}
              </span>
            )}

            {/* Main Promo Text & Link */}
            {currentMsg.link ? (
              <Link 
                href={currentMsg.link}
                className="hover:underline hover:text-white transition-colors tracking-wide truncate max-w-[280px] xs:max-w-md sm:max-w-xl md:max-w-2xl"
              >
                {currentMsg.text}
              </Link>
            ) : (
              <span className="tracking-wide truncate max-w-[280px] xs:max-w-md sm:max-w-xl md:max-w-2xl">
                {currentMsg.text}
              </span>
            )}

            {/* Copy Code Pill if available */}
            {currentMsg.code && (
              <button
                onClick={(e) => copyPromo(e, currentMsg.code)}
                className="hidden sm:inline-flex items-center gap-1 bg-[#3E0C15] hover:bg-amber-600 hover:text-stone-950 text-amber-200 border border-amber-400/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded transition-all cursor-pointer shrink-0 ml-1"
                title="Click to copy promo code"
              >
                {copiedCode === currentMsg.code ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-2.5 h-2.5" />
                    <span>{currentMsg.code}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Mini Next Arrow & Dismiss Button */}
        <div className="flex items-center gap-1 shrink-0">
          {showControls && messages.length > 1 && (
            <button
              onClick={nextMessage}
              aria-label="Next promotional message"
              className="p-1 text-stone-400 hover:text-amber-300 transition-colors shrink-0 cursor-pointer hidden xs:flex items-center"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {dismissible && (
            <button
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss Announcement"
              className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
