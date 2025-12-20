import { getOrders } from "@/app/_actions/order";
import { ProductCard } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const OrderPage = async () => {
  const products = await getOrders();

  if (products.length === 0) {
    return (
      <div className="px-4 py-8 mx-auto flex flex-col gap-6 items-center bg-blue-50 min-h-screen">
        <h1 className="text-xl">Your shopping cart is empty!</h1>
        <Button asChild size="lg" className="text-md">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-4 container mx-auto py-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} isOrder={true} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default OrderPage;
