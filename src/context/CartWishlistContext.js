"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getPromotionsData, normalizeCoupon, calculateCouponDiscount } from "@/lib/promotions";

const CartWishlistContext = createContext(null);

export function CartWishlistProvider({ children }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  
  // Keep track of whether data is loaded to prevent overwriting cloud data with empty array
  const isInitialized = useRef(false);

  // Load from localStorage on mount (Guest Wishlist + Applied Coupon)
  useEffect(() => {
    try {
      const savedCoupon = localStorage.getItem("suratbazar_applied_coupon");
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {}

    if (!user && !authLoading) {
      // Unauthenticated users cannot hold or add cart items
      setCart([]);
      try {
        localStorage.removeItem("suratbazar_cart");
        localStorage.removeItem("shringaar_cart");
      } catch (e) {}

      try {
        const savedWishlist = localStorage.getItem("suratbazar_wishlist") || localStorage.getItem("shringaar_wishlist");
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to load local wishlist", e);
      }
      isInitialized.current = true;
    }
  }, [user, authLoading]);

  // Firestore Sync (Logged in Mode)
  useEffect(() => {
    if (user) {
      // Listen to Cart changes from Firestore
      const unsubscribeCart = onSnapshot(doc(db, "carts", user.uid), (docSnap) => {
        if (docSnap.exists()) {
          setCart(docSnap.data().items || []);
        } else {
          setCart([]);
        }
        isInitialized.current = true; // Mark as initialized after first fetch
      });

      // Listen to Wishlist changes from Firestore
      const unsubscribeWishlist = onSnapshot(doc(db, "wishlists", user.uid), (docSnap) => {
        if (docSnap.exists()) {
          setWishlist(docSnap.data().items || []);
        } else {
          setWishlist([]);
        }
      });

      return () => {
        unsubscribeCart();
        unsubscribeWishlist();
      };
    } else {
      // Clear cart on logout
      setCart([]);
    }
  }, [user]);

  // Save Cart to Firestore whenever it changes (Logged-in only)
  useEffect(() => {
    if (!isInitialized.current) return; // Prevent saving empty initial state

    if (user) {
      // Save to Firestore
      setDoc(doc(db, "carts", user.uid), { items: cart }).catch(console.error);
    }
  }, [cart, user]);

  // Save Wishlist to LocalStorage OR Firestore whenever it changes
  useEffect(() => {
    if (!isInitialized.current) return;

    if (user) {
      // Save to Firestore
      setDoc(doc(db, "wishlists", user.uid), { items: wishlist }).catch(console.error);
    } else {
      // Save to localStorage
      try {
        localStorage.setItem("suratbazar_wishlist", JSON.stringify(wishlist));
      } catch (e) {
        console.error("Failed to save wishlist locally", e);
      }
    }
  }, [wishlist, user]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = (product, quantity = 1, blouseOption = "unstitched") => {
    if (!user) {
      showToast("Please log in to add items to your Bag 🔒");
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname + window.location.search;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
      return false;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.blouseOption === blouseOption
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { ...product, quantity, blouseOption }];
    });
    showToast(`Added "${product.name}" to Bag! 🛍️`);
    return true;
  };

  const removeFromCart = (id, blouseOption) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.blouseOption === blouseOption)));
    showToast("Item removed from Bag.");
  };

  const updateQuantity = (id, blouseOption, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id && item.blouseOption === blouseOption) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast(`Removed from Wishlist`);
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast(`Added to Wishlist ❤️`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    try {
      localStorage.removeItem("suratbazar_applied_coupon");
    } catch (e) {}
  };

  const applyCoupon = async (codeOrObj, customSubtotal) => {
    try {
      let coupon = null;
      if (typeof codeOrObj === "object" && codeOrObj !== null) {
        coupon = normalizeCoupon(codeOrObj);
      } else if (typeof codeOrObj === "string") {
        const cleanCode = codeOrObj.trim().toUpperCase();
        const data = await getPromotionsData();
        coupon = data.coupons.find((c) => c.code === cleanCode && c.isActive);
        if (!coupon) {
          return { success: false, error: `Coupon "${cleanCode}" is invalid or expired.` };
        }
      }

      if (!coupon || !coupon.isActive) {
        return { success: false, error: "This promo offer is currently inactive." };
      }

      if (coupon.type === "info") {
        return { success: false, error: "This is an informational privilege, not a discount code." };
      }

      const effectiveSubtotal = typeof customSubtotal === "number" ? customSubtotal : cartSubtotal;
      const minOrder = Number(coupon.minOrder) || 0;

      if (minOrder > 0 && effectiveSubtotal < minOrder) {
        return {
          success: false,
          error: `Minimum bag total of ₹${minOrder.toLocaleString("en-IN")} required for "${coupon.code}". (Current: ₹${effectiveSubtotal.toLocaleString("en-IN")})`,
        };
      }

      const discount = calculateCouponDiscount(coupon, effectiveSubtotal);
      setAppliedCoupon(coupon);
      try {
        localStorage.setItem("suratbazar_applied_coupon", JSON.stringify(coupon));
      } catch (e) {}

      showToast(`Privilege Code "${coupon.code}" Applied! Saved ₹${discount.toLocaleString("en-IN")} 🎉`);
      return { success: true, discount, coupon };
    } catch (err) {
      console.error("Error applying coupon:", err);
      return { success: false, error: "Failed to apply privilege code. Please try again." };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    try {
      localStorage.removeItem("suratbazar_applied_coupon");
    } catch (e) {}
    showToast("Privilege coupon removed.");
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const couponDiscount = appliedCoupon ? calculateCouponDiscount(appliedCoupon, cartSubtotal) : 0;

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isInWishlist,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponDiscount,
        showToast
      }}
    >
      {children}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3E0C15] text-[#F7EFCF] px-5 py-3 rounded-xl shadow-2xl border border-amber-400/40 flex items-center gap-3 animate-bounce text-sm font-medium">
          <span>{toastMessage}</span>
        </div>
      )}
    </CartWishlistContext.Provider>
  );
}

export function useCartWishlist() {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error("useCartWishlist must be used within a CartWishlistProvider");
  }
  return context;
}
