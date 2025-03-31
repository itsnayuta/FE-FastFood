export type ScreenType = 'login' | 'onboarding' | 'signup';

export interface FoodItem {
    id: number;
    name: string;
    price: number;
    image: any;
    quality: number;
}

export type RootStackParamList = {
    Cart: undefined;
    Payment: {
        foodItems: FoodItem[];
        totalPrice: number;
    };
    ProcessingOrder: undefined;
    OrderSuccess: undefined; 
};