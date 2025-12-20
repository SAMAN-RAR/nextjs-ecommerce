"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatter";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ cart, clientSecret }) => {
  const priceInCents = cart.items.reduce(
    (sum, item) => sum + item.product.priceInCents,
    0
  );
  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <div className="h-70 overflow-auto px-8">
        {cart.items.map((item) => (
          <div className="flex gap-4 items-center not-last:border-b-2 not-last:py-8 last:pt-8">
            <div className="relative aspect-video flex-shrink-0 w-1/3 ">
              <Image
                src={item.product.imagePath}
                fill
                alt={item.product.name}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-lg">
                {formatCurrency(item.product.priceInCents / 100)}
              </div>
              <h1 className="text-2xl font-black">{item.product.name}</h1>
              <div className="line-clamp-3 text-muted-foreground">
                {item.product.description}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form priceInCents={priceInCents} />
      </Elements>
    </div>
  );
};
export default CheckoutForm;

const Form = ({ priceInCents }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const submitHandler = (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occured!");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <form onSubmit={submitHandler}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
        </CardContent>
        <CardFooter>
          <Button
            className="w-full cursor-pointer"
            size="lg"
            disabled={!stripe || !elements || isLoading}
          >
            {isLoading
              ? "Purchasing..."
              : `Purchase - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
