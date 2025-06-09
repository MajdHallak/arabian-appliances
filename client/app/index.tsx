import { Redirect } from "expo-router";
import { useAuth } from "./lib/authContext";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isLoaded, isSignedIn, isAdmin } = useAuth();

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
      </View>
    );
  }

  // Redirect based on authentication state
  if (isSignedIn) {
    return isAdmin ? (
      <Redirect href="/(admin)/products" />
    ) : (
      <Redirect href="/(auth)/products" />
    );
  }

  // Not signed in - redirect to guest page
  return <Redirect href="/(public)/welcome-screen" />;
}
