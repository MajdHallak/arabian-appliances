// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { Stack } from "expo-router";
// import { useAuth } from "../lib/authContext";
// import { Ionicons } from "@expo/vector-icons";
// import { apiRequest } from "../lib/api";
// import { SafeAreaView } from "react-native-safe-area-context";

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
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

// const AdminScreen = () => {
//   const { isAdmin } = useAuth();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [brands, setBrands] = useState<Brand[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProductId, setSelectedProductId] = useState<string | null>(
//     null
//   );

//   // Form state for adding/editing product
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     brandId: "",
//     categoryId: "",
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [showForm, setShowForm] = useState(false);

//   // Fetch products, brands, and categories
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const productsRes = await apiRequest("/products");
//       const brandsRes = await apiRequest("/brands");
//       const categoriesRes = await apiRequest("/categories");

//       setProducts(productsRes.data.products);
//       setBrands(brandsRes.data.brands);
//       setCategories(categoriesRes.data.categories);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       Alert.alert("Error", "Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isAdmin) {
//       fetchData();
//     }
//   }, [isAdmin]);

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       name: "",
//       description: "",
//       price: "",
//       brandId: "",
//       categoryId: "",
//     });
//     setIsEditing(false);
//     setSelectedProductId(null);
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     // Validate form
//     if (
//       !formData.name ||
//       !formData.description ||
//       !formData.price ||
//       !formData.brandId ||
//       !formData.categoryId
//     ) {
//       Alert.alert("Error", "Please fill in all fields");
//       return;
//     }

//     try {
//       if (isEditing && selectedProductId) {
//         // Update existing product
//         await apiRequest(`/products/${selectedProductId}`, "PATCH", {
//           name: formData.name,
//           description: formData.description,
//           price: parseFloat(formData.price),
//           brand: formData.brandId,
//           category: formData.categoryId,
//         });
//         Alert.alert("Success", "Product updated successfully");
//       } else {
//         // Add new product
//         await apiRequest("/products", "POST", {
//           name: formData.name,
//           description: formData.description,
//           price: parseFloat(formData.price),
//           brand: formData.brandId,
//           category: formData.categoryId,
//         });
//         Alert.alert("Success", "Product added successfully");
//       }

//       // Refresh data and reset form
//       fetchData();
//       setShowForm(false);
//       resetForm();
//     } catch (error) {
//       console.error("Error saving product:", error);
//       Alert.alert("Error", "Failed to save product");
//     }
//   };

//   // Edit product
//   const handleEdit = (product: Product) => {
//     setSelectedProductId(product._id);
//     setFormData({
//       name: product.name,
//       description: product.description,
//       price: product.price.toString(),
//       brandId: product.brand._id,
//       categoryId: product.category._id,
//     });
//     setIsEditing(true);
//     setShowForm(true);
//   };

//   // Delete product
//   const handleDelete = async (productId: string) => {
//     Alert.alert(
//       "Confirm Delete",
//       "Are you sure you want to delete this product?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await apiRequest(`/products/${productId}`, "DELETE");
//               fetchData();
//               Alert.alert("Success", "Product deleted successfully");
//             } catch (error) {
//               console.error("Error deleting product:", error);
//               Alert.alert("Error", "Failed to delete product");
//             }
//           },
//         },
//       ]
//     );
//   };

//   if (!isAdmin) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Access Denied</Text>
//         <Text>You do not have administrator privileges.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Stack.Screen
//         options={{
//           title: "Product Management",
//           headerStyle: { backgroundColor: "#0e78bb" },
//           headerTintColor: "#fff",
//         }}
//       />

//       {loading ? (
//         <ActivityIndicator size="large" color="#0e78bb" style={styles.loader} />
//       ) : (
//         <>
//           {!showForm ? (
//             <SafeAreaView>
//               <View style={styles.header}>
//                 <Text style={styles.title}>Product Management</Text>
//                 <TouchableOpacity
//                   style={styles.addButton}
//                   onPress={() => {
//                     resetForm();
//                     setShowForm(true);
//                   }}
//                 >
//                   <Text style={styles.addButtonText}>Add Product</Text>
//                 </TouchableOpacity>
//               </View>

//               <FlatList
//                 data={products}
//                 keyExtractor={(item) => item._id}
//                 renderItem={({ item }) => (
//                   <View style={styles.productCard}>
//                     <View style={styles.productInfo}>
//                       <Text style={styles.productName}>{item.name}</Text>
//                       <Text style={styles.productPrice}>
//                         ${item.price.toFixed(2)}
//                       </Text>
//                       <Text style={styles.productDetail}>
//                         Brand: {item.brand?.name || "N/A"}
//                       </Text>
//                       <Text style={styles.productDetail}>
//                         Category: {item.category?.name || "N/A"}
//                       </Text>
//                     </View>
//                     <View style={styles.productActions}>
//                       <TouchableOpacity
//                         style={styles.editButton}
//                         onPress={() => handleEdit(item)}
//                       >
//                         <Ionicons name="pencil" size={18} color="#fff" />
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         style={styles.deleteButton}
//                         onPress={() => handleDelete(item._id)}
//                       >
//                         <Ionicons name="trash" size={18} color="#fff" />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 )}
//               />
//             </SafeAreaView>
//           ) : (
//             <View style={styles.formContainer}>
//               <Text style={styles.formTitle}>
//                 {isEditing ? "Edit Product" : "Add New Product"}
//               </Text>

