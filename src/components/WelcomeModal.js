"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { 
  Sparkles, 
  Crown, 
  CheckCircle2, 
  ShoppingBag, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  Truck, 
  MessageCircle,
  UserCheck
} from "lucide-react";
import { useStoreConfig } from "@/context/StoreConfigContext";

export default function WelcomeModal() {
  const { config } = useStoreConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkWelcomeSession = () => {
      try {
        if (typeof window === "undefined") return;
        const raw = sessionStorage.getItem("suratbazar_welcome_user");
        if (raw) {
          const parsed = JSON.parse(raw);
          setUserData(parsed);
          setIsOpen(true);
          sessionStorage.removeItem("suratbazar_welcome_user");
        }
      } catch (err) {
        console.error("Failed to parse welcome session:", err);
      }
    };

    // Check on initial load and route changes
    checkWelcomeSession();

    // Listen for custom login success event
    const handleLoginSuccess = (event) => {
      if (event?.detail) {
        setUserData(event.detail);
        setIsOpen(true);
        try {
          sessionStorage.removeItem("suratbazar_welcome_user");
        } catch (_) {}
      } else {
        checkWelcomeSession();
      }
    };

    window.addEventListener("suratbazar_login_success", handleLoginSuccess);
    return () => {
      window.removeEventListener("suratbazar_login_success", handleLoginSuccess);
    };
  }, [pathname]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handlePrimaryAction = () => {
    setIsOpen(false);
    if (userData?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/collections/sarees");
    }
  };

  const handleSecondaryAction = () => {
    setIsOpen(false);
    if (userData?.role === "admin") {
      router.push("/");
    } else {
      router.push("/account");
    }
  };

  // Keyboard escape listener
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const isAdmin = userData?.role === "admin";
  const isNew = userData?.isNew;
  const displayName = userData?.name || "Valued Patron";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8C574]/40 overflow-hidden z-10 my-auto text-left"
        >
          {/* Top Decorative Header with Royal Maroon & Gold Filigree */}
          <div className="relative bg-gradient-to-br from-[#3E0C15] via-[#2A080C] to-[#1a0508] text-white px-6 sm:px-8 pt-8 pb-10 overflow-hidden text-center">
            {/* Background luxury shimmer particles */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#E8C574_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#E8C574]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label="Close welcome popup"
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F2] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8C574]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Royal Crest Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 260 }}
              className="relative inline-flex items-center justify-center w-20 h-20 mb-3 mx-auto"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#E8C574] via-[#F3E5C8] to-[#C99738] animate-pulse opacity-75 blur-xs" />
              <div className="relative w-18 h-18 rounded-full bg-gradient-to-b from-[#4A0E1A] to-[#20050A] border-2 border-[#E8C574] flex items-center justify-center shadow-lg shadow-black/40">
                {isAdmin ? (
                  <Crown className="w-9 h-9 text-[#E8C574]" />
                ) : (
                  <Sparkles className="w-9 h-9 text-[#E8C574]" />
                )}
              </div>
            </motion.div>

            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8C574]/20 border border-[#E8C574]/40 text-[#E8C574] text-xs font-semibold uppercase tracking-wider mb-2">
              {isAdmin ? (
                <>
                  <Crown className="w-3.5 h-3.5" />
                  <span>Verified Administrator</span>
                </>
              ) : isNew ? (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Welcome To Suratbazar Family</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Royal Silk Patron</span>
                </>
              )}
            </div>

            {/* Greeting Heading */}
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDFBF7] tracking-wide">
              {isAdmin
                ? `Namaste, Admin ${displayName}!`
                : isNew
                ? `Welcome, ${displayName}!`
                : `Welcome Back, ${displayName}!`}
            </h2>
            <p className="text-xs sm:text-sm text-[#E5D7BF] mt-1.5 max-w-sm mx-auto leading-relaxed">
              {isAdmin
                ? "Your administrative session is verified. You have full command over catalog, orders, and customer management."
                : "You are signed in to Surat's premier handcrafted silk treasury. Your bespoke shopping experience awaits."}
            </p>
          </div>

          {/* Modal Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* VIP Perks / Trust Points */}
            <div className="space-y-3">
              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/50">
                <div className="p-2 rounded-xl bg-[#3E0C15] text-[#E8C574] shrink-0 mt-0.5 shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Pure Silk Mark Certified
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-snug">
                    Authentic pure zari and handloom weaves delivered straight from Surat master artisans.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/50">
                <div className="p-2 rounded-xl bg-[#3E0C15] text-[#E8C574] shrink-0 mt-0.5 shadow-xs">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Insured Express Dispatch
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-snug">
                    Complimentary fast delivery across all Indian pin-codes with full tracking updates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/50">
                <div className="p-2 rounded-xl bg-[#3E0C15] text-[#E8C574] shrink-0 mt-0.5 shadow-xs">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    VIP Concierge Support
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-snug">
                    Direct WhatsApp assistance for styling & custom drape inquiries at {config.contact?.whatsapp || config.contact?.phone || "+91 82002 60300"}.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#571520] via-[#3E0C15] to-[#2A080C] text-[#F3E5C8] font-semibold text-sm hover:shadow-lg hover:shadow-[#3E0C15]/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer border border-[#E8C574]/40"
              >
                {isAdmin ? (
                  <>
                    <Crown className="w-4 h-4 text-[#E8C574]" />
                    <span>Open Admin Dashboard</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#E8C574]" />
                    <span>Explore Festive Sarees</span>
                  </>
                )}
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                type="button"
                onClick={handleSecondaryAction}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-medium text-sm border border-stone-300 hover:border-stone-400 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
              >
                {isAdmin ? "Browse Store" : "My Account"}
              </button>
            </div>

            {/* Footer Dismiss Note */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-stone-500 hover:text-stone-800 underline underline-offset-4 transition-colors cursor-pointer"
              >
                Continue browsing without redirection
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
