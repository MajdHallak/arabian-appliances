import * as SecureStore from "expo-secure-store";

// Base URL for API
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5003/api";

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "user";
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  refreshToken: string;
  data: {
    user: User;
  };
}

// Token management
export const storeToken = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error("Error storing token:", error);
  }
};

export const getToken = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

export const removeToken = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

// API request helper
export const apiRequest = async (
  endpoint: string,
  method: string = "GET",
  data?: any,
  requiresAuth: boolean = true
) => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add auth token if required
    if (requiresAuth) {
      const token = await getToken("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        throw new Error("Authentication required");
      }
    }

    const config: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    const url = `${API_URL}${endpoint}`;
    console.log(`🌐 API Request: ${method} ${url}`);
    if (data) console.log(`📦 Request data:`, data);

    const response = await fetch(url, config);
    const responseData = await response.json();

    if (!response.ok) {
      console.error(`❌ API Error (${response.status}):`, responseData);
      throw new Error(responseData.message || "Something went wrong");
    }

    // console.log(`✅ API Response (${endpoint}):`, responseData);
    return responseData;
  } catch (error: any) {
    console.error(`API request error (${endpoint}):`, error);
    throw error;
  }
};

// Authentication endpoints
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}) => {
  return (await apiRequest(
    "/auth/register",
    "POST",
    userData,
    false
  )) as AuthResponse;
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  return (await apiRequest(
    "/auth/login",
    "POST",
    credentials,
    false
  )) as AuthResponse;
};

export const refreshAuthToken = async (refreshToken: string) => {
  return (await apiRequest(
    "/auth/refresh-token",
    "POST",
    { refreshToken },
    false
  )) as AuthResponse;
};

export const getCurrentUser = async () => {
  return (await apiRequest("/auth/me")) as {
    status: string;
    data: { user: User };
  };
};

export const updateUserProfile = async (userData: {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}) => {
  return (await apiRequest("/auth/update-profile", "PUT", userData)) as {
    status: string;
    data: { user: User };
  };
};

export const updatePassword = async (passwords: {
  currentPassword: string;
  newPassword: string;
}) => {
  return (await apiRequest(
    "/auth/update-password",
    "PUT",
    passwords
  )) as AuthResponse;
};

// Logout helper - clears tokens from storage
export const logout = async () => {
  await removeToken("token");
  await removeToken("refreshToken");
};
