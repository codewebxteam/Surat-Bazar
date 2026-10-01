/**
 * Core Site Configuration & Branding Metadata
 * Consumed across Header, Footer, Checkout, and Meta tags.
 */
export const SITE_CONFIG = {
  brandName: "Suratbazar",
  brandNameUpper: "SURATBAZAR",
  tagline: "Surat Silk & Textile Emporium",
  subTagline: "Authentic Surat Handloom & Silk Treasury Since 1984",
  contact: {
    phone: "+91 98765 43210",
    phoneDisplay: "+91 98765 43210 / +91 261 4982 0000",
    email: "support@suratbazar.com",
    bridalEmail: "bridal@suratbazar.com",
    address: "Ring Road Textile Market, Surat, Gujarat - 395002",
    workingHours: "Open All 7 Days: 10:00 AM – 9:00 PM IST",
  },
  socialLinks: {
    instagram: "https://instagram.com/suratbazar_official",
    facebook: "https://facebook.com/suratbazar_official",
    pinterest: "https://pinterest.com/suratbazar_official",
    youtube: "https://youtube.com/@suratbazar_official",
  },
  currencies: [
    { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 1.0 },
    { code: "USD", symbol: "$", name: "US Dollar", rate: 0.012 },
    { code: "GBP", symbol: "£", name: "British Pound", rate: 0.0095 },
    { code: "AED", symbol: "AED", name: "UAE Dirham", rate: 0.044 },
  ],
  certifications: [
    { name: "Silk Mark India", icon: "Award", description: "100% Pure Natural Silk Guarantee" },
    { name: "GI Handloom Authenticated", icon: "ShieldCheck", description: "Geographical Indication Certified Weaves" },
    { name: "Insured Express Transit", icon: "Truck", description: "Tamper-Proof Box Delivery" },
    { name: "Artisan Welfare Fund", icon: "Sparkles", description: "Direct Fair-Trade Artisan Commissions" },
  ],
  paymentBadges: [
    { id: "upi", name: "UPI Instant (GPay / PhonePe / Paytm)" },
    { id: "visa", name: "Visa" },
    { id: "mastercard", name: "Mastercard" },
    { id: "rupay", name: "RuPay" },
    { id: "amex", name: "American Express" },
    { id: "netbanking", name: "50+ Net Banking Banks" },
    { id: "cod", name: "Cash on Delivery" },
  ],
};
