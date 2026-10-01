import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";

export default function CollectionsOverviewPage() {
  return (
    <>
      <Navbar />
      <ProductListingPage
        title="All Handcrafted Collections & Categories"
        description="Explore our complete treasury of authentic Banarasi, Kanjeevaram, Organza, Georgette, and Chiffon master-drapes."
        bannerImage="/banners/hero-1.png"
        filterType="all"
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Categories & Collections", href: "/collections" },
        ]}
      />
      <Footer />
    </>
  );
}
