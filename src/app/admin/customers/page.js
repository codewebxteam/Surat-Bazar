"use client";

import { useState, useEffect } from "react";
import { Users, Search, Mail, Phone, MapPin, ShoppingBag, Star } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const custMap = new Map();

        // 1. Fetch Registered Users
        const usersSnapshot = await getDocs(collection(db, "users"));
        usersSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.role === "admin") return; // Skip admins

          const identifier = data.email || data.phone || doc.id;
          custMap.set(identifier, {
            id: doc.id,
            name: data.name || "Unknown",
            email: data.email || "N/A",
            phone: data.phone || "N/A",
            city: "N/A", // We don't have city on registration right now
            totalOrders: 0,
            totalSpent: 0,
            joined: data.createdAt ? new Date(data.createdAt).toLocaleDateString("en-IN", { month: 'short', year: 'numeric' }) : "Recent",
            tier: "Registered"
          });
        });

        // 2. Fetch Orders to Aggregate Spending and Orders Count
        const q = query(collection(db, "orders"), orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          // We prioritize matching by userId first, then email, then phone
          // But our checkout primarily saves phone and sometimes userId
          const identifierToMatch = data.userId || data.phone;
          
          if (!identifierToMatch) return;

          // Find if we already have this user
          let existingCustKey = null;
          if (custMap.has(identifierToMatch)) {
            existingCustKey = identifierToMatch;
          } else {
            // Check if phone matches any registered user (since sometimes they order logged out)
            for (let [key, val] of custMap.entries()) {
              if (val.phone === data.phone || val.id === data.userId) {
                existingCustKey = key;
                break;
              }
            }
          }

          const addressParts = (data.address || "").split(",");
          const city = addressParts.length > 1 ? addressParts[addressParts.length - 2].trim() : "Unknown";

          if (!existingCustKey) {
            // Guest Checkout Customer (Not Registered)
            custMap.set(identifierToMatch, {
              id: identifierToMatch,
              name: data.customer || "Unknown",
              email: "N/A",
              phone: data.phone || "N/A",
              city: city,
              totalOrders: 1,
              totalSpent: data.totalAmount || 0,
              joined: data.date ? data.date.split(",")[0] : "Recent",
              tier: "Guest Patron"
            });
          } else {
            // Update Existing Registered or Guest Customer
            const cust = custMap.get(existingCustKey);
            cust.totalOrders += 1;
            cust.totalSpent += (data.totalAmount || 0);
            if (cust.city === "N/A") cust.city = city; // Update city from order if it was N/A
            custMap.set(existingCustKey, cust);
          }
        });

        // Compute Tiers
        const customersArray = Array.from(custMap.values()).map(c => {
          if (c.totalSpent > 100000) c.tier = "VIP Bride Club";
          else if (c.totalSpent > 50000) c.tier = "Silk Connoisseur";
          else if (c.totalSpent > 0) c.tier = "Patron";
          return c;
        });

        // Sort by total spent descending
        customersArray.sort((a, b) => b.totalSpent - a.totalSpent);
        setCustomers(customersArray);

      } catch (error) {
        console.warn("Notice: Fetching customers from Firestore:", error?.message || error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);



  const filtered = customers.filter((c) => {
    const q = (search || "").toLowerCase().trim();
    if (!q) return true;
    const name = (c.name || "").toLowerCase();
    const email = (c.email || "").toLowerCase();
    const city = (c.city || "").toLowerCase();
    const phone = String(c.phone || "");
    return name.includes(q) || email.includes(q) || city.includes(q) || phone.includes(q);
  });

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
            {loading ? "..." : customers.length.toLocaleString()} Total Patrons
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
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-stone-500">Loading patrons...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-stone-500">No patrons found matching your search.</td>
                </tr>
              ) : (
                filtered.map((c) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
