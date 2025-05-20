export interface Combo {
    id: number;
    name: string;
    type: String;
    description: string;
    price: number;
    discount: number;
    imageUrl: string;
    servingSize: string;
}

export interface Category {
    id: number;
    name: string;
    imageUrl: string;
}


export interface Product {
    id: number,
    name: string,
    description: string,
    categoryId: number,
    price: number;
    imageUrl: string,
    size: string
    quantity?: number;
}

export interface ProductInCombo {
    id: number,
    productId: number,
    comboId: number,
    quantity: number
}
export interface FoodItem {
    id: number;
    name: string;
    price: number;
    quality: number;
}

export type RootStackParamList = {
    Home: undefined;
    Cart: undefined;
    Payment: {
        foodItems: FoodItem[];
        totalPrice: number;
        voucher?: {
            code: string;
            discount: number;
        };
    };
    ProcessingOrder: {
        orderId?: string;
        storeName?: string;
        storeAddress?: string;
        storePhone?: string;
        // Customer information
        firstName?: string;
        lastName?: string;
        houseNumber?: string;
        streetName?: string;
        ward?: string;
        customerName?: string;
        address?: string;
        phoneNumber?: string;
        email?: string;
        // Payment information
        subtotal?: number;
        deliveryFee?: number;
        voucher?: {
            code: string;
            discount: number;
        };
        totalPayment?: number;
        paymentMethod?: string;
        note?: string;
        estimatedDeliveryMin?: string;
        estimatedDeliveryMax?: string;

        orderItems?: FoodItem[];
    };
    OrderSuccess: {
        orderId?: string;
        storeName?: string;
        storeAddress?: string;
        storePhone?: string;

        firstName?: string;
        lastName?: string;
        houseNumber?: string;
        streetName?: string;
        ward?: string;
        customerName?: string;
        address?: string;
        phoneNumber?: string;
        email?: string;

        subtotal?: number;
        deliveryFee?: number;
        voucher?: {
            code: string;
            discount: number;
        };
        totalPayment?: number;
        paymentMethod?: string;
        note?: string;
        estimatedDeliveryMin?: string;
        estimatedDeliveryMax?: string;

        orderItems?: FoodItem[];
    };
    LoginScreen: undefined;
    SignupScreen: undefined;


};

export interface CartItem {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    quality: number;
}

export type RootParamList = {
    AdminRoot: undefined;
    MainRoot: undefined;
};