import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight, ArrowRightCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatCurrency } from "@/lib/formatter";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Suspense } from "react";
import { CartSubmitBtn, OrderSubmitBtn, ProductSubmitBtn } from "./SubmitBtn";

const ProductGrid = ({ products, title, cardColor, isCart, isOrder }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4 px-12">
        <h2 className="txt-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild className={cardColor}>
          <Link href="/products" className="space-x-1">
            <span>View All</span>
            <ArrowRight />
          </Link>
        </Button>
      </div>

      <div className="px-12">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            <Suspense
              fallback={
                <>
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                </>
              }
            >
              <ProductSuspense
                products={products}
                isCart={isCart}
                isOrder={isOrder}
                cardColor={cardColor}
              />
            </Suspense>
            <CarouselItem className="basis-1/1 xl:basis-1/5 md:basis-1/3">
              <Card className={cardColor}>
                <div className="relative w-full h-auto aspect-video flex justify-center items-center">
                  <Link href="/products">
                    <ArrowRightCircle
                      className="size-20 hover:size-21 transition-all duration-100 ease-in"
                      strokeWidth={1}
                    />
                  </Link>
                </div>
                <CardHeader className="flex flex-col items-center">
                  <CardTitle className="text-2xl">See All</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-4"></CardContent>
                <CardFooter>
                  <Button asChild size="lg" className={"w-full"}>
                    <Link
                      href={
                        isCart
                          ? "/profile/cart"
                          : isOrder
                          ? "profile/orders"
                          : `/products`
                      }
                    >
                      {isCart
                        ? "Go to Shooping Cart"
                        : isOrder
                        ? "Go to Orders"
                        : "Go to Products Page"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious size="50" />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};
export default ProductGrid;

export const ProductCard = ({ product, isCart, isOrder, cardColor }) => {
  const { name, priceInCents, description, imagePath, id } = product;
  const productId = isCart || isOrder ? product.productId : null;
  return (
    <Card className={cardColor}>
      <div className="relative w-full h-auto aspect-video">
        <Image alt={name} src={imagePath} fill className="object-contain" />
      </div>
      <CardHeader className="flex flex-col">
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {isOrder ? "Owned" : formatCurrency(priceInCents / 100)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <p className="whitespace-nowrap overflow-ellipsis overflow-hidden w-full">
          {description}
        </p>
      </CardContent>
      <CardFooter>
        {isCart ? (
          <CartSubmitBtn id={id} productId={productId} />
        ) : isOrder ? (
          <OrderSubmitBtn id={productId} />
        ) : (
          <ProductSubmitBtn id={id} />
        )}
      </CardFooter>
    </Card>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <CarouselItem className="basis-1/1 xl:basis-1/5 md:basis-1/3">
      <Card className="overflow-hidden flex flex-col animate-pulse">
        <div className="w-full aspect-video bg-gray-300" />
        <CardHeader>
          <CardTitle>
            <div className="w-3/4 h-6 rounded-full bg-gray-300" />
          </CardTitle>
          <CardDescription>
            <div className="w-1/2 rounded-full bg-gray-300" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="w-full rounded-full bg-gray-300" />
          <div className="w-full rounded-full bg-gray-300" />
          <div className="w-full rounded-full bg-gray-300" />
        </CardContent>
        <CardFooter>
          <Button disabled size="lg" className="w-full"></Button>
        </CardFooter>
      </Card>
    </CarouselItem>
  );
};

const ProductSuspense = async ({ products, isCart, isOrder, cardColor }) => {
  return products.map((product) => (
    <CarouselItem
      key={product.id}
      className="basis-1/1 xl:basis-1/5 md:basis-1/3"
    >
      <ProductCard
        key={product.id}
        product={product}
        isCart={isCart}
        isOrder={isOrder}
        cardColor={cardColor}
      />
    </CarouselItem>
  ));
};
