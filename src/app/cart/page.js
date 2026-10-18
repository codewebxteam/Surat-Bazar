"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Sparkles,
  Lock,
  ArrowLeft,
  X,
  Check,
  Loader2
} from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPromotionsData, calculateCouponDiscount } from "@/lib/promotions";

export default function CartPage() {
  const { user } = useAuth();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCartWishlist();

  const [couponCode, setCouponCode] = useState(appliedCoupon?.code || "");
  const [couponError, setCouponError] = useState("");
  const [availableOffers, setAvailableOffers] = useState([]);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (appliedCoupon?.code) {
      setCouponCode(appliedCoupon.code);
    }
  }, [appliedCoupon]);

  useEffect(() => {
    async function loadCoupons() {
      try {
        const data = await getPromotionsData();
        const active = (data?.coupons || []).filter(c => c.isActive && c.type !== "info");
        setAvailableOffers(active);
      } catch (e) {}
    }
    loadCoupons();
  }, []);

  const handleApplyCoupon = async (e) => {
    if (e) e.preventDefault();
    if (!couponCode.trim()) return;

    setApplying(true);
    setCouponError("");
    const res = await applyCoupon(couponCode, cartSubtotal);
    setApplying(false);

    if (!res.success) {
      setCouponError(res.error || "Invalid coupon code.");
    } else {
      setCouponError("");
    }
  };

  const handleApplyDirect = async (offer) => {
    setCouponCode(offer.code);
    setApplying(true);
    setCouponError("");
    const res = await applyCoupon(offer, cartSubtotal);
    setApplying(false);
    if (!res.success) {
      setCouponError(res.error || "Coupon could not be applied.");
    } else {
      setCouponError("");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode("");
    setCouponError("");
  };

  const discountAmount = appliedCoupon ? calculateCouponDiscount(appliedCoupon, cartSubtotal) : 0;
  const shippingFee = 0; // Free express delivery
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const freeShippingThreshold = 50000;
  const progressToFreeShipping = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <>
      <Navbar />

      <main className="w-full bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#9E7D2E] font-semibold">
              Curated Selections
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-medium text-[#2D0A10] mt-1.5 mb-2">
              Shopping Bag
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Review your handcrafted heirloom drapes before secure royal checkout.
            </p>
          </div>

          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Left Column: Item List (Desktop 8 cols, Mobile 100% stacked) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Free Shipping Progress Alert */}
                <div className="bg-amber-100/70 border border-amber-300/70 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-900 mb-2">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#9E7D2E]" />
                      {cartSubtotal >= freeShippingThreshold 
                        ? "✨ Unlocked: Free Insured Worldwide Express Delivery!" 
                        : `Add ₹${(freeShippingThreshold - cartSubtotal).toLocaleString("en-IN")} more for Free Insured Express Delivery`}
                    </span>
                    <span className="font-bold text-[#3E0C15]">{progressToFreeShipping}%</span>
                  </div>
                  <div className="w-full h-2 bg-amber-200/80 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-[#3E0C15] transition-all duration-500 rounded-full"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>

                {/* Bag Items Container */}
                <div className="bg-white rounded-3xl border border-amber-900/10 divide-y divide-stone-100 overflow-hidden shadow-sm">
                  <div className="p-4 sm:p-5 bg-stone-50/70 border-b border-stone-200/80 flex items-center justify-between text-xs font-bold text-stone-700 uppercase tracking-wider">
                    <span>Handcrafted Item ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span>Subtotal</span>
                  </div>

                  {cart.map((item, idx) => {
                    const itemUnitPrice = item.price;
                    const itemLineTotal = itemUnitPrice * item.quantity;

                    return (
                      <div key={`${item.id}-${idx}`} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                        
                        {/* Saree Image */}
                        <Link href={`/product/${item.slug}`} className="relative w-24 sm:w-28 aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 shadow-sm group">
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Details & Specs */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] uppercase font-bold text-[#9E7D2E] tracking-wider">
                              {item.categoryName || item.category}
                            </span>
                            <span className="text-stone-300">•</span>
                            <span className="text-[10px] text-stone-500 font-medium">
                              {item.fabricName || item.fabric}
                            </span>
                          </div>

                          <Link href={`/product/${item.slug}`}>
                            <h3 className="font-serif-luxury text-base sm:text-lg font-semibold text-stone-900 hover:text-[#571520] transition-colors leading-snug">
                              {item.name}
                            </h3>
                          </Link>
                          
                          {/* Blouse Option */}
                          <div className="text-xs text-stone-500 mt-1.5 flex items-center gap-1.5 flex-wrap">
                            <span className="text-stone-400">Blouse Piece:</span>
                            <span className="font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                              Included (0.8m Matching Fabric)
                            </span>
                          </div>

                          {/* Unit Price */}
                          <div className="text-xs text-stone-600 mt-1.5">
                            Unit Price: <span className="font-bold text-[#3E0C15]">₹{itemUnitPrice.toLocaleString("en-IN")}</span>
                          </div>

                          {/* Mobile Controls */}
                          <div className="flex sm:hidden items-center justify-between mt-4 pt-3 border-t border-stone-100 w-full">
                            <div className="flex items-center border border-stone-300 rounded-lg p-0.5 bg-stone-50">
                              <button
                                onClick={() => updateQuantity(item.id, item.blouseOption, -1)}
                                className="p-1 text-stone-600 hover:text-stone-950 cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-7 text-center text-xs font-bold text-stone-900">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.blouseOption, 1)}
                                className="p-1 text-stone-600 hover:text-stone-950 cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-right">
                              <div className="text-sm font-bold text-[#3E0C15]">
                                ₹{itemLineTotal.toLocaleString("en-IN")}
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id, item.blouseOption)}
                                className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 mt-0.5 ml-auto cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>

                        </div>

                        {/* Desktop Quantity controls & Line Total */}
                        <div className="hidden sm:flex items-center gap-6 shrink-0">
                          {/* Quantity Counter */}
                          <div className="flex items-center border border-stone-300 rounded-xl p-1 bg-stone-50">
                            <button
                              onClick={() => updateQuantity(item.id, item.blouseOption, -1)}
                              className="p-1.5 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-stone-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.blouseOption, 1)}
                              className="p-1.5 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="text-right min-w-24">
                            <span className="text-base font-bold text-[#3E0C15] block">
                              ₹{itemLineTotal.toLocaleString("en-IN")}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id, item.blouseOption)}
                              className="text-[11px] text-stone-400 hover:text-rose-600 transition-colors inline-flex items-center gap-1 mt-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Continue Shopping Link */}
                <div className="flex items-center justify-between pt-2">
                  <Link
                    href="/collections/sarees"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#3E0C15] hover:text-[#571520] transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Continue Exploring Sarees</span>
                  </Link>
                </div>

              </div>

              {/* Right Column: Order Summary (Desktop 4 cols, Mobile 100% stacked) */}
              <div className="lg:col-span-4 space-y-6 sticky top-28">
                <div className="bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-lg">
                  <h3 className="font-serif-luxury text-2xl font-semibold text-[#2D0A10] pb-4 border-b border-stone-200">
                    Order Summary
                  </h3>

                  {/* Promo Code Input / Applied Badge */}
                  <div className="mt-4 pb-4 border-b border-stone-200 space-y-3">
                    <label className="block text-xs uppercase tracking-wider font-bold text-stone-700">
                      Privilege / Promo Code
                    </label>

                    {appliedCoupon ? (
                      <div className="p-3 bg-emerald-50/90 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-bold text-emerald-950 uppercase">{appliedCoupon.code}</span>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-1.5 py-0.5 rounded">
                                Saved ₹{discountAmount.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <p className="text-[11px] text-emerald-800 font-medium leading-tight mt-0.5">{appliedCoupon.description}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="p-1.5 rounded-lg text-emerald-800 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                          title="Remove Coupon"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. ROYAL10"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="flex-1 bg-[#F4EFE6] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-mono uppercase font-bold focus:outline-none focus:border-[#3E0C15]"
                          />
                          <button
                            type="submit"
                            disabled={applying || !couponCode.trim()}
                            className="px-5 py-2.5 bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs font-bold rounded-xl transition-all cursor-pointer shadow disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            {applying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                          </button>
                        </form>
                        {couponError && <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>}
                      </>
                    )}

                    {/* Available Promo Badges for 1-Tap Apply */}
                    {!appliedCoupon && availableOffers.length > 0 && (
                      <div className="pt-1 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">
                          Available Privilege Codes:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {availableOffers.map((offer) => (
                            <button
                              key={offer.code}
                              type="button"
                              onClick={() => handleApplyDirect(offer)}
                              className="text-[11px] font-mono font-bold bg-amber-100 hover:bg-amber-200 text-[#3E0C15] px-2 py-1 rounded-lg border border-amber-300 transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <span>{offer.code}</span>
                              <span className="font-sans font-normal text-[10px] text-amber-900">
                                ({offer.type === "percentage" ? `${offer.value}% off` : `₹${Number(offer.value).toLocaleString("en-IN")} off`})
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Financial Breakdown (Subtotal, Discount, Shipping, Total) */}
                  <div className="space-y-3 pt-4 text-xs sm:text-sm">
                    <div className="flex justify-between text-stone-600">
                      <span>Bag Subtotal</span>
                      <span className="font-semibold text-stone-900">₹{cartSubtotal.toLocaleString("en-IN")}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          <span>Privilege Savings ({appliedCoupon?.code})</span>
                        </span>
                        <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-stone-600">
                      <span>Express Air Shipping</span>
                      <span className="font-semibold text-emerald-700 uppercase tracking-wider">Free (₹0)</span>
                    </div>

                    <div className="flex justify-between text-stone-600">
                      <span>Fall & Pico Finishing</span>
                      <span className="font-semibold text-emerald-700 uppercase tracking-wider">Free (Included)</span>
                    </div>

                    <div className="flex justify-between items-baseline pt-4 border-t border-stone-200 text-base font-bold text-[#3E0C15]">
                      <span>Grand Total</span>
                      <span className="text-2xl font-bold">₹{finalTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 block -mt-1">
                      (Inclusive of 5% GST & All Handloom Cess)
                    </span>
                  </div>

                  {/* Proceed to Checkout CTA Button */}
                  <Link
                    href={user ? "/checkout" : "/login?redirect=/checkout"}
                    id="cart-proceed-to-checkout"
                    className="mt-6 w-full py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 text-center cursor-pointer"
                  >
                    <span>{user ? "Proceed to Checkout" : "Sign In to Checkout"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-stone-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>256-Bit SSL Encrypted Royal Checkout</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Empty Cart State with START SHOPPING CTA */
            <div className="bg-white rounded-3xl border border-amber-900/10 p-12 sm:p-16 text-center max-w-lg mx-auto shadow-sm">
              <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto mb-5 border border-amber-200/60 shadow-inner">
                {user ? <ShoppingBag className="w-10 h-10" /> : <Lock className="w-10 h-10 text-amber-900" />}
              </div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-stone-900">
                {!user ? "Please Sign In to Access Your Bag" : "Your Shopping Bag is Empty"}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-2.5 max-w-sm mx-auto leading-relaxed">
                {!user
                  ? "Sign in to your Patron account to view your saved heirlooms, add exclusive collections, and enjoy tailored royal privileges."
                  : "Explore our royal bridal collections, pure Banarasi silks, and featherlight organza drapes to fill your shopping bag."}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                {!user ? (
                  <>
                    <Link
                      href="/login?redirect=/cart"
                      id="cart-login-cta"
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs uppercase tracking-widest font-bold transition-all shadow-xl active:scale-95 cursor-pointer"
                    >
                      <span>SIGN IN TO BAG</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/collections/sarees"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-stone-300 hover:border-stone-800 text-stone-700 text-xs uppercase tracking-widest font-bold transition-all active:scale-95"
                    >
                      <span>EXPLORE SAREES</span>
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/collections/sarees"
                    id="empty-cart-start-shopping"
                    className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs uppercase tracking-widest font-bold transition-all shadow-xl active:scale-95 cursor-pointer"
                  >
                    <span>START SHOPPING</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
