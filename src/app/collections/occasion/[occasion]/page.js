import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";
import { OCCASION_META } from "@/data/products";

export default async function OccasionPage({ params }) {
  const { occasion } = await params;
  const meta = OCCASION_META[occasion] || {
    name: `${occasion.replace("-", " ").toUpperCase()} Weaves`,
    description: "Curated heirloom drapes perfectly styled for your special celebrations.",
    banner: "/banners/hero-2.png",
  };

  return (
    <>
      <Navbar />
      <ProductListingPage
        title={meta.name}
        description={meta.description}
        bannerImage={meta.banner || "/banners/hero-2.png"}
        filterType="occasion"
        filterValue={occasion}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Occasions", href: "/collections/sarees" },
          { name: meta.name, href: `/collections/occasion/${occasion}` },
        ]}
      />
      <Footer />
    </>
  );
}
