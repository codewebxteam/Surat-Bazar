"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Smartphone,
  MapPin,
  Banknote,
  Check,
  Building,
  User,
  Phone,
  Plus,
  Edit2,
  Home,
  Briefcase,
  Gift,
  Loader2,
  Tag,
  X
} from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { calculateCouponDiscount } from "@/lib/promotions";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart, appliedCoupon, applyCoupon, removeCoupon } = useCartWishlist();
  const { user, loading: authLoading } = useAuth();

  // 4-Step Checkout Flow: 1. Address -> 2. Delivery -> 3. Payment -> 4. Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  // Coupon inline state in checkout
  const [couponInput, setCouponInput] = useState(appliedCoupon?.code || "");
  const [couponMsg, setCouponMsg] = useState({ type: "", text: "" });
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    if (appliedCoupon?.code) {
      setCouponInput(appliedCoupon.code);
    }
  }, [appliedCoupon]);

  // Address dynamic states
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isCustomAddress, setIsCustomAddress] = useState(false);
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);
  const [addressType, setAddressType] = useState("Home");
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Step 1: Address Fields (Name, Mobile, Address, City, State, Pincode)
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Step 2: Delivery Method
  const [deliveryOption, setDeliveryOption] = useState("express"); // "express" (Free) | "vip" (+₹999)

  // Step 3: Payment Method & Dynamic COD Store Setting from Admin Panel
  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // "razorpay" (Online) | "cod" (Cash on Delivery)
  const [codEnabled, setCodEnabled] = useState(true);
  const [upiId, setUpiId] = useState("");

  const [loading, setLoading] = useState(false);

  // Dynamic Real-time Sync with Admin Settings (COD Toggle from /admin/settings)
  useEffect(() => {
    let isMounted = true;

    // 1. Initial check from localStorage cache
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("suratbazar_store_config");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (typeof parsed.codEnabled === "boolean" && isMounted) {
            setCodEnabled(parsed.codEnabled);
            if (!parsed.codEnabled && paymentMethod === "cod") {
              setPaymentMethod("razorpay");
            }
          }
        }
      }
    } catch (_) {}

    // 2. Real-time Firestore onSnapshot subscription
    try {
      const docRef = doc(db, "settings", "store_config");
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists() && isMounted) {
          const data = docSnap.data();
          const isEnabled = typeof data.codEnabled === "boolean" ? data.codEnabled : true;
          setCodEnabled(isEnabled);
          if (!isEnabled) {
            setPaymentMethod((curr) => (curr === "cod" ? "razorpay" : curr));
          }
        }
      }, (err) => {
        console.warn("Notice: Live store_config listener:", err);
      });

      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch (e) {
      console.warn("Could not attach store_config listener:", e);
    }
  }, []);

  // Helper to load Razorpay Checkout SDK dynamically if not yet ready
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const existing = document.getElementById("razorpay-checkout-sdk");
      if (existing) {
        existing.onload = () => resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-checkout-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Load user data or guest data dynamically on mount
  useEffect(() => {
    let isMounted = true;

    async function loadAddressData() {
      if (user) {
        setLoadingAddresses(true);
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists() && isMounted) {
            const userData = userSnap.data();
            const addrs = Array.isArray(userData.addresses) ? userData.addresses : [];
            setSavedAddresses(addrs);

            if (addrs.length > 0) {
              // Pre-select default address, or the first address
              const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
              setSelectedAddressId(defaultAddr.id);
              setIsCustomAddress(false);
              setFormData({
                name: defaultAddr.name || userData.name || user.displayName || "",
                mobile: defaultAddr.mobile || userData.phone || "",
                address: defaultAddr.address || "",
                city: defaultAddr.city || "",
                state: defaultAddr.state || "",
                pincode: defaultAddr.pincode || "",
              });
              setAddressType(defaultAddr.type || "Home");
            } else {
              // No saved addresses in profile, prefill name and phone if present
              setSelectedAddressId("new");
              setIsCustomAddress(true);
              setFormData((prev) => ({
                ...prev,
                name: userData.name || user.displayName || "",
                mobile: userData.phone || "",
              }));
            }
          } else if (isMounted) {
            setSelectedAddressId("new");
            setIsCustomAddress(true);
            if (user.displayName) {
              setFormData((prev) => ({ ...prev, name: user.displayName }));
            }
          }
        } catch (err) {
          console.error("Error loading user address from Firestore:", err);
        } finally {
          if (isMounted) setLoadingAddresses(false);
        }
      } else if (!authLoading && isMounted) {
        // Guest mode: check localStorage for any previous details
        try {
          const savedGuest = localStorage.getItem("suratbazar_guest_address");
          if (savedGuest) {
            const parsed = JSON.parse(savedGuest);
            setFormData(parsed);
          }
        } catch (e) {
          console.warn("Could not read guest address from storage:", e);
        }
        setIsCustomAddress(true);
        setSelectedAddressId("guest");
        setLoadingAddresses(false);
      }
    }

    if (!authLoading) {
      loadAddressData();
    }

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  // Dynamic Financial Calculations from Admin Coupons
  const discount = appliedCoupon ? calculateCouponDiscount(appliedCoupon, cartSubtotal) : 0;
  const deliveryFee = deliveryOption === "vip" ? 999 : 0;
  const finalTotal = Math.max(0, cartSubtotal - discount + deliveryFee);

  const handleApplyCheckoutCoupon = async (e) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) return;

    setApplyingCoupon(true);
    setCouponMsg({ type: "", text: "" });
    const res = await applyCoupon(couponInput, cartSubtotal);
    setApplyingCoupon(false);

    if (res.success) {
      setCouponMsg({ type: "success", text: `Applied! Saved ₹${res.discount.toLocaleString("en-IN")}` });
    } else {
      setCouponMsg({ type: "error", text: res.error || "Invalid coupon code." });
    }
  };

  const handleRemoveCheckoutCoupon = () => {
    removeCoupon();
    setCouponInput("");
    setCouponMsg({ type: "", text: "" });
  };

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setIsCustomAddress(false);
    setFormData({
      name: addr.name || "",
      mobile: addr.mobile || "",
      address: addr.address || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
    });
    setAddressType(addr.type || "Home");
  };

  const handleStartNewAddress = () => {
    setSelectedAddressId("new");
    setIsCustomAddress(true);
    setFormData({
      name: user?.displayName || "",
      mobile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });
    setAddressType("Home");
  };

  const handleNextStep = (e) => {
    e?.preventDefault();
    // Validate Step 1 Address Fields
    if (currentStep === 1) {
      if (!formData.name?.trim() || !formData.mobile?.trim() || !formData.address?.trim() || !formData.city?.trim() || !formData.state?.trim() || !formData.pincode?.trim()) {
        alert("Please complete all required shipping address fields.");
        return;
      }
      const cleanMobile = formData.mobile.replace(/\D/g, "");
      if (cleanMobile.length !== 10) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
      }
      const cleanPincode = formData.pincode.replace(/\D/g, "");
      if (cleanPincode.length !== 6) {
        alert("Please enter a valid 6-digit postal pincode.");
        return;
      }

      // If guest user, persist to localStorage for convenience
      if (!user) {
        try {
          localStorage.setItem("suratbazar_guest_address", JSON.stringify(formData));
        } catch (e) {
          // ignore
        }
      }
    }
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const saveAddressToProfileIfRequested = async () => {
    if (user && saveAddressToProfile && (isCustomAddress || savedAddresses.length === 0)) {
      try {
        const alreadyExists = savedAddresses.some(
          a => a.address?.toLowerCase().trim() === formData.address.toLowerCase().trim() &&
               a.pincode?.trim() === formData.pincode.trim()
        );

        if (!alreadyExists) {
          const newAddrObj = {
            id: Date.now().toString(),
            type: addressType || "Home",
            name: formData.name.trim(),
            mobile: formData.mobile.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            pincode: formData.pincode.trim(),
            isDefault: savedAddresses.length === 0,
          };

          await updateDoc(doc(db, "users", user.uid), {
            addresses: [...savedAddresses, newAddrObj],
            phone: formData.mobile.trim()
          });
        }
      } catch (saveAddrErr) {
        console.warn("Could not auto-save address to user profile:", saveAddrErr);
      }
    }
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;

    // Validate Step 1 Address Fields
    if (!formData.name?.trim() || !formData.mobile?.trim() || !formData.address?.trim() || !formData.city?.trim() || !formData.state?.trim() || !formData.pincode?.trim()) {
      alert("Please complete all shipping address fields.");
      setCurrentStep(1);
      return;
    }

    if (!cart || cart.length === 0) {
      alert("Your shopping bag is empty.");
      router.push("/cart");
      return;
    }

    setLoading(true);
    const orderId = `SHR-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. CASH ON DELIVERY (COD)
    if (paymentMethod === "cod") {
      if (!codEnabled) {
        alert("Cash on Delivery (COD) has been disabled by store management. Please proceed with Razorpay Online Checkout.");
        setPaymentMethod("razorpay");
        setLoading(false);
        return;
      }
      try {
        const orderData = {
          id: orderId,
          customer: formData.name.trim(),
          phone: formData.mobile.trim(),
          address: `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`,
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            qty: item.quantity || item.qty || 1,
            price: item.price,
            blouseOption: item.blouseOption || 'unstitched',
            image: (item.images && item.images.length > 0) ? item.images[0] : (item.image || '')
          })),
          subtotal: cartSubtotal,
          discount: discount,
          couponCode: appliedCoupon?.code || null,
          deliveryFee: deliveryFee,
          totalAmount: finalTotal,
          paymentMethod: "Cash on Delivery",
          paymentStatus: "Pending (Pay on Delivery)",
          isOnlinePayment: false,
          status: "Pending",
          date: new Date().toLocaleString("en-IN", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
          createdAt: serverTimestamp(),
          userId: user?.uid || null,
          shippingDetails: {
            name: formData.name.trim(),
            mobile: formData.mobile.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            pincode: formData.pincode.trim(),
            addressType: addressType || "Home",
            deliveryOption
          }
        };

        await setDoc(doc(db, "orders", orderId), orderData);
        await saveAddressToProfileIfRequested();

        if (clearCart) clearCart();
        router.push(`/order-success/${orderId}`);
      } catch (error) {
        console.error("Error saving COD order:", error);
        alert("There was an error processing your COD order. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. RAZORPAY STANDARD CHECKOUT POPUP (UPI, Cards, NetBanking, Wallets)
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || typeof window === "undefined" || !window.Razorpay) {
        alert("Razorpay checkout SDK could not be loaded. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // Step A: Create order on backend
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          receipt: orderId,
          notes: {
            customerName: formData.name.trim(),
            customerMobile: formData.mobile.trim(),
            orderId: orderId,
          },
        }),
      });

      const orderRes = await res.json();
      if (!res.ok || !orderRes.success) {
        throw new Error(orderRes.error || "Failed to initiate payment gateway.");
      }

      // Step B: Configure and open Razorpay popup modal
      const options = {
        key: orderRes.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_ToZUxsu1jlHKm6",
        amount: orderRes.amount,
        currency: orderRes.currency || "INR",
        name: "Surat Bazar",
        description: `Order ${orderId} • Luxury Sarees & Silks`,
        order_id: orderRes.orderId,
        prefill: {
          name: formData.name.trim(),
          contact: formData.mobile.trim(),
          email: user?.email || "",
        },
        theme: {
          color: "#3E0C15", // Brand royal burgundy theme
        },
        handler: async function (response) {
          setLoading(true);
          try {
            // Step C: Verify payment signature with backend
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              alert("Payment verification could not be validated. If amount was debited, please save Payment ID: " + response.razorpay_payment_id);
              setLoading(false);
              return;
            }

            // Step D: Payment Verified -> Save order to Firestore ONLY after verified payment
            const orderData = {
              id: orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              customer: formData.name.trim(),
              phone: formData.mobile.trim(),
              address: `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`,
              items: cart.map(item => ({
                id: item.id,
                name: item.name,
                qty: item.quantity || item.qty || 1,
                price: item.price,
                blouseOption: item.blouseOption || 'unstitched',
                image: (item.images && item.images.length > 0) ? item.images[0] : (item.image || '')
              })),
              subtotal: cartSubtotal,
              discount: discount,
              couponCode: appliedCoupon?.code || null,
              deliveryFee: deliveryFee,
              totalAmount: finalTotal,
              paymentMethod: "Online (Razorpay)",
              paymentStatus: "Paid",
              isOnlinePayment: true,
              status: "Confirmed",
              date: new Date().toLocaleString("en-IN", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
              createdAt: serverTimestamp(),
              userId: user?.uid || null,
              shippingDetails: {
                name: formData.name.trim(),
                mobile: formData.mobile.trim(),
                address: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                pincode: formData.pincode.trim(),
                addressType: addressType || "Home",
                deliveryOption
              }
            };

            await setDoc(doc(db, "orders", orderId), orderData);
            await saveAddressToProfileIfRequested();

            if (clearCart) clearCart();
            router.push(`/order-success/${orderId}`);
          } catch (err) {
            console.error("Order finalization error:", err);
            alert("Payment was successful (" + response.razorpay_payment_id + "), but there was an error recording order. Please contact support.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            alert("Payment was cancelled or closed. Your order was NOT placed and no money was deducted. You can retry payment or select Cash on Delivery.");
          },
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on("payment.failed", function (failResp) {
        setLoading(false);
        const reason = failResp.error?.description || "Transaction failed";
        alert("Payment was declined or cancelled: " + reason + ". Your order was NOT placed.");
      });
      rzpInstance.open();
    } catch (err) {
      console.error("Razorpay initiation error:", err);
      alert("Payment initialization error: " + (err.message || "Please try again"));
      setLoading(false);
    }
  };

  const stepLabels = [
    { num: 1, label: "Address", icon: MapPin },
    { num: 2, label: "Delivery", icon: Truck },
    { num: 3, label: "Payment", icon: CreditCard },
    { num: 4, label: "Confirmation", icon: CheckCircle2 },
  ];

  return (
    <>
      <Navbar />

      <main className="w-full bg-[#FAF7F2] min-h-screen pt-3 sm:pt-5 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-stone-200">
            <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#3E0C15] font-semibold">
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Shopping Bag</span>
            </Link>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit SSL Encrypted Royal Checkout</span>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white rounded-3xl border border-amber-900/10 p-12 sm:p-16 text-center max-w-lg mx-auto shadow-sm my-8">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                Your Shopping Bag is Empty
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mb-6 max-w-xs mx-auto">
                Please add your cherished sarees to your bag before proceeding to royal checkout.
              </p>
              <Link
                href="/collections/sarees"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>Browse Sarees</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              {/* STICKY COMPACT 4-STEP PROGRESS BAR (Address -> Delivery -> Payment -> Confirmation) */}
              <div 
                className="sticky z-30 -mx-4 sm:-mx-6 lg:-mx-12 px-4 sm:px-6 lg:px-12 py-2 sm:py-2.5 mb-5 sm:mb-6 bg-[#FAF7F2]/95 backdrop-blur-md border-y border-amber-900/10 shadow-xs transition-all"
                style={{ top: "var(--header-height, 120px)" }}
              >
                <div className="max-w-2xl mx-auto">
                  <div className="grid grid-cols-4 gap-1 sm:gap-2 relative items-center">
                    {/* Background Progress Track Line */}
                    <div className="absolute top-[12px] sm:top-[14px] left-[12%] right-[12%] h-[2px] bg-stone-200 -z-0">
                      <div 
                        className="h-full bg-emerald-600 transition-all duration-300"
                        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                      />
                    </div>

                    {stepLabels.map((step) => {
                      const Icon = step.icon;
                      const isCompleted = currentStep > step.num;
                      const isCurrent = currentStep === step.num;

                      return (
                        <button
                          key={step.num}
                          type="button"
                          onClick={() => {
                            if (step.num < currentStep) setCurrentStep(step.num);
                          }}
                          className={`relative z-10 flex flex-col items-center justify-center text-center group transition-all ${
                            step.num <= currentStep ? "cursor-pointer" : "cursor-default"
                          }`}
                        >
                          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                            isCurrent 
                              ? "bg-[#3E0C15] text-[#F7EFCF] ring-2 ring-amber-500/40 scale-105" 
                              : isCompleted 
                              ? "bg-emerald-600 text-white" 
                              : "bg-white text-stone-400 border border-stone-300"
                          }`}>
                            {isCompleted ? (
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            ) : (
                              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            )}
                          </div>
                          <span className={`text-[9px] sm:text-[11px] font-bold uppercase tracking-wider mt-0.5 sm:mt-1 transition-colors ${
                            isCurrent 
                              ? "text-[#3E0C15] font-extrabold" 
                              : isCompleted 
                              ? "text-emerald-700 font-bold" 
                              : "text-stone-400 opacity-70"
                          }`}>
                            {step.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

          {/* Two-Column Grid: Left Step Form (7 cols) + Right Order Summary (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Step Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-sm">
              
              {/* STEP 1: DYNAMIC ADDRESS */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div>
                      <h2 className="font-serif-luxury text-2xl font-bold text-[#3E0C15]">
                        Step 1: Shipping Address
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {user ? "Select from saved addresses or add a new delivery location" : "Enter your delivery destination"}
                      </p>
                    </div>
                    {user && savedAddresses.length > 0 && !isCustomAddress && (
                      <button
                        type="button"
                        onClick={handleStartNewAddress}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#3E0C15] text-xs font-bold rounded-lg border border-amber-900/15 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New</span>
                      </button>
                    )}
                  </div>

                  {/* Guest Login Suggestion Banner */}
                  {!user && !authLoading && (
                    <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-stone-700">
                        <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Have an account? Log in for fast one-touch saved addresses.</span>
                      </div>
                      <Link 
                        href="/login" 
                        className="font-bold text-[#3E0C15] hover:underline shrink-0 font-serif-luxury"
                      >
                        Sign In →
                      </Link>
                    </div>
                  )}

                  {/* Loading Indicator for Addresses */}
                  {loadingAddresses ? (
                    <div className="py-12 flex flex-col items-center justify-center text-stone-400 gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#3E0C15]" />
                      <span className="text-xs">Loading delivery addresses...</span>
                    </div>
                  ) : (
                    <>
                      {/* SAVED ADDRESSES SELECTOR CARDS (When user has saved addresses and isn't adding new) */}
                      {user && savedAddresses.length > 0 && !isCustomAddress && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                              Saved Addresses ({savedAddresses.length})
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-3.5">
                            {savedAddresses.map((addr) => {
                              const isSelected = selectedAddressId === addr.id;
                              const IconType = addr.type === "Office" ? Briefcase : addr.type === "Bridal Venue" ? Gift : Home;

                              return (
                                <div
                                  key={addr.id}
                                  onClick={() => handleSelectSavedAddress(addr)}
                                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                                    isSelected
                                      ? "border-[#3E0C15] bg-[#3E0C15]/5 ring-1 ring-[#3E0C15] shadow-sm"
                                      : "border-stone-200 hover:border-stone-300 bg-stone-50/50"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 min-w-0">
                                      {/* Radio indicator */}
                                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                        isSelected 
                                          ? "border-[#3E0C15] bg-[#3E0C15] text-[#F7EFCF]" 
                                          : "border-stone-300 bg-white"
                                      }`}>
                                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                      </div>

                                      <div className="space-y-1 text-xs">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <strong className="text-sm font-bold text-stone-900">{addr.name}</strong>
                                          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700">
                                            <IconType className="w-3 h-3" />
                                            {addr.type || "Home"}
                                          </span>
                                          {addr.isDefault && (
                                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                              Default
                                            </span>
                                          )}
                                        </div>

                                        <p className="text-stone-700 leading-relaxed pt-0.5">
                                          {addr.address}
                                        </p>
                                        <p className="text-stone-600 font-medium">
                                          {addr.city}, {addr.state} - <span className="font-mono">{addr.pincode}</span>
                                        </p>
                                        <p className="text-stone-500 font-mono text-[11px] pt-1">
                                          Mobile: +91 {addr.mobile}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Edit this address trigger */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectSavedAddress(addr);
                                        setIsCustomAddress(true);
                                      }}
                                      className="text-stone-400 hover:text-[#3E0C15] p-1.5 transition-colors cursor-pointer"
                                      title="Edit this address"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={handleStartNewAddress}
                              className="w-full sm:w-auto px-5 py-3 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Deliver to Different Address</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleNextStep}
                              id="checkout-step1-continue-saved"
                              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                            >
                              <span>Deliver Here & Continue</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* NEW / CUSTOM ADDRESS FORM (For Guests, users without saved address, or adding new) */}
                      {(isCustomAddress || !user || savedAddresses.length === 0) && (
                        <form onSubmit={handleNextStep} className="space-y-5 animate-in fade-in">
                          {user && savedAddresses.length > 0 && (
                            <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-200">
                              <span className="text-xs font-semibold text-stone-700">Entering new shipping details</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsCustomAddress(false);
                                  const def = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
                                  if (def) handleSelectSavedAddress(def);
                                }}
                                className="text-xs font-bold text-[#3E0C15] hover:underline cursor-pointer"
                              >
                                ← Use Saved Address
                              </button>
                            </div>
                          )}

                          {/* Address Type Selector */}
                          <div>
                            <label className="block font-bold text-stone-700 text-xs mb-2">Address Type</label>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              {[
                                { id: "Home", label: "Home", icon: Home },
                                { id: "Office", label: "Office", icon: Briefcase },
                                { id: "Bridal Venue", label: "Venue", icon: Gift },
                              ].map((t) => {
                                const TypeIcon = t.icon;
                                const isCurr = addressType === t.id;
                                return (
                                  <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setAddressType(t.id)}
                                    className={`py-2 px-3 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                      isCurr
                                        ? "bg-[#3E0C15] text-[#F7EFCF] border-[#3E0C15] shadow-xs"
                                        : "bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-stone-300"
                                    }`}
                                  >
                                    <TypeIcon className="w-3.5 h-3.5" />
                                    <span>{t.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            {/* Name */}
                            <div>
                              <label className="block font-bold text-stone-700 mb-1">
                                Full Recipient Name <span className="text-rose-600">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  required
                                  id="checkout-name"
                                  value={formData.name}
                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                  placeholder="e.g. Sanskriti Sharma"
                                  className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl pl-9 pr-3 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15]"
                                />
                                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              </div>
                            </div>

                            {/* Mobile */}
                            <div>
                              <label className="block font-bold text-stone-700 mb-1">
                                Mobile Number <span className="text-rose-600">*</span>
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-500">+91</span>
                                <input
                                  type="tel"
                                  required
                                  maxLength={10}
                                  id="checkout-mobile"
                                  value={formData.mobile}
                                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                                  placeholder="9876543210"
                                  className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl pl-11 pr-3 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15] font-mono"
                                />
                              </div>
                            </div>

                            {/* Address */}
                            <div className="sm:col-span-2">
                              <label className="block font-bold text-stone-700 mb-1">
                                Street Address & Flat/Villa Number <span className="text-rose-600">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  required
                                  id="checkout-address"
                                  value={formData.address}
                                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                  placeholder="e.g. B-402, Heritage Imperial Towers, Ring Road"
                                  className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl pl-9 pr-3 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15]"
                                />
                                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              </div>
                            </div>

                            {/* City */}
                            <div>
                              <label className="block font-bold text-stone-700 mb-1">
                                City <span className="text-rose-600">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                id="checkout-city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="e.g. Surat"
                                className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15]"
                              />
                            </div>

                            {/* State */}
                            <div>
                              <label className="block font-bold text-stone-700 mb-1">
                                State <span className="text-rose-600">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                id="checkout-state"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                placeholder="e.g. Gujarat"
                                className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15]"
                              />
                            </div>

                            {/* Pincode */}
                            <div>
                              <label className="block font-bold text-stone-700 mb-1">
                                Pincode (6-Digits) <span className="text-rose-600">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                maxLength={6}
                                id="checkout-pincode"
                                value={formData.pincode}
                                onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                                placeholder="395002"
                                className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15] font-mono"
                              />
                            </div>

                          </div>

                          {/* Save Address to Profile Checkbox for logged-in users */}
                          {user && (
                            <div className="pt-2 flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                id="save-address-checkbox"
                                checked={saveAddressToProfile}
                                onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                                className="w-4 h-4 accent-[#3E0C15] rounded cursor-pointer"
                              />
                              <label htmlFor="save-address-checkbox" className="text-xs text-stone-700 font-semibold cursor-pointer">
                                Save this address to my account for faster one-click checkout
                              </label>
                            </div>
                          )}

                          <div className="pt-4 flex items-center justify-between">
                            {user && savedAddresses.length > 0 ? (
                              <button
                                type="button"
                                onClick={() => setIsCustomAddress(false)}
                                className="px-5 py-3 rounded-full border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                              >
                                Cancel
                              </button>
                            ) : <div />}

                            <button
                              type="submit"
                              id="checkout-step1-continue"
                              className="px-8 py-3.5 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs uppercase tracking-widest font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ml-auto"
                            >
                              <span>Proceed to Delivery</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </form>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* STEP 2: DELIVERY */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h2 className="font-serif-luxury text-2xl font-bold text-[#3E0C15]">
                      Step 2: Select Delivery Speed
                    </h2>
                    <span className="text-xs text-stone-500">
                      Delivering to {formData.city ? `${formData.city}${formData.pincode ? `, ${formData.pincode}` : ""}` : "your destination"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <label 
                      onClick={() => setDeliveryOption("express")}
                      className={`p-5 rounded-2xl border-2 flex items-start justify-between gap-4 cursor-pointer transition-all ${
                        deliveryOption === "express"
                          ? "border-[#3E0C15] bg-[#3E0C15]/5 shadow-sm ring-1 ring-[#3E0C15]"
                          : "border-stone-200 hover:border-stone-300 bg-stone-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Truck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-sm text-stone-900 block">Complimentary Express Air Delivery</span>
                          <span className="text-xs text-stone-600">Dispatched in 24 hrs. Delivered within 3-4 business days.</span>
                          <span className="text-[11px] text-emerald-700 font-semibold block mt-1">✓ 100% Insured Transit Included</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 uppercase bg-emerald-100 px-3 py-1 rounded-full">
                        FREE
                      </span>
                    </label>

                    <label 
                      onClick={() => setDeliveryOption("vip")}
                      className={`p-5 rounded-2xl border-2 flex items-start justify-between gap-4 cursor-pointer transition-all ${
                        deliveryOption === "vip"
                          ? "border-[#3E0C15] bg-[#3E0C15]/5 shadow-sm ring-1 ring-[#3E0C15]"
                          : "border-stone-200 hover:border-stone-300 bg-stone-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-sm text-stone-900 block">Royal VIP White-Glove Hand Delivery</span>
                          <span className="text-xs text-stone-600">Guaranteed 24-48 hr delivery in luxury satin garment trunk.</span>
                          <span className="text-[11px] text-amber-800 font-semibold block mt-1">★ Dedicated Master Draper Concierge</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-stone-900">
                        +₹999
                      </span>
                    </label>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3 rounded-full border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                    >
                      Back to Address
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-8 py-3.5 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs uppercase tracking-widest font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                    <div>
                      <h2 className="font-serif-luxury text-2xl font-bold text-[#3E0C15]">
                        Step 3: Select Payment Mode
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">Instant in-app checkout powered by Razorpay</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>100% RBI Compliant & Secure</span>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    {/* 1. All-in-One Razorpay Online Payment */}
                    <div 
                      onClick={() => setPaymentMethod("razorpay")}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "razorpay" 
                          ? "border-[#3E0C15] bg-[#3E0C15]/5 ring-2 ring-[#3E0C15]/20 shadow-sm" 
                          : "border-stone-200 bg-stone-50 hover:border-stone-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === "razorpay" ? "bg-[#3E0C15] text-[#F7EFCF]" : "bg-stone-200 text-stone-700"}`}>
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-stone-900">Online Payment (UPI, Cards, NetBanking)</span>
                              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                                Instant &amp; Secure
                              </span>
                            </div>
                            <p className="text-xs text-stone-600 mt-1">
                              Pay instantly via UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, or NetBanking.
                            </p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${paymentMethod === "razorpay" ? "border-[#3E0C15] bg-[#3E0C15]" : "border-stone-300"}`}>
                          {paymentMethod === "razorpay" && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    </div>

                    {/* 2. Cash on Delivery (COD) - Dynamically toggled from Admin Settings */}
                    {codEnabled ? (
                      <div 
                        onClick={() => setPaymentMethod("cod")}
                        id="checkout-payment-cod-option"
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          paymentMethod === "cod" 
                            ? "border-[#3E0C15] bg-[#3E0C15]/5 ring-2 ring-[#3E0C15]/20 shadow-sm" 
                            : "border-stone-200 bg-stone-50 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === "cod" ? "bg-[#3E0C15] text-[#F7EFCF]" : "bg-stone-200 text-stone-700"}`}>
                              <Banknote className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-stone-900">Cash on Delivery (COD)</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                                  Pay at Doorstep
                                </span>
                              </div>
                              <p className="text-xs text-stone-600 mt-1">
                                Pay with cash or UPI QR directly to the courier agent when your package arrives.
                              </p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${paymentMethod === "cod" ? "border-[#3E0C15] bg-[#3E0C15]" : "border-stone-300"}`}>
                            {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        id="checkout-payment-cod-disabled"
                        className="p-5 rounded-2xl border border-dashed border-stone-300 bg-stone-100/70 opacity-80 cursor-not-allowed select-none"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-stone-200 text-stone-400">
                              <Banknote className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-stone-500 line-through">Cash on Delivery (COD)</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-600 bg-stone-200 px-2.5 py-0.5 rounded-full">
                                  Temporarily Unavailable
                                </span>
                              </div>
                              <p className="text-xs text-stone-500 mt-1">
                                Cash on Delivery is currently turned OFF by store management. Please proceed securely via Razorpay Online Payment (UPI, Cards, NetBanking).
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3 rounded-full border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                    >
                      Back to Delivery
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-8 py-3.5 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs uppercase tracking-widest font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                    >
                      <span>Review & Confirm</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CONFIRMATION & REVIEW */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h2 className="font-serif-luxury text-2xl font-bold text-[#3E0C15]">
                      Step 4: Final Order Review
                    </h2>
                    <span className="text-xs text-emerald-800 font-semibold">Ready to Commission</span>
                  </div>

                  {/* Summary Cards */}
                  <div className="space-y-3 text-xs">
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-stone-900 uppercase">1. Shipping To:</span>
                        <button onClick={() => setCurrentStep(1)} className="text-amber-800 underline font-semibold">Edit</button>
                      </div>
                      <p className="text-stone-700 font-semibold">{formData.name} • +91 {formData.mobile}</p>
                      <p className="text-stone-600">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-stone-900 uppercase">2. Delivery Speed:</span>
                        <button onClick={() => setCurrentStep(2)} className="text-amber-800 underline font-semibold">Edit</button>
                      </div>
                      <p className="text-stone-700 font-semibold">
                        {deliveryOption === "vip" ? "Royal VIP White-Glove Hand Delivery (+₹999)" : "Complimentary Express Air Delivery (FREE)"}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-stone-900 uppercase">3. Payment Mode:</span>
                        <button onClick={() => setCurrentStep(3)} className="text-amber-800 underline font-semibold">Edit</button>
                      </div>
                      <p className="text-stone-700 font-semibold">
                        {paymentMethod === "razorpay" || !codEnabled
                          ? "Razorpay Online (Instant UPI, Cards, NetBanking)" 
                          : "Cash on Delivery (Pay at Doorstep)"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3 rounded-full border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handlePlaceOrder}
                      id="checkout-confirm-place-order"
                      className="px-10 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs uppercase tracking-widest font-bold flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{paymentMethod === "razorpay" || !codEnabled ? "Opening Razorpay..." : "Placing Order..."}</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {paymentMethod === "razorpay" || !codEnabled
                              ? `Pay ₹${finalTotal.toLocaleString("en-IN")} via Razorpay` 
                              : "Confirm & Place COD Order"}
                          </span>
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky" style={{ top: "calc(var(--header-height, 120px) + 64px)" }}>
              <div className="bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-lg">
                <h3 className="font-serif-luxury text-xl font-bold text-[#2D0A10] pb-4 border-b border-stone-200 flex items-center justify-between">
                  <span>Bag Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <Link href="/cart" className="text-xs text-amber-800 font-semibold hover:underline">Edit Bag</Link>
                </h3>

                {/* Items preview list */}
                <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 my-4 pr-1">
                  {cart.map((item, idx) => {
                    const itemUnitPrice = item.price;

                    return (
                      <div key={idx} className="py-3 flex items-center gap-3 text-xs">
                        <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                          <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-stone-900 truncate">{item.name}</h4>
                          <span className="text-stone-500 text-[11px] block">Qty {item.quantity}</span>
                          <span className="font-bold text-[#3E0C15]">₹{(itemUnitPrice * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Financial Summary */}
                {/* Coupon Code Box */}
                <div className="pt-3 border-t border-stone-100">
                  {appliedCoupon ? (
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-emerald-950 uppercase">{appliedCoupon.code}</span>
                            <span className="text-[10px] bg-emerald-200/80 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                              Saved ₹{discount.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <p className="text-[10px] text-emerald-700 leading-tight mt-0.5">{appliedCoupon.description}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCheckoutCoupon}
                        className="p-1 rounded-md text-emerald-800 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title="Remove Coupon"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <form onSubmit={handleApplyCheckoutCoupon} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Privilege Code (e.g. ROYAL10)"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#3E0C15]"
                        />
                        <button
                          type="submit"
                          disabled={applyingCoupon || !couponInput.trim()}
                          className="px-4 py-2 bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center"
                        >
                          {applyingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                        </button>
                      </form>
                      {couponMsg.text && (
                        <p className={`text-[11px] font-medium ${couponMsg.type === "error" ? "text-rose-600" : "text-emerald-700"}`}>
                          {couponMsg.text}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="space-y-2.5 pt-4 border-t border-stone-200 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-900">₹{cartSubtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Privilege Discount ({appliedCoupon?.code || "Promo"})</span>
                      </span>
                      <span>-₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping Fee</span>
                    <span className="text-emerald-700 font-bold uppercase">
                      {deliveryFee === 0 ? "Free (₹0)" : `+₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t border-stone-200 text-base font-bold text-[#3E0C15]">
                    <span>Grand Total</span>
                    <span className="text-2xl font-bold">₹{finalTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-[11px] text-stone-400">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>100% Silk Mark Certified Pure Indian Silk</span>
                </div>
              </div>
            </div>

          </div>
          </>
          )}

        </div>
      </main>

      {/* Load official Razorpay Checkout SDK */}
      <Script
        id="razorpay-checkout-script"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <Footer />
    </>
  );
}
