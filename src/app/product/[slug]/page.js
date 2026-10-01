"use client";

import { use, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  Scissors, 
  Award, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Share2, 
  HelpCircle,
  Plus,
  Minus,
  ZoomIn,
  Play,
  RotateCcw,
  Tag,
  Clock,
  CheckCircle2,
  Lock,
  MessageSquare,
  ThumbsUp,
  MapPin,
  X
} from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useCartWishlist } from "@/context/CartWishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;

  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return notFound();
  }

  const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();
  const wishlisted = isInWishlist(product.id);

  // Gallery States
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Purchasing & Customization States
  const [quantity, setQuantity] = useState(1);
  const [blouseOption, setBlouseOption] = useState("unstitched");
  const [activeColor, setActiveColor] = useState(product.colorName || "Primary");
  const [addedToast, setAddedToast] = useState(false);

  // Delivery Pincode Checker
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null); // null | "checking" | "success" | "invalid"

  // Bottom Tabs
  const [activeTab, setActiveTab] = useState("description"); // "description" | "details" | "delivery" | "returns" | "reviews"

  // Reviews interactive state
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      author: "Gayatri Devi Singhania",
      location: "Mumbai",
      rating: 5,
      date: "12 September 2026",
      title: "Majestic Craftsmanship for My Daughter's Wedding",
      comment: "The zari work is completely authentic with deep matte gold sheen. The silk georgette drape is light yet regal. Packaged in a lovely velvet heirloom bag.",
      verified: true,
      helpfulCount: 24,
    },
    {
      id: 2,
      author: "Dr. Ananya Mukherjee",
      location: "Kolkata",
      rating: 5,
      date: "28 August 2026",
      title: "Pure Handloom Quality That Exceeded Expectations",
      comment: "Silk Mark certified as promised. The cutwork on the scalloped borders is clean and intricate. Received endless compliments at the royal reception.",
      verified: true,
      helpfulCount: 18,
    },
    {
      id: 3,
      author: "Radhika K. Pillai",
      location: "Bengaluru",
      rating: 5,
      date: "14 August 2026",
      title: "Exquisite Drape & Fast Delivery",
      comment: "Arrived in 2 days in a luxurious gold embossed box. The fabric feels whisper soft and the fall/pico was finished impeccably.",
      verified: true,
      helpfulCount: 11,
    }
  ]);

  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const savingsAmount = product.originalPrice ? product.originalPrice - product.price : 0;

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const blousePrices = {
    unstitched: 0,
    standard: 1500,
    custom: 2500,
  };

  const currentPrice = product.price + blousePrices[blouseOption];

  // Zoom Mouse Movement Handler
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length !== 6 || isNaN(pincode)) {
      setPincodeStatus("invalid");
      return;
    }
    setPincodeStatus("checking");
    setTimeout(() => {
      setPincodeStatus("success");
    }, 400);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;
    
    const newRev = {
      id: Date.now(),
      author: newReviewAuthor.trim(),
      location: "Verified Connoisseur",
      rating: newReviewRating,
      date: "Just now",
      title: "Exceptional Bridal Masterpiece",
      comment: newReviewComment.trim(),
      verified: true,
      helpfulCount: 1,
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewAuthor("");
    setNewReviewComment("");
    setShowReviewForm(false);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, blouseOption);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  // Color variants for demo
  const variantColors = [
    { name: product.colorName || "Primary Color", hex: product.colorHex || "#3E0C15" },
    { name: "Royal Wine", hex: "#4A0E17" },
    { name: "Midnight Navy", hex: "#1A2A6C" },
    { name: "Antique Gold", hex: "#D4AF37" },
  ];

  return (
    <>
      <Navbar />

      <main className="w-full bg-[#FAF7F2] min-h-screen pb-20">
        
        {/* 1. Breadcrumbs Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <Link href="/collections/sarees" className="hover:text-stone-900 transition-colors">Sarees</Link>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <Link href={`/collections/${product.category}`} className="hover:text-stone-900 transition-colors capitalize">
              {product.categoryName}
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="text-[#3E0C15] font-semibold truncate">{product.name}</span>
          </nav>
        </div>

        {/* 2. Main PDP Two-Column Grid (Gallery Left, Product Information Right) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ───────────── LEFT: IMAGE GALLERY (7 COLS) ───────────── */}
            <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 sticky top-28">
              
              {/* Vertical Thumbnail Strip */}
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-24 shrink-0 pb-2 sm:pb-0 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`relative w-16 sm:w-20 aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImage === idx 
                        ? "border-[#3E0C15] ring-2 ring-[#3E0C15]/20 scale-105 shadow-md" 
                        : "border-stone-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}

                {/* Optional Video Thumbnail Trigger */}
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="relative w-16 sm:w-20 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-amber-500/50 bg-[#1C0F0C] flex flex-col items-center justify-center text-amber-300 gap-1 shrink-0 group hover:border-amber-400 transition-all cursor-pointer shadow"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400 ml-0.5" />
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-wider">Video</span>
                </button>
              </div>

              {/* Main Featured Image with Interactive Zoom */}
              <div 
                className="relative flex-1 aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden bg-stone-900 shadow-xl border border-amber-900/10 cursor-crosshair group"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  priority
                  className={`object-cover object-center transition-transform duration-200 ${
                    isZoomed ? "scale-150" : "scale-100"
                  }`}
                  style={
                    isZoomed
                      ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                      : undefined
                  }
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                  {product.isBestseller && (
                    <span className="bg-[#3E0C15] text-[#F3E5C8] text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-lg border border-amber-500/30 backdrop-blur-sm">
                      Bestseller
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="bg-emerald-700 text-white text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-lg">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Wishlist & Share Top-Right Actions */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    aria-label="Share product link"
                    className="w-10 h-10 rounded-full bg-white/85 hover:bg-white text-stone-800 flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-md active:scale-90 cursor-pointer ${
                      wishlisted 
                        ? "bg-rose-50 text-rose-600 border border-rose-200" 
                        : "bg-white/85 text-stone-800 hover:text-rose-600 hover:bg-white"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${wishlisted ? "fill-rose-600 text-rose-600 scale-110" : ""}`} />
                  </button>
                </div>

                {/* Hover Zoom Indicator Tooltip */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hover to Zoom In</span>
                </div>

                {/* Share copied toast */}
                {copiedLink && (
                  <div className="absolute bottom-4 left-4 bg-stone-900 text-white text-xs px-3.5 py-1.5 rounded-full shadow-xl animate-in fade-in">
                    Link copied to clipboard!
                  </div>
                )}
              </div>

            </div>

            {/* ───────────── RIGHT: PRODUCT INFORMATION (5 COLS) ───────────── */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Category, Rating & Title */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#9E7D2E]">
                    {product.categoryName || product.category}
                  </span>
                  
                  {/* Rating Badge */}
                  <a 
                    href="#reviews-section" 
                    onClick={() => setActiveTab("reviews")}
                    className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                    </div>
                    <span className="text-xs font-bold text-stone-900">{product.rating}</span>
                    <span className="text-xs text-stone-500 font-medium">({reviewsList.length} reviews)</span>
                  </a>
                </div>

                <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#2D0A10] leading-snug">
                  {product.name}
                </h1>
                
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  {product.tagline}
                </p>
              </div>

              {/* Price, MRP, Discount & Stock */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F5EFEB] border border-amber-900/15">
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <div className="flex items-baseline flex-wrap gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-[#3E0C15]">
                      ₹{currentPrice.toLocaleString("en-IN")}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm sm:text-base text-stone-400 line-through">
                        ₹{(product.originalPrice + blousePrices[blouseOption]).toLocaleString("en-IN")}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {discountPercent}% OFF (Save ₹{savingsAmount.toLocaleString("en-IN")})
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    ● In Stock ({product.stock} left)
                  </span>
                </div>

                <span className="text-[11px] text-stone-500 block mt-2">
                  Inclusive of all taxes • Handcrafted Pure Silk • Free Express Doorstep Delivery
                </span>
              </div>

              {/* Exclusive Member & Bank Offers Box */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300/60 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#3E0C15] uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-amber-700" />
                  <span>Available Offers & Privileges</span>
                </div>
                
                <ul className="space-y-1.5 text-xs text-stone-700">
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-[#3E0C15] bg-amber-200/80 px-1.5 py-0.5 rounded text-[10px]">ROYAL10</span>
                    <span>Get flat 10% instant off on orders above ₹15,000.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-[#3E0C15] bg-amber-200/80 px-1.5 py-0.5 rounded text-[10px]">SAREECLUB</span>
                    <span>₹2,000 welcome credit for registered Saree Club connoisseurs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">NO COST EMI</span>
                    <span>Zero interest monthly installments starting from ₹2,100/mo.</span>
                  </li>
                </ul>
              </div>

              {/* Color / Variant Swatch Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-stone-900">
                    Colour Palette: <span className="font-normal text-amber-800">{activeColor}</span>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  {variantColors.map((col, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveColor(col.name)}
                      className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer ${
                        activeColor === col.name
                          ? "border-[#3E0C15] bg-white ring-2 ring-[#3E0C15]/20 font-bold shadow-sm"
                          : "border-stone-200 bg-white/60 hover:bg-white text-stone-700"
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full shadow-inner" style={{ backgroundColor: col.hex }} />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Blouse Customization Option */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-stone-900">
                    Blouse Customization Options:
                  </label>
                  <span className="text-[11px] text-amber-800 font-medium">Bespoke Tailoring</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {[
                    { id: "unstitched", label: "Unstitched Fabric", extra: "Included (0.8m)", tag: "Free" },
                    { id: "standard", label: "Standard Tailoring", extra: "+₹1,500", tag: "3-4 Days" },
                    { id: "custom", label: "Bridal Bespoke Stitch", extra: "+₹2,500", tag: "Hand Finished" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setBlouseOption(opt.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        blouseOption === opt.id
                          ? "border-[#3E0C15] bg-white shadow-md ring-2 ring-[#3E0C15]/20"
                          : "border-stone-200 bg-stone-50 hover:bg-white text-stone-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">{opt.label}</span>
                        {blouseOption === opt.id && <Check className="w-3.5 h-3.5 text-[#3E0C15]" />}
                      </div>
                      <div className="text-[11px] text-amber-800 font-semibold mt-1">{opt.extra}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{opt.tag}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity, Add to Bag & Buy Now CTAs */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-stone-300 bg-white rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-stone-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="p-2 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    onClick={handleAddToCart}
                    id="pdp-add-to-bag"
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-sm font-bold flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{addedToast ? "Added to Bag ✓" : "Add to Bag"}</span>
                  </button>
                </div>

                {/* Direct Buy Now Button */}
                <Link
                  href="/checkout"
                  onClick={() => addToCart(product, quantity, blouseOption)}
                  id="pdp-buy-now"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-center cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buy Now • Instant Express Checkout</span>
                </Link>
              </div>

              {/* Pincode Delivery Estimate Checker */}
              <div className="pt-4 border-t border-stone-200">
                <form onSubmit={handleCheckPincode} className="space-y-2">
                  <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                    Check Delivery & Availability:
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => {
                          setPincode(e.target.value);
                          setPincodeStatus(null);
                        }}
                        placeholder="Enter 6-digit Pincode..."
                        className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#3E0C15]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-[#3E0C15] text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
                    >
                      Check
                    </button>
                  </div>

                  {pincodeStatus === "success" && (
                    <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Delivery by <strong>Thursday, 3 Business Days</strong>. Free Express Insured Shipping.</span>
                    </div>
                  )}

                  {pincodeStatus === "invalid" && (
                    <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-2.5 animate-in fade-in">
                      Please enter a valid 6-digit Indian delivery pincode.
                    </div>
                  )}
                </form>
              </div>

              {/* 4 Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-200 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>100% Silk Mark Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Complimentary Fall & Pico</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Insured Express Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>7-Day Hassle-Free Returns</span>
                </div>
              </div>

            </div>

          </div>

          {/* ───────────── 3. BELOW SECTIONS ───────────── */}
          {/* Tabs: Description | Fabric & Details | Delivery | Returns | Reviews */}
          <div className="mt-16 sm:mt-20 pt-8 border-t border-stone-300">
            
            {/* Tab Navigation Headers */}
            <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-4 overflow-x-auto pb-4 border-b border-stone-200 scrollbar-none">
              {[
                { id: "description", label: "Description" },
                { id: "details", label: "Fabric & Details" },
                { id: "delivery", label: "Delivery & Shipping" },
                { id: "returns", label: "Returns & Exchange" },
                { id: "reviews", label: `Reviews (${reviewsList.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#3E0C15] text-[#F7EFCF] shadow-md"
                      : "bg-white text-stone-600 hover:text-stone-950 border border-stone-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="mt-8 max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-amber-900/10 shadow-sm">
              
              {/* Tab 1: Description */}
              {activeTab === "description" && (
                <div className="space-y-4 animate-in fade-in duration-200 text-stone-700 leading-relaxed text-sm">
                  <h3 className="font-serif-luxury text-2xl text-[#3E0C15] font-semibold">
                    The Artisan Drape Chronicle
                  </h3>
                  <p>{product.description}</p>
                  <p>
                    Every thread tells the story of generations of master weavers who have preserved the ancient craft of Indian handlooms. Each warp and weft is tensioned manually to achieve a supple drape that flatters the silhouette while honouring royal traditions.
                  </p>
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-amber-900/10 mt-4 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />
                    <span className="text-xs text-stone-700 italic">
                      "An heirloom piece designed not merely for a season, but to be passed down through generations with reverence."
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 2: Fabric & Details */}
              {activeTab === "details" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <h3 className="font-serif-luxury text-2xl text-[#3E0C15] font-semibold">
                    Fabric & Craftsmanship Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Base Fabric</span>
                      <span className="font-bold text-stone-900 mt-0.5 block">{product.fabricName}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Weave Technique</span>
                      <span className="font-bold text-stone-900 mt-0.5 block">{product.details.weave}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Zari Material</span>
                      <span className="font-bold text-stone-900 mt-0.5 block">{product.details.zari}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Blouse Piece</span>
                      <span className="font-bold text-stone-900 mt-0.5 block">{product.details.blousePiece}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Dimensions & Length</span>
                      <span className="font-bold text-stone-900 mt-0.5 block">{product.details.length}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Care Instructions</span>
                      <span className="font-bold text-stone-900 mt-0.5 block">{product.details.care}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Certified with <strong>Silk Mark India</strong> authentic pure silk label attached with tamper-proof QR code.</span>
                  </div>
                </div>
              )}

              {/* Tab 3: Delivery */}
              {activeTab === "delivery" && (
                <div className="space-y-4 animate-in fade-in duration-200 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <h3 className="font-serif-luxury text-2xl text-[#3E0C15] font-semibold">
                    Worldwide Delivery & Logistics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900 block">Domestic Express Air Shipping (India)</strong>
                        <span>Dispatched within 24 hours. Delivered across major Indian metros in 2 to 4 business days. Free shipping on all orders.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900 block">100% Insured Luxury Transit</strong>
                        <span>All packages are sealed in tamper-evident velvet-lined heirloom boxes with signature-required doorstep delivery.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900 block">Custom Tailored Delivery Timelines</strong>
                        <span>Orders with custom blouse stitching require an additional 3 business days for our master drapers to craft your bespoke measurements.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Returns */}
              {activeTab === "returns" && (
                <div className="space-y-4 animate-in fade-in duration-200 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <h3 className="font-serif-luxury text-2xl text-[#3E0C15] font-semibold">
                    7-Day Complimentary Exchange & Return Policy
                  </h3>
                  <p>
                    We want you to be completely captivated by your heirloom drape. If for any reason the saree does not meet your expectations, we offer a seamless 7-day doorstep return or exchange service.
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                    <li>The saree must remain unused, unwashed, and with original tags and Silk Mark hologram intact.</li>
                    <li>Complimentary reverse pickup arranged from your doorstep.</li>
                    <li>Full refund processed to your original payment method within 48 hours of quality inspection.</li>
                  </ul>
                </div>
              )}

              {/* Tab 5: Reviews */}
              {activeTab === "reviews" && (
                <div id="reviews-section" className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
                    <div>
                      <h3 className="font-serif-luxury text-2xl text-[#3E0C15] font-semibold">
                        Customer Appraisals & Chronicles
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-stone-900">{product.rating} out of 5</span>
                        <span className="text-xs text-stone-400">({reviewsList.length} global appraisals)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="px-6 py-2.5 rounded-full bg-[#3E0C15] text-[#F7EFCF] text-xs font-bold hover:bg-[#571520] transition-all shadow cursor-pointer self-start sm:self-auto"
                    >
                      {showReviewForm ? "Cancel Review" : "Write an Appraisal"}
                    </button>
                  </div>

                  {/* Write a Review Form */}
                  {showReviewForm && (
                    <form onSubmit={handleAddReview} className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4 animate-in fade-in">
                      <h4 className="text-sm font-bold text-stone-900">Write Your Customer Review</h4>
                      
                      <div>
                        <label className="text-xs text-stone-600 block mb-1">Your Rating</label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewReviewRating(star)}
                              className="p-1 text-amber-500 cursor-pointer"
                            >
                              <Star className={`w-5 h-5 ${star <= newReviewRating ? "fill-amber-400" : "text-stone-300"}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-stone-600 block mb-1">Your Full Name</label>
                        <input
                          type="text"
                          required
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          placeholder="e.g. Radhika Sharma"
                          className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15]"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-stone-600 block mb-1">Your Review & Comments</label>
                        <textarea
                          required
                          rows={3}
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          placeholder="Share details about the weave, fabric feel, and draping elegance..."
                          className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-full bg-[#3E0C15] text-[#F7EFCF] text-xs font-bold transition-all shadow cursor-pointer"
                      >
                        Submit Appraisal
                      </button>
                    </form>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviewsList.map((rev) => (
                      <div key={rev.id} className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-stone-900">{rev.author}</span>
                            {rev.verified && (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="w-2.5 h-2.5" />
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400">{rev.date}</span>
                        </div>

                        <div className="flex items-center text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>

                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* ───────────── 4. YOU MAY ALSO LIKE (RELATED PRODUCTS) ───────────── */}
          <div className="mt-20 pt-12 border-t border-stone-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#9E7D2E] font-semibold">Curated Pairings</span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#2D0A10]">You May Also Cherish</h3>
              </div>
              <Link href="/collections/sarees" className="text-xs font-semibold text-amber-800 hover:underline">
                View All Sarees →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Product Video Drape Modal */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div 
            className="bg-[#1C0F0C] border border-amber-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-center text-white relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/40 animate-pulse">
              <Play className="w-8 h-8 fill-amber-400 ml-1" />
            </div>

            <h3 className="font-serif-luxury text-2xl font-bold mb-2">Artisan Loom & Drape Motion Reel</h3>
            <p className="text-xs text-stone-300 mb-6 max-w-md mx-auto">
              Witness the fluid drape, natural silk luster, and light reflections of the {product.name} captured under daylight.
            </p>

            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 flex items-center justify-center">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover opacity-60"
              />
              <div className="relative z-10 text-center">
                <span className="text-xs bg-amber-500 text-stone-950 font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  4K Drape Simulation Active
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
