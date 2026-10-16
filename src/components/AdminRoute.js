"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  const userEmail = (user?.email || "").toLowerCase().trim();
  const isAdmin = 
    role === "admin" ||
    userEmail === "admin@suratbazar.com" ||
    userEmail === "suratbazar360@gmail.com" ||
    userEmail.startsWith("admin@");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to single login
        router.push("/login");
      } else if (!isAdmin) {
        // Logged in as regular customer, redirect to storefront home
        router.push("/");
      }
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A0E0B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#E8C574] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#E8C574] font-medium tracking-widest uppercase">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  // Only render children if user is logged in and is an admin
  if (user && isAdmin) {
    return <>{children}</>;
  }

  // Render nothing while redirecting
  return null;
}
