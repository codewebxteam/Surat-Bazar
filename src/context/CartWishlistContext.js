"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartWishlistContext = createContext(null);

export function CartWishlistProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default logged in for smooth demo or configurable
  const [user, setUser] = useState({ name: "Sanskriti Sharma", email: "sanskriti@example.com" });
  const [toastMessage, setToastMessage] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("suratbazar_cart") || localStorage.getItem("shringaar_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("suratbazar_wishlist") || localStorage.getItem("shringaar_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedAuth = localStorage.getItem("suratbazar_auth") || localStorage.getItem("shringaar_auth");
      if (savedAuth !== null) setIsLoggedIn(savedAuth === "true");
    } catch (e) {
      console.error("Failed to load cart/wishlist", e);
    }
  }, []);

  const loginUser = (userData) => {
    setIsLoggedIn(true);
    if (userData) setUser(userData);
    localStorage.setItem("suratbazar_auth", "true");
    showToast("Logged in successfully! 👑");
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    localStorage.setItem("suratbazar_auth", "false");
    showToast("Logged out of Suratbazar.");
  };

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("suratbazar_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("suratbazar_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist", e);
    }
  }, [wishlist]);

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
        cartCount,
        cartSubtotal,
        showToast,
        isLoggedIn,
        user,
        loginUser,
        logoutUser,
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
