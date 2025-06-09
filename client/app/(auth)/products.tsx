import React from "react";
import GuestProductsScreen from "../(public)/guest-products";

const logoutLogo = require("../../assets/logout-png.png");

const AdminProducts = () => {
  return <GuestProductsScreen backButton={logoutLogo} />;
};

export default AdminProducts;

// import React, { useState, useEffect, useMemo } from "react";
// import {
//   View,
//   StyleSheet,
//   FlatList,
//   Text,
//   Image,
//   Modal,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   ScrollView,
// } from "react-native";

// import { StatusBar } from "expo-status-bar";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import { Stack, router } from "expo-router";
// import { useAuth } from "../lib/authContext";
// import { apiRequest } from "../lib/api";

// // Component imports
// import SearchBar from "@/app/components/SearchBar";

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   image?: string;
//   brand: {
//     _id: string;
//     name: string;
//   };
//   category: {
//     _id: string;
//     name: string;
//   };
// }

// interface Brand {
//   _id: string;
//   name: string;
// }

// interface Category {
//   _id: string;
//   name: string;
// }

// const ProductsScreen = () => {
//   const { user, isAdmin } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [brands, setBrands] = useState<Brand[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [isDetailVisible, setIsDetailVisible] = useState(false);

//   // Fetch data from backend
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const productsRes = await apiRequest("/products");
//       const brandsRes = await apiRequest("/brands");
//       const categoriesRes = await apiRequest("/categories");

//       // Ensure data exists before setting state
//       setProducts(
//         Array.isArray(productsRes?.data?.products)
//           ? productsRes.data.products
//           : []
//       );
//       setBrands(
//         Array.isArray(brandsRes?.data?.brands) ? brandsRes.data.brands : []
//       );
//       setCategories(
//         Array.isArray(categoriesRes?.data?.categories)
//           ? categoriesRes.data.categories
//           : []
//       );
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       Alert.alert("Error", "Failed to load products");
//       // Set empty arrays on error to avoid undefined values
//       setProducts([]);
//       setBrands([]);
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Filter products based on search query, selected brand, and selected category
//   // Use useMemo to only recalculate when dependencies change
//   const filteredProducts = useMemo(() => {
//     // Make sure products is defined before filtering
//     if (!products || !Array.isArray(products)) return [];

//     return products.filter((product) => {
//       if (!product) return false;

//       // Check if the product matches the search query
//       if (
//         searchQuery &&
//         !product.name?.toLowerCase().includes(searchQuery.toLowerCase())
//       ) {
//         return false;
//       }

//       // Check if the product matches the selected brand
//       if (selectedBrand && product.brand?._id !== selectedBrand) {
//         return false;
//       }

//       // Check if the product matches the selected category
//       if (selectedCategory && product.category?._id !== selectedCategory) {
//         return false;
//       }

//       return true;
//     });
//   }, [products, searchQuery, selectedBrand, selectedCategory]);

//   const handleProductPress = (product: Product) => {
//     if (!product) return;
//     setSelectedProduct(product);
//     setIsDetailVisible(true);
//   };

//   const handleCloseDetail = () => {
//     setIsDetailVisible(false);
//     setSelectedProduct(null);
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//   };

//   const renderProductCard = ({ item }: { item: Product }) => {
//     if (!item) return null;

//     return (
//       <TouchableOpacity
//         style={styles.productCard}
//         onPress={() => handleProductPress(item)}
//       >
//         <View style={styles.productImageContainer}>
//           <Image
//             source={require("../../assets/aa-logo-.png")}
//             style={styles.productImage}
//             resizeMode="contain"
//           />
//         </View>
//         <View style={styles.productInfo}>
//           <Text style={styles.productName} numberOfLines={2}>
//             {item.name || "Unnamed Product"}
//           </Text>
//           <Text style={styles.productBrand}>
//             {item.brand?.name || "Unknown Brand"}
//           </Text>
//           <View style={styles.productBottomRow}>
//             <Text style={styles.productPrice}>
//               ${typeof item.price === "number" ? item.price.toFixed(2) : "0.00"}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Stack.Screen
//         options={{
//           title: "Products",
//           headerStyle: { backgroundColor: "#0e78bb" },
//           headerTintColor: "#fff",
//         }}
//       />
//       <StatusBar style="light" />

//       <SearchBar
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//         onSubmit={() => {}}
//         onClear={handleClearSearch}
//       />

//       <View style={styles.filterBar}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           <TouchableOpacity
//             style={[
//               styles.filterChip,
//               !selectedBrand && !selectedCategory && styles.filterChipSelected,
//             ]}
//             onPress={() => {
//               setSelectedBrand(null);
//               setSelectedCategory(null);
//             }}
//           >
//             <Text
//               style={[
//                 styles.filterChipText,
//                 !selectedBrand &&
//                   !selectedCategory &&
//                   styles.filterChipTextSelected,
//               ]}
//             >
//               All
//             </Text>
//           </TouchableOpacity>

//           {Array.isArray(brands) &&
//             brands.map(
//               (brand) =>
//                 brand && (
//                   <TouchableOpacity
//                     key={brand._id || Math.random().toString()}
//                     style={[
//                       styles.filterChip,
//                       selectedBrand === brand._id && styles.filterChipSelected,
//                     ]}
//                     onPress={() =>
//                       setSelectedBrand(
//                         selectedBrand === brand._id ? null : brand._id
//                       )
//                     }
//                   >
//                     <Text
//                       style={[
//                         styles.filterChipText,
//                         selectedBrand === brand._id &&
//                           styles.filterChipTextSelected,
//                       ]}
//                     >
//                       {brand.name || "Unknown"}
//                     </Text>
//                   </TouchableOpacity>
//                 )
//             )}

