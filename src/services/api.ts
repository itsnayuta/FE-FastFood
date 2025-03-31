// import { API_HOST } from "@env"




const API_BASE_URL = `http://192.168.1.17:8080/api`;

export const getCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/categories/listAll`);
        const data = await response.json();
        console.log("Categories:", data);
        return data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export const getCombos = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/combos/listAll`);
        const data = await response.json();
        console.log("Combos:", data);
        return data;
    } catch (error) {
        console.error("Error fetching combos:", error);
        return [];
    }
};

export const getProductsByCategoryId = async (categoryId: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/searchByCategoryId/${categoryId}`);
        const data = await response.json();
        console.log("Product by CategoryId:", data);
        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const getProductInComboByComboId = async (comboId: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/productincombos/searchByComboId/${comboId}`);
        const data = await response.json();
        console.log("Product in Combo:", data);
        return data;
    } catch (error) {
        console.error("Error fetching products in combo:", error);
        return [];
    }
};

export const getProductById = async (productId: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/searchById/${productId}`);
        const data = await response.json();
        console.log("Product: ", data);
        return data;
    } catch (error) {
        console.log("Error fetching product by id", error);
        return [];
    }
};

export const getComboByType = async (type: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/combos/searchByType?type=${type}`);
        const data = await response.json();
        console.log("Combos by type: ", data);
        return data;
    } catch (error) {
        console.log("Error while fetching combo by type: ", error);
        return [];
    }
};
