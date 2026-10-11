"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function CheckoutLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