//               <TextInput
//                 style={styles.input}
//                 placeholder="Product Name"
//                 value={formData.name}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, name: text })
//                 }
//               />

//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 placeholder="Description"
//                 multiline
//                 numberOfLines={4}
//                 value={formData.description}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, description: text })
//                 }
//               />

//               <TextInput
//                 style={styles.input}
//                 placeholder="Price"
//                 keyboardType="numeric"
//                 value={formData.price}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, price: text })
//                 }
//               />

//               <View style={styles.pickerContainer}>
//                 <Text style={styles.pickerLabel}>Select Brand:</Text>
//                 <View style={styles.picker}>
//                   {brands.map((brand) => (
//                     <TouchableOpacity
//                       key={brand._id}
//                       style={[
//                         styles.pickerItem,
//                         formData.brandId === brand._id &&
//                           styles.pickerItemSelected,
//                       ]}
//                       onPress={() =>
//                         setFormData({ ...formData, brandId: brand._id })
//                       }
//                     >
//                       <Text
//                         style={[
//                           styles.pickerItemText,
//                           formData.brandId === brand._id &&
//                             styles.pickerItemTextSelected,
//                         ]}
//                       >
//                         {brand.name}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               <View style={styles.pickerContainer}>
//                 <Text style={styles.pickerLabel}>Select Category:</Text>
//                 <View style={styles.picker}>
//                   {categories.map((category) => (
//                     <TouchableOpacity
//                       key={category._id}
//                       style={[
//                         styles.pickerItem,
//                         formData.categoryId === category._id &&
//                           styles.pickerItemSelected,
//                       ]}
//                       onPress={() =>
//                         setFormData({ ...formData, categoryId: category._id })
//                       }
//                     >
//                       <Text
//                         style={[
//                           styles.pickerItemText,
//                           formData.categoryId === category._id &&
//                             styles.pickerItemTextSelected,
//                         ]}
//                       >
//                         {category.name}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               <View style={styles.formButtons}>
//                 <TouchableOpacity
//                   style={styles.cancelButton}
//                   onPress={() => {
//                     setShowForm(false);
//                     resetForm();
//                   }}
//                 >
//                   <Text style={styles.buttonText}>Cancel</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.submitButton}
//                   onPress={handleSubmit}
//                 >
//                   <Text style={styles.buttonText}>
//                     {isEditing ? "Update Product" : "Add Product"}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//     padding: 16,
//   },
//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 16,
//   },
//   addButton: {
//     backgroundColor: "#0e78bb",
//     padding: 8,
//     borderRadius: 6,
//   },
//   addButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   productCard: {
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 12,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   productInfo: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   productPrice: {
//     fontSize: 16,
//     color: "#0e78bb",
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   productDetail: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 2,
//   },
//   productActions: {
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingLeft: 8,
//   },
//   editButton: {
//     backgroundColor: "#ffb100",
//     padding: 8,
//     borderRadius: 6,
//     marginBottom: 8,
//   },
//   deleteButton: {
//     backgroundColor: "#ff4d4d",
//     padding: 8,
//     borderRadius: 6,
//   },
//   formContainer: {
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   formTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 16,
//     color: "#333",
//     textAlign: "center",
//   },
//   input: {
//     backgroundColor: "#f9f9f9",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16,
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: "top",
//   },
//   pickerContainer: {
//     marginBottom: 16,
//   },
//   pickerLabel: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: "#333",
//   },
//   picker: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   pickerItem: {
//     backgroundColor: "#f0f0f0",
//     padding: 8,
//     borderRadius: 4,
//     marginRight: 8,
//     marginBottom: 8,
//   },
//   pickerItemSelected: {
//     backgroundColor: "#0e78bb",
//   },
//   pickerItemText: {
//     color: "#333",
//   },
//   pickerItemTextSelected: {
//     color: "#fff",
//   },
//   formButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 16,
//   },
//   cancelButton: {
//     backgroundColor: "#ccc",
//     padding: 12,
//     borderRadius: 8,
//     flex: 1,
//     marginRight: 8,
//     alignItems: "center",
//   },
//   submitButton: {
//     backgroundColor: "#0e78bb",
//     padding: 12,
//     borderRadius: 8,
//     flex: 1,
//     marginLeft: 8,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

// export default AdminScreen;
