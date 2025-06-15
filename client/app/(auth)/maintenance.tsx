import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Modal,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useAuth } from "../lib/authContext";
import { apiRequest } from "../lib/api";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getUserMaintenanceRequests,
  createMaintenanceRequest,
  MaintenanceRequest as MaintenanceRequestType,
} from "../lib/maintenanceAPI";
import { brands, categories } from "../data/products";

// Removed Brand and Category interfaces since they're imported from productsAPI

// Updated MaintenanceRequest interface to reference imported type
interface MaintenanceRequest extends MaintenanceRequestType {}

const MaintenanceScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [myRequests, setMyRequests] = useState<MaintenanceRequest[]>([]);
  const [showRequests, setShowRequests] = useState(false);
  const [selected, setSelected] = useState("");

  // Modal state instead of inline pickers
  const [brandModalVisible, setBrandModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Status options matching the MaintenanceRequest interface
  const data = [
    "pending",
    "scheduled",
    "in-progress",
    "completed",
    "cancelled",
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    productName: "",
    serialNumber: "",
    purchaseDate: new Date(),
    brand: "",
    brandName: "",
    category: "",
    categoryName: "",
    issueDescription: "",
    preferredDate: new Date(),
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch brands, categories, and user's existing maintenance requests
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!user?._id) return;
        const maintenanceRequests = await getUserMaintenanceRequests(user._id);
        setMyRequests(maintenanceRequests);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.productName.trim())
      newErrors.productName = "Product name is required";
    if (!formData.brand) newErrors.brand = "Brand selection is required";
    if (!formData.category)
      newErrors.category = "Category selection is required";
    if (!formData.issueDescription.trim())
      newErrors.issueDescription = "Issue description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setSubmitting(true);

      try {
        await createMaintenanceRequest({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          productName: formData.productName,
          serialNumber: formData.serialNumber,
          purchaseDate: formData.purchaseDate.toISOString(),
          brand: formData.brandName,
          category: formData.categoryName,
          issueDescription: formData.issueDescription,
          preferredDate: formData.preferredDate.toISOString(),
          product: formData.brand, // This is actually the product ID, badly named in the form state
        });

        Alert.alert(
          "Request Submitted",
          "Your maintenance request has been submitted successfully. Our team will contact you shortly.",
          [
            {
              text: "OK",
              onPress: () => {
                // Refresh user's maintenance requests
                if (user?._id) {
                  fetchUserRequests(user._id);
                }
                // Reset form (except for user details)
                setFormData({
                  ...formData,
                  productName: "",
                  serialNumber: "",
                  purchaseDate: new Date(),
                  brand: "",
                  brandName: "",
                  category: "",
                  categoryName: "",
                  issueDescription: "",
                  preferredDate: new Date(),
                });
                // Show the user's requests
                setShowRequests(true);
              },
            },
          ]
        );
      } catch (error) {
        console.error("Submission error:", error);
        Alert.alert(
          "Submission Error",
          "There was a problem submitting your request. Please try again.",
          [{ text: "OK" }]
        );
      } finally {
        setSubmitting(false);
      }
    } else {
      Alert.alert("Form Incomplete", "Please fill in all required fields.", [
        { text: "OK" },
      ]);
    }
  };

  const fetchUserRequests = async (userId: string) => {
    try {
      const maintenanceRequests = await getUserMaintenanceRequests(userId);
      setMyRequests(maintenanceRequests);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#ff9900";
      case "scheduled":
        return "#3498db";
      case "in-progress":
        return "#9b59b6";
      case "completed":
        return "#2ecc71";
      case "cancelled":
        return "#e74c3c";
      default:
        return "#7f8c8d";
    }
  };

  // Add the updateMaintenanceRequestStatus function
  const updateMaintenanceRequestStatus = async (
    requestId: string,
    status: string
  ) => {
    try {
      const response = await apiRequest(
        `/maintenance/${requestId}/status`,
        "PUT",
        { status }
      );
      return response;
    } catch (error) {
      console.error("Error updating maintenance request status:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0e78bb" />
      </View>
    );
  }

  // Render the form content
  const renderFormContent = () => (
    <ScrollView>
      <View style={styles.header}>
        <Ionicons name="construct-outline" size={32} color="#0e78bb" />
        <Text style={styles.title}>Maintenance Request</Text>
      </View>

      <Text style={styles.sectionTitle}>Contact Information</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name*</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter your full name"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email Address*</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Enter your email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number*</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Address*</Text>
        <TextInput
          style={[styles.input, errors.address && styles.inputError]}
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          placeholder="Enter your address"
          multiline
          numberOfLines={2}
        />
        {errors.address && (
          <Text style={styles.errorText}>{errors.address}</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Product Information</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Product Name*</Text>
        <TextInput
          style={[styles.input, errors.productName && styles.inputError]}
          value={formData.productName}
          onChangeText={(text) =>
            setFormData({ ...formData, productName: text })
          }
          placeholder="Enter product name"
        />
        {errors.productName && (
          <Text style={styles.errorText}>{errors.productName}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Serial Number (Optional)</Text>
        <TextInput
          style={styles.input}
          value={formData.serialNumber}
          onChangeText={(text) =>
            setFormData({ ...formData, serialNumber: text })
          }
          placeholder="Enter serial number"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Brand*</Text>
        <TouchableOpacity
          style={[styles.selector, errors.brand && styles.inputError]}
          onPress={() => setBrandModalVisible(true)}
        >
          <Text
            style={
              formData.brandName
                ? styles.selectorText
                : styles.selectorPlaceholder
            }
          >
            {formData.brandName || "Select a brand"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
        {errors.brand && <Text style={styles.errorText}>{errors.brand}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Category*</Text>
        <TouchableOpacity
          style={[styles.selector, errors.category && styles.inputError]}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text
            style={
              formData.categoryName
                ? styles.selectorText
                : styles.selectorPlaceholder
            }
          >
            {formData.categoryName || "Select a category"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
        {errors.category && (
          <Text style={styles.errorText}>{errors.category}</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Service Details</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Issue Description*</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            errors.issueDescription && styles.inputError,
          ]}
          value={formData.issueDescription}
          onChangeText={(text) =>
            setFormData({ ...formData, issueDescription: text })
          }
          placeholder="Describe the issue with your appliance"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        {errors.issueDescription && (
          <Text style={styles.errorText}>{errors.issueDescription}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Preferred Service Date</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.selectorText}>
            {formData.preferredDate.toLocaleDateString()}
          </Text>
          <Ionicons name="calendar" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={formData.preferredDate}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setFormData({ ...formData, preferredDate: selectedDate });
            }
          }}
        />
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Request</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Stack.Screen
          options={{
            title: "Maintenance",
            headerStyle: { backgroundColor: "#0e78bb" },
            headerTintColor: "#fff",
          }}
        />

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, !showRequests && styles.activeTab]}
            onPress={() => {
              setShowRequests(false);
              console.log(myRequests);
            }}
          >
            <Text
              style={[styles.tabText, !showRequests && styles.activeTabText]}
            >
              New Request
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, showRequests && styles.activeTab]}
            onPress={() => setShowRequests(true)}
          >
            <Text
              style={[styles.tabText, showRequests && styles.activeTabText]}
            >
              My Requests
            </Text>
          </TouchableOpacity>
        </View>

        {showRequests ? (
          <View style={styles.requestsContainer}>
            {myRequests.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="construct-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>No maintenance requests</Text>
                <Text style={styles.emptySubtext}>
                  Submit a request to get service for your appliance
                </Text>
                <TouchableOpacity
                  style={styles.newRequestButton}
                  onPress={() => setShowRequests(false)}
                >
                  <Text style={styles.newRequestButtonText}>New Request</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={myRequests}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.requestCard}>
                    <View style={styles.requestHeader}>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(item.status) },
                        ]}
                      >
                        <Text style={styles.statusText}>{item.status}</Text>
                      </View>
                      <Text style={styles.requestDate}>
                        {formatDate(item.createdAt)}
                      </Text>
                    </View>

                    <View style={styles.requestDetails}>
                      <Text style={styles.requestProductName}>
                        {item.productName}
                      </Text>
                      <Text style={styles.requestDetail}>
                        Brand: {item.brand}
                      </Text>
                      <Text style={styles.requestDetail}>
                        Category: {item.category}
                      </Text>
                      <Text style={styles.requestDescription} numberOfLines={2}>
                        {item.issueDescription}
                      </Text>
                    </View>

                    {item.appointmentDateTime && (
                      <View style={styles.appointmentContainer}>
                        <Ionicons name="calendar" size={16} color="#666" />
                        <Text style={styles.appointmentText}>
                          Appointment: {formatDate(item.appointmentDateTime)}
                        </Text>
                      </View>
                    )}

                    {item.resolutionSummary && (
                      <View style={styles.resolutionContainer}>
                        <Text style={styles.resolutionTitle}>Resolution:</Text>
                        <Text style={styles.resolutionText}>
                          {item.resolutionSummary}
                        </Text>
                      </View>
                    )}
                    <SelectList
                      setSelected={(val) => {
                        setSelected(val);
                        // Update the status when a new value is selected
                        updateMaintenanceRequestStatus(item._id, val)
                          .then(() => {
                            // Refresh the requests list after successful update
                            if (user?._id) {
                              fetchUserRequests(user._id);
                            }
                          })
                          .catch((error) => {
                            Alert.alert(
                              "Update Failed",
                              "Failed to update the status. Please try again.",
                              [{ text: "OK" }]
                            );
                          });
                      }}
                      data={data}
                      placeholder="Status"
                      save="value"
                    />
                  </View>
                )}
                contentContainerStyle={styles.requestsList}
              />
            )}
          </View>
        ) : (
          renderFormContent()
        )}

        {/* Brand Modal */}
        <Modal
          visible={brandModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setBrandModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Brand</Text>
                <TouchableOpacity onPress={() => setBrandModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={brands}
                keyExtractor={(item, index) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickerItem}
                    onPress={() => {
                      setFormData({
                        ...formData,
                        brand: item,
                        brandName: item,
                      });
                      setBrandModalVisible(false);
                    }}
                  >
                    <Text style={styles.pickerItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
                style={styles.pickerList}
              />
            </View>
          </View>
        </Modal>

        {/* Category Modal */}
        <Modal
          visible={categoryModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setCategoryModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Category</Text>
                <TouchableOpacity
                  onPress={() => setCategoryModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={categories}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickerItem}
                    onPress={() => {
                      setFormData({
                        ...formData,
                        category: item,
                        categoryName: item,
                      });
                      setCategoryModalVisible(false);
                    }}
                  >
                    <Text style={styles.pickerItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
                style={styles.pickerList}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#0e78bb",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  activeTabText: {
    color: "#0e78bb",
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0e78bb",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  formGroup: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginTop: 4,
  },
  selector: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorText: {
    fontSize: 16,
    color: "#333",
  },
  selectorPlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  pickerList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  pickerItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#0e78bb",
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 24,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  requestsContainer: {
    flex: 1,
  },
  requestsList: {
    padding: 16,
    flexGrow: 1,
  },
  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  requestDate: {
    fontSize: 14,
    color: "#666",
  },
  requestDetails: {
    marginBottom: 12,
  },
  requestProductName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  requestDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  requestDescription: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
  },
  appointmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    padding: 10,
    borderRadius: 6,
    marginTop: 12,
  },
  appointmentText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  resolutionContainer: {
    backgroundColor: "#f0f9ff",
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
  },
  resolutionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  resolutionText: {
    fontSize: 14,
    color: "#333",
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
    textAlign: "center",
  },
  newRequestButton: {
    backgroundColor: "#0e78bb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 24,
  },
  newRequestButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MaintenanceScreen;
