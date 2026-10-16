"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Tag, 
  Plus, 
  CheckCircle, 
  Trash2, 
  Edit3,
  Loader2, 
  Save, 
  AlertCircle,
  Percent,
  IndianRupee,
  Info,
  Check,
  X
} from "lucide-react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DEFAULT_COUPONS, DEFAULT_ANNOUNCEMENT, normalizeCoupon } from "@/lib/promotions";

export default function AdminBannersPage() {
  const [announcementText, setAnnouncementText] = useState(DEFAULT_ANNOUNCEMENT);
  const [coupons, setCoupons] = useState(DEFAULT_COUPONS);

  // New coupon form modal / inline state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null if adding, number if editing
  const [formCode, setFormCode] = useState("");
  const [formType, setFormType] = useState("percentage"); // "percentage" | "flat" | "info"
  const [formValue, setFormValue] = useState("10");
  const [formMinOrder, setFormMinOrder] = useState("15000");
  const [formTag, setFormTag] = useState("ROYAL PRIVILEGE");
  const [formDescription, setFormDescription] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

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
          if (Array.isArray(data.coupons)) {
            const normalized = data.coupons.map(normalizeCoupon).filter(Boolean);
            setCoupons(normalized);
          }
        }
      } catch (err) {
        console.warn("Notice: Loading promotions from Firestore:", err?.message || err);
      } finally {
        setLoading(false);
      }
    }
    loadPromotions();
  }, []);

  const openAddModal = () => {
    setEditingIndex(null);
    setFormCode("");
    setFormType("percentage");
    setFormValue("10");
    setFormMinOrder("15000");
    setFormTag("ROYAL PRIVILEGE");
    setFormDescription("Flat 10% instant off on orders above ₹15,000.");
    setFormIsActive(true);
    setShowAddModal(true);
  };

  const openEditModal = (coupon, idx) => {
    setEditingIndex(idx);
    setFormCode(coupon.code || "");
    setFormType(coupon.type || "percentage");
    setFormValue(String(coupon.value ?? ""));
    setFormMinOrder(String(coupon.minOrder ?? "0"));
    setFormTag(coupon.tag || "");
    setFormDescription(coupon.description || "");
    setFormIsActive(coupon.isActive !== false);
    setShowAddModal(true);
  };

  // Auto-generate suggested description when type or value or minOrder changes
  const handleTypeChange = (newType) => {
    setFormType(newType);
    if (newType === "percentage") {
      setFormDescription(`Flat ${formValue || 10}% instant off on orders above ₹${Number(formMinOrder || 0).toLocaleString("en-IN")}.`);
    } else if (newType === "flat") {
      setFormDescription(`₹${Number(formValue || 1000).toLocaleString("en-IN")} flat instant discount on orders above ₹${Number(formMinOrder || 0).toLocaleString("en-IN")}.`);
    } else {
      setFormDescription("Zero interest monthly installments starting from ₹2,100/mo.");
    }
  };

  const toggleCoupon = (code) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const deleteCoupon = (code) => {
    if (confirm(`Are you sure you want to delete offer "${code}"?`)) {
      setCoupons((prev) => prev.filter((c) => c.code !== code));
    }
  };

  const handleSaveCouponForm = (e) => {
    e.preventDefault();
    const cleanCode = formCode.trim().toUpperCase();
    if (!cleanCode) {
      alert("Please enter a coupon code.");
      return;
    }

    // Check duplicate if adding or changing code
    const isDuplicate = coupons.some((c, idx) => c.code === cleanCode && idx !== editingIndex);
    if (isDuplicate) {
      alert(`A coupon with code "${cleanCode}" already exists!`);
      return;
    }

    const numValue = Number(formValue) || 0;
    const numMin = Number(formMinOrder) || 0;

    let finalDesc = formDescription.trim();
    if (!finalDesc) {
      if (formType === "percentage") {
        finalDesc = numMin > 0 
          ? `Flat ${numValue}% instant off on orders above ₹${numMin.toLocaleString("en-IN")}.`
          : `Flat ${numValue}% instant off sitewide.`;
      } else if (formType === "flat") {
        finalDesc = numMin > 0
          ? `₹${numValue.toLocaleString("en-IN")} flat discount on orders above ₹${numMin.toLocaleString("en-IN")}.`
          : `₹${numValue.toLocaleString("en-IN")} flat discount sitewide.`;
      } else {
        finalDesc = "Special member privilege offer.";
      }
    }

    const newCouponItem = {
      code: cleanCode,
      type: formType,
      value: formType === "info" ? 0 : numValue,
      minOrder: numMin,
      tag: formTag.trim(),
      description: finalDesc,
      isActive: formIsActive,
    };

    if (editingIndex !== null) {
      const updated = [...coupons];
      updated[editingIndex] = newCouponItem;
      setCoupons(updated);
    } else {
      setCoupons([...coupons, newCouponItem]);
    }

    setShowAddModal(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSavedAlert(false);

    try {
      const payload = {
        announcementText: announcementText.trim(),
        coupons,
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "settings", "promotions"), payload, { merge: true });

      // Update localStorage cache
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "suratbazar_promotions",
            JSON.stringify({
              announcementText: announcementText.trim(),
              coupons,
              updatedAt: Date.now(),
            })
          );
        } catch (e) {}
      }

      setSavedAlert(true);
      setTimeout(() => setSavedAlert(false), 3500);
    } catch (err) {
      console.warn("Notice: Error saving promotions to Firestore:", err?.message || err);
      setError("Failed to save to Firestore: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-amber-900/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-50 rounded-xl text-amber-900">
              <Tag className="w-5 h-5 text-amber-700" />
            </span>
            <h1 className="font-serif text-2xl font-bold text-stone-900">Offers & Available Privileges</h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Configure discount promo codes & privileges shown on Product Pages, Cart, and Checkout.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#571520] to-[#3A0D15] text-[#F3E5C8] font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving to Cloud...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Publish All Changes</span>
            </>
          )}
        </button>
      </div>

      {savedAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Offers, privileges and announcement bar successfully published! Changes are now live on product pages and checkout.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-stone-400 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#C5832B]" />
          <span className="text-xs font-medium">Loading offers from Firestore...</span>
        </div>
      ) : (
        <>
          {/* 1. Product Page & Checkout Offers Section */}
          <div className="bg-white rounded-3xl border border-amber-900/10 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                  <span>Product Detail Page Offers (&ldquo;Available Offers & Privileges&rdquo;)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  These offers appear directly in the box below the product price. Users can copy/apply with 1 click.
                </p>
              </div>

              <button
                type="button"
                onClick={openAddModal}
                className="px-4 py-2 rounded-xl bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Offer</span>
              </button>
            </div>

            {/* Coupons List Cards */}
            <div className="space-y-3">
              {coupons.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                  No active offers or promo codes. Click &ldquo;Add New Offer&rdquo; to create one.
                </div>
              ) : (
                coupons.map((c, idx) => (
                  <div
                    key={c.code + idx}
                    className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      c.isActive
                        ? "bg-amber-50/40 border-amber-200/80 hover:bg-amber-50/70"
                        : "bg-stone-50/60 border-stone-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="shrink-0">
                        <span className="font-mono font-bold text-sm bg-amber-200/90 text-[#3E0C15] px-3 py-1.5 rounded-lg border border-amber-300 shadow-2xs block">
                          {c.code}
                        </span>
                        {c.tag && (
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                            {c.tag}
                          </span>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-stone-900">{c.description}</p>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            c.type === "percentage" 
                              ? "bg-purple-100 text-purple-800" 
                              : c.type === "flat"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {c.type === "percentage" 
                              ? `${c.value}% Instant Off` 
                              : c.type === "flat" 
                              ? `₹${Number(c.value).toLocaleString("en-IN")} Flat Off` 
                              : "Info Privilege"}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          {c.minOrder > 0
                            ? `Requires Minimum Cart Value: ₹${Number(c.minOrder).toLocaleString("en-IN")}`
                            : "No minimum purchase requirement (Sitewide)"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        type="button"
                        onClick={() => toggleCoupon(c.code)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          c.isActive
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                            : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                        }`}
                      >
                        {c.isActive ? "● Live on Site" : "○ Disabled"}
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditModal(c, idx)}
                        title="Edit Offer"
                        className="p-2 rounded-lg text-stone-500 hover:text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCoupon(c.code)}
                        title="Delete Offer"
                        className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. Top Header Announcement Bar Manager */}
          <div className="bg-white rounded-3xl border border-amber-900/10 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5832B]" />
              <h3 className="font-serif font-bold text-base text-stone-900">Storefront Header Announcement Bar</h3>
            </div>
            <p className="text-xs text-stone-500">This promotional ticker scrolls continuously across the top of every page.</p>
            <textarea
              rows={2}
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="e.g. ✨ Grand Festive Collection Live: Use Code ROYAL10 for Flat 10% Off ✨"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 font-medium"
            />
          </div>
        </>
      )}

      {/* Modal for Adding / Editing Coupon */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-amber-900/15 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {editingIndex !== null ? "Edit Offer / Privilege" : "Add New Offer / Privilege"}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCouponForm} className="space-y-4">
              {/* Code & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Coupon / Offer Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ROYAL10"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Badge Tag (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ROYAL PRIVILEGE"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value.toUpperCase())}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50"
                  />
                </div>
              </div>

              {/* Discount Type Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Offer Benefit Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("percentage")}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      formType === "percentage"
                        ? "bg-[#3E0C15] text-[#F7EFCF] border-[#3E0C15] shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <Percent className="w-4 h-4" />
                    <span>Percentage (%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTypeChange("flat")}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      formType === "flat"
                        ? "bg-[#3E0C15] text-[#F7EFCF] border-[#3E0C15] shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <IndianRupee className="w-4 h-4" />
                    <span>Flat (₹ Off)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTypeChange("info")}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      formType === "info"
                        ? "bg-[#3E0C15] text-[#F7EFCF] border-[#3E0C15] shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <Info className="w-4 h-4" />
                    <span>Info Privilege</span>
                  </button>
                </div>
              </div>

              {/* Value & Min Order */}
              {formType !== "info" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      {formType === "percentage" ? "Discount Percentage (%) *" : "Flat Discount (₹) *"}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={formType === "percentage" ? "99" : "100000"}
                      placeholder={formType === "percentage" ? "e.g. 10" : "e.g. 2000"}
                      value={formValue}
                      onChange={(e) => {
                        setFormValue(e.target.value);
                        if (formType === "percentage") {
                          setFormDescription(`Flat ${e.target.value}% instant off on orders above ₹${Number(formMinOrder || 0).toLocaleString("en-IN")}.`);
                        } else {
                          setFormDescription(`₹${Number(e.target.value || 0).toLocaleString("en-IN")} flat instant discount on orders above ₹${Number(formMinOrder || 0).toLocaleString("en-IN")}.`);
                        }
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Minimum Order (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 15000 (0 for none)"
                      value={formMinOrder}
                      onChange={(e) => {
                        setFormMinOrder(e.target.value);
                        if (formType === "percentage") {
                          setFormDescription(`Flat ${formValue || 10}% instant off on orders above ₹${Number(e.target.value || 0).toLocaleString("en-IN")}.`);
                        } else if (formType === "flat") {
                          setFormDescription(`₹${Number(formValue || 0).toLocaleString("en-IN")} flat instant discount on orders above ₹${Number(e.target.value || 0).toLocaleString("en-IN")}.`);
                        }
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Customer-Facing Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 10% instant off on orders above ₹15,000."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  This exact line is displayed to customers on product pages and in bag checkout.
                </span>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-xs font-bold text-stone-800">Enable Offer Immediately</span>
                <button
                  type="button"
                  onClick={() => setFormIsActive(!formIsActive)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    formIsActive ? "bg-emerald-600 justify-end" : "bg-stone-300 justify-start"
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                </button>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  {editingIndex !== null ? "Update Offer" : "Add Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
