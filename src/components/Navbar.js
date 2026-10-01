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
  User,
  Sparkles
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
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    } else {
      router.push("/search");
    }
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
            ? "bg-[#FAF7F2]/95 backdrop-blur-md shadow-md border-amber-900/10 py-2.5 sm:py-3" 
            : "bg-[#FAF7F2] border-amber-900/10 py-3 sm:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
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

              {/* Account (Click → /account if logged in, otherwise /account/login) */}
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
          {/* SALE, SAREES, COLLECTIONS, OCCASIONS, FABRICS, NEW ARRIVALS, BESTSELLERS */}
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
          {/* Top row: Menu icon left, logo centre, Wishlist and Bag right */}
          <div className="flex lg:hidden flex-col gap-2.5">
            <div className="flex items-center justify-between">
              
              {/* Left: Menu Icon */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-stone-800 hover:text-[#3E0C15] transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Centre: Mobile Brand Logo & Emblem */}
              <div className="text-center">
                <VastraLogo size="compact" showTagline={true} />
              </div>

              {/* Right: Wishlist and Bag */}
              <div className="flex items-center gap-3">
                {/* Wishlist */}
                <Link 
                  href="/wishlist" 
                  aria-label="Wishlist" 
                  className="relative p-1 text-stone-800"
                >
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#571520] text-[#F3E5C8] text-[8px] font-bold flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Bag */}
                <Link 
                  href="/cart" 
                  aria-label="Shopping Bag" 
                  className="relative p-1 text-stone-800"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-amber-600 text-stone-950 text-[8px] font-bold flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

            </div>

            {/* Below top row: Compact search */}
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pure silk, banarasi, bridal..."
                  className="w-full bg-[#F2ECE1] border border-amber-900/15 text-xs text-stone-800 placeholder:text-stone-400 rounded-full pl-9 pr-4 py-2 focus:outline-none focus:border-[#3E0C15]"
                />
                <button type="submit" aria-label="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Mobile Slideout Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-amber-900/10 bg-[#FAF7F2] px-6 py-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {desktopNavItems.map((item) => (
              <div key={item.name} className="border-b border-stone-200 pb-2.5">
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between text-sm font-bold uppercase tracking-wider py-1 ${
                    item.isSale ? "text-rose-700" : "text-stone-900"
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      item.isSale ? "bg-rose-700 text-white" : "bg-[#571520] text-[#F3E5C8]"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
                {item.sublinks && (
                  <div className="pl-3 mt-1.5 space-y-2 border-l-2 border-amber-700/30">
                    {item.sublinks.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-xs text-stone-600 hover:text-[#571520] py-0.5 font-medium"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-3 space-y-2 text-xs">
              <Link 
                href={accountUrl} 
                onClick={() => setMobileMenuOpen(false)} 
                className="block py-1.5 font-bold text-stone-900"
              >
                {isLoggedIn ? "My Account" : "Sign In / Register"}
              </Link>
              <Link 
                href="/pages/about-us" 
                onClick={() => setMobileMenuOpen(false)} 
                className="block py-1 text-stone-600"
              >
                About Suratbazar
              </Link>
              <Link 
                href="/pages/contact-us" 
                onClick={() => setMobileMenuOpen(false)} 
                className="block py-1 text-stone-600"
              >
                Contact Concierge
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
