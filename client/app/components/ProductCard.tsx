import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Product } from "../data/products";

type ProductCardProps = {
  product: Product;
  onPress: (product: Product) => void;
};

const ProductCard = ({ product, onPress }: ProductCardProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(product)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: product.image,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        {/* <Text style={styles.price}>${product.price.toFixed(2)}</Text> */}
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{product.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 160,
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    padding: 12,
  },
  brand: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    height: 40,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0e78bb",
    marginBottom: 8,
  },
  categoryContainer: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  category: {
    fontSize: 12,
    color: "#666",
  },
});

export default ProductCard;
