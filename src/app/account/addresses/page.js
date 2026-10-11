"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Plus, Trash2, Edit2, CheckCircle2, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AddressesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    type: "Home",
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user, authLoading, router]);

  const fetchAddresses = async () => {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setAddresses(userData.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const syncAddressesToFirestore = async (newAddresses) => {
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, { addresses: newAddresses });
      setAddresses(newAddresses);
    } catch (error) {
      console.error("Error updating addresses:", error);
      alert("Failed to save address. Please try again.");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const newAddr = {
      id: Date.now().toString(),
      type: formData.type || "Home",
      name: formData.name,
      mobile: formData.mobile,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      isDefault: addresses.length === 0,
    };
    
    const updatedAddresses = [...addresses, newAddr];
    await syncAddressesToFirestore(updatedAddresses);
    
    setShowAddForm(false);
    setFormData({ name: "", mobile: "", address: "", city: "", state: "", pincode: "", type: "Home" });
  };

  const handleDelete = async (id) => {
    const updatedAddresses = addresses.filter((a) => a.id !== id);
    // If the deleted one was default and there are others left, make the first one default
    if (addresses.find(a => a.id === id)?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    await syncAddressesToFirestore(updatedAddresses);
  };

  const handleSetDefault = async (id) => {
    const updatedAddresses = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    await syncAddressesToFirestore(updatedAddresses);
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
          <p className="text-stone-500 font-medium">Loading addresses...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-8 sm:p-12 text-center shadow-xl border border-amber-900/10">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-amber-800" />
            </div>
            <h2 className="font-serif-luxury text-3xl font-bold text-[#3E0C15] mb-3">Login Required</h2>
            <p className="text-stone-500 mb-8 text-sm">
              Please log in to your account to view and manage your saved delivery addresses.
            </p>
            <div className="space-y-4">
              <Link 
                href="/login" 
                className="flex items-center justify-center w-full bg-[#3E0C15] text-[#F7EFCF] py-3.5 rounded-xl font-bold hover:bg-[#571520] transition-colors"
              >
                Log In to Your Account
              </Link>
              <Link 
                href="/register" 
                className="flex items-center justify-center w-full bg-white text-[#3E0C15] border-2 border-[#3E0C15] py-3.5 rounded-xl font-bold hover:bg-amber-50 transition-colors"
              >
                Create New Account
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="w-full bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Breadcrumb Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
            <Link href="/account" className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#3E0C15]">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Account Dashboard</span>
            </Link>
            <span className="text-xs text-[#9E7D2E] font-bold uppercase tracking-wider">Saved Addresses</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#2D0A10]">
                Delivery Addresses
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Manage your saved delivery destinations for seamless one-touch checkout.
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs font-bold transition-all shadow cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? "Cancel" : "Add New Address"}</span>
            </button>
          </div>

          {/* Add Address Form Modal / Inline Box */}
          {showAddForm && (
            <form onSubmit={handleAddAddress} className="bg-white rounded-3xl border border-amber-900/15 p-6 sm:p-8 shadow-md mb-8 space-y-4 animate-in fade-in">
              <h3 className="font-serif-luxury text-xl font-bold text-[#3E0C15]">Enter New Delivery Address</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Full Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sanskriti Sharma"
                    className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="9876543210"
                    className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Street Address, Flat/Villa Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. B-402, Heritage Imperial Towers, Sector 54"
                    className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Gurgaon"
                    className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Haryana"
                    className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Pincode (6 digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="122002"
                    className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Address Label</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15]"
                  >
                    <option value="Home">Home</option>
                    <option value="Bridal Venue">Bridal Venue / Hotel</option>
                    <option value="Office">Office / Studio</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2.5 rounded-full border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#3E0C15] text-[#F7EFCF] text-xs font-bold hover:bg-[#571520] transition-colors shadow"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {addresses.length === 0 ? (
              <div className="sm:col-span-2 p-12 text-center bg-white rounded-3xl border border-stone-200">
                <MapPin className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <h3 className="font-serif-luxury text-xl font-bold text-stone-800 mb-1">No Saved Addresses</h3>
                <p className="text-xs text-stone-500">You haven't saved any delivery addresses yet.</p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 px-6 py-2.5 bg-[#3E0C15] text-[#F7EFCF] text-xs font-bold rounded-full"
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              addresses.map((addr) => (
                <div key={addr.id} className="bg-white rounded-3xl border border-amber-900/10 p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <span className="font-bold text-xs uppercase tracking-wider text-[#3E0C15]">{addr.type}</span>
                      {addr.isDefault && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Default Address
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-stone-700 leading-relaxed">
                      <strong className="font-semibold text-sm text-stone-900 block">{addr.name}</strong>
                      <p>{addr.address}</p>
                      <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-stone-500 pt-1">Mobile: {addr.mobile}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    {!addr.isDefault ? (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-amber-800 font-semibold hover:underline cursor-pointer"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Primary
                      </span>
                    )}

                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                      title="Delete Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
