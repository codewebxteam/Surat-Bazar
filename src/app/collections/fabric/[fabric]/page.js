import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";
import { FABRIC_META } from "@/data/products";

export default async function FabricPage({ params }) {
  const { fabric } = await params;
  const meta = FABRIC_META[fabric] || {
    name: `${fabric.replace("-", " ").toUpperCase()} Sarees`,
    description: "Authentic pure weave textiles crafted with Silk Mark certified materials.",
    banner: "/banners/hero-3.png",
  };

  return (
    <>
      <Navbar />
      <ProductListingPage
        title={meta.name}
        description={meta.description}
        bannerImage={meta.banner || "/banners/hero-3.png"}
        filterType="fabric"
        filterValue={fabric}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Fabrics", href: "/collections/sarees" },
          { name: meta.name, href: `/collections/fabric/${fabric}` },
        ]}
      />
      <Footer />
    </>
  );
}
