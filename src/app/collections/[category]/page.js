import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";
import { CATEGORY_META, OCCASION_META } from "@/data/products";

export default async function CategoryPage({ params }) {
  const { category } = await params;

  // Support category slugs or occasion direct aliases like /collections/wedding
  const isOccasion = Boolean(OCCASION_META[category]);
  const meta = isOccasion 
    ? OCCASION_META[category] 
    : (CATEGORY_META[category] || {
        name: category === "sarees" ? "All Handcrafted Sarees" : `${category.replace("-", " ").toUpperCase()} Collection`,
        description: "Discover authentic master-woven drapes crafted with pure silk, exquisite zari, and centuries of tradition.",
        banner: "/banners/hero-1.png",
      });

  const isAll = category === "sarees";

  return (
    <>
      <Navbar />
      <ProductListingPage
        title={meta.name}
        description={meta.description}
        bannerImage={meta.banner || "/banners/hero-4.png"}
        filterType={isAll ? "all" : isOccasion ? "occasion" : "category"}
        filterValue={isAll ? null : category}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Collections", href: "/collections/sarees" },
          { name: meta.name, href: `/collections/${category}` },
        ]}
      />
      <Footer />
    </>
  );
}
