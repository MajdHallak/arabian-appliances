import { Alert } from "react-native";
import { apiRequest } from "./api";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  brand: {
    _id: string;
    name: string;
  };
  category: {
    _id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  _id: string;
  name: string;
}

export interface Category {
  _id: string;
  name: string;
}

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await apiRequest("/products");
    return response.data?.products || response.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get single product by ID
export const getProductById = async (productId: string) => {
  try {
    const response = await apiRequest(`/products/${productId}`);
    return response.data?.product || response.product || null;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    throw error;
  }
};

// Create new product (admin only)
export const createProduct = async (productData: {
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
}) => {
  try {
    const response = await apiRequest("/products", "POST", productData);
    return response.data?.product || response.product || null;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update product (admin only)
export const updateProduct = async (
  productId: string,
  productData: {
    name?: string;
    description?: string;
    brand?: string;
    category?: string;
  }
) => {
  try {
    const response = await apiRequest(
      `/products/${productId}`,
      "PUT",
      productData
    );
    return response.data?.product || response.product || null;
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error;
  }
};

// Delete product (admin only)
export const deleteProduct = async (productId: string) => {
  try {
    const response = await apiRequest(`/products/${productId}`, "DELETE");
    return response;
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    Alert.alert("error deleting product ", productId);
    throw error;
  }
};

// Get all brands
export const getAllBrands = async () => {
  try {
    const response = await apiRequest("/brands");
    return response.data?.brands || response.brands || [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await apiRequest("/categories");
    return response.data?.categories || response.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
