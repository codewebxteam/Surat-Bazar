"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Phone, Mail, Lock, ArrowRight, User, ShieldCheck, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/account");
    }, 800);
  };

  return (
    <>
      <Navbar />

      <main className="w-full bg-[#FAF7F2] min-h-screen py-12 sm:py-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-amber-900/10 shadow-2xl p-6 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#9E7D2E] font-semibold">
              Suratbazar Royal Club
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#2D0A10] mt-1.5 mb-2">
              Create Your Account
            </h1>
            <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
              Join our private circle to unlock ₹2,000 welcome credit, priority bridal consultations, and private vault drops.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Maharani Gayatri Devi"
                  className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl pl-10 pr-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15] focus:ring-2 focus:ring-amber-500/20"
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl pl-10 pr-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15] focus:ring-2 focus:ring-amber-500/20"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mobile Number <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-600">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl pl-12 pr-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15] focus:ring-2 focus:ring-amber-500/20 font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Create Password <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters..."
                  className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl pl-10 pr-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15] focus:ring-2 focus:ring-amber-500/20"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-stone-300 text-[#3E0C15] focus:ring-[#3E0C15]"
              />
              <span className="text-[11px] text-stone-600 leading-snug">
                I agree to the <Link href="/pages/terms-of-service" className="underline hover:text-[#3E0C15]">Terms of Service</Link> and <Link href="/pages/privacy-policy" className="underline hover:text-[#3E0C15]">Privacy Policy</Link>.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer mt-4"
            >
              <span>{loading ? "Creating Royal Account..." : "Create Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Already have an account link */}
          <div className="mt-6 pt-6 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-600">
              Already have an account?{" "}
              <Link href="/account/login" className="font-bold text-[#3E0C15] hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Silk Mark Certified Heritage Platform</span>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
