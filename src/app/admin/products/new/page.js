"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  Tag, 
  ShieldCheck, 
  Image as ImageIcon,
  Trash2,
  X
} from "lucide-react";
import { IKContext, IKUpload } from "imagekitio-react";
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const authenticator = async () => {
  try {
    const response = await fetch("/api/imagekit/auth");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const DEFAULT_CATEGORIES = [
  { id: "cat-banarasi", name: "Banarasi Sarees", slug: "banarasi-sarees", type: "main" },
  { id: "cat-kanjeevaram", name: "Kanjeevaram Silk", slug: "kanjeevaram-silk", type: "main" },
  { id: "cat-paithani", name: "Paithani Sarees", slug: "paithani-sarees", type: "main" },
  { id: "cat-organza", name: "Organza Sarees", slug: "organza-sarees", type: "main" },
  { id: "cat-chiffon", name: "Chiffon & Georgette", slug: "chiffon-georgette", type: "main" },
  { id: "cat-bandhani", name: "Bandhani Sarees", slug: "bandhani-sarees", type: "main" },
  { id: "cat-bridal", name: "Bridal Heritage", slug: "bridal-heritage", type: "main" },
  { id: "fab-katan", name: "Katan Silk", slug: "katan-silk", type: "fabric" },
  { id: "fab-pure-silk", name: "Pure Silk", slug: "pure-silk", type: "fabric" },
  { id: "fab-tissue", name: "Tissue Silk", slug: "tissue-silk", type: "fabric" },
  { id: "fab-organza", name: "Organza Silk", slug: "organza-silk", type: "fabric" },
  { id: "fab-georgette", name: "Silk Georgette", slug: "silk-georgette", type: "fabric" },
  { id: "fab-chiffon", name: "Pure Chiffon", slug: "pure-chiffon", type: "fabric" },
  { id: "fab-tussar", name: "Tussar Silk", slug: "tussar-silk", type: "fabric" },
];

function AddProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [permissionWarning, setPermissionWarning] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Categories from Firestore
        const querySnapshot = await getDocs(collection(db, "categories"));
        const cats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (cats.length > 0) {
          setDynamicCategories(cats);
        } else {
          setDynamicCategories(DEFAULT_CATEGORIES);
        }

        // If editing, fetch Product
        if (editId) {
          const docRef = doc(db, "products", editId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              name: data.name || "",
              slug: data.slug || "",
              tagline: data.tagline || "",
              category: data.category || "",
              categoryName: data.categoryName || "",
              subcategory: data.subcategory || "",
              subcategoryName: data.subcategoryName || "",
              fabricName: data.fabricName || "",
              occasions: data.occasions || [],
              collections: data.collections || [],
              price: data.price ? data.price.toString() : "",
              stock: data.stock !== undefined ? data.stock.toString() : "",
              colorName: data.colorName || "",
              images: data.images || [],
              zari: data.zari || "",
              length: data.length || "",
              description: data.description || "",
              isBestseller: !!data.isBestseller,
              isNewArrival: !!data.isNewArrival,
              isSale: !!data.isSale
            });
          }
        }
      } catch (error) {
        console.warn("Categories fetch note:", error);
        if (error?.code === "permission-denied" || error?.message?.includes("permissions")) {
          setPermissionWarning(true);
        }
        setDynamicCategories(DEFAULT_CATEGORIES);
      }
    }
    fetchData();
  }, [editId]);

  // Form State initialized completely empty
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    category: "",
    categoryName: "",
    subcategory: "",
    subcategoryName: "",
    fabricName: "",
    occasions: [],
    collections: [],
    price: "",
    stock: "",
    colorName: "",
    images: [],
    zari: "",
    length: "",
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

  const toggleSelection = (field, slug) => {
    setFormData(prev => {
      const currentList = prev[field] || [];
      if (currentList.includes(slug)) {
        return { ...prev, [field]: currentList.filter(item => item !== slug) };
      } else {
        return { ...prev, [field]: [...currentList, slug] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editId) {
        // Update existing product
        const docRef = doc(db, "products", editId);
        await updateDoc(docRef, {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          updatedAt: serverTimestamp()
        });
      } else {
        // Add new product
        await addDoc(collection(db, "products"), {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          createdAt: serverTimestamp()
        });
      }
      
      setSuccessMessage(true);
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    } catch (error) {
      console.error("Error saving product: ", error);
      if (error?.code === "permission-denied" || error?.message?.includes("permissions")) {
        alert("Firebase Security Rules Warning:\n\n'Missing or insufficient permissions.'\n\nFirebase Console > Firestore Database > Rules me jakar rules update karein taaki admin products add/edit kar sake.");
      } else {
        alert("Failed to save product: " + (error?.message || "Please try again."));
      }
    } finally {
      setIsSubmitting(false);
    }
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

      {permissionWarning && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-start gap-3 shadow-xs">
          <div className="space-y-1">
            <span className="font-bold block">Firestore Database Rules Notice:</span>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Firebase Console me Firestore database security rules read/write ko block kar rahi hain (&quot;Missing or insufficient permissions&quot;). Dropdowns ke liye default categories load ho gaye hain. Nayi sarees Firestore me save karne ke liye Firebase Console &gt; Firestore Database &gt; Rules ko update karein.
            </p>
          </div>
        </div>
      )}

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Section 3: Fabric, Occasion & Category */}
          <div className="pt-4 border-t border-stone-100 space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5832B]"></span> Classifications (Category, Fabric, Occasion, Collection)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Main Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value, categoryName: e.target.options[e.target.selectedIndex].text })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 text-stone-800"
                >
                  <option value="" disabled>-- Select Category --</option>
                  {dynamicCategories.filter(cat => !cat.type || cat.type === "main").map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory Select (Appears dynamically) */}
              {dynamicCategories.some(cat => cat.isSubcategory && cat.parentCategory === formData.category) && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Subcategory (Optional)
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value, subcategoryName: e.target.options[e.target.selectedIndex].text })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 text-stone-800"
                  >
                    <option value="">-- Select Subcategory --</option>
                    {dynamicCategories.filter(cat => (cat.type === "sub" || cat.isSubcategory === true) && cat.parentCategory === formData.category).map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              )}

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
                  {dynamicCategories.filter(cat => cat.type === "fabric").map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
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

            {/* Multi-Select Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-100">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                  Occasions (Select Multiple)
                </label>
                <div className="flex flex-wrap gap-2">
                  {dynamicCategories.filter(cat => cat.type === "occasion").map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleSelection('occasions', cat.slug)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border ${
                        formData.occasions.includes(cat.slug) 
                          ? 'bg-[#3E0C15] text-white border-[#3E0C15] shadow-sm' 
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-amber-500 hover:text-amber-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                  Collections (Select Multiple)
                </label>
                <div className="flex flex-wrap gap-2">
                  {dynamicCategories.filter(cat => cat.type === "collection").map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleSelection('collections', cat.slug)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border ${
                        formData.collections.includes(cat.slug) 
                          ? 'bg-[#C5832B] text-white border-[#C5832B] shadow-sm' 
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-amber-500 hover:text-amber-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Saree Image */}
          <div className="pt-4 border-t border-stone-100 space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5832B]"></span> Saree Images
            </h3>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                Upload Images
              </label>
              
              <IKContext 
                publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY} 
                urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT} 
                authenticator={authenticator}
              >
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-stone-300 border-dashed rounded-xl cursor-pointer bg-stone-50 hover:bg-stone-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 text-stone-400 mb-2" />
                      <p className="text-sm text-stone-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    </div>
                    <IKUpload
                      className="hidden"
                      fileName="saree-image"
                      tags={["saree"]}
                      useUniqueFileName={true}
                      isPrivateFile={false}
                      onSuccess={(res) => {
                        setFormData((prev) => ({
                          ...prev,
                          images: [...prev.images, res.url]
                        }));
                      }}
                      onError={(err) => {
                        console.error("Image upload failed", err);
                        alert("Image upload failed. Check console for details.");
                      }}
                    />
                  </label>
                </div>
              </IKContext>

              {/* Uploaded Images Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 group">
                      <img src={img} alt={`Uploaded ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx)
                          }));
                        }}
                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
              <span>{isSubmitting ? (editId ? "Updating Saree..." : "Publishing Saree...") : (editId ? "Update Saree" : "Publish Saree to Catalog")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddNewProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-stone-500">Loading form...</div>}>
      <AddProductForm />
    </Suspense>
  );
}
