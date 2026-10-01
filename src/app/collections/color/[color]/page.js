import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";
import { COLOR_META } from "@/data/products";

export default async function ColorPage({ params }) {
  const { color } = await params;
  const meta = COLOR_META[color] || {
    name: `${color.replace("-", " ").toUpperCase()} Sarees`,
    description: "Discover our majestic spectrum of hand-dyed royal colorways.",
    banner: "/banners/hero-4.png",
  };

  return (
    <>
      <Navbar />
      <ProductListingPage
        title={meta.name}
        description={meta.description}
        bannerImage={meta.banner || "/banners/hero-4.png"}
        filterType="color"
        filterValue={color}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Colours", href: "/collections/sarees" },
          { name: meta.name, href: `/collections/color/${color}` },
        ]}
      />
      <Footer />
    </>
  );
}
