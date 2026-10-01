/**
 * Dynamic Navigation Configuration
 * Consumed by: Header/Navbar, Mega Menu, Mobile Drawer, Mobile Bottom Nav, and Footer.
 */

// Desktop Header & Mega Menu
export const HEADER_NAV_ITEMS = [
  {
    id: "sale",
    name: "SALE",
    href: "/sale",
    isSale: true,
    badge: "Up to 30% Off",
  },
  {
    id: "sarees",
    name: "SAREES",
    href: "/collections/sarees",
    sublinks: [
      { name: "All Handcrafted Sarees", href: "/collections/sarees", description: "Complete catalog of curated handlooms" },
      { name: "Ready-to-Wear Drapes", href: "/collections/georgette", description: "Effortless pre-stitched & fluid styles" },
      { name: "Hand-painted Masterpieces", href: "/collections/organza", description: "Artisan botanical florals on sheer silk" },
      { name: "Heavy Bridal Trousseau", href: "/collections/occasion/wedding", description: "Opulent pure gold zari heirlooms" },
    ],
    featuredPromo: {
      title: "Handloom Heritage Edit",
      subtitle: "Pure Mulberry & Katan Silks",
      image: "/banners/hero-1.png",
      href: "/collections/sarees",
    }
  },
  {
    id: "collections",
    name: "COLLECTIONS",
    href: "/collections",
    sublinks: [
      { name: "Banarasi Silks", href: "/collections/banarasi", count: 24 },
      { name: "Kanjeevaram Pattu", href: "/collections/kanjeevaram", count: 18 },
      { name: "Organza & Tissue", href: "/collections/organza", count: 15 },
      { name: "Pure Silk Georgette", href: "/collections/georgette", count: 20 },
      { name: "Khaddi Chiffon & Bandhani", href: "/collections/chiffon", count: 12 },
    ],
    featuredPromo: {
      title: "Royal Banarasi Vault",
      subtitle: "Varanasi Pit-loom Weaves",
      image: "/banners/hero-2.png",
      href: "/collections/banarasi",
    }
  },
  {
    id: "occasions",
    name: "OCCASIONS",
    href: "/collections/occasion/wedding",
    sublinks: [
      { name: "Bridal & Wedding Edit", href: "/collections/occasion/wedding" },
      { name: "Festive Celebrations", href: "/collections/occasion/festive" },
      { name: "Cocktail & Reception", href: "/collections/occasion/reception" },
      { name: "Haldi & Pooja", href: "/collections/occasion/haldi" },
      { name: "Mehendi & Sangeet", href: "/collections/occasion/mehendi" },
    ],
    featuredPromo: {
      title: "Bridal Matrimony 2026",
      subtitle: "Curated for the Indian Bride",
      image: "/banners/hero-4.png",
      href: "/collections/occasion/wedding",
    }
  },
  {
    id: "fabrics",
    name: "FABRICS",
    href: "/collections/fabric/silk",
    sublinks: [
      { name: "100% Pure Mulberry Silk", href: "/collections/fabric/silk" },
      { name: "Pure Katan Silk", href: "/collections/fabric/katan-silk" },
      { name: "Tissue Organza", href: "/collections/fabric/organza" },
      { name: "Pure Silk Georgette", href: "/collections/fabric/georgette" },
      { name: "Khaddi Chiffon", href: "/collections/fabric/chiffon" },
      { name: "Chanderi Cotton Silk", href: "/collections/fabric/chanderi" },
    ],
  },
  {
    id: "new-arrivals",
    name: "NEW ARRIVALS",
    href: "/new-arrivals",
    badge: "New",
  },
  {
    id: "bestsellers",
    name: "BESTSELLERS",
    href: "/bestsellers",
  },
];

// Mobile Bottom Navigation Bar Links
export const MOBILE_BOTTOM_NAV_ITEMS = [
  { id: "home", label: "Home", href: "/", icon: "Home" },
  { id: "categories", label: "Categories", href: "/collections", icon: "Grid" },
  { id: "search", label: "Search", href: "/search", icon: "Search" },
  { id: "wishlist", label: "Wishlist", href: "/wishlist", icon: "Heart", showBadge: true },
  { id: "account", label: "Account", href: "/account", icon: "User" },
];

// Footer 5 Columns Data Structure
export const FOOTER_COLUMNS = [
  {
    id: "shop",
    title: "SHOP",
    links: [
      { label: "Sarees", href: "/collections/sarees" },
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Bestsellers", href: "/bestsellers" },
      { label: "Wedding Sarees", href: "/collections/occasion/wedding" },
      { label: "Festive Sarees", href: "/collections/occasion/festive" },
      { label: "Sale", href: "/sale" },
    ],
  },
  {
    id: "customer-care",
    title: "CUSTOMER CARE",
    links: [
      { label: "Contact Us", href: "/pages/contact-us" },
      { label: "Shipping & Delivery", href: "/pages/shipping-policy" },
      { label: "Track Order", href: "/account/orders" },
      { label: "Returns & Exchange", href: "/pages/return-policy" },
      { label: "FAQs", href: "/pages/faq" },
    ],
  },
  {
    id: "about",
    title: "ABOUT",
    links: [
      { label: "About Us", href: "/pages/about-us" },
      { label: "Our Story", href: "/pages/about-us" },
      { label: "Our Stores", href: "/pages/stores" },
      { label: "Contact Concierge", href: "/pages/contact-us" },
    ],
  },
  {
    id: "information",
    title: "INFORMATION",
    links: [
      { label: "Privacy Policy", href: "/pages/privacy-policy" },
      { label: "Terms & Conditions", href: "/pages/terms-conditions" },
      { label: "Refund Policy", href: "/pages/return-policy" },
      { label: "Shipping Policy", href: "/pages/shipping-policy" },
      { label: "Care Guide", href: "/pages/care-guide" },
      { label: "Size Guide", href: "/pages/size-guide" },
    ],
  },
  {
    id: "social",
    title: "SOCIAL",
    links: [
      { label: "Instagram", href: "https://instagram.com", isExternal: true },
      { label: "Facebook", href: "https://facebook.com", isExternal: true },
      { label: "Pinterest", href: "https://pinterest.com", isExternal: true },
      { label: "YouTube", href: "https://youtube.com", isExternal: true },
    ],
  },
];
