import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";

export default function BestsellersPage() {
  return (
    <>
      <Navbar />
      <ProductListingPage
        title="Bestsellers • Most Coveted Heirloom Sarees"
        description="Our most cherished, highest-rated bridal and festive handlooms loved by royal brides worldwide."
        bannerImage="/banners/hero-2.png"
        filterType="bestseller"
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Bestsellers", href: "/bestsellers" },
        ]}
      />
      <Footer />
    </>
  );
}
