import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";

const Guest = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/aa-logo-.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Welcome to Arabian Appliance</Text>
      <Text style={styles.subtitle}>
        Browse our collection of premium home appliances from our top brands.
      </Text>

      <Link href="/(public)/guest-products" asChild>
        <TouchableOpacity style={styles.browseButton}>
          <Text style={styles.browseButtonText}>Browse Products</Text>
        </TouchableOpacity>
      </Link>

      <Text style={styles.loginText}>
        Already have an account?
        <Link href="/(public)/login" asChild>
          <Text style={styles.loginLink}> Log in</Text>
        </Link>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  logoContainer: {},
  logo: {
    width: 220,
    height: 220,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#0e78bb",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#666",
    paddingHorizontal: 20,
  },
  browseButton: {
    backgroundColor: "#0e78bb",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 24,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 16,
    color: "#666",
  },
  loginLink: {
    color: "#0e78bb",
    fontWeight: "bold",
  },
});

export default Guest;
