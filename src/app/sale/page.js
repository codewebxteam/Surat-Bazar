import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";

export default function SalePage() {
  return (
    <>
      <Navbar />
      <ProductListingPage
        title="Festive Sale & Special Offers"
        description="Exclusive prices on timeless handcrafted silks and celebration drapes. Limited seasonal stock."
        bannerImage="/banners/hero-1.png"
        filterType="sale"
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Sale", href: "/sale" },
        ]}
      />
      <Footer />
    </>
  );
}
