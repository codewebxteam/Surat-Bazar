"use client";

import { useState } from "react";
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
  Tag
} from "lucide-react";
import { PRODUCTS } from "@/data/products";

export default function AdminProductsPage() {
  const [productsList, setProductsList] = useState(PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [fabricFilter, setFabricFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fabrics = [
    { value: "all", label: "All Fabrics" },
    { value: "georgette", label: "Georgette" },
    { value: "katan-silk", label: "Katan Silk" },
    { value: "organza", label: "Organza" },
    { value: "tissue", label: "Tissue Silk" },
    { value: "chiffon", label: "Chiffon" },
    { value: "kanjeevaram", label: "Kanjeevaram" },
  ];

  const filteredProducts = productsList.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.fabricName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFabric = fabricFilter === "all" || p.fabric === fabricFilter || p.category === fabricFilter;
    return matchesSearch && matchesFabric;
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to remove this saree from the catalog?")) {
      setProductsList(productsList.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-amber-900/10 shadow-xs">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Saree Catalog Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your {productsList.length} handcrafted pure silk and bridal sarees
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

      {/* Search & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by saree name, fabric, ID..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50 focus:border-[#C5832B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-stone-500 font-medium whitespace-nowrap">Filter:</span>
          {fabrics.map((f) => (
            <button
              key={f.value}
              onClick={() => setFabricFilter(f.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                fabricFilter === f.value
                  ? "bg-[#571520] text-[#F3E5C8] shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {f.label}
            </button>
          ))}
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
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        (saree.stock || 8) <= 3
                          ? "bg-rose-100 text-rose-700 border border-rose-200"
                          : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      }`}>
                        {(saree.stock || 8) <= 3 ? "Low Stock: " : "In Stock: "}
                        {saree.stock || 8} pcs
                      </span>
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
                        <button
                          title="Edit Saree"
                          className="p-1.5 rounded-lg text-stone-500 hover:text-[#C5832B] hover:bg-amber-50 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
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
