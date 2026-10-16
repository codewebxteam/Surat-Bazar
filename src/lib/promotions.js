import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const DEFAULT_COUPONS = [
  {
    code: "ROYAL10",
    type: "percentage",
    value: 10,
    minOrder: 15000,
    description: "Flat 10% instant off on orders above ₹15,000.",
    tag: "ROYAL PRIVILEGE",
    isActive: true,
  },
  {
    code: "SAREECLUB",
    type: "flat",
    value: 2000,
    minOrder: 10000,
    description: "₹2,000 welcome credit for registered Saree Club members.",
    tag: "MEMBER OFFER",
    isActive: true,
  },
  {
    code: "FESTIVE500",
    type: "flat",
    value: 500,
    minOrder: 5000,
    description: "₹500 flat discount on orders above ₹5,000.",
    tag: "FESTIVE SPECIAL",
    isActive: true,
  },
  {
    code: "NO COST EMI",
    type: "info",
    value: 0,
    minOrder: 0,
    description: "Zero interest monthly installments starting from ₹2,100/mo.",
    tag: "FINANCING",
    isActive: true,
  },
];

export const DEFAULT_ANNOUNCEMENT =
  "✨ Grand Festive Collection Live: Use Code ROYAL10 for Flat 10% Off | Free Express Shipping Across India ✨";

/**
 * Normalizes a coupon object into a consistent structure.
 */
export function normalizeCoupon(c) {
  if (!c) return null;
  const code = (c.code || "").toUpperCase().trim();
  let type = c.type;
  let value = Number(c.value);

  // If type or value wasn't explicitly saved (legacy format)
  if (!type || isNaN(value)) {
    if (code === "NO COST EMI" || c.isInfo) {
      type = "info";
      value = 0;
    } else if (typeof c.discount === "string" && c.discount.includes("%")) {
      type = "percentage";
      const match = c.discount.match(/(\d+(\.\d+)?)/);
      value = match ? parseFloat(match[1]) : 10;
    } else if (typeof c.discount === "string" && (c.discount.includes("₹") || /FLAT/i.test(c.discount))) {
      type = "flat";
      const match = c.discount.replace(/,/g, "").match(/(\d+)/);
      value = match ? parseInt(match[1], 10) : 1000;
    } else {
      type = "percentage";
      value = 10;
    }
  }

  const minOrder = Number(c.minOrder) || 0;
  let description = c.description;
  if (!description) {
    if (type === "percentage") {
      description = minOrder > 0
        ? `Flat ${value}% instant off on orders above ₹${minOrder.toLocaleString("en-IN")}.`
        : `Flat ${value}% instant off sitewide.`;
    } else if (type === "flat") {
      description = minOrder > 0
        ? `₹${value.toLocaleString("en-IN")} flat discount on orders above ₹${minOrder.toLocaleString("en-IN")}.`
        : `₹${value.toLocaleString("en-IN")} flat discount sitewide.`;
    } else {
      description = "Special member privilege offer.";
    }
  }

  return {
    code,
    type, // "percentage" | "flat" | "info"
    value: Number(value) || 0,
    minOrder,
    description,
    tag: c.tag || "",
    isActive: c.isActive !== false,
  };
}

/**
 * Calculate the exact discount amount for a given coupon and order subtotal.
 */
export function calculateCouponDiscount(coupon, subtotal = 0) {
  if (!coupon || !coupon.isActive) return 0;
  if (coupon.type === "info") return 0;

  const minOrder = Number(coupon.minOrder) || 0;
  if (subtotal < minOrder) return 0;

  const val = Number(coupon.value) || 0;
  if (coupon.type === "percentage") {
    return Math.round((subtotal * val) / 100);
  } else if (coupon.type === "flat") {
    return Math.min(subtotal, Math.round(val));
  }
  return 0;
}

/**
 * Fetch promotions and coupons from Firestore settings/promotions,
 * with fallback to local storage and hardcoded defaults.
 */
export async function getPromotionsData() {
  let cached = null;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("suratbazar_promotions");
      if (raw) cached = JSON.parse(raw);
    } catch (e) {
      // ignore
    }
  }

  try {
    const docRef = doc(db, "settings", "promotions");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const rawCoupons = Array.isArray(data.coupons) ? data.coupons : DEFAULT_COUPONS;
      const normalizedCoupons = rawCoupons.map(normalizeCoupon).filter(Boolean);
      const announcementText = data.announcementText || DEFAULT_ANNOUNCEMENT;

      const result = {
        coupons: normalizedCoupons,
        announcementText,
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("suratbazar_promotions", JSON.stringify(result));
        } catch (e) {
          // ignore
        }
      }

      return result;
    }
  } catch (err) {
    console.warn("Notice: Fetching promotions from Firestore:", err?.message || err);
  }

  if (cached && Array.isArray(cached.coupons)) {
    return {
      coupons: cached.coupons.map(normalizeCoupon).filter(Boolean),
      announcementText: cached.announcementText || DEFAULT_ANNOUNCEMENT,
    };
  }

  return {
    coupons: DEFAULT_COUPONS.map(normalizeCoupon),
    announcementText: DEFAULT_ANNOUNCEMENT,
  };
}
