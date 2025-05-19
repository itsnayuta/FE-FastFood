import { Product, Combo } from '../types/index';

type CartItem = (Product | Combo) & { quality: number };

let cart: CartItem[] = [];

export const addToCart = (item: Product | Combo) => {
  const existingItem = cart.find((cartItem) => cartItem.id === item.id);
  if (existingItem) {
    cart = cart.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, quality: cartItem.quality + 1 }
        : cartItem
    );
  } else {
    cart.push({ ...item, quality: 1 });
  }
};

export const getCart = () => {
  return cart;
};

export const updateQuantity = (id: number, typeHandle: number) => {
  cart = cart.map((item) => {
    if (item.id === id) {
      if (typeHandle === 0) return { ...item, quality: item.quality + 1 };
      if (typeHandle === 1 && item.quality > 1) return { ...item, quality: item.quality - 1 };
    }
    return item;
  });
};

export const removeFromCart = (id: number) => {
  cart = cart.filter((item) => item.id !== id);
};

export const clearCart = () => {
  cart = [];
};