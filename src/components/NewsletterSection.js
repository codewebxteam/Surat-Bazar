"use client";

import { useState } from "react";
import { Sparkles, Check, ArrowRight, Mail, AlertCircle, Loader2, Copy, CheckCheck, Gift } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const validateEmail = (val) => {
    if (!val || !val.trim()) {
      return "Please enter your email address to join.";
    }
    // Standard RFC-compliant regex check for valid email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(val.trim())) {
      return "Please enter a valid email address (e.g., name@example.com).";
    }
    return null;
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    const error = validateEmail(email);

    if (error) {
      setStatus("error");
      setErrorMessage(error);
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    // Simulate API registration delay
    setTimeout(() => {
      setStatus("success");
    }, 600);
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("SAREECLUB2000");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReset = () => {
    setEmail("");
    setStatus("idle");
    setErrorMessage("");
    setCopied(false);
  };

  return (
    <section className="w-full bg-gradient-to-b from-[#1C0F0C] via-[#140806] to-[#0D0504] text-[#FAF7F2] py-16 sm:py-20 border-t border-amber-900/40 relative overflow-hidden">
      {/* Decorative subtle background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center relative z-10">
        
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs uppercase tracking-widest font-semibold mb-4 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Exclusive Member Privileges</span>
        </div>

        {/* Main Heading */}
        <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-normal text-white max-w-2xl mx-auto leading-tight tracking-wide">
          JOIN THE SAREE CLUB
        </h2>

        {/* Subtitle */}
        <p className="text-stone-300 text-xs sm:text-sm md:text-base max-w-lg mx-auto mt-3 mb-8 leading-relaxed font-light">
          Be the first to preview rare loom drops, receive private salon invitations, and unlock an exclusive <span className="text-amber-400 font-medium">₹2,000 privilege voucher</span> on your inaugural heirloom.
        </p>

        {/* Subscription Card / Form */}
        {status === "success" ? (
          <div className="max-w-lg mx-auto bg-gradient-to-br from-stone-900/90 to-black/90 border border-amber-500/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 mb-4 shadow-lg shadow-amber-500/20">
              <Gift className="w-7 h-7" />
            </div>

            <h3 className="font-serif-luxury text-2xl text-white font-medium mb-1">
              Welcome to the Saree Club
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm mb-5 leading-relaxed">
              We have dispatched your private welcome dossier and gift coupon to{" "}
              <strong className="text-amber-300 font-semibold break-all">{email}</strong>.
            </p>

            {/* Voucher Card */}
            <div className="bg-amber-950/40 border border-dashed border-amber-500/50 rounded-xl p-3.5 mb-5 flex items-center justify-between gap-3">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider text-amber-400 block font-medium">Your Welcome Code</span>
                <span className="text-base sm:text-lg font-mono font-bold tracking-widest text-white">SAREECLUB2000</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-stone-950" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-stone-400 hover:text-amber-300 underline underline-offset-4 transition-colors cursor-pointer"
            >
              Subscribe another email address
            </button>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubscribe} noValidate className="relative">
              <div className="flex flex-col sm:flex-row gap-3">
                
                {/* Input container */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="newsletter-email-input"
                    aria-label="Email address for Saree Club newsletter"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address..."
                    disabled={status === "loading"}
                    className={`w-full bg-white/10 border text-white placeholder:text-stone-400 text-xs sm:text-sm rounded-full pl-11 pr-5 py-3.5 backdrop-blur-md transition-all focus:outline-none ${
                      status === "error"
                        ? "border-rose-500/80 ring-2 ring-rose-500/30 bg-rose-950/20"
                        : "border-white/20 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                    }`}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="newsletter-subscribe-btn"
                  disabled={status === "loading"}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm rounded-full transition-all shadow-lg hover:shadow-amber-500/25 shrink-0 flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Error feedback banner */}
              {status === "error" && (
                <div className="mt-3 p-2.5 px-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-medium flex items-center justify-center gap-2 text-left animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </form>

            <p className="mt-3.5 text-[11px] text-stone-400 font-light">
              By subscribing, you agree to our Terms & Privacy Policy. Unsubscribe with one click anytime.
            </p>
          </div>
        )}

        {/* 3 Luxury Micro-Benefits */}
        <div className="mt-12 pt-10 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-stone-300 text-xs">
          <div className="flex flex-col items-center text-center gap-1.5">
            <span className="text-amber-400 font-bold text-sm tracking-wide">PRIVATE VAULT PREVIEWS</span>
            <span className="text-stone-400 text-[11px]">48-hour early access to rare limited artisanal weaves</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1.5">
            <span className="text-amber-400 font-bold text-sm tracking-wide">₹2,000 WELCOME GIFT</span>
            <span className="text-stone-400 text-[11px]">Applied instantly towards your bridal or heirloom order</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1.5">
            <span className="text-amber-400 font-bold text-sm tracking-wide">BESPOKE STYLING</span>
            <span className="text-stone-400 text-[11px]">Complimentary styling consultation with master drapers</span>
          </div>
        </div>

      </div>
    </section>
  );
}

