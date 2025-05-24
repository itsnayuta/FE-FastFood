import api from "../utils/api";
import { AxiosResponse } from "axios";

export const getCategories = async () => {
  try {
    const response = await api.get('/categories/listAll');
    console.log("Categories:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getCombos = async () => {
  try {
    const response = await api.get('/combos/listAll');
    console.log("Combos:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching combos:", error);
    return [];
  }
};

export const getProductsByCategoryId = async (categoryId: number) => {
  try {
    const response = await api.get(`/products/searchByCategoryId/${categoryId}`);
    console.log("Product by CategoryId:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductInComboByComboId = async (comboId: number) => {
  try {
    const response = await api.get(`/productincombos/searchByComboId/${comboId}`);
    console.log("Product in Combo:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products in combo:", error);
    return [];
  }
};

export const getProductById = async (productId: number) => {
  try {
    const response = await api.get(`/products/searchById/${productId}`);
    console.log("Product:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return [];
  }
};

export const getComboByType = async (type: string) => {
  try {
    const response = await api.get(`/combos/searchByType`, {
      params: { type }
    });
    console.log("Combos by type:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error while fetching combo by type:", error);
    return [];
  }
};

export const validateVoucher = async (code: string) => {
    try {
        const response = await api.get(`/vouchers/code/${code}`);
        return response.data;
    } catch (error: any) {
        console.warn('Voucher không tồn tại hoặc bị lỗi:', error?.message || error);
        return null; 
    }
};

export async function processPayment(bill: any): Promise<AxiosResponse> {
    const response = await api.post('/payments/process', bill);
    return response;
};

export const processOrder = async (orderPayload: any) => {
    try {
        const response = await api.post('/orders', orderPayload);
        return response.data;
    } catch (error: any) {
        console.error('Error processing order:', error?.message || error);
        throw error;
    }
};

export const getOrdersByMemberId = async (memberId: number) => {
    try {
        const response = await api.get(`/orders/member/${memberId}`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching orders by memberId:', error?.message || error);
        return [];
    }
};
