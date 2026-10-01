"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  LogOut, 
  ShieldCheck, 
  Phone, 
  ChevronRight,
  Sparkles,
  Truck,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "orders" | "wishlist" | "addresses" | "track" | "returns"
  const { wishlist } = useCartWishlist();

  const [trackQuery, setTrackQuery] = useState("SHR-98421");
  const [trackResult, setTrackResult] = useState(null);

  const mockOrders = [
    {
      id: "SHR-98421",
      date: "28 Sep 2026",
      status: "In Transit (Express Air)",
      estimatedDelivery: "04 Oct 2026",
      courier: "BlueDart Apex Aviation • AWB #849201948",
      total: 38500,
      paymentMethod: "UPI (Google Pay)",
      shippingAddress: "B-402, Heritage Imperial Towers, Golf Course Road, Gurgaon, Haryana - 122002",
      items: [
        {
          name: "Rani Gulabi Katan Banarasi Kadwa Silk Saree",
          image: "/banners/hero-2.png",
          blouse: "Custom Bridal Stitch",
          qty: 1,
          price: 38500,
        }
      ]
    },
    {
      id: "SHR-91204",
      date: "14 Aug 2026",
      status: "Delivered",
      estimatedDelivery: "18 Aug 2026",
      courier: "Delhivery Air Express • Delivered",
      total: 24999,
      paymentMethod: "Credit Card (HDFC Visa)",
      shippingAddress: "B-402, Heritage Imperial Towers, Golf Course Road, Gurgaon, Haryana - 122002",
      items: [
        {
          name: "Emerald Royale Scalloped Silk Georgette Saree",
          image: "/banners/hero-1.png",
          blouse: "Unstitched Piece",
          qty: 1,
          price: 24999,
        }
      ]
    }
  ];

  const mockAddresses = [
    {
      id: 1,
      type: "Home (Primary)",
      name: "Sanskriti Sharma",
      mobile: "+91 98765 43210",
      address: "B-402, Heritage Imperial Towers, Sector 54, Golf Course Road",
      city: "Gurgaon",
      state: "Haryana",
      pincode: "122002",
      isDefault: true,
    },
    {
      id: 2,
      type: "Family Home / Bridal Venue",
      name: "Sanskriti Sharma (C/O Singhania Estate)",
      mobile: "+91 98111 22334",
      address: "Villa 14, Royal Palm Boulevard, Mehrauli",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110030",
      isDefault: false,
    }
  ];

  const handleTrackSearch = (e) => {
    e.preventDefault();
    const found = mockOrders.find((o) => o.id.toLowerCase() === trackQuery.trim().toLowerCase());
    setTrackResult(found || "not-found");
  };

  return (
    <>
      <Navbar />

      <main className="w-full bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* User Profile Welcome Header Banner */}
          <div className="bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#3E0C15] to-amber-700 text-[#F7EFCF] flex items-center justify-center font-serif-luxury text-2xl font-bold shadow-md">
                S
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="font-serif-luxury text-2xl font-semibold text-stone-900">Sanskriti Sharma</h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-100 text-[#3E0C15] px-2.5 py-0.5 rounded-full border border-amber-300">
                    Royal Member
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">sanskriti.sharma@example.com • +91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/account/login"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-stone-300 hover:border-rose-600 text-xs font-semibold text-stone-700 hover:text-rose-600 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </Link>
            </div>
          </div>

          {/* Account Navigation & Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Tabs (3 cols) with Profile, Orders, Wishlist, Addresses, Track Order, Returns, Logout */}
            <div className="lg:col-span-3 space-y-1.5 bg-white p-3 rounded-2xl border border-amber-900/10 shadow-sm sticky top-28">
              {[
                { id: "profile", label: "My Profile", icon: User },
                { id: "orders", label: "My Orders", icon: Package },
                { id: "wishlist", label: `Saved Sarees (${wishlist.length})`, icon: Heart },
                { id: "addresses", label: "Saved Addresses", icon: MapPin },
                { id: "track", label: "Track Order", icon: Truck },
                { id: "returns", label: "Returns & Exchanges", icon: RotateCcw },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-[#3E0C15] text-[#F7EFCF] shadow-sm font-bold"
                        : "text-stone-700 hover:bg-stone-50 hover:text-stone-950"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                );
              })}

              <div className="pt-2 border-t border-stone-100">
                <Link
                  href="/account/login"
                  className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Link>
              </div>
            </div>

            {/* Right Tab Content (9 cols) */}
            <div className="lg:col-span-9 bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-sm">
              
              {/* TAB 1: PROFILE */}
              {activeTab === "profile" && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                    <h2 className="font-serif-luxury text-2xl font-bold text-[#3E0C15]">Profile & Royal Preferences</h2>
                    <span className="text-xs text-amber-800 font-semibold">Member ID: #SHR-VIP-9012</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Full Name</span>
                      <span className="font-bold text-stone-900 mt-1 block">Sanskriti Sharma</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Email Address</span>
                      <span className="font-bold text-stone-900 mt-1 block">sanskriti.sharma@example.com</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Mobile Number</span>
                      <span className="font-bold text-stone-900 mt-1 block">+91 98765 43210</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Privilege Tier</span>
                      <span className="font-bold text-amber-800 mt-1 block">Saree Club Connoisseur Tier (2,000 Pts)</span>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50/70 border border-amber-300/60 rounded-2xl">
                    <h4 className="text-xs uppercase font-bold text-[#3E0C15] tracking-wider mb-1">Bridal Measurements Profile</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Blouse Bust: 36&quot; • Waist: 30&quot; • Shoulder: 14.5&quot; • Armhole: 16&quot; • Preferred Drape Style: Classic Seedha Pallu & Royal Nivi.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: ORDERS */}
              {activeTab === "orders" && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                    <h2 className="font-serif-luxury text-2xl font-bold text-[#3E0C15]">Order History</h2>
                    <Link href="/account/orders" className="text-xs text-amber-800 font-semibold hover:underline flex items-center gap-1">
                      <span>View Orders Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200 text-xs">
                          <div>
                            <span className="text-stone-400">Order ID: </span>
                            <span className="font-mono font-bold text-[#3E0C15]">{order.id}</span>
                            <span className="text-stone-400 ml-3">Placed on: </span>
                            <span className="font-semibold text-stone-800">{order.date}</span>
                          </div>
                          <span className="px-3 py-1 bg-amber-100 text-[#3E0C15] font-bold rounded-full text-[11px]">
                            {order.status}
                          </span>
                        </div>

                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif-luxury text-sm font-semibold text-stone-900 truncate">{item.name}</h4>
                              <p className="text-xs text-stone-500 mt-0.5">{item.blouse} • Qty: {item.qty}</p>
                              <p className="text-xs font-bold text-[#3E0C15] mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                            </div>
                            <Link
                              href={`/account/orders/${order.id}`}
                              className="px-4 py-2 rounded-full border border-stone-300 hover:border-stone-800 text-xs font-semibold text-stone-800 transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: WISHLIST */}
              {activeTab === "wishlist" && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                    <h2 className="font-serif-luxury text-2xl font-bold text-[#3E0C15]">My Saved Sarees ({wishlist.length})</h2>
                    <Link href="/wishlist" className="text-xs text-amber-800 font-semibold hover:underline">
                      Full Wishlist Page →
                    </Link>
                  </div>

                  {wishlist.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {wishlist.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                      <p className="text-xs text-stone-500">No saved sarees currently in your personal vault.</p>
                      <Link href="/collections/sarees" className="mt-4 inline-block px-6 py-2.5 bg-[#3E0C15] text-[#F7EFCF] text-xs font-bold rounded-full">
                        Explore Sarees
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ADDRESSES */}
              {activeTab === "addresses" && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                    <h2 className="font-serif-luxury text-2xl font-bold text-[#3E0C15]">Saved Shipping Addresses</h2>
                    <Link href="/account/addresses" className="text-xs text-amber-800 font-semibold hover:underline">
                      Manage Addresses →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {mockAddresses.map((addr) => (
                      <div key={addr.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 relative space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900">{addr.type}</span>
                          {addr.isDefault && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Default</span>
                          )}
                        </div>
                        <p className="font-semibold text-stone-800">{addr.name}</p>
                        <p className="text-stone-600 leading-relaxed">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-stone-500">Mobile: {addr.mobile}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: TRACK ORDER */}
              {activeTab === "track" && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="pb-4 border-b border-stone-200">
                    <h2 className="font-serif-luxury text-2xl font-bold text-[#3E0C15]">Track Live Drape Dispatch</h2>
                    <p className="text-xs text-stone-500 mt-1">Enter your order ID (e.g. SHR-98421) or tracking AWB number.</p>
                  </div>

                  <form onSubmit={handleTrackSearch} className="flex gap-2 max-w-md">
                    <input
                      type="text"
                      value={trackQuery}
                      onChange={(e) => setTrackQuery(e.target.value)}
                      placeholder="e.g. SHR-98421"
                      className="flex-1 bg-[#FAF7F2] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 font-mono uppercase focus:outline-none focus:border-[#3E0C15]"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#3E0C15] text-[#F7EFCF] text-xs font-bold rounded-xl hover:bg-[#571520] transition-colors"
                    >
                      Track
                    </button>
                  </form>

                  {/* Tracking Timeline */}
                  <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-3 text-xs">
                      <div>
                        <span className="text-stone-400">Tracking: </span>
                        <strong className="text-stone-900 font-mono">SHR-98421</strong>
                      </div>
                      <span className="text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px]">
                        ● On Schedule (Delivery: 04 Oct 2026)
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center gap-3 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Handcrafted on Varanasi Pit-loom & Silk Mark Tagged (28 Sep)</span>
                      </div>
                      <div className="flex items-center gap-3 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Quality Verified & Sealed in Velvet Box (29 Sep)</span>
                      </div>
                      <div className="flex items-center gap-3 text-amber-800 font-bold">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>In Transit with BlueDart Aviation Express (30 Sep)</span>
                      </div>
                      <div className="flex items-center gap-3 text-stone-400">
                        <div className="w-4 h-4 rounded-full border-2 border-stone-300 shrink-0" />
                        <span>Out for Doorstep Delivery (Expected 04 Oct)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: RETURNS */}
              {activeTab === "returns" && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="pb-4 border-b border-stone-200">
                    <h2 className="font-serif-luxury text-2xl font-bold text-[#3E0C15]">Returns & Exchange Concierge</h2>
                    <p className="text-xs text-stone-500 mt-1">Initiate 7-day hassle-free doorstep return or size/color exchange.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs text-stone-700">
                    <h4 className="font-bold text-[#3E0C15]">7-Day Hassle-Free Policy</h4>
                    <p>All unworn sarees with Silk Mark certification tags intact are eligible for instant 100% refund or exchange.</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Eligible Past Orders</h4>
                    <div className="p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">Emerald Royale Scalloped Silk Georgette Saree</span>
                        <span className="text-[11px] text-stone-500">Delivered on 14 Aug 2026 • Order #SHR-91204</span>
                      </div>
                      <button className="px-4 py-2 bg-[#3E0C15] text-[#F7EFCF] text-xs font-semibold rounded-full hover:bg-[#571520] transition-colors">
                        Request Exchange
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
