"use client";

import { useState } from "react";
import { Layers, Sparkles, Tag, Plus, CheckCircle, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

export default function AdminBannersPage() {
  const [announcementText, setAnnouncementText] = useState(
    "✨ Grand Festive Collection Live: Use Code VASTRA10 for Flat 10% Off | Free Express Shipping Across India ✨"
  );
  const [coupons, setCoupons] = useState([
    { code: "VASTRA10", discount: "10% OFF", minOrder: 15000, isActive: true },
    { code: "ROYALWEDDING", discount: "₹2,500 FLAT OFF", minOrder: 30000, isActive: true },
    { code: "FIRSTSILK", discount: "₹1,000 OFF", minOrder: 10000, isActive: false },
  ]);

  const [savedAlert, setSavedAlert] = useState(false);

  const toggleCoupon = (code) => {
    setCoupons(coupons.map(c => c.code === code ? { ...c, isActive: !c.isActive } : c));
  };

  const handleSave = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-amber-900/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Banners, Offers & Promo Codes</h1>
          <p className="text-xs text-stone-500 mt-1">Manage announcement tickers, promotional banners, and discount coupons</p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#571520] to-[#3A0D15] text-[#F3E5C8] font-semibold text-xs shadow-md transition-all"
        >
          Save All Changes
        </button>
      </div>

      {savedAlert && (
        <div className="p-3 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Offers and Announcement Ticker successfully updated on storefront!</span>
        </div>
      )}

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
        </div>

        <div className="space-y-3">
          {coupons.map((c) => (
            <div key={c.code} className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sm bg-white px-3 py-1 rounded-lg border border-stone-300 text-stone-900">
                  {c.code}
                </span>
                <div>
                  <p className="text-xs font-bold text-stone-900">{c.discount}</p>
                  <p className="text-[10px] text-stone-500">Min Order: ₹{c.minOrder.toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleCoupon(c.code)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    c.isActive 
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {c.isActive ? "Active on Checkout" : "Disabled"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