//           {Array.isArray(categories) &&
//             categories.map(
//               (category) =>
//                 category && (
//                   <TouchableOpacity
//                     key={category._id || Math.random().toString()}
//                     style={[
//                       styles.filterChip,
//                       selectedCategory === category._id &&
//                         styles.filterChipSelected,
//                     ]}
//                     onPress={() =>
//                       setSelectedCategory(
//                         selectedCategory === category._id ? null : category._id
//                       )
//                     }
//                   >
//                     <Text
//                       style={[
//                         styles.filterChipText,
//                         selectedCategory === category._id &&
//                           styles.filterChipTextSelected,
//                       ]}
//                     >
//                       {category.name || "Unknown"}
//                     </Text>
//                   </TouchableOpacity>
//                 )
//             )}
//         </ScrollView>
//       </View>

//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0e78bb" />
//         </View>
//       ) : filteredProducts.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="search-outline" size={64} color="#ccc" />
//           <Text style={styles.emptyText}>No products found</Text>
//           <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
//           <TouchableOpacity
//             style={styles.resetButton}
//             onPress={() => {
//               setSelectedBrand(null);
//               setSelectedCategory(null);
//               setSearchQuery("");
//             }}
//           >
//             <Text style={styles.resetButtonText}>Reset Filters</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredProducts}
//           renderItem={renderProductCard}
//           keyExtractor={(item) => item?._id || Math.random().toString()}
//           numColumns={2}
//           columnWrapperStyle={styles.columnWrapper}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//         />
//       )}

//       {isAdmin && (
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={() => router.push("/(admin)/products")}
//         >
//           <Ionicons name="add" size={24} color="white" />
//         </TouchableOpacity>
//       )}

//       <Modal
//         visible={isDetailVisible}
//         animationType="slide"
//         onRequestClose={handleCloseDetail}
//       >
//         {selectedProduct && (
//           <View style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <TouchableOpacity
//                 onPress={handleCloseDetail}
//                 style={styles.closeButton}
//               >
//                 <Ionicons name="close" size={28} color="#333" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.modalContent}>
//               <View style={styles.modalImageContainer}>
//                 <Image
//                   source={require("../../assets/aa-logo-.png")}
//                   style={styles.modalImage}
//                   resizeMode="contain"
//                 />
//               </View>

//               <View style={styles.modalProductInfo}>
//                 <Text style={styles.modalProductName}>
//                   {selectedProduct.name || "Unnamed Product"}
//                 </Text>
//                 <View style={styles.modalProductMeta}>
//                   <Text style={styles.modalProductBrand}>
//                     Brand: {selectedProduct.brand?.name || "Unknown Brand"}
//                   </Text>
//                   <Text style={styles.modalProductCategory}>
//                     Category:{" "}
//                     {selectedProduct.category?.name || "Unknown Category"}
//                   </Text>
//                 </View>
//                 <Text style={styles.modalProductPrice}>
//                   $
//                   {typeof selectedProduct.price === "number"
//                     ? selectedProduct.price.toFixed(2)
//                     : "0.00"}
//                 </Text>

//                 <View style={styles.divider} />

//                 <Text style={styles.descriptionTitle}>Description</Text>
//                 <Text style={styles.descriptionText}>
//                   {selectedProduct.description || "No description available"}
//                 </Text>
//               </View>
//             </ScrollView>
//           </View>
//         )}
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   filterBar: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   filterChip: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: "#f0f0f0",
//     borderRadius: 20,
//     marginRight: 8,
//   },
//   filterChipSelected: {
//     backgroundColor: "#0e78bb",
//   },
//   filterChipText: {
//     color: "#333",
//     fontWeight: "500",
//   },
//   filterChipTextSelected: {
//     color: "#fff",
//   },
//   columnWrapper: {
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//   },
//   listContent: {
//     paddingTop: 8,
//     paddingBottom: 24,
//   },
//   productCard: {
//     width: "48%",
//     backgroundColor: "white",
//     borderRadius: 12,
//     overflow: "hidden",
//     marginTop: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   productImageContainer: {
//     height: 140,
//     backgroundColor: "#f9f9f9",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   productImage: {
//     width: "80%",
//     height: "80%",
//   },
//   productInfo: {
//     padding: 12,
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: 4,
//     height: 40,
//   },
//   productBrand: {
//     fontSize: 12,
//     color: "#888",
//     marginBottom: 8,
//   },
//   productBottomRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   productPrice: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#0e78bb",
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 24,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//     marginTop: 16,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: "#666",
//     marginTop: 8,
//   },
//   resetButton: {
//     marginTop: 24,
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     backgroundColor: "#0e78bb",
//     borderRadius: 8,
//   },
//   resetButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   addButton: {
//     position: "absolute",
//     right: 24,
//     bottom: 24,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#0e78bb",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   modalHeader: {
//     padding: 16,
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   closeButton: {
//     padding: 4,
//   },
//   modalContent: {
//     flex: 1,
//   },
//   modalImageContainer: {
//     height: 300,
//     backgroundColor: "#f9f9f9",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalImage: {
//     width: "60%",
//     height: "60%",
//   },
//   modalProductInfo: {
//     padding: 24,
//   },
//   modalProductName: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 8,
//   },
//   modalProductMeta: {
//     marginBottom: 12,
//   },
//   modalProductBrand: {
//     fontSize: 16,
//     color: "#666",
//     marginBottom: 4,
//   },
//   modalProductCategory: {
//     fontSize: 16,
//     color: "#666",
//   },
//   modalProductPrice: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#0e78bb",
//     marginBottom: 16,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "#eee",
//     marginVertical: 16,
//   },
//   descriptionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 8,
//   },
//   descriptionText: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: "#555",
//   },
// });

// export default ProductsScreen;
