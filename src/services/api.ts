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

export const getAllProducts = async () => {
  try {
    const response = await api.get('/products/listAll');
    console.log('All Products:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching all products:', error?.message || error);
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


export const getAllOrders = async () => {
    try {
        const response = await api.get('user/orders');
        return response.data;
    } catch (error: any) {
        console.error('Error fetching all orders:', error?.message || error);
        return [];
    }
};
// tạo combo
export const createComboWithProducts = async (comboData: any) => {
  try {
    const response = await api.post('admin/combos', comboData);
    console.log('Created Combo:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating combo:', error?.message || error);
    throw error;
  }
};

// Xóa combo theo id
export const deleteCombo = async (comboId: number) => {
  try {
    const response = await api.delete(`admin/combos/${comboId}`);
    console.log('Delete combo response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting combo:', error?.message || error);
    throw error;
  }
};

export const getOrdersByMemberId = async (memberId: number) => {
    try {
        const response = await api.get(`user/orders/member/${memberId}`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching orders by memberId:', error?.message || error);
        return [];
    }
};

