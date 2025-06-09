// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   SafeAreaView,
// } from "react-native";
// import { Link, Stack, router } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { useAuth } from "../lib/authContext";

// export default function AdminDashboard() {
//   const { user } = useAuth();

//   return (
//     <SafeAreaView style={styles.container}>
//       <Stack.Screen
//         options={{
//           title: "Admin Dashboard",
//           headerStyle: { backgroundColor: "#0e78bb" },
//           headerTintColor: "#fff",
//         }}
//       />

//       <ScrollView style={styles.scrollView}>
//         <View style={styles.header}>
//           <Text style={styles.welcomeText}>
//             Welcome, {user?.name || "Admin"}
//           </Text>
//           <Text style={styles.subtitleText}>
//             Manage your Arabian Appliance store
//           </Text>
//         </View>

//         <View style={styles.menuContainer}>
//           <TouchableOpacity
//             style={styles.menuItem}
//             onPress={() => router.push("/(admin)/products")}
//           >
//             <View
//               style={[styles.iconContainer, { backgroundColor: "#3498db" }]}
//             >
//               <Ionicons name="cube-outline" size={28} color="#fff" />
//             </View>
//             <Text style={styles.menuItemText}>Manage Products</Text>
//             <Ionicons name="chevron-forward" size={20} color="#999" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.menuItem}
//             onPress={() => router.push("/(admin)/profile")}
//           >
//             <View
//               style={[styles.iconContainer, { backgroundColor: "#1abc9c" }]}
//             >
//               <Ionicons name="person-outline" size={28} color="#fff" />
//             </View>
//             <Text style={styles.menuItemText}>My Profile</Text>
//             <Ionicons name="chevron-forward" size={20} color="#999" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.menuItem}
//             onPress={() => {
//               router.navigate("/(auth)/maintenance");
//             }}
//           >
//             <View
//               style={[styles.iconContainer, { backgroundColor: "#e74c3c" }]}
//             >
//               <Ionicons name="construct-outline" size={28} color="#fff" />
//             </View>
//             <Text style={styles.menuItemText}>Maintenance Requests</Text>
//             <Ionicons name="chevron-forward" size={20} color="#999" />
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   header: {
//     padding: 24,
//     backgroundColor: "#0e78bb",
//   },
//   welcomeText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "white",
//     marginBottom: 8,
//   },
//   subtitleText: {
//     fontSize: 16,
//     color: "rgba(255, 255, 255, 0.8)",
//   },
//   menuContainer: {
//     padding: 16,
//     paddingTop: 24,
//   },
//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     backgroundColor: "white",
//     borderRadius: 8,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   iconContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 16,
//   },
//   menuItemText: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#333",
//   },
// });
