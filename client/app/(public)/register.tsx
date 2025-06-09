import {
  TouchableOpacity,
  TextInput,
  View,
  StyleSheet,
  Text,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { useState } from "react";
import { Stack, Link } from "expo-router";
import { useAuth } from "../lib/authContext";

const Register = () => {
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await signUp({
        name,
        email,
        password,
        phone: phone || undefined,
      });
    } catch (err) {
      // Error already handled in signUp function
      console.error("Registration error:", err);
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
      <Stack.Screen options={{ headerBackVisible: true }} />
      <Spinner visible={loading} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/aa-logo-.png")}
              style={styles.logo}
            />
          </View>

          <Text style={styles.title}>Create Account</Text>

          <View style={styles.formContainer}>
            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              style={styles.inputField}
            />
            <TextInput
              autoCapitalize="none"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.inputField}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Phone Number (Optional)"
              value={phone}
              onChangeText={setPhone}
              style={styles.inputField}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.inputField}
            />

            <TouchableOpacity
              onPress={onSignUpPress}
              style={styles.registerButton}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <Link href="/login" asChild>
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.buttonText}>Back to login</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/(public)/guest-products" asChild>
              <TouchableOpacity style={styles.guestButton}>
                <Text style={styles.guestButtonText}>Continue as a guest</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
    color: "#333",
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
    // flexDirection: "column",
    // justifyContent: "space-between",
    marginTop: 20,
  },
  registerButton: {
    backgroundColor: "#ed2c29",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#0e78bb",
    padding: 15,
    borderRadius: 8,

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
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  guestButtonText: {
    color: "#666",
    fontSize: 16,
  },
});

export default Register;
