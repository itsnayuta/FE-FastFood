
import { Product, Combo } from './types/index';
export type ScreenType = 'login' | 'onboarding' | 'signup';

export type CartItem = (Product | Combo) & {
    quality: number;
};

// Định nghĩa các màn trong Stack
export type RootStackParamList = {
    Cart: undefined;
    Payment: {
        foodItems: CartItem[];
        totalPrice: number;
    };
    ProcessingOrder: undefined;
    OrderSuccess: undefined;
};