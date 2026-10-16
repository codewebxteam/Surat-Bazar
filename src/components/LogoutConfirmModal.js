"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X, AlertCircle, ShieldAlert } from "lucide-react";

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  userName = "",
  isAdmin = false,
}) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={!loading ? onClose : undefined}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8C574]/40 overflow-hidden z-10 my-auto text-center"
        >
          {/* Top Decorative Border Accent */}
          <div className="h-2 w-full bg-gradient-to-r from-[#3E0C15] via-rose-700 to-[#E8C574]" />

          {/* Close Button */}
          {!loading && (
            <button
              onClick={onClose}
              aria-label="Close logout modal"
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="p-6 sm:p-8">
            {/* Icon Seal */}
            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200/70 text-rose-700 mb-4 shadow-inner">
              {isAdmin ? (
                <ShieldAlert className="w-8 h-8" />
              ) : (
                <LogOut className="w-8 h-8 translate-x-0.5" />
              )}
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#3E0C15] text-[#E8C574] flex items-center justify-center shadow-xs">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Badge */}
            <div className="mb-2">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-rose-100 text-rose-900 border border-rose-200">
                {isAdmin ? "Admin Security Check" : "Sign Out Confirmation"}
              </span>
            </div>

            {/* Heading */}
            <h3 className="font-serif text-2xl font-bold text-stone-900 tracking-wide mb-2">
              {isAdmin ? "Sign Out of Admin Portal?" : "Sign Out of Suratbazar?"}
            </h3>

            {/* Explanatory Text */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 max-w-xs mx-auto">
              {isAdmin
                ? "Are you sure you want to end your Super Admin session? You will need your master credentials to access the management portal again."
                : `Are you sure you want to log out${userName ? `, ${userName}` : ""}? Your cart, saved addresses, and orders will remain securely stored for your return.`}
            </p>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-medium text-xs sm:text-sm border border-stone-300 active:scale-[0.98] transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                Cancel / Stay Logged In
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={onConfirm}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-800 via-rose-700 to-[#3E0C15] text-white font-semibold text-xs sm:text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-rose-950/20 disabled:opacity-50 cursor-pointer border border-[#E8C574]/30"
              >
                <LogOut className="w-4 h-4" />
                <span>{loading ? "Signing out..." : "Yes, Log Out"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
