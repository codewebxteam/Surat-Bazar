"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SITE_CONFIG } from "@/data/siteConfig";

const StoreConfigContext = createContext({
  config: SITE_CONFIG,
  loading: false,
});

export const useStoreConfig = () => useContext(StoreConfigContext);

export const StoreConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(SITE_CONFIG);
  const [loading, setLoading] = useState(true);

  const applyData = (data) => {
    if (!data) return;
    setConfig((prev) => ({
      ...prev,
      brandName: data.storeName || prev.brandName,
      brandNameUpper: (data.storeName || prev.brandName).toUpperCase(),
      contact: {
        ...prev.contact,
        phone: data.supportPhone || prev.contact.phone,
        phoneDisplay: data.supportPhone || prev.contact.phoneDisplay,
        whatsapp: data.whatsappNumber || data.supportPhone || prev.contact.whatsapp,
        email: data.supportEmail || prev.contact.email,
        bridalEmail: data.bridalEmail || data.supportEmail || prev.contact.bridalEmail,
        address: data.address || prev.contact.address,
        workingHours: data.workingHours || prev.contact.workingHours || "Open All 7 Days: 10:00 AM – 9:00 PM IST",
      },
      socialLinks: {
        ...prev.socialLinks,
        instagram: data.instagramUrl || prev.socialLinks?.instagram || "https://instagram.com/suratbazar_official",
        facebook: data.facebookUrl || prev.socialLinks?.facebook || "https://facebook.com/suratbazar_official",
      },
      policies: {
        freeShippingAbove: Number(data.freeShippingAbove) || 5000,
        codEnabled: typeof data.codEnabled === "boolean" ? data.codEnabled : true,
      },
    }));
  };

  useEffect(() => {
    // 1. Initial hydration from localStorage if available
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("suratbazar_store_config");
        if (saved) {
          applyData(JSON.parse(saved));
        }
      }
    } catch (_) {}

    // 2. Custom event listener for immediate sync across components
    const handleConfigEvent = (e) => {
      if (e?.detail) {
        applyData(e.detail);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("suratbazar_config_updated", handleConfigEvent);
    }

    // 3. Firestore live listener
    let unsubscribe = () => {};
    try {
      const docRef = doc(db, "settings", "store_config");
      unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            applyData(snapshot.data());
          }
          setLoading(false);
        },
        (error) => {
          // Gracefully suppress permission errors so app doesn't crash
          console.warn("Notice: reading store config from Firestore:", error?.message || error);
          setLoading(false);
        }
      );
    } catch (err) {
      console.warn("StoreConfigProvider snapshot listener note:", err?.message || err);
      setLoading(false);
    }

    return () => {
      unsubscribe();
      if (typeof window !== "undefined") {
        window.removeEventListener("suratbazar_config_updated", handleConfigEvent);
      }
    };
  }, []);

  return (
    <StoreConfigContext.Provider value={{ config, loading }}>
      {children}
    </StoreConfigContext.Provider>
  );
};
