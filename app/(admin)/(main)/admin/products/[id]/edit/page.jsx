import PageHeader from "@/components/admin/PageHeader";
import ProductForm from "@/components/products/ProductForm";
import db from "@/db/db";

const ProductEditPage = async ({ params }) => {
  const { id } = await params;

  const product = await db.product.findUnique({ where: { id } });

  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
};
export default ProductEditPage;
