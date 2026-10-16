"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  UserPlus, 
  Phone, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle 
} from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VastraLogo from "@/components/VastraLogo";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Update their display name
      await updateProfile(user, { displayName: name.trim() });

      // 3. Save user to Firestore with default role 'customer'
      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        phone: phone.trim(),
        email: user.email,
        role: "customer",
        createdAt: new Date().toISOString()
      });

      // Trigger Welcome Popup after registration
      const welcomePayload = {
        name: name.trim() || "Patron",
        email: user.email,
        role: "customer",
        isNew: true
      };
      
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("suratbazar_welcome_user", JSON.stringify(welcomePayload));
          window.dispatchEvent(new CustomEvent("suratbazar_login_success", { detail: welcomePayload }));
        } catch (_) {}
      }

      // 4. Redirect to home or account page
      router.push("/");
    } catch (err) {
      console.error("Registration error:", err);
      const code = err.code || "";
      if (code === "auth/email-already-in-use") {
        setError("This email address is already registered. Please sign in instead.");
      } else if (code === "auth/weak-password") {
        setError("Password should be at least 6 characters long.");
      } else if (code === "auth/invalid-email") {
        setError("Please provide a valid email address.");
      } else {
        setError(err.message || "Failed to create an account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Decorative Royal Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#E8C574_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#571520]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Luxury Modal Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-[#E8C574]/40 overflow-hidden z-10"
      >
        {/* Top Filigree Accent Header */}
        <div className="bg-gradient-to-r from-[#3E0C15] via-[#571520] to-[#2A080C] text-white pt-8 pb-7 px-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#E8C574_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Brand Logo */}
          <div className="flex justify-center mb-3">
            <VastraLogo variant="light" size="default" showTagline={false} />
          </div>

          {/* Patron Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8C574]/20 border border-[#E8C574]/40 text-[#E8C574] text-[11px] font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Patron Registration</span>
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#FDFBF7] tracking-wide">
            Join Suratbazar Family
          </h1>
          <p className="text-xs text-[#E5D7BF] mt-1 max-w-xs mx-auto leading-relaxed">
            Create your bespoke patron account to enjoy handcrafted handloom treasures and seamless orders.
          </p>
        </div>

        {/* Form Body Container */}
        <div className="p-6 sm:p-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 bg-red-50/90 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleEmailRegister} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15] focus:bg-white focus:border-transparent transition-all"
                  placeholder="e.g. Radhika Sharma"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15] focus:bg-white focus:border-transparent transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15] focus:bg-white focus:border-transparent transition-all"
                  placeholder="radhika@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15] focus:bg-white focus:border-transparent transition-all"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-stone-500">Must be at least 6 characters long</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#571520] via-[#3E0C15] to-[#2A080C] text-[#F3E5C8] py-3 px-4 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#3E0C15]/25 hover:brightness-110 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3E0C15] transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-[#E8C574]/40 cursor-pointer mt-3"
            >
              <span>{loading ? "Creating Patron Account..." : "Complete Registration"}</span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Back to Sign In Link */}
          <div className="mt-6 pt-5 border-t border-stone-200 text-center">
            <p className="text-xs text-stone-600">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#3E0C15] hover:underline underline-offset-4">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-around text-[10px] text-stone-500 font-medium">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Genuine Weaves</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Silk Mark Registered</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
