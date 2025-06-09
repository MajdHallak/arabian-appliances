import "../global.css";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./lib/authContext";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

// This function handles auth state and redirects
function RootLayoutNavigation() {
  const { isLoaded, isSignedIn, isAdmin } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // useEffect to handle navigation based on auth state changes
  useEffect(() => {
    if (!isLoaded) return;

    const inPublicGroup = segments[0] === "(public)";
    const inAuthGroup = segments[0] === "(auth)";
    const inAdminGroup = segments[0] === "(admin)";

    console.log("Auth state:", { isSignedIn, isAdmin, segments });

    if (isSignedIn) {
      // If user is signed in but in public route, redirect to appropriate route
      if (inPublicGroup) {
        if (isAdmin) {
          router.replace("/(admin)/products");
        } else {
          router.replace("/(auth)/products");
        }
      }
      // If admin in non-admin routes
      else if (isAdmin && !inAdminGroup && segments[0] !== undefined) {
        router.replace("/(admin)/products");
      }
      // If regular user in admin routes
      else if (!isAdmin && inAdminGroup) {
        router.replace("/(auth)/products");
      }
    } else {
      // If not signed in and trying to access protected routes
      if (!inPublicGroup && segments[0] !== undefined) {
        router.replace("/(public)/welcome-screen");
      }
    }
  }, [isSignedIn, isAdmin, isLoaded, segments]);

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}

// Root layout component
export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <RootLayoutNavigation />
    </AuthProvider>
  );
}
