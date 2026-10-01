"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Phone
} from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart } = useCartWishlist();

  // 4-Step Checkout Flow: 1. Address -> 2. Delivery -> 3. Payment -> 4. Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Address Fields (Name, Mobile, Address, City, State, Pincode)
  const [formData, setFormData] = useState({
    name: "Sanskriti Sharma",
    mobile: "9876543210",
    address: "B-402, Heritage Imperial Towers, Sector 54, Golf Course Road",
    city: "Gurgaon",
    state: "Haryana",
    pincode: "122002",
  });

  // Step 2: Delivery Method
  const [deliveryOption, setDeliveryOption] = useState("express"); // "express" (Free) | "vip" (+₹999)

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState("upi"); // "upi" | "card" | "netbanking" | "cod"
  const [upiId, setUpiId] = useState("sanskriti@okhdfcbank");

  const [loading, setLoading] = useState(false);

  // Financial Calculations
  const discount = Math.round(cartSubtotal * 0.1); // ROYAL10 default discount
  const deliveryFee = deliveryOption === "vip" ? 999 : 0;
  const finalTotal = Math.max(0, cartSubtotal - discount + deliveryFee);

  const handleNextStep = (e) => {
    e?.preventDefault();
    // Validate Step 1 Address Fields
    if (currentStep === 1) {
      if (!formData.name || !formData.mobile || !formData.address || !formData.city || !formData.state || !formData.pincode) {
        alert("Please complete all required shipping address fields.");
        return;
      }
      if (formData.mobile.length < 10) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
      }
      if (formData.pincode.length !== 6) {
        alert("Please enter a valid 6-digit postal pincode.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setLoading(true);
    const orderId = `SHR-${Math.floor(100000 + Math.random() * 900000)}`;
    
    setTimeout(() => {
      setLoading(false);
      if (clearCart) clearCart();
      router.push(`/order-success/${orderId}`);
    }, 1200);
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

      <main className="w-full bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
            <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#3E0C15] font-semibold">
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Shopping Bag</span>
            </Link>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit SSL Encrypted Royal Checkout</span>
            </div>
          </div>

          {/* 4-STEP PROGRESS BAR (Address -> Delivery -> Payment -> Confirmation) */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="grid grid-cols-4 gap-2 relative">
              {stepLabels.map((step) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.num;
                const isCurrent = currentStep === step.num;

                return (
                  <button
                    key={step.num}
                    onClick={() => {
                      if (step.num < currentStep) setCurrentStep(step.num);
                    }}
                    className={`flex flex-col items-center text-center group cursor-pointer transition-all ${
                      isCurrent 
                        ? "text-[#3E0C15]" 
                        : isCompleted 
                        ? "text-emerald-700" 
                        : "text-stone-400 opacity-60"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all shadow-sm ${
                      isCurrent 
                        ? "bg-[#3E0C15] text-[#F7EFCF] ring-4 ring-amber-500/20 scale-105" 
                        : isCompleted 
                        ? "bg-emerald-600 text-white" 
                        : "bg-stone-200 text-stone-600"
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two-Column Grid: Left Step Form (7 cols) + Right Order Summary (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Step Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-sm">
              
              {/* STEP 1: ADDRESS (Name, Mobile, Address, City, State, Pincode) */}
              {currentStep === 1 && (
                <form onSubmit={handleNextStep} className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h2 className="font-serif-luxury text-2xl font-bold text-[#3E0C15]">
                      Step 1: Shipping Address
                    </h2>
                    <span className="text-xs text-stone-400">All fields required</span>
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
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          placeholder="9876543210"
                          className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl pl-11 pr-3 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15] font-mono"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-stone-700 mb-1">
                        Street Address & Villa/Flat Number <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          id="checkout-address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="e.g. B-402, Heritage Imperial Towers, Golf Course Road"
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
                        placeholder="e.g. Gurgaon"
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
                        placeholder="e.g. Haryana"
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
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="122002"
                        className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15] font-mono"
                      />
                    </div>

                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      id="checkout-step1-continue"
                      className="px-8 py-3.5 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs uppercase tracking-widest font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                    >
                      <span>Proceed to Delivery</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: DELIVERY */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h2 className="font-serif-luxury text-2xl font-bold text-[#3E0C15]">
                      Step 2: Select Delivery Speed
                    </h2>
                    <span className="text-xs text-stone-500">Delivering to {formData.city}, {formData.pincode}</span>
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
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h2 className="font-serif-luxury text-2xl font-bold text-[#3E0C15]">
                      Step 3: Payment Method
                    </h2>
                    <span className="text-xs text-stone-500">Encrypted Gateway</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* UPI */}
                    <div 
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "upi" ? "border-[#3E0C15] bg-[#3E0C15]/5 ring-1 ring-[#3E0C15]" : "border-stone-200 bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 font-bold text-stone-900 text-sm">
                          <Smartphone className="w-4 h-4 text-amber-700" />
                          <span>Instant UPI (Google Pay / PhonePe / Paytm / CRED)</span>
                        </div>
                        <span className="text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded text-[10px]">Fastest</span>
                      </div>
                      {paymentMethod === "upi" && (
                        <div className="mt-3 pt-3 border-t border-stone-200/60 flex gap-2">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="Enter UPI ID (e.g. mobile@upi)"
                            className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono"
                          />
                        </div>
                      )}
                    </div>

                    {/* Credit / Debit Card */}
                    <div 
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "card" ? "border-[#3E0C15] bg-[#3E0C15]/5 ring-1 ring-[#3E0C15]" : "border-stone-200 bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-stone-900 text-sm">
                        <div className="flex items-center gap-2.5">
                          <CreditCard className="w-4 h-4 text-amber-700" />
                          <span>Credit / Debit Card (Visa, MasterCard, Amex, RuPay)</span>
                        </div>
                      </div>
                    </div>

                    {/* Net Banking */}
                    <div 
                      onClick={() => setPaymentMethod("netbanking")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "netbanking" ? "border-[#3E0C15] bg-[#3E0C15]/5 ring-1 ring-[#3E0C15]" : "border-stone-200 bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 font-bold text-stone-900 text-sm">
                        <Building className="w-4 h-4 text-amber-700" />
                        <span>Net Banking (HDFC, ICICI, SBI, Axis, Kotak)</span>
                      </div>
                    </div>

                    {/* COD */}
                    <div 
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "cod" ? "border-[#3E0C15] bg-[#3E0C15]/5 ring-1 ring-[#3E0C15]" : "border-stone-200 bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-stone-900 text-sm">
                        <div className="flex items-center gap-2.5">
                          <Banknote className="w-4 h-4 text-amber-700" />
                          <span>Cash on Delivery (Verified Mobile OTP)</span>
                        </div>
                      </div>
                    </div>
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
                      <p className="text-stone-700 font-semibold uppercase">{paymentMethod} Payment</p>
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
                      <span>{loading ? "Placing Royal Commission..." : "Place Order & Pay"}</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6 sticky top-28">
              <div className="bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-lg">
                <h3 className="font-serif-luxury text-xl font-bold text-[#2D0A10] pb-4 border-b border-stone-200 flex items-center justify-between">
                  <span>Bag Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <Link href="/cart" className="text-xs text-amber-800 font-semibold hover:underline">Edit Bag</Link>
                </h3>

                {/* Items preview list */}
                <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 my-4 pr-1">
                  {cart.map((item, idx) => {
                    const blousePrice = item.blouseOption === "standard" ? 1500 : item.blouseOption === "custom" ? 2500 : 0;
                    const itemUnitPrice = item.price + blousePrice;

                    return (
                      <div key={idx} className="py-3 flex items-center gap-3 text-xs">
                        <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                          <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-stone-900 truncate">{item.name}</h4>
                          <span className="text-stone-500 text-[11px] block">{item.blouseOption} • Qty {item.quantity}</span>
                          <span className="font-bold text-[#3E0C15]">₹{(itemUnitPrice * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Financial Summary */}
                <div className="space-y-2.5 pt-4 border-t border-stone-200 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-900">₹{cartSubtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>ROYAL10 Privilege Discount</span>
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

        </div>
      </main>

      <Footer />
    </>
  );
}
