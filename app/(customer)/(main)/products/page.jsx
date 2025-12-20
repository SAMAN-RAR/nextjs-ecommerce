import { ProductCard } from "@/components/products/ProductGrid";
import db from "@/db/db";

const ProductPage = async ({ searchParams }) => {
  const { order } = (await searchParams) || "popular";
  let orderBy = { orders: { _count: "desc" } };
  if (order === "latest") {
    orderBy = { createdAt: "desc" };
  }

  const products = await db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy,
  });

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 ">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 ">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
