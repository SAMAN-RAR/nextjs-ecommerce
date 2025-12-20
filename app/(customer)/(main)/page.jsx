import {
  getMostPopularProducts,
  getNewestProducts,
} from "@/app/_actions/products";
import ProductGrid from "@/components/products/ProductGrid";

const HomePage = async () => {
  const newestProducts = await getNewestProducts(6);
  const mostPopularProducts = await getMostPopularProducts(6);

  return (
    <main className="bg-blue-50">
      <div className="space-y-12">
        <div className="px-4 py-6">
          <ProductGrid products={mostPopularProducts} title="Most Popular" />
        </div>
        <div className="bg-blue-100 px-4 py-6">
          {" "}
          <ProductGrid
            products={newestProducts}
            title="Newest"
            cardColor="bg-blue-50"
          />
        </div>
      </div>
    </main>
  );
};
export default HomePage;
