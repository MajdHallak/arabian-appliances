import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { categories, Product } from "../data/products";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useAuth } from "../lib/authContext";
import { deleteProduct, updateProduct } from "../lib/productsAPI";

type ProductDetailProps = {
  product: Product;
  onClose: () => void;
};

const ProductDetail = ({ product, onClose }: ProductDetailProps) => {
  const { user, isAdmin } = useAuth();
  const [dataForm, setDataForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    brand: product?.brand || "",
    category: product?.category || "",
  });

  const handleProductUpdate = async () => {
    try {
      // Validate form
      if (
        !dataForm.name ||
        !dataForm.description ||
        !dataForm.brand ||
        !dataForm.category
      ) {
        Alert.alert("Error", "Name and email are required");
        return;
      }

      await updateProduct(product.id, {
        name: dataForm.name,
        description: product?.description,
        brand: product?.brand,
        category: product?.category,
      });

      Alert.alert("Success", "Product updated successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="arrow-back" size={24} color="#0e78bb" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: product.image,
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.brandCategory}>
            <Text style={styles.brand}>{product.brand}</Text>
            <View style={styles.categoryContainer}>
              <Text style={styles.category}>{product.category}</Text>
            </View>
          </View>

          <Text style={styles.name}>{product.name}</Text>
          {/* <Text style={styles.price}>${product.price.toFixed(2)}</Text> */}

          <View style={styles.divider} />

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.divider} />

          {isAdmin && (
            <>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  updateProduct(product.id, {
                    name: "",
                    description: "",
                    brand: "",
                    category: "",
                  });
                  console.log("editProd", product.id);
                }}
              >
                <AntDesign name="plus" size={24} color="#fff" />
                <Text style={styles.editButtonText}>Edit {product.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  deleteProduct(product.id);
                  console.log("deleteProd", product.id);
                }}
              >
                <AntDesign name="delete" size={24} color="#fff" />
                <Text style={styles.deleteButtonText}>
                  delete {product.name}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    top: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    padding: 16,
  },
  brandCategory: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  brand: {
    fontSize: 14,
    color: "#666",
  },
  categoryContainer: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  category: {
    fontSize: 12,
    color: "#666",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0e78bb",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  addToCartButton: {
    backgroundColor: "#0e78bb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  addToCartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#1f1f33",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
  },

  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default ProductDetail;
