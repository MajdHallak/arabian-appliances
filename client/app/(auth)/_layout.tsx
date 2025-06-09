import { Tabs } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

import { useAuth } from "../lib/authContext";
import Entypo from "@expo/vector-icons/Entypo";
import { LogoutButton } from "../components/LogoutButton";

const TabsPage = () => {
  const { isSignedIn, isAdmin } = useAuth();

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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color="black" />
          ),
          tabBarLabel: "Products",
          headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />

      {/* Only show maintenance tab for regular users */}

      <Tabs.Screen
        name="maintenance"
        options={{
          headerTitle: "Maintenance",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="tools" size={size} color="black" />
          ),
          tabBarLabel: "Maintenance",
          headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user-circle-o" size={size} color="black" />
          ),
          tabBarLabel: "Profile",
          headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />
    </Tabs>
  );
};

export default TabsPage;
