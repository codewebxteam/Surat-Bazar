"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Tag, 
  Plus, 
  CheckCircle, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Loader2, 
  Save, 
  AlertCircle 
} from "lucide-react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const DEFAULT_COUPONS = [
  { code: "VASTRA10", discount: "10% OFF", minOrder: 15000, isActive: true },
  { code: "ROYALWEDDING", discount: "₹2,500 FLAT OFF", minOrder: 30000, isActive: true },
  { code: "FIRSTSILK", discount: "₹1,000 OFF", minOrder: 10000, isActive: false },
];

const DEFAULT_ANNOUNCEMENT = "✨ Grand Festive Collection Live: Use Code VASTRA10 for Flat 10% Off | Free Express Shipping Across India ✨";

export default function AdminBannersPage() {
  const [announcementText, setAnnouncementText] = useState(DEFAULT_ANNOUNCEMENT);
  const [coupons, setCoupons] = useState(DEFAULT_COUPONS);

  // New coupon form state
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [newMinOrder, setNewMinOrder] = useState("");
  const [showAddCoupon, setShowAddCoupon] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAlert, setSavedAlert] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPromotions() {
      setLoading(true);
      try {
        const docRef = doc(db, "settings", "promotions");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.announcementText) setAnnouncementText(data.announcementText);
          if (Array.isArray(data.coupons)) setCoupons(data.coupons);
        }
      } catch (err) {
        console.error("Error loading promotions from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPromotions();
  }, []);

  const toggleCoupon = (code) => {
    setCoupons(coupons.map(c => c.code === code ? { ...c, isActive: !c.isActive } : c));
  };

  const deleteCoupon = (code) => {
    if (confirm(`Are you sure you want to delete coupon ${code}?`)) {
      setCoupons(coupons.filter(c => c.code !== code));
    }
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCode.trim() || !newDiscount.trim()) return;

    const formattedCode = newCode.trim().toUpperCase();
    if (coupons.some(c => c.code === formattedCode)) {
      alert("A coupon with this code already exists!");
      return;
    }

    const newCouponItem = {
      code: formattedCode,
      discount: newDiscount.trim(),
      minOrder: Number(newMinOrder) || 0,
      isActive: true,
    };

    setCoupons([...coupons, newCouponItem]);
    setNewCode("");
    setNewDiscount("");
    setNewMinOrder("");
    setShowAddCoupon(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSavedAlert(false);

    try {
      await setDoc(doc(db, "settings", "promotions"), {
        announcementText: announcementText.trim(),
        coupons,
        updatedAt: serverTimestamp()
      }, { merge: true });

      setSavedAlert(true);
      setTimeout(() => setSavedAlert(false), 3000);
    } catch (err) {
      console.error("Error saving promotions to Firestore:", err);
      setError("Failed to save to Firestore: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="bg-white p-6 rounded-3xl border border-amber-900/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Banners, Offers & Promo Codes</h1>
          <p className="text-xs text-stone-500 mt-1">Manage announcement tickers, promotional banners, and discount coupons</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#571520] to-[#3A0D15] text-[#F3E5C8] font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving to Firestore...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save All Changes</span>
            </>
          )}
        </button>
      </div>

      {savedAlert && (
        <div className="p-3.5 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Offers and Announcement Ticker successfully updated in Firestore!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-stone-400 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#C5832B]" />
          <span className="text-xs">Loading promotions from Firestore...</span>
        </div>
      ) : (
        <>
          {/* Announcement Bar Manager */}
          <div className="bg-white rounded-3xl border border-amber-900/10 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5832B]" />
              <h3 className="font-serif font-bold text-base text-stone-900">Storefront Header Announcement Bar</h3>
            </div>
            <p className="text-xs text-stone-500">This announcement scrolls across the top banner of the entire website.</p>
            <textarea
              rows={2}
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50"
            />
          </div>

          {/* Discount Coupon Manager */}
          <div className="bg-white rounded-3xl border border-amber-900/10 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#C5832B]" />
                <h3 className="font-serif font-bold text-base text-stone-900">Active Discount Coupons</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCoupon(!showAddCoupon)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-400 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddCoupon ? "Cancel" : "Add Coupon"}</span>
              </button>
            </div>

            {/* Add Coupon Inline Form */}
            {showAddCoupon && (
              <form onSubmit={handleAddCoupon} className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-3">
                <div className="text-xs font-bold text-stone-900">Add New Promo Code</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Coupon Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SILK20"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Discount Label</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 20% OFF or ₹2,000 OFF"
                      value={newDiscount}
                      onChange={(e) => setNewDiscount(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Min Order Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 10000"
                      value={newMinOrder}
                      onChange={(e) => setNewMinOrder(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#3E0C15] text-[#E8C574] text-xs font-semibold hover:bg-[#571520] transition-colors cursor-pointer"
                  >
                    Add to List
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {coupons.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-400">No promo codes configured yet.</div>
              ) : (
                coupons.map((c) => (
                  <div key={c.code} className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm bg-white px-3 py-1 rounded-lg border border-stone-300 text-stone-900 shadow-2xs">
                        {c.code}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-stone-900">{c.discount}</p>
                        <p className="text-[10px] text-stone-500">Min Order: ₹{Number(c.minOrder || 0).toLocaleString("en-IN")}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleCoupon(c.code)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                          c.isActive 
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                            : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        {c.isActive ? "Active on Checkout" : "Disabled"}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCoupon(c.code)}
                        title="Delete Coupon"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
