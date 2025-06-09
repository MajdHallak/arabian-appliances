import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Brand, Category } from "../data/products";

type FilterBarProps = {
  brands: Brand[];
  categories: Category[];
  selectedBrand: Brand | null;
  selectedCategory: Category | null;
  onSelectBrand: (brand: Brand | null) => void;
  onSelectCategory: (category: Category | null) => void;
};

const FilterBar = ({
  brands,
  categories,
  selectedBrand,
  selectedCategory,
  onSelectBrand,
  onSelectCategory,
}: FilterBarProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.filterTitle}>Brands:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedBrand === null && styles.selectedChip,
          ]}
          onPress={() => onSelectBrand(null)}
        >
          <Text
            style={[
              styles.filterText,
              selectedBrand === null && styles.selectedText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {brands.map((brand) => (
          <TouchableOpacity
            key={brand}
            style={[
              styles.filterChip,
              selectedBrand === brand &&
                styles.selectedChip,
            ]}
            onPress={() => onSelectBrand(brand)}
          >
            <Text
              style={[
                styles.filterText,
                selectedBrand === brand &&
                  styles.selectedText,
              ]}
            >
              {brand}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.filterTitle}>Categories:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedCategory === null &&
              styles.selectedCategoryChip,
          ]}
          onPress={() => onSelectCategory(null)}
        >
          <Text
            style={[
              styles.filterText,
              selectedCategory === null &&
                styles.selectedText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterChip,
              selectedCategory === category &&
                styles.selectedCategoryChip,
            ]}
            onPress={() => onSelectCategory(category)}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === category &&
                  styles.selectedText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    marginBottom: 8,
    color: "#333",
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  filterChip: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedChip: {
    backgroundColor: "#0e78bb",
    borderColor: "#0e78bb",
  },
  selectedCategoryChip: {
    backgroundColor: "#ed2b29",
    borderColor: "#ed2b29",
  },
  filterText: {
    color: "#666",
    fontSize: 14,
  },
  selectedText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default FilterBar;
