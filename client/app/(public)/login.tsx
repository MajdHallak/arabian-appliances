import { Link } from "expo-router";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { useAuth } from "../lib/authContext";

const Login = () => {
  const { signIn } = useAuth();

  const [emailAddress, setEmailAddress] = useState("admin@aa.com");
  const [password, setPassword] = useState("123_majd_123");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!emailAddress || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      await signIn(emailAddress, password);
    } catch (err) {
      // Error is already handled in signIn function
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <Spinner visible={loading} />

      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/aa-logo-.png")}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Welcome Back</Text>

      <View style={styles.formContainer}>
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          value={emailAddress}
          onChangeText={setEmailAddress}
          style={styles.inputField}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.inputField}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={onSignInPress} style={styles.loginButton}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <Link href="/(public)/register" asChild>
            <TouchableOpacity style={styles.signupButton}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Link href="/(public)/guest-products" asChild>
          <TouchableOpacity style={styles.guestButton}>
            <Text style={styles.guestButtonText}>Continue as a guest</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(public)/reset" asChild>
          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 220,
    height: 220,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#0e78bb",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputField: {
    marginVertical: 10,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  loginButton: {
    flex: 1,
    backgroundColor: "#0e78bb",
    padding: 15,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  signupButton: {
    flex: 1,
    backgroundColor: "#ed2c29",
    padding: 15,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  guestButton: {
    backgroundColor: "transparent",
    padding: 15,
    marginTop: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  forgotPasswordButton: {
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  guestButtonText: {
    color: "#666",
    fontSize: 16,
  },
  forgotPasswordText: {
    color: "#0e78bb",
    fontSize: 14,
  },
});

export default Login;
