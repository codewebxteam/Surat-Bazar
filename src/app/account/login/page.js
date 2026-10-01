"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Phone, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [method, setMethod] = useState("otp"); // "otp" | "password"
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (method === "otp" && !otpSent) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setOtpSent(true);
      }, 500);
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/account");
    }, 600);
  };

  return (
    <>
      <Navbar />

      <main className="w-full bg-[#FAF7F2] min-h-screen py-12 sm:py-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-amber-900/10 shadow-2xl p-6 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#9E7D2E] font-semibold">
              Suratbazar Connoisseur Club
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#2D0A10] mt-1.5 mb-2">
              Welcome Back
            </h1>
            <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
              Sign in to manage your bridal orders, saved heirloom wishlist, and bespoke salon bookings.
            </p>
          </div>

          {/* Login Method Toggle */}
          <div className="flex border-b border-stone-200 mb-6">
            <button
              onClick={() => { setMethod("otp"); setOtpSent(false); }}
              className={`flex-1 pb-3 text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer ${
                method === "otp" 
                  ? "border-b-2 border-[#3E0C15] text-[#3E0C15]" 
                  : "text-stone-400 hover:text-stone-700"
              }`}
            >
              Instant OTP
            </button>
            <button
              onClick={() => { setMethod("password"); setOtpSent(false); }}
              className={`flex-1 pb-3 text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer ${
                method === "password" 
                  ? "border-b-2 border-[#3E0C15] text-[#3E0C15]" 
                  : "text-stone-400 hover:text-stone-700"
              }`}
            >
              Password
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {method === "otp" ? (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-600">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl pl-12 pr-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15] focus:ring-2 focus:ring-amber-500/20 font-mono"
                  />
                </div>

                {otpSent && (
                  <div className="mt-4 animate-in fade-in">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-stone-700">Enter 4-Digit OTP</label>
                      <span className="text-[11px] text-emerald-700 font-medium">OTP sent to +91 {phone}</span>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="• • • •"
                      className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-[0.5em] text-stone-900 focus:outline-none focus:border-[#3E0C15]"
                    />
                    <p className="text-[11px] text-stone-500 mt-1 text-right">
                      Didn&apos;t receive? <button type="button" onClick={() => setOtpSent(false)} className="text-[#3E0C15] font-semibold underline">Resend</button>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sanskriti@example.com"
                      className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl pl-10 pr-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15] focus:ring-2 focus:ring-amber-500/20"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-stone-700">Password</label>
                    <a href="#" className="text-[11px] text-amber-800 hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl pl-10 pr-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15] focus:ring-2 focus:ring-amber-500/20"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer mt-4"
            >
              <span>{loading ? "Verifying..." : method === "otp" && !otpSent ? "Send OTP" : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Link to Register */}
          <div className="mt-6 pt-6 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-600">
              New to Suratbazar?{" "}
              <Link href="/account/register" className="font-bold text-[#3E0C15] hover:underline">
                Create an Account
              </Link>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>256-Bit SSL Encrypted Royal Sign-In</span>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
