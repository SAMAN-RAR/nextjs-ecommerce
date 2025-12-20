import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/customerAuth";
import db from "@/db/db";
import { DownloadIcon } from "lucide-react";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const SuccessPurchasePage = async ({ searchParams }) => {
  const { payment_intent } = await searchParams;
  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);
  const isSuccess = paymentIntent.status === "succeeded";

  if (!isSuccess) {
    return <div>Purchased Failed!</div>;
  }

  if (!paymentIntent.metadata.cartId) return notFound();

  const cart = await db.cart.findUnique({
    where: { id: paymentIntent.metadata.cartId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) return notFound();

  const session = await auth();
  if (!session) throw new Error("Unauthenticated!");
  const userId = session.user.id;

  await Promise.all(
    cart.items.map((item) =>
      db.order.create({
        data: {
          pricePaidInCents: item.product.priceInCents,
          userId: userId,
          productId: item.product.id,
        },
      })
    )
  );

  revalidatePath("/profile/orders", "page");
  revalidatePath("/profile", "page");

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col items-center gap-5">
        <h2>The purchaed products are added to your orders</h2>
        <Button asChild variant="outline">
          <Link href="/profile/orders">Go to Orders Page</Link>
        </Button>
      </div>
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Purchassed Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cart.items.map((item) => (
            <Card>
              <div className="flex justify-between items-center">
                <CardHeader>
                  <div className="relative h-[100px] aspect-video">
                    <Image
                      alt={item.product.name}
                      src={item.product.imagePath}
                      fill
                      className="object-contain"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-end">
                    <h2>{item.product.name}</h2>
                    <p className="line-clamp-3 text-muted-foreground">
                      {item.product.description}
                    </p>
                    <Button className="mt-5" asChild>
                      <a
                        href={`/admin/products/${item.product.id}/download`}
                        className="flex gap-2"
                      >
                        <span>Download</span>
                        <DownloadIcon />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
export default SuccessPurchasePage;
