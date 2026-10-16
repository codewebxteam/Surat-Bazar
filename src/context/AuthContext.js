"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const isEmailAdmin = (email = "") => {
  const clean = (email || "").toLowerCase().trim();
  return (
    clean === "admin@suratbazar.com" ||
    clean === "suratbazar360@gmail.com" ||
    clean.startsWith("admin@")
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        
        let determinedRole = "customer";
        try {
          // Fetch user role from Firestore
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            determinedRole = (userDoc.data().role || "customer").toLowerCase();
          }
        } catch (error) {
          console.warn("Notice: reading user role from Firestore:", error);
        }

        // Automatic Admin detection via designated admin emails or Firestore role
        if (determinedRole === "admin" || isEmailAdmin(firebaseUser.email)) {
          determinedRole = "admin";
          // Sync to Firestore in background
          try {
            await setDoc(doc(db, "users", firebaseUser.uid), {
              email: firebaseUser.email,
              role: "admin",
              updatedAt: new Date().toISOString()
            }, { merge: true });
          } catch (_) {}
        }

        setRole(determinedRole);
      } else {
        setUser(null);
        setRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
