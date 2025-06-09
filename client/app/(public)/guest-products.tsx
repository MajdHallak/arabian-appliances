import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "@/app/components/ProductCard";
import FilterBar from "@/app/components/FilterBar";
import ProductDetail from "@/app/components/ProductDetail";
import SearchBar from "@/app/components/SearchBar";

import {
  Product,
  products,
  brands,
  categories,
  Brand,
  Category,
  getProductsByBrand,
  getProductsByCategory,
  searchProducts,
} from "../data/products";
import { Link, router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

import { useAuth } from "../lib/authContext";

const GuestProductsScreen = ({ backButton }) => {
  const { user, isSignedIn, isAdmin, signOut } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const [isAddProdVisible, setIsAddProdVisible] = useState(false);

  // Filter products based on search query, selected brand, and selected category
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply brand filter
    if (selectedBrand) {
      result = getProductsByBrand(selectedBrand);
    }

    // Apply category filter
    if (selectedCategory) {
      // If brand is also selected, filter from already filtered results
      if (selectedBrand) {
        result = result.filter(
          (product) => product.category === selectedCategory
        );
      } else {
        result = getProductsByCategory(selectedCategory);
      }
    }

    // Apply search filter
    if (searchQuery.trim().length > 0) {
      const searchResults = searchProducts(searchQuery);
      // Intersection of search results and filtered results
      result = result.filter((product) =>
        searchResults.some((searchProduct) => searchProduct.id === product.id)
      );
    }

    return result;
  }, [searchQuery, selectedBrand, selectedCategory]);

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailVisible(true);
  };

  const handleCloseDetail = () => {
    setIsDetailVisible(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleSearchSubmit = () => {
    // Already handled by the useMemo above
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Image
          source={require("../../assets/aa-logo--rm-bg.48.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Arabian Appliance</Text>
        <View style={{ flex: 1 }} />
        {/* <Link href={"/(public)/login"} asChild> */}
        <TouchableOpacity
          style={styles.login}
          onPress={() => {
            signOut();
          }}
        >
          <Text style={styles.backButton}>
            {isSignedIn ? "Logout" : "Login"}
          </Text>
        </TouchableOpacity>
        {/* </Link> */}
        <View style={{ flex: 0.3 }} />
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={handleSearchSubmit}
        onClear={handleClearSearch}
      />

      <FilterBar
        brands={brands}
        categories={categories}
        selectedBrand={selectedBrand}
        selectedCategory={selectedCategory}
        onSelectBrand={setSelectedBrand}
        onSelectCategory={setSelectedCategory}
      />

      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No products found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSelectedBrand(null);
              setSelectedCategory(null);
              setSearchQuery("");
            }}
          >
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={handleProductPress} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={isDetailVisible}
        animationType="slide"
        onRequestClose={handleCloseDetail}
      >
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={handleCloseDetail}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  logo: {
    width: 39,
    height: 30,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0e78bb",
  },
  login: {},
  backButton: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#e0e0e0",
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  resetButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#0e78bb",
    borderRadius: 8,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GuestProductsScreen;
