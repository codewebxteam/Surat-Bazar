"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp,
  X, 
  Sparkles, 
  RotateCcw,
  Check,
  ChevronRight,
  Filter,
  CheckCircle2,
  Tag,
  IndianRupee,
  Layers,
  Sparkle
} from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { FILTER_CRITERIA } from "@/data/filters";
import ProductCard from "@/components/ProductCard";

export default function ProductListingPage({
  title,
  subtitle,
  description,
  bannerImage = "/banners/hero-1.png",
  filterType = "all",
  filterValue = null,
  breadcrumbs = [{ name: "Home", href: "/" }, { name: "Sarees", href: "/collections/sarees" }],
  products = PRODUCTS,
  filterCriteria = FILTER_CRITERIA,
}) {
  // Filter States for all 7 required facets
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceBracket, setSelectedPriceBracket] = useState("all");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState("all"); // "all" | "in-stock" | "ready-to-ship" | "limited"
  const [selectedMinDiscount, setSelectedMinDiscount] = useState(0); // 0 | 10 | 20 | 30

  // Collapsible accordion states for desktop sidebar
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    color: true,
    fabric: true,
    occasion: true,
    availability: true,
    discount: true,
  });

  const [sortBy, setSortBy] = useState("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // 1. Category facet definitions
  const categoryOptions = useMemo(() => [
    { id: "banarasi", name: "Banarasi Silks" },
    { id: "kanjeevaram", name: "Kanjeevaram Pattu" },
    { id: "paithani", name: "Yeola Paithani" },
    { id: "patola", name: "Patan Patola" },
    { id: "organza", name: "Organza & Tissue" },
    { id: "georgette", name: "Silk Georgette" },
    { id: "chiffon", name: "Khaddi Chiffon & Bandhani" },
    { id: "chanderi", name: "Chanderi Handlooms" },
    { id: "tussar", name: "Tussar Silk" },
    { id: "bridal", name: "Bridal Trousseau" }
  ], []);

  // 2. Price Brackets
  const priceBrackets = useMemo(() => [
    { id: "all", label: "All Price Ranges", min: 0, max: 1000000 },
    { id: "under-25k", label: "Under ₹25,000", min: 0, max: 25000 },
    { id: "25k-45k", label: "₹25,000 - ₹45,000", min: 25000, max: 45000 },
    { id: "45k-70k", label: "₹45,000 - ₹70,000", min: 45000, max: 70000 },
    { id: "above-70k", label: "Above ₹70,000", min: 70000, max: 1000000 },
  ], []);

  // 3. Colour Palette
  const colorOptions = useMemo(() => [
    { id: "emerald-green", name: "Emerald Green", hex: "#0D593F" },
    { id: "pink", name: "Rani Pink", hex: "#C2185B" },
    { id: "royal-blue", name: "Midnight / Sky Blue", hex: "#1A2A6C" },
    { id: "red", name: "Sindoor Red", hex: "#B71C1C" },
    { id: "yellow", name: "Sunshine Yellow", hex: "#FBC02D" },
    { id: "purple", name: "Royal Violet / Lavender", hex: "#4B0082" },
    { id: "gold", name: "Champagne Gold", hex: "#D4AF37" },
    { id: "peach", name: "Blush Peach", hex: "#FAD4C0" },
    { id: "turquoise", name: "Peacock Turquoise", hex: "#008B8B" },
    { id: "rose-gold", name: "Rose Gold", hex: "#B76E79" },
    { id: "black", name: "Obsidian Black", hex: "#111111" },
    { id: "pistachio", name: "Mint Pistachio", hex: "#93C572" },
    { id: "maroon", name: "Burgundy Maroon", hex: "#4A0E17" }
  ], []);

  // 4. Fabric facet definitions
  const fabricOptions = useMemo(() => [
    { id: "pure-silk", name: "Pure Mulberry Silk" },
    { id: "katan-silk", name: "Pure Katan Silk" },
    { id: "organza", name: "Tissue Organza" },
    { id: "georgette", name: "Pure Silk Georgette" },
    { id: "chiffon", name: "Khaddi Chiffon" },
    { id: "chanderi", name: "Chanderi Cotton Silk" },
    { id: "tussar-silk", name: "Bhagalpuri Tussar" },
    { id: "tissue", name: "Metallic Tissue Silk" },
    { id: "velvet", name: "Micro Velvet & Silk" }
  ], []);

  // 5. Occasion facet definitions
  const occasionOptions = useMemo(() => [
    { id: "wedding", name: "Wedding & Bridal" },
    { id: "festive", name: "Festive Celebrations" },
    { id: "reception", name: "Reception & Cocktails" },
    { id: "party", name: "Cocktail & Party" },
    { id: "haldi", name: "Haldi & Pooja" },
    { id: "mehendi", name: "Mehendi & Sangeet" },
    { id: "engagement", name: "Engagement & Roka" }
  ], []);

  // 6. Availability Options
  const availabilityOptions = useMemo(() => [
    { id: "all", label: "All Items" },
    { id: "in-stock", label: "In Stock (Ready to Dispatch)" },
    { id: "limited", label: "Rare / Limited Stock (≤ 5 left)" }
  ], []);

  // 7. Discount Brackets
  const discountOptions = useMemo(() => [
    { value: 0, label: "All Items" },
    { value: 10, label: "10% Off or More" },
    { value: 20, label: "20% Off or More" },
    { value: 30, label: "30% Off or More" }
  ], []);

  // Main Filter Logic encompassing all 7 facets
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // 1. Initial Route Context Filter
      if (filterType === "category" && filterValue && item.category !== filterValue) return false;
      if (filterType === "occasion" && filterValue && item.occasion !== filterValue) return false;
      if (filterType === "fabric" && filterValue && item.fabric !== filterValue) return false;
      if (filterType === "color" && filterValue && item.color !== filterValue) return false;
      if (filterType === "sale" && !item.isSale) return false;
      if (filterType === "new" && !item.isNewArrival) return false;
      if (filterType === "bestseller" && !item.isBestseller) return false;

      // 2. Facet 1: Category
      if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) return false;

      // 3. Facet 2: Price
      if (selectedPriceBracket !== "all") {
        const bracket = priceBrackets.find((b) => b.id === selectedPriceBracket);
        if (bracket && (item.price < bracket.min || item.price > bracket.max)) return false;
      }

      // 4. Facet 3: Colour
      if (selectedColors.length > 0 && !selectedColors.includes(item.color)) return false;

      // 5. Facet 4: Fabric
      if (selectedFabrics.length > 0 && !selectedFabrics.includes(item.fabric)) return false;

      // 6. Facet 5: Occasion
      if (selectedOccasions.length > 0 && !selectedOccasions.includes(item.occasion)) return false;

      // 7. Facet 6: Availability
      if (selectedAvailability === "in-stock" && (!item.stock || item.stock <= 0)) return false;
      if (selectedAvailability === "limited" && (item.stock > 5 || item.stock <= 0)) return false;

      // 8. Facet 7: Discount
      const itemDiscount = item.originalPrice && item.originalPrice > item.price
        ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
        : 0;
      if (selectedMinDiscount > 0 && itemDiscount < selectedMinDiscount) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low-high") return a.price - b.price;
      if (sortBy === "price-high-low") return b.price - a.price;
      if (sortBy === "newest") return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      if (sortBy === "best-selling") return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0) || b.reviewsCount - a.reviewsCount;
      if (sortBy === "rating") return b.rating - a.rating || b.reviewsCount - a.reviewsCount;
      return 0; // default "featured"
    });
  }, [
    filterType, 
    filterValue, 
    selectedCategories, 
    selectedPriceBracket, 
    priceBrackets, 
    selectedColors, 
    selectedFabrics, 
    selectedOccasions, 
    selectedAvailability, 
    selectedMinDiscount, 
    sortBy
  ]);

  const toggleArrayFilter = (setter, currentArr, value) => {
    if (currentArr.includes(value)) {
      setter(currentArr.filter((item) => item !== value));
    } else {
      setter([...currentArr, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceBracket("all");
    setSelectedColors([]);
    setSelectedFabrics([]);
    setSelectedOccasions([]);
    setSelectedAvailability("all");
    setSelectedMinDiscount(0);
    setSortBy("featured");
  };

  const hasActiveFilters = 
    selectedCategories.length > 0 || 
    selectedPriceBracket !== "all" || 
    selectedColors.length > 0 || 
    selectedFabrics.length > 0 ||
    selectedOccasions.length > 0 ||
    selectedAvailability !== "all" ||
    selectedMinDiscount > 0;

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen">
      
      {/* 1. Header Banner / Hero Section with Breadcrumb, Title & Optional Description */}
      <section className="relative w-full bg-[#180A08] text-white border-b border-amber-900/30 overflow-hidden">
        {/* Subtle background artwork */}
        <div className="absolute inset-0 opacity-25">
          <Image
            src={bannerImage}
            alt={title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#180A08] via-[#180A08]/80 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14 relative z-10">
          
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-xs text-amber-200/80 mb-4 tracking-wider uppercase font-medium">
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <Link href={crumb.href} className="hover:text-white transition-colors">
                  {crumb.name}
                </Link>
                {idx < breadcrumbs.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-amber-500/60" />
                )}
              </span>
            ))}
          </nav>

          {/* Title */}
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-tight tracking-wide">
            {title}
          </h1>

          {/* Optional Description */}
          {description && (
            <p className="text-stone-300 text-xs sm:text-sm md:text-base max-w-3xl mt-3 leading-relaxed font-light">
              {description}
            </p>
          )}

        </div>
      </section>

      {/* 2. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10">
        
        {/* Top Filter & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-stone-200 mb-6 sm:mb-8">
          
          {/* Left: Filter Toggle & Counter */}
          <div className="flex items-center gap-4">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-full text-xs font-semibold text-stone-900 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-800" />
              <span>All Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-amber-600" />
              )}
            </button>

            {/* Desktop Filter Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 hover:border-amber-700/40 rounded-full text-xs font-semibold text-stone-800 shadow-sm transition-all cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#3E0C15]" />
              <span>{isSidebarCollapsed ? "Show Filters (7)" : "Hide Filters"}</span>
            </button>

            {/* Product Count */}
            <span className="text-xs sm:text-sm text-stone-600 font-medium">
              Showing <strong className="text-stone-950 font-bold">{filteredProducts.length}</strong> Heirloom Sarees
            </span>
          </div>

          {/* Right: Sort Dropdown */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">Sort By:</span>
            <div className="relative">
              <select
                id="collection-sort-select"
                aria-label="Sort sarees"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-stone-300 hover:border-amber-700/50 rounded-xl text-xs font-semibold text-stone-800 pl-3.5 pr-8 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="best-selling">Best Selling</option>
                <option value="rating">Rating</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 pb-2">
            <span className="text-xs text-stone-500 font-medium">Active Filters:</span>
            
            {/* Category Chips */}
            {selectedCategories.map((c) => (
              <span key={`cat-${c}`} className="inline-flex items-center gap-1.5 text-xs bg-amber-100/80 text-[#3E0C15] px-3 py-1 rounded-full font-medium border border-amber-300/40">
                <span className="capitalize">{categoryOptions.find((o) => o.id === c)?.name || c}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => toggleArrayFilter(setSelectedCategories, selectedCategories, c)} />
              </span>
            ))}

            {/* Price Bracket Chip */}
            {selectedPriceBracket !== "all" && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-amber-100/80 text-[#3E0C15] px-3 py-1 rounded-full font-medium border border-amber-300/40">
                <span>{priceBrackets.find((b) => b.id === selectedPriceBracket)?.label}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setSelectedPriceBracket("all")} />
              </span>
            )}

            {/* Color Chips */}
            {selectedColors.map((c) => (
              <span key={`col-${c}`} className="inline-flex items-center gap-1.5 text-xs bg-amber-100/80 text-[#3E0C15] px-3 py-1 rounded-full font-medium border border-amber-300/40">
                <span className="capitalize">{colorOptions.find((o) => o.id === c)?.name || c}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => toggleArrayFilter(setSelectedColors, selectedColors, c)} />
              </span>
            ))}

            {/* Fabric Chips */}
            {selectedFabrics.map((f) => (
              <span key={`fab-${f}`} className="inline-flex items-center gap-1.5 text-xs bg-amber-100/80 text-[#3E0C15] px-3 py-1 rounded-full font-medium border border-amber-300/40">
                <span className="capitalize">{fabricOptions.find((o) => o.id === f)?.name || f}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => toggleArrayFilter(setSelectedFabrics, selectedFabrics, f)} />
              </span>
            ))}

            {/* Occasion Chips */}
            {selectedOccasions.map((o) => (
              <span key={`occ-${o}`} className="inline-flex items-center gap-1.5 text-xs bg-amber-100/80 text-[#3E0C15] px-3 py-1 rounded-full font-medium border border-amber-300/40">
                <span className="capitalize">{occasionOptions.find((op) => op.id === o)?.name || o}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => toggleArrayFilter(setSelectedOccasions, selectedOccasions, o)} />
              </span>
            ))}

            {/* Availability Chip */}
            {selectedAvailability !== "all" && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-amber-100/80 text-[#3E0C15] px-3 py-1 rounded-full font-medium border border-amber-300/40">
                <span>{availabilityOptions.find((a) => a.id === selectedAvailability)?.label}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setSelectedAvailability("all")} />
              </span>
            )}

            {/* Discount Chip */}
            {selectedMinDiscount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-100/80 text-emerald-900 px-3 py-1 rounded-full font-medium border border-emerald-300/40">
                <span>{selectedMinDiscount}% Off or More</span>
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setSelectedMinDiscount(0)} />
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-700 hover:text-rose-900 underline underline-offset-4 flex items-center gap-1 font-semibold ml-2 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* 3. Layout Grid: Desktop Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar (All 7 Facets) */}
          {!isSidebarCollapsed && (
            <aside className="hidden lg:block lg:col-span-3 space-y-5 sticky top-28 max-h-[85vh] overflow-y-auto pr-3 bg-white p-5 rounded-2xl border border-amber-900/10 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="font-serif-luxury text-lg font-bold text-[#3E0C15]">Filters</span>
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="text-xs text-amber-800 hover:underline cursor-pointer">
                    Reset All
                  </button>
                )}
              </div>

              {/* 1. Category Facet */}
              <div className="border-b border-stone-100 pb-4">
                <button 
                  onClick={() => toggleSection("category")}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-widest text-stone-900 font-bold mb-2.5 cursor-pointer"
                >
                  <span>Category</span>
                  {openSections.category ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
                </button>
                {openSections.category && (
                  <div className="space-y-1.5 pt-1">
                    {categoryOptions.map((cat) => (
                      <label key={cat.id} className="flex items-center justify-between text-xs text-stone-700 hover:text-stone-950 cursor-pointer py-0.5">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.id)}
                            onChange={() => toggleArrayFilter(setSelectedCategories, selectedCategories, cat.id)}
                            className="rounded border-stone-300 text-[#3E0C15] focus:ring-[#3E0C15]"
                          />
                          <span>{cat.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Price Facet */}
              <div className="border-b border-stone-100 pb-4">
                <button 
                  onClick={() => toggleSection("price")}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-widest text-stone-900 font-bold mb-2.5 cursor-pointer"
                >
                  <span>Price</span>
                  {openSections.price ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
                </button>
                {openSections.price && (
                  <div className="space-y-1.5 pt-1 text-xs">
                    {priceBrackets.map((p) => (
                      <label key={p.id} className="flex items-center gap-2.5 text-stone-700 hover:text-stone-950 cursor-pointer py-0.5">
                        <input
                          type="radio"
                          name="price-bracket-desktop"
                          checked={selectedPriceBracket === p.id}
                          onChange={() => setSelectedPriceBracket(p.id)}
                          className="text-[#3E0C15] focus:ring-[#3E0C15]"
                        />
                        <span>{p.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Colour Facet */}
              <div className="border-b border-stone-100 pb-4">
                <button 
                  onClick={() => toggleSection("color")}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-widest text-stone-900 font-bold mb-2.5 cursor-pointer"
                >
                  <span>Colour</span>
                  {openSections.color ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
                </button>
                {openSections.color && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {colorOptions.map((col) => {
                      const isChecked = selectedColors.includes(col.id);
                      return (
                        <button
                          key={col.id}
                          onClick={() => toggleArrayFilter(setSelectedColors, selectedColors, col.id)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-transform cursor-pointer ${
                            isChecked ? "border-[#3E0C15] ring-2 ring-[#3E0C15]/30 scale-110 shadow" : "border-stone-200 hover:scale-105"
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. Fabric Facet */}
              <div className="border-b border-stone-100 pb-4">
                <button 
                  onClick={() => toggleSection("fabric")}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-widest text-stone-900 font-bold mb-2.5 cursor-pointer"
                >
                  <span>Fabric</span>
                  {openSections.fabric ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
                </button>
                {openSections.fabric && (
                  <div className="space-y-1.5 pt-1">
                    {fabricOptions.map((fab) => (
                      <label key={fab.id} className="flex items-center gap-2.5 text-xs text-stone-700 hover:text-stone-950 cursor-pointer py-0.5">
                        <input
                          type="checkbox"
                          checked={selectedFabrics.includes(fab.id)}
                          onChange={() => toggleArrayFilter(setSelectedFabrics, selectedFabrics, fab.id)}
                          className="rounded border-stone-300 text-[#3E0C15] focus:ring-[#3E0C15]"
                        />
                        <span>{fab.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Occasion Facet */}
              <div className="border-b border-stone-100 pb-4">
                <button 
                  onClick={() => toggleSection("occasion")}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-widest text-stone-900 font-bold mb-2.5 cursor-pointer"
                >
                  <span>Occasion</span>
                  {openSections.occasion ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
                </button>
                {openSections.occasion && (
                  <div className="space-y-1.5 pt-1">
                    {occasionOptions.map((occ) => (
                      <label key={occ.id} className="flex items-center gap-2.5 text-xs text-stone-700 hover:text-stone-950 cursor-pointer py-0.5">
                        <input
                          type="checkbox"
                          checked={selectedOccasions.includes(occ.id)}
                          onChange={() => toggleArrayFilter(setSelectedOccasions, selectedOccasions, occ.id)}
                          className="rounded border-stone-300 text-[#3E0C15] focus:ring-[#3E0C15]"
                        />
                        <span>{occ.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. Availability Facet */}
              <div className="border-b border-stone-100 pb-4">
                <button 
                  onClick={() => toggleSection("availability")}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-widest text-stone-900 font-bold mb-2.5 cursor-pointer"
                >
                  <span>Availability</span>
                  {openSections.availability ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
                </button>
                {openSections.availability && (
                  <div className="space-y-1.5 pt-1 text-xs">
                    {availabilityOptions.map((av) => (
                      <label key={av.id} className="flex items-center gap-2.5 text-stone-700 hover:text-stone-950 cursor-pointer py-0.5">
                        <input
                          type="radio"
                          name="availability-desktop"
                          checked={selectedAvailability === av.id}
                          onChange={() => setSelectedAvailability(av.id)}
                          className="text-[#3E0C15] focus:ring-[#3E0C15]"
                        />
                        <span>{av.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* 7. Discount Facet */}
              <div>
                <button 
                  onClick={() => toggleSection("discount")}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-widest text-stone-900 font-bold mb-2.5 cursor-pointer"
                >
                  <span>Discount</span>
                  {openSections.discount ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
                </button>
                {openSections.discount && (
                  <div className="space-y-1.5 pt-1 text-xs">
                    {discountOptions.map((d) => (
                      <label key={d.value} className="flex items-center gap-2.5 text-stone-700 hover:text-stone-950 cursor-pointer py-0.5">
                        <input
                          type="radio"
                          name="discount-desktop"
                          checked={selectedMinDiscount === d.value}
                          onChange={() => setSelectedMinDiscount(d.value)}
                          className="text-[#3E0C15] focus:ring-[#3E0C15]"
                        />
                        <span>{d.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

            </aside>
          )}

          {/* 4. Product Grid: Desktop 4 / row, Mobile 2 / row */}
          <main className={`${isSidebarCollapsed ? "lg:col-span-12" : "lg:col-span-9"}`}>
            {filteredProducts.length > 0 ? (
              <div 
                className={`grid grid-cols-2 gap-3.5 sm:gap-5 md:gap-6 ${
                  isSidebarCollapsed 
                    ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
                    : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center my-6 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="font-serif-luxury text-2xl font-semibold text-stone-900">No Sarees Matched Your Filter</h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-md mx-auto leading-relaxed">
                  We could not find any drapes matching the selected combination of filters. Try resetting to explore our full treasury.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-8 py-3 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs font-semibold transition-all shadow cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Slide-Out Filter Drawer (All 7 Facets) */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#FAF7F2] h-full p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-300 mb-6">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#3E0C15]" />
                  <h3 className="font-serif-luxury text-2xl font-bold text-[#3E0C15]">All Filters</h3>
                </div>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)} 
                  className="p-1.5 rounded-full bg-stone-200 text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. Mobile Category */}
              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-widest font-bold text-stone-900 mb-2.5">Category</h4>
                <div className="space-y-2">
                  {categoryOptions.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2.5 text-xs text-stone-700">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => toggleArrayFilter(setSelectedCategories, selectedCategories, cat.id)}
                        className="rounded text-[#3E0C15]"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. Mobile Price */}
              <div className="mb-6 pt-4 border-t border-stone-200">
                <h4 className="text-xs uppercase tracking-widest font-bold text-stone-900 mb-2.5">Price Range</h4>
                <div className="space-y-2 text-xs">
                  {priceBrackets.map((p) => (
                    <label key={p.id} className="flex items-center gap-2.5 text-stone-700">
                      <input
                        type="radio"
                        name="price-bracket-mobile"
                        checked={selectedPriceBracket === p.id}
                        onChange={() => setSelectedPriceBracket(p.id)}
                        className="text-[#3E0C15]"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Mobile Colour */}
              <div className="mb-6 pt-4 border-t border-stone-200">
                <h4 className="text-xs uppercase tracking-widest font-bold text-stone-900 mb-2.5">Colour</h4>
                <div className="flex flex-wrap gap-2.5">
                  {colorOptions.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => toggleArrayFilter(setSelectedColors, selectedColors, col.id)}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                        selectedColors.includes(col.id) ? "border-stone-950 ring-2 ring-amber-500" : "border-stone-300"
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {selectedColors.includes(col.id) && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Mobile Fabric */}
              <div className="mb-6 pt-4 border-t border-stone-200">
                <h4 className="text-xs uppercase tracking-widest font-bold text-stone-900 mb-2.5">Fabric</h4>
                <div className="space-y-2">
                  {fabricOptions.map((fab) => (
                    <label key={fab.id} className="flex items-center gap-2.5 text-xs text-stone-700">
                      <input
                        type="checkbox"
                        checked={selectedFabrics.includes(fab.id)}
                        onChange={() => toggleArrayFilter(setSelectedFabrics, selectedFabrics, fab.id)}
                        className="rounded text-[#3E0C15]"
                      />
                      <span>{fab.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 5. Mobile Occasion */}
              <div className="mb-6 pt-4 border-t border-stone-200">
                <h4 className="text-xs uppercase tracking-widest font-bold text-stone-900 mb-2.5">Occasion</h4>
                <div className="space-y-2">
                  {occasionOptions.map((occ) => (
                    <label key={occ.id} className="flex items-center gap-2.5 text-xs text-stone-700">
                      <input
                        type="checkbox"
                        checked={selectedOccasions.includes(occ.id)}
                        onChange={() => toggleArrayFilter(setSelectedOccasions, selectedOccasions, occ.id)}
                        className="rounded text-[#3E0C15]"
                      />
                      <span>{occ.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 6. Mobile Availability */}
              <div className="mb-6 pt-4 border-t border-stone-200">
                <h4 className="text-xs uppercase tracking-widest font-bold text-stone-900 mb-2.5">Availability</h4>
                <div className="space-y-2 text-xs">
                  {availabilityOptions.map((av) => (
                    <label key={av.id} className="flex items-center gap-2.5 text-stone-700">
                      <input
                        type="radio"
                        name="availability-mobile"
                        checked={selectedAvailability === av.id}
                        onChange={() => setSelectedAvailability(av.id)}
                        className="text-[#3E0C15]"
                      />
                      <span>{av.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 7. Mobile Discount */}
              <div className="mb-6 pt-4 border-t border-stone-200">
                <h4 className="text-xs uppercase tracking-widest font-bold text-stone-900 mb-2.5">Discount</h4>
                <div className="space-y-2 text-xs">
                  {discountOptions.map((d) => (
                    <label key={d.value} className="flex items-center gap-2.5 text-stone-700">
                      <input
                        type="radio"
                        name="discount-mobile"
                        checked={selectedMinDiscount === d.value}
                        onChange={() => setSelectedMinDiscount(d.value)}
                        className="text-[#3E0C15]"
                      />
                      <span>{d.label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-stone-300 flex gap-3 sticky bottom-0 bg-[#FAF7F2]">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 text-xs font-semibold rounded-full border border-stone-400 text-stone-800 active:scale-95"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 text-xs font-semibold rounded-full bg-[#3E0C15] text-[#F7EFCF] active:scale-95 shadow"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
