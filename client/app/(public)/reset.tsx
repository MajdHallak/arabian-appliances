import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { apiRequest } from "../lib/api";

const PwReset = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Request a password reset code by email
  const onRequestReset = async () => {
    if (!emailAddress.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await apiRequest(
        "/auth/forgot-password",
        "POST",
        { email: emailAddress },
        false
      );
      setSuccessfulCreation(true);
      Alert.alert("Success", "A reset code has been sent to your email");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  // Reset the password with the code and the new password
  const onReset = async () => {
    if (!code.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both code and new password");
      return;
    }

    setLoading(true);
    try {
      await apiRequest(
        "/auth/reset-password",
        "POST",
        { email: emailAddress, resetCode: code, newPassword: password },
        false
      );
      Alert.alert("Success", "Password reset successfully", [
        {
          text: "OK",
          onPress: () => router.replace("/(public)/login"),
        },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />

      <Text style={styles.title}>Reset Password</Text>

      {!successfulCreation ? (
        <>
          <TextInput
            autoCapitalize="none"
            placeholder="Enter your email address"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.inputField}
            keyboardType="email-address"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={onRequestReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Send Reset Email</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View>
            <TextInput
              value={code}
              placeholder="Enter reset code"
              style={styles.inputField}
              onChangeText={setCode}
            />
            <TextInput
              placeholder="Enter new password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.inputField}
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={onReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Set New Password</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#0e78bb",
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
  button: {
    backgroundColor: "#0e78bb",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#0e78bb",
    fontSize: 16,
  },
});

export default PwReset;
