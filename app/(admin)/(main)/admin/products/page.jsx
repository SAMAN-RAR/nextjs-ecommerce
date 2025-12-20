import PageHeader from "@/components/admin/PageHeader";
import ProductsTable from "@/components/products/ProductsTable";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import Link from "next/link";

const AdminProductPage = async ({ searchParams }) => {
  const params = await searchParams;
  const sort = params.sort || "name";
  const order = params.order || "asc";

  let orderBy = {};
  if (sort === "order") {
    orderBy = {
      order: {
        _count: order,
      },
    };
  } else {
    orderBy = { [sort]: order };
  }

  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      fileSize: true,
      _count: { select: { orders: true } },
    },
    orderBy,
  });

  return (
    <>
      <div className="flex justify-between items-center gap-4 mb-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      {products.length > 0 ? (
        <ProductsTable products={products} sort={sort} order={order} />
      ) : (
        <p>No products found...</p>
      )}
    </>
  );
};
export default AdminProductPage;
