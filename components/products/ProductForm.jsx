"use client";

import { useActionState, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { formatCurrency, sizeFormatter } from "@/lib/formatter";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { addProduct, updateProduct } from "@/app/_actions/products";
import { useFormStatus } from "react-dom";
import Image from "next/image";

const ProductForm = ({ product }) => {
  const [error, action] = useActionState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );
  const [priceInCents, setPriceInCents] = useState(product?.priceInCents || "");
  const [image, setImage] = useState();
  const [file, setFile] = useState("Please select a file");

  const imageChangeHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const fileChangeHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      const fileString = `${e.target.files[0].name}-${sizeFormatter(
        e.target.files[0].size
      )}`;
      setFile(fileString);
    }
  };
  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ""}
        />
        {error.name?.errors.length > 0 &&
          error.name.errors.map((error) => (
            <div key={error} className="text-destructive">
              {error}
            </div>
          ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents}
          onChange={(e) => setPriceInCents(e.target.value)}
        />
        <div className="text-muted-foreground">
          {formatCurrency((priceInCents || 0) / 100)}
        </div>
        {error.priceInCents?.errors.length > 0 &&
          error.priceInCents.errors.map((error) => (
            <div key={error} className="text-destructive">
              {error}
            </div>
          ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description || ""}
        />
        {error.description?.errors.length > 0 &&
          error.description.errors.map((error) => (
            <div key={error} className="text-destructive">
              {error}
            </div>
          ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          type="file"
          id="file"
          name="file"
          required={product == null}
          onChange={fileChangeHandler}
        />
        <div className="text-muted-foreground text-sm px-3">
          {product == null
            ? file
            : `${product?.name}-${sizeFormatter(product?.fileSize)}`}
        </div>
        {error.file?.errors.length > 0 &&
          error.file.errors.map((error) => (
            <div key={error} className="text-destructive">
              {error}
            </div>
          ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Thumbnail</Label>
        <Input
          type="file"
          accept="image/*"
          id="image"
          name="image"
          required={product == null}
          onChange={imageChangeHandler}
        />
        <div className="mt-6">
          {(product || image) && (
            <Image
              src={image || product.imagePath}
              width={300}
              height={200}
              alt="thumbnail"
            />
          )}
        </div>
        {error.image?.errors.length > 0 &&
          error.image.errors.map((error) => (
            <div key={error} className="text-destructive">
              {error}
            </div>
          ))}
      </div>
      <div className="flex justify-between w-full">
        <div className="flex gap-2 items-center">
          <Input
            type="checkbox"
            id="isAvailableForPurchase"
            name="isAvailableForPurchase"
            defaultChecked={product?.isAvailableForPurchase || false}
          />
          <Label htmlFor="isAvailableForPurchase">Activate</Label>
          {error.isAvailableForPurchase?.errors.length > 0 &&
            error.isAvailableForPurchase.errors.map((error) => (
              <div key={error} className="text-destructive">
                {error}
              </div>
            ))}
        </div>
        <SubmitButton />
      </div>
    </form>
  );
};

export default ProductForm;

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
};
