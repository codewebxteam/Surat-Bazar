"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingBag, 
  Users, 
  Layers, 
  Sliders, 
  Settings, 
  ExternalLink,
  Sparkles,
  ChevronRight,
  LogOut,
  Boxes
} from "lucide-react";

export default function AdminSidebar({ isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    { name: "All Sarees", href: "/admin/products", icon: Package },
    { name: "Add New Saree", href: "/admin/products/new", icon: PlusCircle, highlight: true },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag, badge: "8 New" },
    { name: "Inventory", href: "/admin/inventory", icon: Boxes, badge: "3 Low" },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Banners & Offers", href: "/admin/banners", icon: Layers },
    { name: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#1C1412] text-[#F3E5C8] flex flex-col transition-transform duration-300 ease-in-out border-r border-[#3E251A]
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#3E251A]/80 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9B111E] to-[#C5832B] flex items-center justify-center text-white shadow-lg font-serif font-bold text-xl ring-2 ring-[#E8C574]/30">
              SB
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold tracking-wide text-[#FAF7F2] flex items-center gap-1.5">
                Suratbazar
                <span className="text-[9px] font-sans font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#C5832B]/20 text-[#E8C574] border border-[#C5832B]/30 tracking-wider">
                  Admin
                </span>
              </h1>
              <p className="text-xs text-stone-400 font-sans">Silk Treasury Management</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
          <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-3 mb-2">
            Main Management
          </div>

          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href) && (item.href !== "/admin" || pathname === "/admin");

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group
                  ${isActive 
                    ? "bg-gradient-to-r from-[#571520] to-[#3A0D15] text-[#FAF7F2] font-semibold shadow-md border border-[#9B111E]/40" 
                    : item.highlight
                    ? "text-[#E8C574] hover:bg-[#2A1C18] hover:text-[#FFF8E7]"
                    : "text-stone-300 hover:bg-[#2A1C18] hover:text-[#FAF7F2]"}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-[#E8C574]" : item.highlight ? "text-[#E8C574]" : "text-stone-400 group-hover:text-stone-200"}`} />
                  <span>{item.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badge.includes("Low") 
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" 
                        : "bg-[#C5832B]/20 text-[#E8C574] border border-[#C5832B]/30"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#E8C574]" />}
                </div>
              </Link>
            );
          })}

          <div className="pt-6">
            <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-3 mb-2">
              Store Preview
            </div>
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-stone-300 hover:bg-[#2A1C18] hover:text-white transition-all border border-dashed border-[#3E251A]"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-[#C5832B]" />
                <span>Visit Live Store</span>
              </div>
              <span className="text-[10px] text-stone-400 bg-stone-800 px-1.5 py-0.5 rounded">Client</span>
            </Link>
          </div>
        </nav>

        {/* Admin User Footer Card */}
        <div className="p-4 border-t border-[#3E251A]/80 bg-[#160E0C]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#3E0C15] border border-[#C5832B]/50 flex items-center justify-center text-sm font-bold text-[#E8C574]">
                SA
              </div>
              <div className="text-left leading-tight">
                <p className="text-xs font-bold text-[#FAF7F2]">Super Admin</p>
                <p className="text-[11px] text-stone-400">admin@suratbazar.com</p>
              </div>
            </div>
            <Link 
              href="/account/login" 
              title="Logout"
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
