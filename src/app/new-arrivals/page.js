import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";

export default function NewArrivalsPage() {
  return (
    <>
      <Navbar />
      <ProductListingPage
        title="New Arrivals • Latest Loom Creations"
        description="Freshly woven master creations straight off the looms of Varanasi, Kanchipuram, and Gujarat."
        bannerImage="/banners/hero-3.png"
        filterType="new"
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "New Arrivals", href: "/new-arrivals" },
        ]}
      />
      <Footer />
    </>
  );
}
