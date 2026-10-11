"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CartWishlistContext = createContext(null);

export function CartWishlistProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  
  // Keep track of whether data is loaded to prevent overwriting cloud data with empty array
  const isInitialized = useRef(false);

  // Load from localStorage on mount (Guest Mode)
  useEffect(() => {
    if (!user && !authLoading) {
      try {
        const savedCart = localStorage.getItem("suratbazar_cart") || localStorage.getItem("shringaar_cart");
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedWishlist = localStorage.getItem("suratbazar_wishlist") || localStorage.getItem("shringaar_wishlist");
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to load local cart/wishlist", e);
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
    }
  }, [user]);

  // Save Cart to LocalStorage OR Firestore whenever it changes
  useEffect(() => {
    if (!isInitialized.current) return; // Prevent saving empty initial state

    if (user) {
      // Save to Firestore
      setDoc(doc(db, "carts", user.uid), { items: cart }).catch(console.error);
    } else {
      // Save to localStorage
      try {
        localStorage.setItem("suratbazar_cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart locally", e);
      }
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
    }, 3000);
  };

  const addToCart = (product, quantity = 1, blouseOption = "unstitched") => {
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
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

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
