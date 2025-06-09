import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../lib/authContext";
import { router, useRouter } from "expo-router";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onClear: () => void;
};

const SearchBar = (
  { value, onChangeText, onSubmit, onClear }: SearchBarProps,
  isAddProdVisible?
) => {
  const { isAdmin } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          // clearButtonMode="while-editing"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      {isAdmin && (
        <TouchableOpacity
          style={styles.addProductButton}
          onPress={() => {
            router.navigate("/(admin)/add-product");
            console.log("Add products");
          }}
        >
          <Text>Add Product</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    flex: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },

  addProductButton: {
    backgroundColor: "#f2f2f2",
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderWidth: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 12,
    flex: 0.3,
  },

  clearButton: {
    padding: 4,
  },
});

export default SearchBar;
