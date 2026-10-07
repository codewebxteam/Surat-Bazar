"use client";

import { useState } from "react";
import { Users, Search, Mail, Phone, MapPin, ShoppingBag, Star } from "lucide-react";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const customers = [
    {
      id: "CUST-101",
      name: "Meera Singhania",
      email: "meera.singhania@gmail.com",
      phone: "+91 98201 45892",
      city: "Mumbai, Maharashtra",
      totalOrders: 6,
      totalSpent: 184500,
      tier: "VIP Bride Club",
      joined: "Jan 2026"
    },
    {
      id: "CUST-102",
      name: "Ananya Deshmukh",
      email: "ananya.deshmukh@yahoo.com",
      phone: "+91 97112 33419",
      city: "Hyderabad, Telangana",
      totalOrders: 3,
      totalSpent: 74999,
      tier: "Silk Connoisseur",
      joined: "Mar 2026"
    },
    {
      id: "CUST-103",
      name: "Kavita Reddy",
      email: "kavita.reddy@outlook.com",
      phone: "+91 94401 88321",
      city: "Bangalore, Karnataka",
      totalOrders: 4,
      totalSpent: 98000,
      tier: "Silk Connoisseur",
      joined: "Feb 2026"
    },
    {
      id: "CUST-104",
      name: "Rituja Patil",
      email: "patil.rituja@gmail.com",
      phone: "+91 98810 54321",
      city: "Pune, Maharashtra",
      totalOrders: 1,
      totalSpent: 18750,
      tier: "Patron",
      joined: "Sep 2026"
    },
    {
      id: "CUST-105",
      name: "Sunita Aggarwal",
      email: "sunita.aggarwal@hotmail.com",
      phone: "+91 99280 12345",
      city: "Jaipur, Rajasthan",
      totalOrders: 5,
      totalSpent: 142000,
      tier: "VIP Bride Club",
      joined: "Nov 2025"
    }
  ];

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-amber-900/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Registered Patrons & Customers</h1>
          <p className="text-xs text-stone-500 mt-1">
            Directory of brides, stylists, and recurring silk patrons
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-amber-100 text-[#571520] font-bold text-xs">
            1,420 Total Patrons
          </span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patron name, email, city..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5832B]/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Patron Name & Tier</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Lifetime Value</th>
                <th className="py-3.5 px-4">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-amber-50/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900">{c.name}</div>
                    <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      c.tier.includes("VIP") 
                        ? "bg-amber-100 text-amber-900 border border-amber-200" 
                        : "bg-stone-100 text-stone-700"
                    }`}>
                      {c.tier}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-stone-700">{c.email}</div>
                    <div className="text-[11px] text-stone-400">{c.phone}</div>
                  </td>

                  <td className="py-3.5 px-4 text-stone-700">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{c.city}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-stone-900">{c.totalOrders}</span> orders
                  </td>

                  <td className="py-3.5 px-4 font-bold text-[#571520]">
                    ₹{c.totalSpent.toLocaleString("en-IN")}
                  </td>

                  <td className="py-3.5 px-4 text-stone-500">
                    {c.joined}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
