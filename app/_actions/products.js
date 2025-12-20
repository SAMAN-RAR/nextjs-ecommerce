"use server";

import db from "@/db/db";
import z from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { cache } from "@/lib/cache";
import { revalidatePath } from "next/cache";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);
const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
  isAvailableForPurchase: z.coerce.boolean(),
});

export const addProduct = async (prevState, formData) => {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    const error = z.treeifyError(result.error);
    return error.properties;
  }

  const data = result.data;

  await fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  await fs.mkdir("public/products", { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(
    "public" + imagePath,
    Buffer.from(await data.image.arrayBuffer())
  );

  const { user } = await auth();
  await db.product.create({
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      isAvailableForPurchase: data.isAvailableForPurchase,
      adminId: user.id,
      fileSize: data.file.size,
      filePath,
      imagePath,
    },
  });

  revalidatePath("/", "layout");

  redirect("/admin/products");
};

const editSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

export const updateProduct = async (id, prevState, formData) => {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    const error = z.treeifyError(result.error);
    return error.properties;
  }

  const data = result.data;

  const product = await db.product.findUnique({ where: { id } });

  if (product == null) {
    return notFound();
  }

  let filePath = product.filePath;
  let fileSize = product.fileSize;
  if (data.file != null && data.file.size > 0) {
    await fs.unlink(product.filePath);
    filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
    fileSize = data.file.size;
  }

  let imagePath = product.imagePath;
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public${product.imagePath}`);
    imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
      "public" + imagePath,
      Buffer.from(await data.image.arrayBuffer())
    );
  }
  const { adminId } = product;

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      isAvailableForPurchase: data.isAvailableForPurchase,
      adminId,
      fileSize,
      filePath,
      imagePath,
    },
  });

  revalidatePath("/", "layout");

  redirect("/admin/products");
};

export const toggleProductAvailability = async (id, isAvailableForPurchase) => {
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } });
  revalidatePath("/", "layout");
};

export const deleteProduct = async (id) => {
  const product = db.product.findUnique({
    where: { id },
    select: {
      _count: { select: { order: true } },
    },
  });

  if (product._count?.order > 0) {
    return (error = {
      message: "You can not delete a product tha hase orders",
    });
  }
  const deletedProduct = await db.product.delete({ where: { id } });

  if (deletedProduct == null) return notFound();

  await fs.unlink(deletedProduct.filePath);
  await fs.unlink("public" + deletedProduct.imagePath);

  revalidatePath("/", "layout");
  return deletedProduct;
};

export const getMostPopularProducts = cache(async (amount) => {
  const products = await db.product.findMany(
    {
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: "desc" } },
      take: amount,
    },
    ["getMostPopularProduct"],
    { revalidate: 60 * 60 * 24 }
  );

  return products;
});

export const getNewestProducts = cache(async (amount) => {
  const products = await db.product.findMany(
    {
      where: { isAvailableForPurchase: true },
      orderBy: { createdAt: "desc" },
      take: amount,
    },
    ["getMostPopularProduct"],
    { revalidate: 60 * 60 * 24 }
  );

  return products;
});
