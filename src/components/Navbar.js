"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  User,
  Sparkles,
  Phone,
  ShieldCheck,
  Flame,
  ArrowRight
} from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { HEADER_NAV_ITEMS } from "@/data/navigation";
import { SITE_CONFIG } from "@/data/siteConfig";
import AnnouncementBar from "@/components/AnnouncementBar";
import VastraLogo from "@/components/VastraLogo";

export default function Navbar({ navItems = HEADER_NAV_ITEMS, config = SITE_CONFIG }) {
  const router = useRouter();
  const { cartCount, wishlist, isLoggedIn } = useCartWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    } else {
      router.push("/search");
    }
  };

  const toggleMobileSub = (name) => {
    setExpandedMobileCategory((prev) => (prev === name ? null : name));
  };

  const accountUrl = isLoggedIn ? "/account" : "/account/login";
  const desktopNavItems = navItems;

  return (
    <header className="w-full sticky top-0 z-50 transition-all duration-300">
      {/* Dynamic Multi-Message Promotional Announcement Bar */}
      <AnnouncementBar />

      {/* Main Header Container */}
      <nav 
        className={`transition-all duration-300 border-b ${
          isScrolled 
            ? "bg-[#FAF7F2]/95 backdrop-blur-md shadow-md border-amber-900/10 py-2 sm:py-2.5" 
            : "bg-[#FAF7F2] border-amber-900/10 py-2.5 sm:py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-12">
          
          {/* ================= DESKTOP HEADER ROW (lg+) ================= */}
          <div className="hidden lg:flex items-center justify-between gap-8">
            
            {/* 1. Desktop Left: Brand Logo & Emblem */}
            <div className="shrink-0">
              <VastraLogo size="default" />
            </div>

            {/* 2. Desktop Main Area: Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pure silk, banarasi, bridal, organza, colours..."
                  className="w-full bg-[#F2ECE1] border border-amber-900/15 text-xs text-stone-800 placeholder:text-stone-400 rounded-full pl-11 pr-4 py-2.5 focus:outline-none focus:border-[#3E0C15] focus:bg-white transition-all shadow-xs"
                />
                <button 
                  type="submit" 
                  aria-label="Search" 
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* 3. Desktop Right: Wishlist, Bag, Account */}
            <div className="flex items-center gap-6 shrink-0 text-stone-800">
              
              {/* Wishlist */}
              <Link 
                href="/wishlist"
                aria-label="Wishlist" 
                className="relative flex items-center gap-1.5 p-1 text-stone-800 hover:text-[#571520] transition-colors group"
              >
                <div className="relative">
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#571520] text-[#F3E5C8] text-[9px] font-bold flex items-center justify-center shadow-xs">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider hidden xl:inline">
                  Wishlist
                </span>
              </Link>

              {/* Bag / Cart */}
              <Link 
                href="/cart"
                aria-label="Shopping Bag" 
                className="relative flex items-center gap-1.5 p-1 text-stone-800 hover:text-[#571520] transition-colors group"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-amber-600 text-stone-950 text-[9px] font-bold flex items-center justify-center shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider hidden xl:inline">
                  Bag
                </span>
              </Link>

              {/* Account */}
              <Link 
                href={accountUrl}
                aria-label="My Account" 
                className="flex items-center gap-1.5 p-1 text-stone-800 hover:text-[#571520] transition-colors group"
              >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold uppercase tracking-wider hidden xl:inline">
                  {isLoggedIn ? "Account" : "Sign In"}
                </span>
              </Link>

            </div>

          </div>

          {/* ================= DESKTOP NAVIGATION BAR ROW (lg+) ================= */}
          <div className="hidden lg:flex items-center justify-center gap-8 mt-3 pt-3 border-t border-amber-900/10">
            {desktopNavItems.map((item) => (
              <div 
                key={item.name} 
                className="relative group py-1"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
                    item.isSale 
                      ? "text-rose-700 hover:text-rose-900 font-extrabold" 
                      : "text-stone-800 hover:text-[#3E0C15]"
                  }`}
                >
                  <span>{item.name}</span>
                  {item.sublinks && (
                    <ChevronDown className="w-3 h-3 text-stone-400 group-hover:rotate-180 transition-transform" />
                  )}
                  {item.badge && (
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-sm font-bold tracking-normal ${
                      item.isSale ? "bg-rose-700 text-white" : "bg-[#571520] text-[#F3E5C8]"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.sublinks && activeDropdown === item.name && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-2xl border border-amber-900/10 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-1">
                    {item.sublinks.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="block px-3.5 py-2 text-xs text-stone-700 hover:text-[#3E0C15] hover:bg-[#FAF7F2] rounded-xl transition-colors font-medium"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ================= MOBILE HEADER (lg:hidden) ================= */}
          <div className="flex lg:hidden flex-col gap-2">
            
            {/* Top row: Hamburger Menu Left, Centered Logo, Wishlist & Bag Right */}
            <div className="flex items-center justify-between gap-2">
              
              {/* Left: Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 -ml-1 text-stone-800 hover:text-[#3E0C15] active:scale-95 transition-all rounded-lg"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Centre: Responsive Brand Logo & Emblem */}
              <div className="flex-1 flex justify-center overflow-hidden">
                <VastraLogo size="compact" showTagline={true} />
              </div>

              {/* Right: Wishlist and Bag */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Wishlist */}
                <Link 
                  href="/wishlist" 
                  aria-label="Wishlist" 
                  className="relative p-1.5 text-stone-800 active:scale-95 transition-transform"
                >
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute 0 right-0 w-4 h-4 rounded-full bg-[#571520] text-[#F3E5C8] text-[8px] font-bold flex items-center justify-center shadow-xs">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Bag */}
                <Link 
                  href="/cart" 
                  aria-label="Shopping Bag" 
                  className="relative p-1.5 text-stone-800 active:scale-95 transition-transform"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute 0 right-0 w-4 h-4 rounded-full bg-amber-600 text-stone-950 text-[8px] font-bold flex items-center justify-center shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

            </div>

            {/* Below top row: Mobile Search Input */}
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pure silk, banarasi, bridal..."
                  className="w-full bg-[#F2ECE1] border border-amber-900/15 text-xs text-stone-800 placeholder:text-stone-400 rounded-full pl-9 pr-8 py-2 focus:outline-none focus:border-[#3E0C15] focus:bg-white transition-all shadow-xs"
                />
                <button 
                  type="submit" 
                  aria-label="Search" 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </form>

          </div>

        </div>
      </nav>

      {/* ================= LUXURY MOBILE SLIDE-OVER DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-[85%] max-w-sm bg-[#FAF7F2] h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
            
            {/* Drawer Top Header */}
            <div>
              <div className="p-4 border-b border-amber-900/10 flex items-center justify-between bg-[#F4EFE6]">
                <VastraLogo size="compact" showTagline={false} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-200 text-stone-700 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Special Promotion Highlight Strip */}
              <div className="bg-gradient-to-r from-[#3E0C15] to-[#571520] text-[#F3E5C8] p-3 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Royal Festive Vault: Flat 30% Off
                </span>
                <Link 
                  href="/collections/sale" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[10px] font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full uppercase"
                >
                  Shop
                </Link>
              </div>

              {/* Navigation Links Accordion */}
              <div className="p-4 space-y-1 divide-y divide-stone-200/70">
                {desktopNavItems.map((item) => {
                  const hasSub = item.sublinks && item.sublinks.length > 0;
                  const isExpanded = expandedMobileCategory === item.name;

                  return (
                    <div key={item.name} className="pt-2.5 pb-2">
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`text-sm font-bold uppercase tracking-wider py-1 flex items-center gap-2 ${
                            item.isSale ? "text-rose-700" : "text-stone-900"
                          }`}
                        >
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${
                              item.isSale ? "bg-rose-700 text-white" : "bg-[#571520] text-[#F3E5C8]"
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>

                        {hasSub && (
                          <button
                            onClick={() => toggleMobileSub(item.name)}
                            className="p-1.5 text-stone-500 hover:text-stone-900"
                            aria-label={`Toggle ${item.name} subcategories`}
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                        )}
                      </div>

                      {/* Sublinks Accordion Content */}
                      {hasSub && isExpanded && (
                        <div className="pl-3 mt-2 space-y-2 border-l-2 border-[#9E7D2E] animate-in fade-in slide-in-from-top-1">
                          {item.sublinks.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block text-xs text-stone-600 hover:text-[#571520] py-1 font-medium"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick Customer Links */}
              <div className="p-4 bg-stone-100/70 border-t border-amber-900/10 space-y-2.5 text-xs text-stone-700">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#9E7D2E] block">
                  Customer Privileges
                </span>
                <Link 
                  href={accountUrl} 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center justify-between py-1 font-bold text-stone-900 hover:text-[#3E0C15]"
                >
                  <span>{isLoggedIn ? "My Royal Account" : "Sign In / Register"}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </Link>
                <Link 
                  href="/pages/about-us" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center justify-between py-1 text-stone-600 hover:text-stone-900"
                >
                  <span>About Suratbazar Heritage</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </Link>
                <Link 
                  href="/pages/contact-us" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center justify-between py-1 text-stone-600 hover:text-stone-900"
                >
                  <span>Contact Master Concierge</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </Link>
              </div>
            </div>

            {/* Drawer Bottom Concierge Footer */}
            <div className="p-4 bg-[#24070D] text-white text-xs border-t border-amber-900/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Silk Mark Certified Sarees</span>
              </div>
              <p className="text-[10px] text-stone-300">
                Doorstep Delivery Across India & Worldwide.
              </p>
            </div>

          </div>

        </div>
      )}

    </header>
  );
}
