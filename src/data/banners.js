/**
 * Dynamic Banner, Campaign & Promotional Announcement Data
 * Consumed by: HeroSlider, AnnouncementBar, PromotionalStrip, MarqueeBanner, FeaturedCollectionBanner.
 */

// Hero campaign slideshow slides
export const HERO_SLIDES = [
  {
    id: "hero-1",
    desktopBanner: "/banners/hero-1.png",
    mobileBanner: "/banners/mobile-hero-1.jpg",
    heading: "Emerald Royale & Scalloped Silks",
    subheading: "Hand-embroidered festive drapes with delicate cutwork for grand celebrations.",
    ctaText: "Shop Georgette Edit",
    ctaUrl: "/collections/georgette",
    badge: "Festive Collection 2026",
    tagline: "Pure Silk Georgette • Hand Scalloped",
  },
  {
    id: "hero-2",
    desktopBanner: "/banners/hero-2.png",
    mobileBanner: "/banners/mobile-hero-2.jpg",
    heading: "Utsav Ki Khushiyan & Kadwa Weaves",
    subheading: "Luminous Rani pink & sunshine yellow pure Varanasi Katan silks.",
    ctaText: "Explore Banarasi Silks",
    ctaUrl: "/collections/banarasi",
    badge: "Utsav & Haldi Edit",
    tagline: "Authentic Kadwa Weave • 24k Gold Zari",
  },
  {
    id: "hero-3",
    desktopBanner: "/banners/hero-3.png",
    mobileBanner: "/banners/mobile-hero-3.jpg",
    heading: "Midnight Glow & Shimmering Organza",
    subheading: "Featherlight metallic tissue with hand-embroidered silver-gold vines.",
    ctaText: "Shop Evening Organza",
    ctaUrl: "/collections/organza",
    badge: "Diwali & Cocktails",
    tagline: "Tissue Organza • Resham Embroidery",
  },
  {
    id: "hero-4",
    desktopBanner: "/banners/hero-4.png",
    mobileBanner: "/banners/mobile-hero-4.jpg",
    heading: "Eternal Marigold & Sacred Korvai",
    subheading: "Heritage Kanchipuram temple borders crafted for matrimonial splendour.",
    ctaText: "Explore Bridal Vault",
    ctaUrl: "/collections/occasion/wedding",
    badge: "Royal Bridal Heritage",
    tagline: "Pure Mulberry Silk • Solid Gold Korvai",
  },
];

// Top announcement messages rotating in AnnouncementBar
export const ANNOUNCEMENT_MESSAGES = [
  {
    id: "msg-1",
    text: "Complimentary Worldwide Express Delivery on all Heirloom Saree Commissions above ₹50,000",
    linkText: "Explore Bridal Vault",
    href: "/collections/occasion/wedding",
    icon: "Sparkles",
  },
  {
    id: "msg-2",
    text: "Festive Privilege: Enjoy Extra 10% Off on orders above ₹25,000 with Code",
    couponCode: "ROYAL10",
    linkText: "Shop Sale",
    href: "/sale",
    icon: "Tag",
  },
  {
    id: "msg-3",
    text: "Silk Mark India Certified • Direct Pit-loom Handcrafted Purity",
    linkText: "Our Heritage Story",
    href: "/pages/about-us",
    icon: "Award",
  },
];

// Marquee text items rotating across the homepage strip
export const MARQUEE_ITEMS = [
  "100% PURE SILK MARK CERTIFIED",
  "DIRECT FROM MASTER ARTISAN LOOMS",
  "FREE EXPRESS SHIPPING WORLDWIDE",
  "BESPOKE BRIDAL BLOUSE TAILORING",
  "AUTHENTIC VARANASI KADWA & KANCHIPURAM KORVAI",
  "TAMPER-PROOF ARCHIVAL BOX PACKAGING",
  "7-DAY HASSLE-FREE RETURNS",
];

// Promotional Coupons available sitewide
export const PROMOTIONAL_COUPONS = [
  {
    code: "ROYAL10",
    discountPercent: 10,
    minOrderAmount: 25000,
    description: "10% Royal Privilege Discount on orders above ₹25,000",
  },
  {
    code: "SURAT15",
    discountPercent: 15,
    minOrderAmount: 50000,
    description: "15% Heritage Wedding Discount on bridal orders above ₹50,000",
  },
  {
    code: "WELCOME2K",
    discountFlat: 2000,
    minOrderAmount: 15000,
    description: "₹2,000 Welcome Voucher on your first royal drape commission",
  },
];
