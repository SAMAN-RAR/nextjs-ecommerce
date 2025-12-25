'use server';

import { auth } from '@/customerAuth';
import db from '@/db/db';
import { revalidatePath } from 'next/cache';

export const addToCart = async (productId) => {
  const session = await auth();
  if (!session?.user?.id) {
    const result = {
      status: 'error',
      type: 'authentication',
      message: 'Must authenticate first!',
    };
    return result;
  }

  const userId = session.user.id;

  let cart = await db.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart) {
    cart = await db.cart.create({
      data: {
        userId,
      },
    });
  }

  const existingInCart = await db.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (existingInCart) {
    const result = {
      status: 'error',
      type: 'cartError',
      message: 'This item is already in your cart!',
    };
    return result;
  }

  const existingInOrder = await db.order.findFirst({
    where: { productId, userId },
  });
  if (existingInOrder) {
    const result = {
      status: 'error',
      type: 'orderError',
      message: 'You own this item!',
    };

    return result;
  }
  await db.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
    },
  });

  const result = {
    status: 'success',
    type: 'success',
    message: 'Added to Cart!',
  };
  revalidatePath('/profile/cart', 'page');
  revalidatePath('/profile', 'page');
  return result;
};

export const deleteProductFromCart = async (id) => {
  await db.cartItem.delete({ where: { id } });
  revalidatePath('/profile/cart', 'page');
  revalidatePath('/profile', 'page');
};

export const getCartProducts = async () => {
  const session = await auth();
  if (!session) throw new Error('Unauthenticated!');

  let cart = await db.cart.findUnique({
    where: { userId: session.user.id },
  });

  if (!cart) {
    cart = await db.cart.create({
      data: {
        userId: session.user.id,
      },
    });
  }

  const data = await db.cartItem.findMany({
    where: { cartId: cart.id },
    select: {
      product: true,
      id: true,
      cartId: true,
      productId: true,
    },
  });

  const products = data.map((item) => ({
    ...item.product,
    id: item.id,
    productId: item.productId,
    cartId: item.cartId,
  }));

  return products;
};
