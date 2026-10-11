"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push("/login");
      } else if (role !== "admin") {
        // Logged in but not admin, redirect to home
        router.push("/");
      }
    }
  }, [user, role, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Only render children if user is logged in and is an admin
  if (user && role === "admin") {
    return <>{children}</>;
  }

  // Render nothing while redirecting
  return null;
}
