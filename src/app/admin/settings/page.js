"use client";

import { useState } from "react";
import { 
  Settings, 
  Database, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  Save, 
  Store 
} from "lucide-react";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("Suratbazar");
  const [supportEmail, setSupportEmail] = useState("care@suratbazar.com");
  const [supportPhone, setSupportPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("Tower B, Ring Road Silk Market, Surat, Gujarat - 395002");
  const [freeShippingAbove, setFreeShippingAbove] = useState("5000");
  const [codEnabled, setCodEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-amber-900/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Admin & Store Settings</h1>
          <p className="text-xs text-stone-500 mt-1">Configure boutique contact, Firebase sync, and shipping policies</p>
        </div>
        {saved && (
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      {/* Firebase Status Card */}
      <div className="bg-gradient-to-br from-[#1C1412] to-[#2A170F] text-[#FAF7F2] p-6 rounded-3xl border border-[#3E251A] shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#E8C574]" />
            <h3 className="font-serif font-bold text-base text-[#FAF7F2]">Firebase Backend Connection</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
            SDK Configured
          </span>
        </div>
        <p className="text-xs text-stone-300">
          Firebase credentials are read from <code className="bg-stone-800 px-1.5 py-0.5 rounded text-[#E8C574]">.env.local</code> and initialized via <code className="bg-stone-800 px-1.5 py-0.5 rounded text-[#E8C574]">src/lib/firebase.js</code>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800">
            <p className="text-stone-400">Authentication Service</p>
            <p className="text-emerald-400 font-bold mt-0.5">Ready (Google & Email Auth)</p>
          </div>
          <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800">
            <p className="text-stone-400">Cloud Firestore DB</p>
            <p className="text-emerald-400 font-bold mt-0.5">Ready (Products & Orders Collection)</p>
          </div>
        </div>
      </div>

      {/* Store Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-900/10 shadow-xs space-y-6">
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
            <Store className="w-4 h-4 text-[#C5832B]" />
            <span>Storefront & Contact Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Store Brand Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">WhatsApp / Call Support</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Free Shipping Minimum (₹)</label>
              <input
                type="number"
                value={freeShippingAbove}
                onChange={(e) => setFreeShippingAbove(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Flagship Boutique / Warehouse Address</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Shipping & Payment Policies */}
        <div className="pt-4 border-t border-stone-100 space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#C5832B]" />
            <span>Payment & Shipping Options</span>
          </h3>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="cod"
              checked={codEnabled}
              onChange={(e) => setCodEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-[#571520] focus:ring-[#C5832B]"
            />
            <label htmlFor="cod" className="text-xs font-semibold text-stone-800 cursor-pointer">
              Enable Cash on Delivery (COD) for orders across India
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#571520] to-[#3A0D15] text-[#F3E5C8] font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
