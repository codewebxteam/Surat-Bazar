/**
 * Unified API & Dynamic Data Layer Abstraction for SURATBAZAR
 * 
 * Provides dynamic query interfaces for frontend components:
 * - Products, Categories, Occasions, Fabrics, Colours
 * - Hero Banners, Announcements, Marquees, Coupons
 * - Navigation, Mega Menu, Footer columns
 * - Filter criteria, Sort options, Reviews, UGC
 * 
 * This decouples the UI from static files, allowing the later Admin Panel / REST API / GraphQL
 * to replace the data source without changing a single line of frontend component logic.
 */

import { PRODUCTS, CATEGORY_META, OCCASION_META, FABRIC_META, COLOR_META } from "./products";
import { HEADER_NAV_ITEMS, MOBILE_BOTTOM_NAV_ITEMS, FOOTER_COLUMNS } from "./navigation";
import { HERO_SLIDES, ANNOUNCEMENT_MESSAGES, MARQUEE_ITEMS, PROMOTIONAL_COUPONS } from "./banners";
import { TESTIMONIALS, INSTAGRAM_POSTS } from "./reviews";
import { FILTER_CRITERIA } from "./filters";
import { SITE_CONFIG } from "./siteConfig";

// 1. PRODUCT QUERIES
export async function getProducts(options = {}) {
  let list = [...PRODUCTS];

  if (options.category && options.category !== "all" && options.category !== "sarees") {
    list = list.filter((p) => p.category === options.category);
  }
  if (options.occasion && options.occasion !== "all") {
    list = list.filter((p) => p.occasion === options.occasion);
  }
  if (options.fabric && options.fabric !== "all") {
    list = list.filter((p) => p.fabric === options.fabric);
  }
  if (options.color && options.color !== "all") {
    list = list.filter((p) => p.color === options.color);
  }
  if (options.isBestseller) {
    list = list.filter((p) => p.isBestseller);
  }
  if (options.isNewArrival) {
    list = list.filter((p) => p.isNewArrival);
  }
  if (options.isSale) {
    list = list.filter((p) => p.isSale);
  }
  if (options.searchQuery) {
    const q = options.searchQuery.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q) ||
        p.fabricName?.toLowerCase().includes(q) ||
        p.occasionName?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export async function getFeaturedProducts(limit = 4) {
  return PRODUCTS.slice(0, limit);
}

export async function getBestsellerProducts(limit = 8) {
  return PRODUCTS.filter((p) => p.isBestseller).slice(0, limit);
}

export async function getNewArrivalProducts(limit = 8) {
  return PRODUCTS.filter((p) => p.isNewArrival).slice(0, limit);
}

export async function getSaleProducts(limit = 8) {
  return PRODUCTS.filter((p) => p.isSale).slice(0, limit);
}

// 2. TAXONOMY & METADATA QUERIES
export async function getCategories() {
  return CATEGORY_META;
}

export async function getOccasions() {
  return OCCASION_META;
}

export async function getFabrics() {
  return FABRIC_META;
}

export async function getColors() {
  return COLOR_META;
}

// 3. CAMPAIGN & PROMOTIONS QUERIES
export async function getHeroBanners() {
  return HERO_SLIDES;
}

export async function getAnnouncementMessages() {
  return ANNOUNCEMENT_MESSAGES;
}

export async function getMarqueeItems() {
  return MARQUEE_ITEMS;
}

export async function getPromotions() {
  return PROMOTIONAL_COUPONS;
}

// 4. NAVIGATION & STRUCTURE QUERIES
export async function getNavigation() {
  return {
    header: HEADER_NAV_ITEMS,
    mobileBottomNav: MOBILE_BOTTOM_NAV_ITEMS,
    footer: FOOTER_COLUMNS,
  };
}

export async function getFilterCriteria() {
  return FILTER_CRITERIA;
}

export async function getReviews() {
  return {
    testimonials: TESTIMONIALS,
    ugcPosts: INSTAGRAM_POSTS,
  };
}

export async function getSiteConfig() {
  return SITE_CONFIG;
}
