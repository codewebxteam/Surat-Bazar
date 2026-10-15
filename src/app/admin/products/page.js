"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Eye, 
  Sparkles, 
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  Tag,
  Minus,
  Boxes
} from "lucide-react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminProductsPage() {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFabric, setFilterFabric] = useState("all");
  const [filterStock, setFilterStock] = useState("all"); // 'all', 'low', 'in-stock'

  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductsList(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Extract dynamic filter options from loaded products
  const uniqueCategories = Array.from(new Set(productsList.map(p => p.categoryName || p.category).filter(Boolean)));
  const uniqueFabrics = Array.from(new Set(productsList.map(p => p.fabricName || p.fabric).filter(Boolean)));

  const filteredProducts = productsList.filter((p) => {
    // 1. Search filter
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.fabricName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Category filter
    const matchesCat = filterCategory === "all" || p.categoryName === filterCategory || p.category === filterCategory;
    
    // 3. Fabric filter
    const matchesFab = filterFabric === "all" || p.fabricName === filterFabric || p.fabric === filterFabric;

    // 4. Stock filter
    let matchesStock = true;
    if (filterStock === "low") matchesStock = (p.stock || 0) <= 3;
    if (filterStock === "in-stock") matchesStock = (p.stock || 0) > 3;

    return matchesSearch && matchesCat && matchesFab && matchesStock;
  });

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to remove this saree from the catalog?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProductsList(productsList.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting product", error);
        alert("Failed to delete product.");
      }
    }
  };

  const handleStockChange = async (id, currentStock, delta) => {
    const newStock = Math.max(0, (currentStock || 0) + delta);
    try {
      await updateDoc(doc(db, "products", id), { stock: newStock });
      setProductsList(productsList.map(item => item.id === id ? { ...item, stock: newStock } : item));
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to update stock.");
    }
  };

  const lowStockCount = productsList.filter((s) => (s.stock || 0) <= 3).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-amber-900/10 shadow-xs">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Saree Catalog & Inventory
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your {loading ? "..." : productsList.length} products and stock levels
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#571520] to-[#3A0D15] text-[#F3E5C8] hover:text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-[#9B111E]/40"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Saree</span>
          </Link>
        </div>
      </div>

      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <p className="text-xs text-stone-500 font-bold uppercase">Total Saree Stock</p>
          <h3 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            {productsList.reduce((acc, curr) => acc + (curr.stock || 0), 0)} Units
          </h3>
          <p className="text-[11px] text-stone-400 mt-0.5">Across {productsList.length} active designs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <p className="text-xs text-rose-600 font-bold uppercase">Low Stock Alerts</p>
          <h3 className="text-2xl font-serif font-bold text-rose-700 mt-1">
            {lowStockCount} Sarees
          </h3>
          <p className="text-[11px] text-rose-500 mt-0.5">Stock below threshold (≤ 3 units)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <p className="text-xs text-amber-700 font-bold uppercase">Warehouse Location</p>
          <h3 className="text-lg font-bold text-stone-900 mt-1">
            Surat Textile Hub
          </h3>
          <p className="text-[11px] text-stone-400 mt-0.5">Primary dispatch center</p>
        </div>
      </div>

      {/* Advanced Search & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by saree name, SKU, or tags..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 focus:border-[#C5832B] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Category Dropdown */}
            <div className="relative flex-1 md:flex-none">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 pr-8 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Fabric Dropdown */}
            <div className="relative flex-1 md:flex-none">
              <select
                value={filterFabric}
                onChange={(e) => setFilterFabric(e.target.value)}
                className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 pr-8 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 cursor-pointer"
              >
                <option value="all">All Fabrics</option>
                {uniqueFabrics.map(fab => (
                  <option key={fab} value={fab}>{fab}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Stock Status Dropdown */}
            <div className="relative flex-1 md:flex-none">
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 pr-8 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 cursor-pointer"
              >
                <option value="all">All Stock Status</option>
                <option value="in-stock">In Stock (&gt;3)</option>
                <option value="low">Low Stock (≤3)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            
            {/* Clear All Filters */}
            {(searchQuery.trim() !== "" || filterCategory !== "all" || filterFabric !== "all" || filterStock !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setFilterCategory("all");
                  setFilterFabric("all");
                  setFilterStock("all");
                }}
                className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Saree</th>
                <th className="py-3.5 px-4">Fabric & Craft</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Tags</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-stone-400">
                    No sarees match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((saree) => (
                  <tr key={saree.id} className="hover:bg-amber-50/20 transition-colors">
                    {/* Saree Name & Image */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded-xl overflow-hidden bg-stone-100 relative shrink-0 border border-stone-200">
                          <img
                            src={saree.images[0]}
                            alt={saree.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-serif font-bold text-sm text-stone-900 hover:text-[#571520] cursor-pointer">
                            {saree.name}
                          </div>
                          <div className="text-[11px] text-stone-400 font-mono">
                            SKU: {saree.id.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Fabric */}
                    <td className="py-3.5 px-4 text-stone-700">
                      <div className="font-semibold">{saree.fabricName || saree.fabric}</div>
                      <div className="text-[11px] text-stone-400">{saree.occasionName || saree.occasion}</div>
                    </td>

                    {/* Pricing */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">
                        ₹{saree.price?.toLocaleString("en-IN")}
                      </div>
                      {saree.originalPrice && (
                        <div className="text-[11px] text-stone-400 line-through">
                          ₹{saree.originalPrice?.toLocaleString("en-IN")}
                        </div>
                      )}
                    </td>

                    {/* Stock Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          (saree.stock || 0) <= 3
                            ? "bg-rose-100 text-rose-700 border border-rose-200"
                            : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        }`}>
                          {(saree.stock || 0) <= 3 ? "Low: " : "In: "}
                          {saree.stock || 0}
                        </span>
                        
                        <div className="flex items-center bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                          <button 
                            onClick={() => handleStockChange(saree.id, saree.stock, -1)}
                            className="p-1 hover:bg-stone-200 text-stone-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => handleStockChange(saree.id, saree.stock, 1)}
                            className="p-1 hover:bg-stone-200 text-stone-600 transition-colors border-l border-stone-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Tags */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {saree.isBestseller && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] font-bold">
                            Bestseller
                          </span>
                        )}
                        {saree.isNewArrival && (
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[9px] font-bold">
                            New
                          </span>
                        )}
                        {saree.isSale && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[9px] font-bold">
                            Sale
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/product/${saree.slug}`}
                          target="_blank"
                          title="View on Storefront"
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/new?id=${saree.id}`}
                          title="Edit Saree"
                          className="p-1.5 rounded-lg text-stone-500 hover:text-[#C5832B] hover:bg-amber-50 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(saree.id)}
                          title="Delete Saree"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between text-xs text-stone-500">
          <span>Showing {filteredProducts.length} of {productsList.length} Sarees</span>
          <span>Surat Warehouse Database</span>
        </div>
      </div>
    </div>
  );
}
