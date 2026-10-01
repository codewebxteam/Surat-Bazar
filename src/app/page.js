import Navbar from "@/components/Navbar"; // 1. Announcement Bar, 2. Header, 3. Mobile Search
import HeroSlider from "@/components/HeroSlider"; // 4. Hero Banner (desktopBanner, mobileBanner, heading, subheading, CTA)
import PromotionalStrip from "@/components/PromotionalStrip"; // 5. Promotional Strip
import ShopByCategory from "@/components/ShopByCategory"; // 6. Shop By Category
import NewArrivalsSection from "@/components/NewArrivalsSection"; // 7. New Arrivals
import ShopByOccasion from "@/components/ShopByOccasion"; // 8. Shop By Occasion
import FeaturedCollectionBanner from "@/components/FeaturedCollectionBanner"; // 9. Featured Collection Banner
import BestsellersSection from "@/components/BestsellersSection"; // 10. Bestsellers
import ShopByFabric from "@/components/ShopByFabric"; // 11. Shop By Fabric
import BrandStory from "@/components/BrandStory"; // 12. Brand Story / USP
import CustomerTestimonials from "@/components/CustomerTestimonials"; // 13. Customer Testimonials
import InstagramUgc from "@/components/InstagramUgc"; // 14. Instagram / UGC
import NewsletterSection from "@/components/NewsletterSection"; // 15. Newsletter
import Footer from "@/components/Footer"; // 16. Footer

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FAF7F2]">
      {/* 
        1. Announcement Bar
        2. Header (Desktop & Mobile)
        3. Mobile Search
        (Encapsulated in Navbar)
      */}
      <Navbar />

      {/* 
        4. Hero Banner 
        (Desktop: Full-Width 1024:341 | Mobile: Dedicated 3:4 Artwork | Heading, Subheading, Collection CTA)
      */}
      <HeroSlider />

      {/* 5. Promotional Strip */}
      <PromotionalStrip />

      {/* 6. Shop By Category */}
      <ShopByCategory />

      {/* 7. New Arrivals */}
      <NewArrivalsSection />

      {/* 8. Shop By Occasion */}
      <ShopByOccasion />

      {/* 9. Featured Collection Banner */}
      <FeaturedCollectionBanner />

      {/* 10. Bestsellers */}
      <BestsellersSection />

      {/* 11. Shop By Fabric */}
      <ShopByFabric />

      {/* 12. Brand Story / USP */}
      <BrandStory />

      {/* 13. Customer Testimonials */}
      <CustomerTestimonials />

      {/* 14. Instagram / UGC */}
      <InstagramUgc />

      {/* 15. Newsletter */}
      <NewsletterSection />

      {/* 16. Footer */}
      <Footer />

      {/* 
        17. Mobile Bottom Navigation
        (Rendered globally in layout.js)
      */}
    </main>
  );
}
