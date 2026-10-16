"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, CheckCircle, FolderTree, Image as ImageIcon, X } from "lucide-react";
import { IKContext, IKUpload } from "imagekitio-react";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState("");
  const [categoryType, setCategoryType] = useState("main"); // "main", "sub", "occasion", "fabric"
  const [parentCategory, setParentCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const catData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(catData);
    } catch (error) {
      console.warn("Notice: Fetching categories from Firestore:", error?.message || error);
    } finally {
      setLoading(false);
    }
  }

  const handleNameChange = (e) => {
    const value = e.target.value;
    setNewCategoryName(value);
    
    if (!value.includes('\n')) {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setNewCategorySlug(slug);
    } else {
      setNewCategorySlug("Auto-generated for each item");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName) return;
    if (categoryType === "sub" && !parentCategory) {
      alert("Please select a parent category for the subcategory.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const names = newCategoryName.split('\n').map(n => n.trim()).filter(n => n);
      
      const promises = names.map(async (name) => {
        const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        return addDoc(collection(db, "categories"), {
          name: name,
          slug: slug,
          image: newCategoryImage,
          type: categoryType,
          isSubcategory: categoryType === "sub",
          parentCategory: categoryType === "sub" ? parentCategory : null,
          createdAt: serverTimestamp()
        });
      });

      await Promise.all(promises);
      setSuccessMessage(true);
      setNewCategoryName("");
      setNewCategorySlug("");
      setNewCategoryImage("");
      setCategoryType("main");
      setParentCategory("");
      setTimeout(() => setSuccessMessage(false), 3000);
      fetchCategories();
    } catch (error) {
      console.warn("Notice: Adding category:", error?.message || error);
      alert("Failed to add category: " + (error?.message || "Check Firestore permissions"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteDoc(doc(db, "categories", id));
        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        console.warn("Notice: Deleting category:", error?.message || error);
      }
    }
  };

  const mainCategories = categories.filter(c => !c.type || c.type === "main");
  const subCategories = categories.filter(c => c.type === "sub" || c.isSubcategory === true);
  const occasionCategories = categories.filter(c => c.type === "occasion");
  const fabricCategories = categories.filter(c => c.type === "fabric");
  const collectionCategories = categories.filter(c => c.type === "collection");

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-amber-900/10 shadow-xs">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Category Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Create main categories and subcategories here. These will dynamically appear in the Add Product form.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Category Form */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl border border-amber-900/10 p-6 shadow-sm">
            <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#C5832B]"></span> Add New
            </h3>
            
            {successMessage && (
              <div className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 mb-4 border border-emerald-100">
                <CheckCircle className="w-4 h-4" />
                Category Added!
              </div>
            )}

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Category Type
                </label>
                <select
                  value={categoryType}
                  onChange={(e) => {
                    setCategoryType(e.target.value);
                    if (e.target.value !== "sub") setParentCategory("");
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C5832B]"
                >
                  <option value="main">Main Category</option>
                  <option value="sub">Subcategory</option>
                  <option value="occasion">Occasion</option>
                  <option value="fabric">Fabric</option>
                  <option value="collection">Collection</option>
                </select>
              </div>

              {categoryType === "sub" && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Select Parent Category
                  </label>
                  <select
                    value={parentCategory}
                    onChange={(e) => setParentCategory(e.target.value)}
                    required={categoryType === "sub"}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C5832B]"
                  >
                    <option value="" disabled>-- Select Main Category --</option>
                    {mainCategories.map(main => (
                      <option key={main.id} value={main.slug}>{main.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Name (Bulk Add Supported)
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={categoryType === "sub" ? "e.g. Wedding Sarees\nParty Sarees" : "e.g. Wedding\nFestive\nParty"}
                  value={newCategoryName}
                  onChange={handleNameChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C5832B] resize-none"
                />
                <p className="text-[10px] text-stone-500 mt-1">Press Enter to add multiple items at once.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Slug
                </label>
                <input
                  type="text"
                  readOnly={newCategoryName.includes('\n')}
                  required
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                  className={`w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#C5832B] ${newCategoryName.includes('\n') ? 'text-stone-400 bg-stone-100 cursor-not-allowed' : 'text-stone-500'}`}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                  Category Image
                </label>
                
                <IKContext 
                  publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY} 
                  urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT} 
                  authenticator={authenticator}
                >
                  <div className="flex flex-col gap-3">
                    {!newCategoryImage ? (
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-stone-300 border-dashed rounded-xl cursor-pointer bg-stone-50 hover:bg-stone-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-6 h-6 text-stone-400 mb-1" />
                          <p className="text-xs text-stone-500 font-semibold">Upload Image</p>
                        </div>
                        <IKUpload
                          className="hidden"
                          fileName="category-image"
                          tags={["category"]}
                          useUniqueFileName={true}
                          isPrivateFile={false}
                          onSuccess={(res) => setNewCategoryImage(res.url)}
                          onError={(err) => {
                            console.error("Image upload failed", err);
                            alert("Image upload failed.");
                          }}
                        />
                      </label>
                    ) : (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden border border-stone-200 group">
                        <img src={newCategoryImage} alt="Category Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewCategoryImage("")}
                          className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-rose-600 shadow-sm hover:bg-rose-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </IKContext>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 rounded-xl bg-[#3E0C15] text-[#F3E5C8] font-semibold text-xs sm:text-sm shadow-md hover:bg-[#571520] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {isSubmitting ? "Adding..." : "Save Category"}
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl border border-amber-900/10 p-6 shadow-sm">
            <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#C5832B]"></span> Existing Categories structure
            </h3>
            
            {loading ? (
              <p className="text-xs text-stone-500">Loading categories...</p>
            ) : mainCategories.length === 0 ? (
              <p className="text-xs text-stone-500">No categories found. Create your first main category.</p>
            ) : (
              <div className="space-y-4">
                {mainCategories.map((mainCat) => {
                  const children = subCategories.filter(sub => sub.parentCategory === mainCat.slug);
                  return (
                    <div key={mainCat.id} className="rounded-xl border border-stone-200 overflow-hidden">
                      <div className="flex items-center justify-between p-3 bg-stone-100 border-b border-stone-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-stone-200 border border-stone-300 flex items-center justify-center overflow-hidden shrink-0">
                            {mainCat.image ? (
                              <img src={mainCat.image} alt={mainCat.name} className="w-full h-full object-cover" />
                            ) : (
                              <FolderTree className="w-5 h-5 text-stone-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-stone-900">{mainCat.name}</p>
                            <p className="text-xs text-stone-500 font-mono">{mainCat.slug}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(mainCat.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Main Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {children.length > 0 ? (
                        <div className="p-2 space-y-1 bg-stone-50">
                          {children.map(subCat => (
                            <div key={subCat.id} className="flex items-center justify-between p-2 pl-4 ml-8 rounded-lg hover:bg-stone-100 transition-colors border-l-2 border-[#C5832B]/30">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-md bg-stone-200 border border-stone-300 flex items-center justify-center overflow-hidden shrink-0">
                                  {subCat.image ? (
                                    <img src={subCat.image} alt={subCat.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <Tag className="w-4 h-4 text-stone-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-stone-800">{subCat.name}</p>
                                  <p className="text-[10px] text-stone-500 font-mono">{subCat.slug}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteCategory(subCat.id)}
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete Subcategory"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-stone-50 text-xs text-stone-400 italic pl-12">
                          No subcategories yet.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Occasions List */}
            <div className="mt-8">
              <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Occasions
              </h3>
              {occasionCategories.length === 0 ? (
                <p className="text-xs text-stone-500">No occasions found.</p>
              ) : (
                <div className="space-y-3">
                  {occasionCategories.map(occ => (
                    <div key={occ.id} className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-stone-200 overflow-hidden shrink-0">
                          {occ.image && <img src={occ.image} alt={occ.name} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900">{occ.name}</p>
                          <p className="text-[10px] text-stone-500 font-mono">{occ.slug}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteCategory(occ.id)} className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fabrics List */}
            <div className="mt-8">
              <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Fabrics
              </h3>
              {fabricCategories.length === 0 ? (
                <p className="text-xs text-stone-500">No fabrics found.</p>
              ) : (
                <div className="space-y-3">
                  {fabricCategories.map(fab => (
                    <div key={fab.id} className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-stone-200 overflow-hidden shrink-0">
                          {fab.image && <img src={fab.image} alt={fab.name} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900">{fab.name}</p>
                          <p className="text-[10px] text-stone-500 font-mono">{fab.slug}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteCategory(fab.id)} className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Collections List */}
            <div className="mt-8">
              <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Collections
              </h3>
              {collectionCategories.length === 0 ? (
                <p className="text-xs text-stone-500">No collections found.</p>
              ) : (
                <div className="space-y-3">
                  {collectionCategories.map(col => (
                    <div key={col.id} className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-stone-200 overflow-hidden shrink-0">
                          {col.image && <img src={col.image} alt={col.name} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900">{col.name}</p>
                          <p className="text-[10px] text-stone-500 font-mono">{col.slug}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteCategory(col.id)} className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
