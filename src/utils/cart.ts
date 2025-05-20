// ../utils/cart.ts
import { Product, Combo } from '../types/index';

type CartItem = (Product | Combo) & { quality: number };

let cart: CartItem[] = [];

// Add Event Để lắng nghe cart thay đổi
type Listener = () => void;
const listeners: Listener[] = [];

export const addCartListener = (listener: Listener) => {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
};

const notifyListeners = () => {
    listeners.forEach(listener => listener());
};

export const addToCart = (item: Product | Combo) => {
    console.log("Adding to cart:", item);
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
    console.log("Cart after update:", cart);
    notifyListeners(); // Notify listeners of cart change
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
    notifyListeners(); // Notify listeners of cart change
};

export const removeFromCart = (id: number) => {
    cart = cart.filter((item) => item.id !== id);
    notifyListeners(); // Notify listeners of cart change
};

export const clearCart = () => {
    cart = [];
    notifyListeners(); // Notify listeners of cart change
};