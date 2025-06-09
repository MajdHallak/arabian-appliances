import React from "react";
import { Tabs } from "expo-router";
import { useAuth } from "../lib/authContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View, Text } from "react-native";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { LogoutButton } from "../components/LogoutButton";

// Checking if the user is authenticated and is an admin
const AdminLayout = () => {
  const { isLoaded, isSignedIn, isAdmin } = useAuth();

  // If auth isn't loaded yet, show loading indicator
  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0e78bb" />
        <Text style={{ marginTop: 10, color: "#666" }}>Loading...</Text>
      </View>
    );
  }

  // If the user isn't signed in, redirect to guest page
  if (!isSignedIn) {
    console.log(
      "Admin route: User not signed in, redirecting to guest products"
    );
    return <Redirect href="/(public)/guest-products" />;
  }

  // If the user is signed in but not an admin, redirect to user products
  if (!isAdmin) {
    console.log(
      "Admin route: User is not an admin, redirecting to user products"
    );
    return <Redirect href="/(auth)/products" />;
  }

  console.log("Admin route: User is an admin, showing admin content");

  // If the user is signed in and is an admin, show the admin routes

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0e78bb",
        },
        headerTintColor: "#fff",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="products"
        options={{
          headerTitle: "Products",
          tabBarIcon: ({ size }) => (
            <FontAwesome5 name="list" size={size} color="black" />
          ),
          tabBarLabel: "Products",
          headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ size }) => (
            <FontAwesome5 name="user" size={size} color="black" />
          ),
          tabBarLabel: "Profile",
          headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="add-product"
        options={{
          tabBarIcon: ({ size }) => (
            <MaterialIcons name="add" size={size} color="black" />
          ),
          tabBarLabel: "Add Product",
        }}
      />
    </Tabs>
  );
};

export default AdminLayout;
