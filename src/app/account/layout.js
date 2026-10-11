"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function AccountLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
