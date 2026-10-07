"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Search, Heart, User } from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { wishlist, isLoggedIn } = useCartWishlist();

  // Hide the global mobile bottom nav on PDP (/product/*), checkout (/checkout), and admin panel (/admin)
  // because these pages render their own specialized full-width navigation/action bars
  if (pathname.startsWith("/product/") || pathname.startsWith("/checkout") || pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home, exact: true },
    { label: "Collections", href: "/collections/sarees", icon: Layers },
    { label: "Search", href: "/search", icon: Search },
    { label: "Wishlist", href: "/wishlist", icon: Heart, badge: wishlist.length },
    { label: "Account", href: isLoggedIn ? "/account" : "/account/login", icon: User },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-amber-900/15 py-1.5 px-2 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <nav className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-95 ${
                isActive 
                  ? "text-[#3E0C15] font-bold" 
                  : "text-stone-500 hover:text-stone-900 font-medium"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px] scale-110 text-[#3E0C15]" : "stroke-[1.75px]"}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#571520] text-[#F3E5C8] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E0C15] -bottom-0.5 absolute" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
