/**
 * Dynamic Customer Testimonials, Product Reviews & Instagram UGC Data
 * Consumed by: CustomerTestimonials, InstagramUgc, ProductReviewsTab.
 */

export const TESTIMONIALS = [
  {
    id: "rev-1",
    name: "Dr. Ananya Singhania",
    location: "Mumbai, India",
    occasion: "Wedding Reception",
    saree: "Rani Gulabi Katan Banarasi Kadwa Silk",
    rating: 5,
    review: "The Kadwa zari work on this Banarasi is beyond magnificent. It felt royal, breathable, and so comfortable throughout my 6-hour wedding reception. The custom blouse fitting was 100% spot on!",
    isVerified: true,
    avatar: "/products/banarasi.jpg",
    date: "14 Sep 2026",
  },
  {
    id: "rev-2",
    name: "Meera & Siddharth Roy",
    location: "London, UK",
    occasion: "Diwali Gala & Soirée",
    saree: "Emerald Royale Scalloped Silk Georgette",
    rating: 5,
    review: "Ordered from London with international express delivery. Arrived in just 4 days in a stunning royal gift box! The drape flows like liquid silk and everyone at our Diwali gala was complimenting it.",
    isVerified: true,
    avatar: "/products/georgette.jpg",
    date: "02 Sep 2026",
  },
  {
    id: "rev-3",
    name: "Pooja Krishnamurthy",
    location: "Bengaluru, India",
    occasion: "Muhurtham Ceremony",
    saree: "Olive Green & Rust Korvai Kanjeevaram",
    rating: 5,
    review: "As a South Indian bride, the temple Korvai border was sacred to me. Suratbazar delivered genuine Kanchipuram silk mark certified purity. An heirloom piece I will pass down to my daughter.",
    isVerified: true,
    avatar: "/products/kanjeevaram.jpg",
    date: "20 Aug 2026",
  },
  {
    id: "rev-4",
    name: "Radhika Mehra",
    location: "New Delhi, India",
    occasion: "Cocktail Evening",
    saree: "Midnight Indigo Floral Resham Tissue",
    rating: 5,
    review: "The tissue organza is weightless yet has this breathtaking metallic moonlight glow. Highly recommend their bespoke video concierge styling service!",
    isVerified: true,
    avatar: "/products/organza.jpg",
    date: "12 Aug 2026",
  },
];

export const INSTAGRAM_POSTS = [
  {
    id: "ig-1",
    handle: "@radhikasingh_roy",
    image: "/products/georgette.jpg",
    caption: "Draped in emerald royalty for our family Diwali puja. ✨ @suratbazar_official",
    likes: 1420,
    productSlug: "emerald-scalloped-silk-georgette-saree",
  },
  {
    id: "ig-2",
    handle: "@ananyasharma_weddings",
    image: "/products/banarasi.jpg",
    caption: "My dream Varanasi Kadwa bridal trousseau saree came to life! 💕 #SuratbazarBride",
    likes: 3890,
    productSlug: "rani-gulabi-katan-banarasi-kadwa-saree",
  },
  {
    id: "ig-3",
    handle: "@priya_lifestyle",
    image: "/products/midnight-blue.jpg",
    caption: "Under the starlight in pure midnight tissue organza. 🌙 @suratbazar_official",
    likes: 2110,
    productSlug: "midnight-indigo-silver-zari-tissue-organza",
  },
  {
    id: "ig-4",
    handle: "@kavithai_south",
    image: "/products/kanjeevaram.jpg",
    caption: "Sacred Korvai temple borders from Kanchipuram. Pure handloom bliss. 🙏",
    likes: 4560,
    productSlug: "olive-rust-bridal-korvai-kanjeevaram-saree",
  },
];
