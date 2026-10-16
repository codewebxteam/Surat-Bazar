"use client";

import { use, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
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
  ChevronLeft,
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
  Globe,
  X,
  Copy,
  Maximize2
} from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getPromotionsData, DEFAULT_COUPONS } from "@/lib/promotions";

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductData() {
      try {
        const q = query(collection(db, "products"), where("slug", "==", slug), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docData = snap.docs[0].data();
          setProduct({ id: snap.docs[0].id, ...docData });
          
          // Fetch related (random or same category, here just fetching 4 docs)
          const relQ = query(collection(db, "products"), limit(4));
          const relSnap = await getDocs(relQ);
          setRelatedProducts(relSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.id !== snap.docs[0].id));
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProductData();
  }, [slug]);

  const { addToCart, toggleWishlist, isInWishlist, appliedCoupon, applyCoupon } = useCartWishlist();
  const wishlisted = product ? isInWishlist(product.id) : false;

  // Dynamic offers from Admin Settings / Promotions
  const [activeOffers, setActiveOffers] = useState(DEFAULT_COUPONS.filter(c => c.isActive));

  useEffect(() => {
    async function loadDynamicOffers() {
      try {
        const data = await getPromotionsData();
        if (data && Array.isArray(data.coupons)) {
          const live = data.coupons.filter(c => c.isActive);
          if (live.length > 0) {
            setActiveOffers(live);
          }
        }
      } catch (e) {
        console.warn("Could not load dynamic offers on product page:", e);
      }
    }
    loadDynamicOffers();
  }, []);

  // Gallery States
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState(null);

  // Purchasing & Customization States
  const [quantity, setQuantity] = useState(1);
  const [blouseOption, setBlouseOption] = useState("unstitched");
  const [activeColor, setActiveColor] = useState(product?.colorName || "Primary");
  const [addedToast, setAddedToast] = useState(false);


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
      comment: "The zari work is completely authentic with deep matte gold sheen. The silk drape is light yet regal. Packaged in a lovely velvet heirloom bag.",
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
      comment: "Silk Mark certified as promised. The cutwork on the scalloped borders is clean and intricate. Received endless compliments at the reception.",
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

  if (loading) {
    return <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">Loading product...</div>;
  }

  if (!product && !loading) {
    return notFound();
  }

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const savingsAmount = product.originalPrice ? product.originalPrice - product.price : 0;

  const currentPrice = product.price;

  // Zoom Mouse Movement Handler (Desktop)
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyPromo = async (offer) => {
    const code = typeof offer === "string" ? offer : offer.code;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedPromo(code);
    setTimeout(() => setCopiedPromo(null), 3000);

    // Apply to cart session if eligible
    if (typeof offer === "object" && offer !== null && offer.type !== "info") {
      await applyCoupon(offer);
    } else if (typeof offer === "string") {
      await applyCoupon(code);
    }
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

  const handleBuyNow = (e) => {
    e?.preventDefault();
    addToCart(product, quantity, blouseOption);
    router.push("/checkout");
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

      <main className="w-full bg-[#FAF7F2] min-h-screen pb-24 lg:pb-20">
        
        {/* 1. Breadcrumbs Navigation (Mobile Responsive Horizontal Scroll) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3 sm:py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-stone-500 uppercase tracking-wider overflow-x-auto whitespace-nowrap scrollbar-none py-1">
            <Link href="/" className="hover:text-stone-900 transition-colors shrink-0">Home</Link>
            <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
            <Link href="/collections/sarees" className="hover:text-stone-900 transition-colors shrink-0">Sarees</Link>
            <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
            <Link href={`/collections/${product.category}`} className="hover:text-stone-900 transition-colors capitalize shrink-0">
              {product.categoryName}
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="text-[#3E0C15] font-semibold truncate max-w-[180px] sm:max-w-none">{product.name}</span>
          </nav>
        </div>

        {/* 2. Main PDP Two-Column Grid (Gallery Left, Product Information Right) */}
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-12 py-2 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
            
            {/* ───────────── LEFT: IMAGE GALLERY (7 COLS) ───────────── */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row-reverse lg:flex-row gap-3 sm:gap-4 lg:sticky lg:top-28">
              
              {/* Vertical / Horizontal Thumbnail Strip */}
              <div className="order-2 sm:order-1 lg:order-1 flex sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 lg:w-24 shrink-0 pb-1 sm:pb-0 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`relative w-16 sm:w-full aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImage === idx 
                        ? "border-[#3E0C15] ring-2 ring-[#3E0C15]/25 scale-105 shadow-md" 
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

                {/* Video Reel Trigger Thumbnail */}
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="relative w-16 sm:w-full aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-amber-500/50 bg-[#1C0F0C] flex flex-col items-center justify-center text-amber-300 gap-1 shrink-0 group hover:border-amber-400 transition-all cursor-pointer shadow"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400 ml-0.5" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider">Video</span>
                </button>
              </div>

              {/* Main Featured Image with Desktop Zoom + Mobile Touch Controls */}
              <div 
                className="order-1 sm:order-2 lg:order-2 relative flex-1 aspect-[3/4] sm:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 shadow-xl border border-amber-900/10 cursor-crosshair group select-none"
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
                    isZoomed ? "scale-150 hidden sm:block" : "scale-100"
                  }`}
                  style={
                    isZoomed
                      ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                      : undefined
                  }
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />

                {/* Floating Badges (Bestseller / Discount) */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                  {product.isBestseller && (
                    <span className="bg-[#3E0C15] text-[#F3E5C8] text-[10px] sm:text-xs uppercase font-bold tracking-widest px-2.5 sm:px-3 py-1 rounded-full shadow-lg border border-amber-500/30 backdrop-blur-sm">
                      Bestseller
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="bg-emerald-700 text-white text-[10px] sm:text-xs uppercase font-bold tracking-widest px-2.5 sm:px-3 py-1 rounded-full shadow-lg">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Wishlist & Share Top-Right Actions */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    aria-label="Share product link"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-800 flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-md active:scale-90 cursor-pointer ${
                      wishlisted 
                        ? "bg-rose-50 text-rose-600 border border-rose-200" 
                        : "bg-white/90 text-stone-800 hover:text-rose-600 hover:bg-white"
                    }`}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${wishlisted ? "fill-rose-600 text-rose-600 scale-110" : ""}`} />
                  </button>
                </div>

                {/* Mobile Prev / Next Image Chevron Buttons */}
                <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none sm:hidden">
                  <button
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                    className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center pointer-events-auto active:scale-90 backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    aria-label="Next image"
                    className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center pointer-events-auto active:scale-90 backdrop-blur-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Fullscreen Lightbox Trigger Button */}
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label="Open Fullscreen HD Zoom"
                  className="sm:hidden absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1.5 shadow"
                >
                  <Maximize2 className="w-3 h-3 text-amber-400" />
                  <span>Tap to Zoom</span>
                </button>

                {/* Image Counter Badge (e.g. 1 / 4) */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/60 backdrop-blur-md text-white px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-medium flex items-center gap-1.5 pointer-events-none">
                  <ZoomIn className="w-3 h-3 text-amber-400 hidden sm:inline" />
                  <span>{selectedImage + 1} / {product.images.length}</span>
                </div>

                {/* Share copied toast */}
                {copiedLink && (
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs px-3.5 py-1.5 rounded-full shadow-xl animate-in fade-in whitespace-nowrap z-20">
                    Link copied to clipboard!
                  </div>
                )}
              </div>

            </div>

            {/* ───────────── RIGHT: PRODUCT INFORMATION (5 COLS) ───────────── */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              
              {/* Category, Rating & Title */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold text-[#9E7D2E]">
                    {product.categoryName || product.category}
                  </span>
                  
                  {/* Rating Badge */}
                  <a 
                    href="#reviews-section" 
                    onClick={() => setActiveTab("reviews")}
                    className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-amber-500/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500" />
                    </div>
                    <span className="text-xs font-bold text-stone-900">{product.rating}</span>
                    <span className="text-[11px] sm:text-xs text-stone-500 font-medium">({reviewsList.length})</span>
                  </a>
                </div>

                <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#2D0A10] leading-snug">
                  {product.name}
                </h1>
                
                <p className="text-xs sm:text-sm text-stone-600 mt-1.5 sm:mt-2 leading-relaxed">
                  {product.tagline}
                </p>
              </div>

              {/* Price, MRP, Discount & Stock */}
              <div className="p-3.5 sm:p-5 rounded-2xl bg-[#F5EFEB] border border-amber-900/15 shadow-xs">
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <div className="flex items-baseline flex-wrap gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-[#3E0C15]">
                      ₹{currentPrice.toLocaleString("en-IN")}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs sm:text-base text-stone-400 line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {discountPercent}% OFF (Save ₹{savingsAmount.toLocaleString("en-IN")})
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    ● In Stock ({product.stock} left)
                  </span>
                </div>

                <span className="text-[10px] sm:text-[11px] text-stone-500 block mt-2">
                  Inclusive of all taxes • Handcrafted Pure Silk • Free Express Doorstep Delivery
                </span>
              </div>

              {/* Exclusive Member & Bank Offers Box (Dynamic from Admin) */}
              {activeOffers && activeOffers.length > 0 && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-300/60 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#3E0C15] uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-amber-700" />
                      <span>Available Offers & Privileges</span>
                    </div>
                    {appliedCoupon && (
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full lowercase tracking-normal">
                        code {appliedCoupon.code} active
                      </span>
                    )}
                  </div>
                  
                  <ul className="space-y-2 text-xs text-stone-700">
                    {activeOffers.map((offer, idx) => {
                      const isApplied = appliedCoupon?.code === offer.code;
                      const isCopied = copiedPromo === offer.code;

                      if (offer.type === "info") {
                        return (
                          <li key={offer.code + idx} className="flex items-start gap-2">
                            <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px] shrink-0">
                              {offer.code}
                            </span>
                            <span className="text-[11px] sm:text-xs text-stone-700">{offer.description}</span>
                          </li>
                        );
                      }

                      return (
                        <li key={offer.code + idx} className="flex items-center justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <span className="font-mono font-bold text-[#3E0C15] bg-amber-200/90 px-1.5 py-0.5 rounded text-[10px] shrink-0">
                              {offer.code}
                            </span>
                            <span className="text-[11px] sm:text-xs text-stone-700">
                              {offer.description}
                            </span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleCopyPromo(offer)} 
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all shrink-0 cursor-pointer ${
                              isApplied
                                ? "bg-emerald-700 text-white shadow-xs"
                                : isCopied
                                ? "bg-amber-400 text-[#3E0C15] font-extrabold"
                                : "text-amber-900 bg-amber-200/70 hover:bg-amber-300"
                            }`}
                          >
                            {isApplied ? "Applied ✓" : isCopied ? "Copied ✓" : "Apply"}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Color / Variant Swatch Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-stone-900">
                    Colour Palette: <span className="font-normal text-amber-800">{activeColor}</span>
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
                      <span className="w-3.5 h-3.5 rounded-full shadow-inner shrink-0" style={{ backgroundColor: col.hex }} />
                      <span className="whitespace-nowrap">{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>


              {/* Quantity, Add to Bag & Buy Now CTAs (Desktop / Large View) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-stone-300 bg-white rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer active:scale-90"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-7 sm:w-8 text-center text-sm font-bold text-stone-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="p-2 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer active:scale-90"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    onClick={handleAddToCart}
                    id="pdp-add-to-bag"
                    className="flex-1 py-3.5 px-4 sm:px-6 rounded-xl bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span>{addedToast ? "Added to Bag ✓" : "Add to Bag"}</span>
                  </button>
                </div>

                {/* Direct Buy Now Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  id="pdp-buy-now"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-center cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Buy Now • Instant Express Checkout</span>
                </button>
              </div>

              {/* Worldwide & Pan-India Delivery Assurance */}
              <div className="pt-4 border-t border-stone-200">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-stone-50 to-amber-50/40 border border-amber-200/60 shadow-2xs">
                  <div className="w-9 h-9 rounded-full bg-amber-100/80 flex items-center justify-center shrink-0 text-[#3E0C15]">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-stone-900 text-xs sm:text-[13px]">
                        Worldwide &amp; Pan-India Express Delivery
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        100% Locations Active
                      </span>
                    </div>
                    <p className="text-stone-600 text-[11px] mt-0.5 leading-snug">
                      Delivery available to every corner of India &amp; all international countries with live tracking.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Trust Badges */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-4 border-t border-stone-200 text-xs text-stone-700">
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
          <div className="mt-12 sm:mt-20 pt-6 sm:pt-8 border-t border-stone-300">
            
            {/* Tab Navigation Headers (Smooth horizontal scroll on mobile) */}
            <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-3 border-b border-stone-200 scrollbar-none px-1">
              {[
                { id: "description", label: "Description" },
                { id: "details", label: "Fabric & Details" },
                { id: "delivery", label: "Delivery & Shipping" },
                { id: "returns", label: "Returns & Exchange" },
                { id: "reviews", label: `Reviews (${reviewsList?.length || 3})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    activeTab === tab.id
                      ? "bg-[#3E0C15] text-[#F7EFCF] shadow-md"
                      : "bg-white text-stone-600 hover:text-stone-950 border border-stone-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents Container */}
            <div className="mt-6 sm:mt-8 max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-amber-900/10 shadow-sm min-h-[320px]">
              
              {/* Tab 1: Description */}
              {activeTab === "description" && (
                <div className="space-y-4 animate-in fade-in duration-200 text-stone-700 leading-relaxed text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#3E0C15] font-semibold">
                      The Artisan Drape Chronicle
                    </h3>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full shrink-0">
                      Product Overview
                    </span>
                  </div>

                  {/* Admin description from Firestore */}
                  {product?.description ? (
                    <div className="text-stone-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium bg-stone-50/80 p-4 rounded-xl border border-stone-200/60 shadow-2xs">
                      {product.description}
                    </div>
                  ) : null}

                  <p className="text-stone-600">
                    Every thread tells the story of generations of master weavers who have preserved the ancient craft of Indian handlooms. Each warp and weft is tensioned manually to achieve a supple drape that flatters the silhouette while honouring royal traditions.
                  </p>

                  {/* Highlights Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                    <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10 text-center">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">Craft &amp; Weave</span>
                      <span className="text-xs font-bold text-stone-900 block mt-0.5">{product?.categoryName || product?.category || "Handloom Silks"}</span>
                    </div>
                    <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10 text-center">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">Base Fabric</span>
                      <span className="text-xs font-bold text-stone-900 block mt-0.5">{product?.fabricName || product?.fabric || "Pure Mulberry Silk"}</span>
                    </div>
                    <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10 text-center">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">Color Shade</span>
                      <span className="text-xs font-bold text-stone-900 block mt-0.5">{product?.colorName || product?.color || "Royal Hue"}</span>
                    </div>
                    <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-amber-900/10 text-center">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">Assurance</span>
                      <span className="text-xs font-bold text-emerald-800 block mt-0.5">Silk Mark Certified</span>
                    </div>
                  </div>

                  <div className="bg-amber-50/60 p-3.5 sm:p-4 rounded-2xl border border-amber-900/10 mt-3 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />
                    <span className="text-xs text-stone-700 italic">
                      &ldquo;An heirloom piece designed not merely for a season, but to be passed down through generations with reverence.&rdquo;
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 2: Fabric & Details */}
              {activeTab === "details" && (
                <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#3E0C15] font-semibold">
                      Fabric &amp; Craftsmanship Specifications
                    </h3>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                      Handloom Certified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-400 block text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">Base Fabric</span>
                      <span className="font-bold text-stone-900 mt-1 block text-xs sm:text-sm">
                        {product?.fabricName || product?.fabric || "Pure Mulberry Silk"}
                      </span>
                      <span className="text-[11px] text-stone-500 mt-0.5 block">100% natural breathable pure handloom yarn</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-400 block text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">Weave Technique</span>
                      <span className="font-bold text-stone-900 mt-1 block text-xs sm:text-sm">
                        {product?.details?.weave || product?.weave || "Authentic Handloom Kadwa / Jacquard Banarasi Weave"}
                      </span>
                      <span className="text-[11px] text-stone-500 mt-0.5 block">Traditional hand-interlocked artisan motifs</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-400 block text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">Zari Material</span>
                      <span className="font-bold text-stone-900 mt-1 block text-xs sm:text-sm">
                        {product?.details?.zari || product?.zari || "Tested Gold & Silver Metallic Zari"}
                      </span>
                      <span className="text-[11px] text-stone-500 mt-0.5 block">Tarnish-resistant antique lustre finish</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-400 block text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">Blouse Piece</span>
                      <span className="font-bold text-stone-900 mt-1 block text-xs sm:text-sm">
                        {product?.details?.blousePiece || product?.blousePiece || "Included (0.8m Matching Unstitched Fabric)"}
                      </span>
                      <span className="text-[11px] text-stone-500 mt-0.5 block">Features coordinating border embroidery</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-400 block text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">Dimensions &amp; Length</span>
                      <span className="font-bold text-stone-900 mt-1 block text-xs sm:text-sm">
                        {product?.details?.length || product?.length || "5.5 Metres Saree + 0.8 Metre Blouse (Standard 6.3m Total)"}
                      </span>
                      <span className="text-[11px] text-stone-500 mt-0.5 block">Width: 46 inches with lavish pallu drape</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-400 block text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">Care Instructions</span>
                      <span className="font-bold text-stone-900 mt-1 block text-xs sm:text-sm">
                        {product?.details?.care || product?.care || "Dry Clean Recommended. Preserve in pure cotton muslin."}
                      </span>
                      <span className="text-[11px] text-stone-500 mt-0.5 block">Avoid direct perfume spraying on zari</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
                    <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <strong className="block text-stone-900">Silk Mark Certified Authenticity</strong>
                      <span>All our pure silks carry the official Silk Mark India label with verifiable security hologram tag.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Delivery */}
              {activeTab === "delivery" && (
                <div className="space-y-4 animate-in fade-in duration-200 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#3E0C15] font-semibold">
                      Worldwide &amp; Pan-India Delivery
                    </h3>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                      100% Locations Active
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <Truck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900 block font-bold">Domestic Express Air Shipping (All India)</strong>
                        <span className="text-stone-600">Dispatched within 24 hours. Delivered across every city, town, and rural pincode in India in 2 to 4 business days. Free express insured shipping on all orders. Cash on Delivery (COD) available.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <Globe className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900 block font-bold">International Priority Delivery (Worldwide 150+ Countries)</strong>
                        <span className="text-stone-600">We ship worldwide to USA, UK, Canada, UAE, Australia, Singapore, Europe, and 150+ countries via DHL Express &amp; FedEx Priority. Tracked door-to-door delivery in 4 to 7 business days.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900 block font-bold">100% Insured Luxury Transit Packaging</strong>
                        <span className="text-stone-600">Every master-drape is packed in a signature velvet-lined heirloom box with moisture-proof protective wrapping and tamper-evident sealing.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                      <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900 block font-bold">Live Tracking &amp; Custom Stitching Timelines</strong>
                        <span className="text-stone-600">Live SMS &amp; WhatsApp tracking links are dispatched immediately upon shipment. For orders with custom blouse tailoring, add 3 additional working days.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Returns */}
              {activeTab === "returns" && (
                <div className="space-y-4 animate-in fade-in duration-200 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#3E0C15] font-semibold">
                      7-Day Complimentary Exchange &amp; Return Policy
                    </h3>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                      Hassle-Free Guarantee
                    </span>
                  </div>

                  <p className="text-stone-600">
                    We want you to be completely captivated by your heirloom drape. If for any reason the saree does not meet your expectations, we offer a seamless 7-day doorstep return or exchange service with 100% money back.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <strong className="text-stone-900 block text-xs font-bold mb-1">1. Easy Request</strong>
                      <span className="text-[11px] text-stone-600">Initiate return or exchange online via account or WhatsApp within 7 days of delivery.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <strong className="text-stone-900 block text-xs font-bold mb-1">2. Doorstep Pickup</strong>
                      <span className="text-[11px] text-stone-600">Complimentary courier pickup arranged from your doorstep anywhere in India.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <strong className="text-stone-900 block text-xs font-bold mb-1">3. Instant Refund</strong>
                      <span className="text-[11px] text-stone-600">Full refund processed to original payment method or bank account within 24-48 hours.</span>
                    </div>
                  </div>

                  <ul className="list-disc pl-5 space-y-1 text-stone-500 text-[11px] sm:text-xs pt-1">
                    <li>Saree must remain unused, unwashed, and with original tags and Silk Mark hologram intact.</li>
                    <li>Fall &amp; pico finished sarees are 100% eligible for standard returns.</li>
                    <li>For international orders, our dedicated concierge team assists with reverse logistics.</li>
                  </ul>
                </div>
              )}

              {/* Tab 5: Reviews */}
              {activeTab === "reviews" && (
                <div id="reviews-section" className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
                    <div>
                      <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#3E0C15] font-semibold">
                        Customer Appraisals &amp; Chronicles
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-stone-900">{product?.rating || 5} out of 5</span>
                        <span className="text-xs text-stone-400">({reviewsList?.length || 3} global appraisals)</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="px-5 py-2 rounded-full bg-[#3E0C15] text-[#F7EFCF] text-xs font-bold hover:bg-[#571520] transition-all shadow cursor-pointer self-start sm:self-auto"
                    >
                      {showReviewForm ? "Cancel Review" : "Write an Appraisal"}
                    </button>
                  </div>

                  {/* Write a Review Form */}
                  {showReviewForm && (
                    <form onSubmit={handleAddReview} className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-3.5 animate-in fade-in">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900">Write Your Customer Review</h4>
                      
                      <div>
                        <label className="text-[11px] text-stone-600 block mb-1">Your Rating</label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewReviewRating(star)}
                              className="p-1 text-amber-500 cursor-pointer"
                            >
                              <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= newReviewRating ? "fill-amber-400" : "text-stone-300"}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-stone-600 block mb-1">Your Full Name</label>
                        <input
                          type="text"
                          required
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          placeholder="e.g. Radhika Sharma"
                          className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#3E0C15]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-stone-600 block mb-1">Your Review & Comments</label>
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
                  <div className="space-y-3.5">
                    {reviewsList.map((rev) => (
                      <div key={rev.id} className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-stone-900">{rev.author}</span>
                            {rev.verified && (
                              <span className="bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="w-2.5 h-2.5" />
                                Verified
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] sm:text-[11px] text-stone-400">{rev.date}</span>
                        </div>

                        <div className="flex items-center text-amber-500">
                          {[...Array(rev.rating || 5)].map((_, i) => (
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
          <div className="mt-14 sm:mt-20 pt-8 sm:pt-12 border-t border-stone-300">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#9E7D2E] font-semibold">Curated Pairings</span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl md:text-3xl font-medium text-[#2D0A10]">You May Also Cherish</h3>
              </div>
              <Link href="/collections/sarees" className="text-xs font-semibold text-amber-800 hover:underline">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* ================= STICKY MOBILE CONVERSION BAR (lg:hidden) ================= */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-900/15 py-2.5 px-3.5 lg:hidden shadow-[0_-4px_25px_rgba(0,0,0,0.12)] flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Total Price</span>
          <span className="text-base font-bold text-[#3E0C15] leading-tight">
            ₹{currentPrice.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-[240px]">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2.5 px-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{addedToast ? "Added ✓" : "Bag"}</span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 py-2.5 px-2 bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all text-center shadow cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* ================= HIGH RES LIGHTBOX ZOOM MODAL ================= */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 animate-in fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close fullscreen view"
            className="absolute top-4 right-4 z-50 text-white/80 hover:text-white p-2 rounded-full bg-black/50 backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>

          <div 
            className="relative w-full max-w-4xl h-[80vh] sm:h-[85vh] rounded-2xl overflow-hidden select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />

            {/* Navigation Chevrons */}
            <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
              <button
                onClick={handlePrevImage}
                className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-auto active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-auto active:scale-90"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3.5 py-1.5 rounded-full">
              {product.name} • {selectedImage + 1} / {product.images.length}
            </div>
          </div>
        </div>
      )}

      {/* ================= PRODUCT VIDEO DRAPE MODAL ================= */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div 
            className="bg-[#1C0F0C] border border-amber-500/40 rounded-3xl max-w-xl w-full p-5 sm:p-8 text-center text-white relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-amber-500/40 animate-pulse">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-amber-400 ml-1" />
            </div>

            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2">Artisan Loom & Drape Motion Reel</h3>
            <p className="text-xs text-stone-300 mb-4 sm:mb-6 max-w-md mx-auto">
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
                <span className="text-xs bg-amber-500 text-stone-950 font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow">
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
