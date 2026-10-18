"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  Crown, 
  AlertCircle, 
  CheckCircle2,
  KeyRound
} from "lucide-react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VastraLogo from "@/components/VastraLogo";
import { useAuth, isEmailAdmin } from "@/context/AuthContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const router = useRouter();
  const { user: currentUser, role: currentRole, loading: authLoading } = useAuth();
  const [redirectParam, setRedirectParam] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setRedirectParam(params.get("redirect"));
    }
  }, []);

  // If already logged in, redirect appropriately
  useEffect(() => {
    if (!authLoading && currentUser) {
      const isAdmin = currentRole === "admin" || isEmailAdmin(currentUser.email);
      if (isAdmin) {
        router.push("/admin");
      } else {
        const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const param = params?.get("redirect");
        const destination = param && param.startsWith("/") ? param : "/";
        router.push(destination);
      }
    }
  }, [currentUser, currentRole, authLoading, router]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setResetMessage("");
    setLoading(true);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError("Please provide both email address and password.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      let userRole = "customer";
      let userName = user.displayName || user.email?.split("@")[0] || "Patron";

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.role) userRole = String(data.role).toLowerCase();
          if (data.name) userName = data.name;
        }
      } catch (docErr) {
        console.warn("Could not read user profile from Firestore:", docErr);
      }

      // Check admin status:
      // Either role was explicitly set to 'admin' in Firestore,
      // or the email matches designated admin emails (admin@suratbazar.com, suratbazar360@gmail.com, or admin@*)
      const isAdminUser = userRole === "admin" || isEmailAdmin(user.email);

      if (isAdminUser) {
        userRole = "admin";
        try {
          await setDoc(
            doc(db, "users", user.uid),
            {
              email: user.email,
              role: "admin",
              lastLoginAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (_) {}
      }

      // Prepare Welcome Popup payload
      const welcomePayload = {
        name: userName,
        email: user.email,
        role: userRole,
        isNew: false,
      };

      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("suratbazar_welcome_user", JSON.stringify(welcomePayload));
          window.dispatchEvent(
            new CustomEvent("suratbazar_login_success", { detail: welcomePayload })
          );
        } catch (_) {}
      }

      // Dynamic routing:
      // Admin -> /admin
      // Customer -> redirect URL or /
      if (userRole === "admin") {
        router.push("/admin");
      } else {
        const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const redirectParam = params?.get("redirect");
        const destination = redirectParam && redirectParam.startsWith("/") ? redirectParam : "/";
        router.push(destination);
      }
    } catch (err) {
      console.error("Login authentication error:", err);
      const code = err.code || "";
      if (
        code === "auth/invalid-credential" || 
        code === "auth/wrong-password" || 
        code === "auth/user-not-found"
      ) {
        setError("Invalid email address or password. Please verify your credentials.");
      } else if (code === "auth/too-many-requests") {
        setError("Access temporarily disabled due to multiple failed login attempts. Please reset password or try again later.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (code === "auth/network-request-failed") {
        setError("Network error. Please verify your internet connection.");
      } else {
        setError(err.message || "Failed to sign in. Please verify your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setResetMessage("");
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your email address to receive a password reset link.");
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setResetMessage(`Password reset link sent to ${cleanEmail}. Please check your inbox or spam folder.`);
      setShowForgot(false);
    } catch (err) {
      console.error("Password reset error:", err);
      if (err.code === "auth/user-not-found") {
        setError("No registered account found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err.message || "Could not send password reset email.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Decorative Royal Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#E8C574_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#571520]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

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

          {/* Unified Access Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8C574]/20 border border-[#E8C574]/40 text-[#E8C574] text-[11px] font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Unified Access Portal</span>
            <Crown className="w-3 h-3 ml-0.5" />
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#FDFBF7] tracking-wide">
            Namaste & Welcome
          </h1>
          <p className="text-xs text-[#E5D7BF] mt-1 max-w-xs mx-auto leading-relaxed">
            Enter your credentials to access your Patron orders or the Administrative Dashboard.
          </p>
        </div>

        {/* Form Body Container */}
        <div className="p-6 sm:p-8">
          {/* Informational Redirect Banner */}
          {redirectParam && (
            <div className="mb-5 bg-amber-50 border border-amber-300/80 text-amber-900 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-800 shrink-0" />
              <span className="font-medium">Please sign in to add items to your Bag and continue shopping.</span>
            </div>
          )}

          {/* Error Alert */}
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

          {/* Success / Reset Message */}
          {resetMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{resetMessage}</span>
            </motion.div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
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
                  placeholder="admin@suratbazar.com or your@email.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(!showForgot)}
                  className="text-xs text-[#571520] hover:text-[#3E0C15] font-semibold transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15] focus:bg-white focus:border-transparent transition-all"
                  placeholder="••••••••"
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
            </div>

            {/* Forgot Password Assistant Strip */}
            {showForgot && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs space-y-2"
              >
                <p className="text-stone-700">
                  Click below to receive a secure password reset link for <span className="font-semibold text-stone-900">{email || "your entered email"}</span>.
                </p>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3E0C15] text-[#F3E5C8] font-semibold text-[11px] hover:bg-[#571520] transition-colors disabled:opacity-50"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>{resetLoading ? "Sending Link..." : "Send Reset Link"}</span>
                </button>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#571520] via-[#3E0C15] to-[#2A080C] text-[#F3E5C8] py-3 px-4 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#3E0C15]/25 hover:brightness-110 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3E0C15] transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-[#E8C574]/40 cursor-pointer mt-2"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Account"}</span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Customer / Patron Register Link */}
          <div className="mt-6 pt-5 border-t border-stone-200 text-center">
            <p className="text-xs text-stone-600">
              New to Suratbazar?{" "}
              <Link 
                href={redirectParam ? `/register?redirect=${encodeURIComponent(redirectParam)}` : "/register"} 
                className="font-bold text-[#3E0C15] hover:underline underline-offset-4"
              >
                Create Patron Account
              </Link>
            </p>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-around text-[10px] text-stone-500 font-medium">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Secured</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>100% Silk Mark Certified</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CustomerLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3E0C15] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
