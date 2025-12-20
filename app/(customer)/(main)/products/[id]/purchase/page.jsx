import CheckoutForm from "@/components/products/purchase/CheckoutForm";
import db from "@/db/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const ProductPurchasePage = async ({ params }) => {
  const { id } = await params;
  const cart = await db.cart.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) return notFound();

  const amount = cart.items.reduce(
    (sum, item) => sum + item.product.priceInCents,
    0
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "USD",
    metadata: { cartId: cart.id },
  });

  if (!paymentIntent.client_secret) {
    throw new Error("Stripe failed to create new payment intent!");
  }

  return (
    <div className="container mx-auto py-8">
      <CheckoutForm cart={cart} clientSecret={paymentIntent.client_secret} />
    </div>
  );
};
export default ProductPurchasePage;
