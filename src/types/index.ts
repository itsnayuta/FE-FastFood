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
