"use client";

import { useState } from "react";
import { PRODUCTS } from "@/data/products";
import { 
  Boxes, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Save, 
  Search, 
  CheckCircle, 
  RefreshCw 
} from "lucide-react";

export default function AdminInventoryPage() {
  const [stockState, setStockState] = useState(
    PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      fabricName: p.fabricName,
      stock: p.stock || 8,
      threshold: 3,
      image: p.images[0],
      price: p.price
    }))
  );

  const [search, setSearch] = useState("");
  const [savedStatus, setSavedStatus] = useState(false);

  const adjustStock = (id, delta) => {
    setStockState(stockState.map((item) => {
      if (item.id === id) {
        const updated = Math.max(0, item.stock + delta);
        return { ...item, stock: updated };
      }
      return item;
    }));
  };

  const handleManualInput = (id, val) => {
    const num = parseInt(val, 10);
    setStockState(stockState.map((item) => {
      if (item.id === id) {
        return { ...item, stock: isNaN(num) ? 0 : num };
      }
      return item;
    }));
  };

  const handleSave = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const filtered = stockState.filter((item) => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.fabricName?.toLowerCase().includes(search.toLowerCase()) ||
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = stockState.filter((s) => s.stock <= s.threshold).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-amber-900/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Surat Warehouse Inventory & Stock Levels
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time handloom stock counters and fast restocking
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedStatus && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Stock Updated!
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#571520] to-[#3A0D15] text-[#F3E5C8] font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-[#9B111E]/40"
          >
            <Save className="w-4 h-4" />
            <span>Save All Stock Changes</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <p className="text-xs text-stone-500 font-bold uppercase">Total Saree Stock</p>
          <h3 className="text-2xl font-serif font-bold text-stone-900 mt-1">
            {stockState.reduce((acc, curr) => acc + curr.stock, 0)} Units
          </h3>
          <p className="text-[11px] text-stone-400 mt-0.5">Across {stockState.length} active designs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <p className="text-xs text-rose-600 font-bold uppercase">Low Stock Alerts</p>
          <h3 className="text-2xl font-serif font-bold text-rose-700 mt-1">
            {lowStockCount} Sarees
          </h3>
          <p className="text-[11px] text-rose-500 mt-0.5">Stock below threshold (≤3 units)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <p className="text-xs text-amber-700 font-bold uppercase">Warehouse Location</p>
          <h3 className="text-lg font-bold text-stone-900 mt-1">
            Ring Road Textile Hub, Surat
          </h3>
          <p className="text-[11px] text-stone-400 mt-0.5">Dispatches via Bluedart & Delhivery</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saree by name or fabric for quick stock update..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50"
          />
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Saree Design</th>
                <th className="py-3.5 px-4">Fabric</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Current Stock Units</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Restock (+ / -)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filtered.map((item) => {
                const isLow = item.stock <= item.threshold;
                return (
                  <tr key={item.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-stone-900">{item.name}</div>
                          <div className="text-[11px] text-stone-400 font-mono">SKU: {item.id.toUpperCase()}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-stone-700">{item.fabricName}</td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">₹{item.price?.toLocaleString("en-IN")}</td>

                    <td className="py-3.5 px-4">
                      <input
                        type="number"
                        min="0"
                        value={item.stock}
                        onChange={(e) => handleManualInput(item.id, e.target.value)}
                        className={`w-20 px-3 py-1.5 rounded-xl border text-center font-bold text-sm focus:outline-none ${
                          isLow ? "border-rose-300 bg-rose-50 text-rose-800" : "border-stone-300 bg-stone-50 text-stone-900"
                        }`}
                      />
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isLow 
                          ? "bg-rose-100 text-rose-800 border border-rose-200" 
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}>
                        {isLow ? <AlertTriangle className="w-3 h-3 text-rose-600" /> : <CheckCircle className="w-3 h-3 text-emerald-600" />}
                        {isLow ? "Restock Needed" : "Optimal Stock"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => adjustStock(item.id, -1)}
                          className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold transition-colors"
                          title="Decrease Stock by 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => adjustStock(item.id, 1)}
                          className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold transition-colors"
                          title="Increase Stock by 1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => adjustStock(item.id, 10)}
                          className="px-2.5 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#571520] flex items-center justify-center text-xs font-bold transition-colors border border-amber-200"
                          title="Add Batch +10"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
