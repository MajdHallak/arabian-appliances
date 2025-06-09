import React from "react";
import { Stack } from "expo-router";
import { useAuth } from "../lib/authContext";

const PublicLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();

  // Wait for auth to load before deciding
  if (!isLoaded) {
    return null; // Return null here since we already have loading indicators in other layouts
  }

  // If user is signed in and trying to access public routes, redirect to products
  // Uncomment this if you want to prevent authenticated users from seeing login/register screens
  // if (isSignedIn) {
  //   console.log("Public route: User is signed in, redirecting to products");
  //   return <Redirect href="/(auth)/products" />;
  // }

  console.log("Public route: Showing public content");

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0e78bb",
        },
        headerTintColor: "#fff",
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="welcome-screen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerTitle: "Create Account",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="guest-products"
        options={{
          headerTitle: "Products",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="reset"
        options={{
          headerTitle: "Reset Password",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default PublicLayout;
