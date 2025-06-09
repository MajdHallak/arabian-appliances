import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

// Import the types from your type definitions
import { Product, Brand, Category, brands, categories } from "../data/products";
import { createProduct } from "../lib/productsAPI";

interface ProductFormProps {
  initialProduct?: Partial<Product>;
}

// Custom dropdown component
interface DropdownProps<T> {
  label: string;
  options: T[];
  selectedValue: T;
  onSelect: (value: T) => void;
}

function Dropdown<T extends string>({
  label,
  options,
  selectedValue,
  onSelect,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.dropdownButtonText}>{selectedValue}</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>{`Select ${label}`}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    selectedValue === item && styles.selectedOption,
                  ]}
                  onPress={() => {
                    onSelect(item);
                    setIsOpen(false);
                  }}
                >
                  <Text
                    style={
                      selectedValue === item
                        ? styles.selectedOptionText
                        : styles.optionText
                    }
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
        <View style={{ height: 50, backgroundColor: "white" }} />
      </Modal>
    </View>
  );
}

const ProductForm: React.FC<ProductFormProps> = ({ initialProduct }) => {
  const [product, setProduct] = useState<Partial<Product>>({
    id: "",
    name: "",
    brand: "GL-General",
    category: "tv",
    image: "",
    description: "",
    ...initialProduct,
  });

  // Store multiple images
  const [images, setImages] = useState<string[]>(
    initialProduct?.image ? [initialProduct.image] : []
  );

  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>(
    {}
  );

  // Handle text input changes
  const handleChange = (key: keyof Product, value: any) => {
    setProduct({
      ...product,
      [key]: value,
    });

    // Clear error when field is edited
    if (errors[key]) {
      setErrors({
        ...errors,
        [key]: undefined,
      });
    }
  };

  // Handle multiple image selection
  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images, result.assets[0].uri];
      setImages(newImages);
      // Set the first image as the main product image
      handleChange("image", newImages[0]);
    }
  };

  // Remove an image from the list
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    handleChange("image", newImages.length > 0 ? newImages[0] : "");
  };

  // Validate the form before submission
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Product, string>> = {};

    if (!product.id) newErrors.id = "ID is required";
    if (!product.name) newErrors.name = "Name is required";
    // if (!product.description) newErrors.description = "Description is required";
    // if (!product.price || product.price <= 0)
    //   newErrors.price = "Valid price is required";
    // if (images.length === 0)
    //   newErrors.image = "At least one product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validate()) {
      // console.log(categoryId);
      console.log(product);
      createProduct(product as Product);
      setProduct({
        id: "",
        name: "",
        brand: "GL-General",
        category: "tv",
        image: "",
        description: "",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Product Information</Text>
        <View style={styles.hairline} />

        {/* ID Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product ID</Text>
          <TextInput
            style={[styles.input, errors.id && styles.inputError]}
            value={product.id}
            onChangeText={(value) => handleChange("id", value)}
            placeholder="Enter product ID"
          />
          {errors.id && <Text style={styles.errorText}>{errors.id}</Text>}
        </View>

        {/* SKU Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product SKU</Text>
          <TextInput
            style={[styles.input, errors.sku && styles.inputError]}
            value={product.sku}
            onChangeText={(value) => handleChange("sku", value)}
            placeholder="Enter product SKU"
          />
          {errors.sku && <Text style={styles.errorText}>{errors.sku}</Text>}
        </View>

        {/* Name Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={product.name}
            onChangeText={(value) => handleChange("name", value)}
            placeholder="Enter product name"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Brand Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Brand</Text>
          <Dropdown
            label="Brand"
            options={brands}
            selectedValue={product.brand as Brand}
            onSelect={(value) => handleChange("brand", value.toLowerCase())}
          />
        </View>

        {/* Category Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <Dropdown
            label="Category"
            options={categories}
            selectedValue={product.category as Category}
            onSelect={(value) => handleChange("category", value)}
          />
        </View>

        {/* Multiple Images */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Images</Text>

          {/* Image Grid */}
          <View style={styles.imageGrid}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeImageText}>x</Text>
                </TouchableOpacity>
                {index === 0 && (
                  <View style={styles.mainImageTag}>
                    <Text style={styles.mainImageText}>Main</Text>
                  </View>
                )}
              </View>
            ))}

            {/* Add Image Button */}
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={handleImagePick}
            >
              <Text style={styles.addImageText}>+</Text>
            </TouchableOpacity>
          </View>

          {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
        </View>

        {/* Description Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            value={product.description}
            onChangeText={(value) => handleChange("description", value)}
            placeholder="Enter product description"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    padding: 16,
    top: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",

    color: "#333",
  },
  hairline: {
    flex: 1,
    height: 1,
    marginTop: 14,
    marginBottom: 22,
    backgroundColor: "black",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
    color: "#555",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#dc3545",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    marginTop: 4,
  },
  dropdownButton: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 16,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedOption: {
    backgroundColor: "#e6f7ff",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOptionText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "500",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  imageContainer: {
    width: "33.33%",
    aspectRatio: 1,
    padding: 4,
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  removeImageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  mainImageTag: {
    position: "absolute",
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 4,
  },
  mainImageText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  addImageButton: {
    width: "33.33%",
    aspectRatio: 1,
    padding: 4,
  },
  addImageText: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    borderStyle: "dashed",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 32,
    color: "#aaa",
    backgroundColor: "#f9f9f9",
  },
  submitButton: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductForm;
