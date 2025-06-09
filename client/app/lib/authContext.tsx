import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";

import {
  User,
  AuthResponse,
  loginUser,
  registerUser,
  getCurrentUser,
  refreshAuthToken,
  storeToken,
  getToken,
  logout as logoutAPI,
} from "./api";
import { router } from "expo-router";

// Define the context type
interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoaded: false,
  isSignedIn: false,
  isAdmin: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  refreshSession: async () => false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Helper function to handle successful authentication
  const handleAuth = async (response: AuthResponse) => {
    const { token, refreshToken, data } = response;

    // Store tokens
    await storeToken("token", token);
    await storeToken("refreshToken", refreshToken);

    // Set user
    setUser(data.user);
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const response = await loginUser({ email, password });
      await handleAuth(response);
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Invalid credentials");
      throw error;
    }
  };

  // Register a new user
  const signUp = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => {
    try {
      const response = await registerUser(userData);
      await handleAuth(response);
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.message || "Could not create account"
      );
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await logoutAPI();
      setUser(null);
      router.navigate("/(public)/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Refresh session using refresh token
  const refreshSession = async (): Promise<boolean> => {
    try {
      const refreshTokenValue = await getToken("refreshToken");
      if (!refreshTokenValue) return false;

      const response = await refreshAuthToken(refreshTokenValue);
      await handleAuth(response);
      return true;
    } catch (error) {
      console.error("Failed to refresh session:", error);
      return false;
    }
  };

  // Load user session on app start
  useEffect(() => {
    const loadSession = async () => {
      try {
        // Check for existing token
        const token = await getToken("token");

        if (token) {
          // Try to get current user
          try {
            const { data } = await getCurrentUser();
            setUser(data.user);
          } catch (error) {
            // If token is invalid, try to refresh
            const refreshed = await refreshSession();
            if (!refreshed) {
              // If refresh fails, clear tokens
              await logoutAPI();
            }
          }
        }
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSession();
  }, []);

  const value = {
    user,
    isLoaded,
    isSignedIn: !!user,
    isAdmin: user?.role === "admin",
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
