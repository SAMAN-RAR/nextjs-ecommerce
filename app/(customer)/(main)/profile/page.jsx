import { getCartProducts } from "@/app/_actions/cart";
import { getOrders } from "@/app/_actions/order";
import ProductGrid from "@/components/products/ProductGrid";
import RemoveAccountBtn from "@/components/RemoveAccountBtn";
import SignOutBtn from "@/components/SiginouBtn";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { auth } from "@/customerAuth";
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatter";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth");
  }
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/auth");
  }

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedDate = dateFormatter.format(user.createdAt);

  const products = await getCartProducts();
  const totalPrice = products.reduce(
    (sum, product) => sum + product.priceInCents,
    0
  );

  const orders = await getOrders();

  return (
    <div className="flex flex-col items-center bg-blue-50 min-h-screen">
      <div className="flex flex-col gap-6 items-center py-12 bg-blue-50 w-full">
        <CircleUserRound size={120} strokeWidth={1} color="var(--primary)" />
        <h2 className="text-3xl text-primary font-bold">
          {session.user.email}
        </h2>
        <p className="text-muted-foreground">{formattedDate}</p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/profile/orders">Orders</Link>
          </Button>{" "}
          <Button asChild>
            <Link href="/profile/cart">Cart</Link>
          </Button>
          <SignOut />
        </div>
        <div>
          <DeleteAccount />
        </div>
      </div>
      {products.length > 0 && (
        <div className=" w-full bg-blue-100 py-12 px-4">
          <div className="container mx-auto space-y-12">
            <ProductGrid
              title={"Cart"}
              products={products}
              isCart={true}
              cardColor="bg-blue-50"
            />
            <div className="px-12 flex justify-between items-center">
              <span className="text-muted-foreground">{`${
                products.length
              } Products-${formatCurrency(totalPrice / 100)}`}</span>
              <Button asChild size="lg" className="text-md">
                <Link href={`/products/${products[0].cartId}/purchase`}>
                  Purchase
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
      {orders.length > 0 && (
        <div className="py-12 px-4 w-full bg-blue-50">
          <div className="container mx-auto">
            <ProductGrid title={"Orders"} products={orders} isOrder={true} />
          </div>
        </div>
      )}
    </div>
  );
};
export default page;

export const SignOut = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Sign Out</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Signing Out?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <SignOutBtn className="hover:bg-slate-800" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const DeleteAccount = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Remove Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <RemoveAccountBtn user={true}>Continue</RemoveAccountBtn>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
