"use server";

import db from "@/db/db";

const { auth } = require("@/customerAuth");

export const getOrders = async () => {
  const session = await auth();

  if (!session) throw new Error("Unauthenticated!");

  const userId = session.user.id;

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      order: {
        include: {
          product: true,
        },
      },
    },
  });

  const products = user.order.map((item) => ({
    ...item.product,
    id: item.id,
    productId: item.productId,
  }));

  return products;
};
