"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  Tag, 
  ShieldCheck, 
  Image as ImageIcon,
  Plus,
  Trash2
} from "lucide-react";

export default function AddNewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Form State initialized completely empty
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    category: "",
    categoryName: "",
    fabric: "",
    fabricName: "",
    occasion: "",
    occasionName: "",
    price: "",
    originalPrice: "",
    stock: "",
    colorName: "",
    colorHex: "#9B111E",
    imageUrl: "",
    weave: "",
    zari: "",
    blousePiece: "",
    length: "",
    weight: "",
    care: "",
    certification: "",
    description: "",
    isBestseller: false,
    isNewArrival: false,
    isSale: false
  });

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate save or write to Firestore
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(true);
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Saree Catalog</span>
        </Link>

        {successMessage && (
          <div className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Saree added successfully! Redirecting...</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-sm overflow-hidden p-6 sm:p-8">
        <div className="flex items-center gap-3 pb-6 border-b border-stone-100 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#571520] to-[#C5832B] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-900">Add New Saree</h1>
            <p className="text-xs text-stone-500">Fill in the drape details to publish into Suratbazar catalog</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Details */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5832B]"></span> Basic Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Saree Title / Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Crimson Kadwa Banarasi Katan Silk Saree"
                value={formData.name}
                onChange={handleNameChange}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 focus:border-[#C5832B] placeholder:text-stone-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  URL Slug (Auto Generated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. royal-crimson-kadwa-banarasi-saree"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-700 font-mono placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Short Tagline / Craft Hook
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pure silver electro zari with intricate floral kadwa jaal"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 placeholder:text-stone-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Inventory */}
          <div className="pt-4 border-t border-stone-100 space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5832B]"></span> Pricing & Stock
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 24999"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 placeholder:text-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Original / MRP Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 32000"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 placeholder:text-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Available Quantity (Stock) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 10"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 placeholder:text-stone-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Fabric, Occasion & Color */}
          <div className="pt-4 border-t border-stone-100 space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5832B]"></span> Fabric, Occasion & Color
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Fabric Type *
                </label>
                <select
                  required
                  value={formData.fabric}
                  onChange={(e) => setFormData({ ...formData, fabric: e.target.value, fabricName: e.target.options[e.target.selectedIndex].text })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 text-stone-800"
                >
                  <option value="" disabled>-- Select Fabric --</option>
                  <option value="katan-silk">Pure Katan Silk</option>
                  <option value="georgette">Pure Silk Georgette</option>
                  <option value="organza">Pure Tissue Organza</option>
                  <option value="kanjeevaram">Pure Kanjeevaram Silk</option>
                  <option value="paithani">Pure Paithani Silk</option>
                  <option value="chiffon">Pure Khaddi Chiffon</option>
                  <option value="tussar">Tussar Silk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Occasion Category *
                </label>
                <select
                  required
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value, occasionName: e.target.options[e.target.selectedIndex].text })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 text-stone-800"
                >
                  <option value="" disabled>-- Select Occasion --</option>
                  <option value="wedding">Wedding & Bridal</option>
                  <option value="festive">Festive & Celebrations</option>
                  <option value="reception">Grand Reception</option>
                  <option value="cocktail">Cocktail & Evening Soiree</option>
                  <option value="puja">Traditional Puja & Rituals</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Color Shade Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rani Pink, Emerald Green"
                  value={formData.colorName}
                  onChange={(e) => setFormData({ ...formData, colorName: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 placeholder:text-stone-400"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Saree Image */}
          <div className="pt-4 border-t border-stone-100 space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5832B]"></span> Saree Images
            </h3>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Main Image Path / URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. /products/georgette.jpg or https://image-url..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 placeholder:text-stone-400"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                You can provide a local path like <code className="bg-stone-100 px-1 py-0.5 rounded">/products/banarasi.jpg</code> or an external image link.
              </p>
            </div>
          </div>

          {/* Section 5: Craft Specifications */}
          <div className="pt-4 border-t border-stone-100 space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5832B]"></span> Craft Specifications & Artisan Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Weave / Karigari Technique
                </label>
                <input
                  type="text"
                  placeholder="e.g. Authentic Kadwa Handloom / Scallop Resham"
                  value={formData.weave}
                  onChange={(e) => setFormData({ ...formData, weave: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 placeholder:text-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Zari Quality
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pure Gold Electroplated Zari / Matte Antique Gold"
                  value={formData.zari}
                  onChange={(e) => setFormData({ ...formData, zari: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 placeholder:text-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Blouse Piece Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unstitched 0.8m Brocade Blouse Piece with sleeve border"
                  value={formData.blousePiece}
                  onChange={(e) => setFormData({ ...formData, blousePiece: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 placeholder:text-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Certification
                </label>
                <input
                  type="text"
                  placeholder="e.g. Silk Mark Certified 100% Pure Silk"
                  value={formData.certification}
                  onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 placeholder:text-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Length & Measurements
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5.5 meters saree + 0.8 meter blouse piece"
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 placeholder:text-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Weight
                </label>
                <input
                  type="text"
                  placeholder="e.g. 650 - 750 grams"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Detailed Drape Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe the texture, feel, border craftsmanship, and styling recommendations for the bride..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 placeholder:text-stone-400"
              />
            </div>
          </div>

          {/* Section 6: Visibility Badges */}
          <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-6 items-center">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
              <input
                type="checkbox"
                checked={formData.isBestseller}
                onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                className="w-4 h-4 rounded text-[#571520] focus:ring-[#C5832B]"
              />
              <span>Mark as Bestseller ⭐</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
              <input
                type="checkbox"
                checked={formData.isNewArrival}
                onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                className="w-4 h-4 rounded text-[#571520] focus:ring-[#C5832B]"
              />
              <span>Mark as New Arrival 🚀</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
              <input
                type="checkbox"
                checked={formData.isSale}
                onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })}
                className="w-4 h-4 rounded text-[#571520] focus:ring-[#C5832B]"
              />
              <span>Include in Festive Sale Discount 🔥</span>
            </label>
          </div>

          {/* Actions Button */}
          <div className="pt-6 border-t border-stone-200 flex items-center justify-end gap-3">
            <Link
              href="/admin/products"
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#571520] to-[#3A0D15] text-[#F3E5C8] hover:text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-[#9B111E]/40 disabled:opacity-60 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Publishing Saree..." : "Publish Saree to Catalog"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
