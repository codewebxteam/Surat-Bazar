"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Not logged in, redirect to login with redirect param
      const path = typeof window !== "undefined" ? window.location.pathname + window.location.search : "";
      const redirectUrl = path && path !== "/login" ? `/login?redirect=${encodeURIComponent(path)}` : "/login";
      router.push(redirectUrl);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#3E0C15] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Only render children if user is logged in
  if (user) {
    return <>{children}</>;
  }

  // Render nothing while redirecting
  return null;
}
