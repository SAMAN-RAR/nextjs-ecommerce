"use client";

import { DownloadIcon, ShoppingCart, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { addToCart, deleteProductFromCart } from "@/app/_actions/cart";
import { toast } from "sonner";
import { auth } from "@/customerAuth";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import CustomerLoginForm from "../customer/CustomerLoginForm";

export const ProductSubmitBtn = ({ id }) => {
  const [open, setOpen] = useState(false);

  const submitHandler = async () => {
    const result = await addToCart(id);
    if (result.status === "error") {
      toast.error("Failed to add item to card!", {
        description: result.message,
      });
      if (result.type === "authentication") {
        setOpen(true);
      }
    } else {
      toast.success("Success!", {
        description: "Successfully added item to card",
      });
    }
  };

  return (
    <>
      <Button
        size="lg"
        className="w-full cursor-pointer"
        onClick={submitHandler}
      >
        <span>Add To Cart</span>
        <ShoppingCart />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-600 p-0 gap-0 text-white">
          <CustomerLoginForm />
          <DialogFooter className="px-12 pb-8 text-black">
            <DialogClose asChild>
              <Button variant="outline" className="w-full cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const CartSubmitBtn = ({ id, productId }) => {
  const deleteHadnler = async () => {
    await deleteProductFromCart(id);
    toast.success("This product is deleted from cart!", {
      action: {
        label: "Undo",
        onClick: async () => await addToCart(productId),
      },
    });
  };
  return (
    <Button size="lg" onClick={deleteHadnler} className="cursor-pointer w-full">
      Remove
      <TrashIcon className="size-5" />
    </Button>
  );
};

export const OrderSubmitBtn = ({ id }) => {
  return (
    <Button size="lg" className="w-full" asChild>
      <a href={`/admin/products/${id}/download`} className="flex gap-2">
        <span>Download</span>
        <DownloadIcon />
      </a>
    </Button>
  );
};
