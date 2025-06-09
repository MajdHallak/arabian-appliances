import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [50, "Product name cannot exceed 50 characters"],
    },
    sku: {
      type: String,
      sku: String,
      trim: true,
      maxlength: [20, "SKU cannot exceed 20 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    // price: {
    //   type: Number,
    //   // required: [true, "Price is required"],
    //   min: [0, "Price cannot be negative"],
    // },
    // warrantyYears: {
    //   type: Number,
    //   default: 0,
    //   min: [0, "Warranty years cannot be negative"],
    // },
    // warrantyMonths: {
    //   type: Number,
    //   default: 0,
    //   min: [0, "Warranty months cannot be negative"],
    //   max: [11, "Warranty months cannot exceed 11"],
    // },
    image: {
      type: String,
      default: "default-product.jpg",
    },
    brand: {
      type: String,
      enum: [
        "general plus",
        "gl-general",
        "starway",
        "general tech",
        "hisense",
        "smart electric",
        "general golden",
        "star vision",
      ],
      required: [true, "Brand is required for product"],
    },
    category: {
      type: String,
      enum: [
        "tv",
        "clothes dryer",
        "air curtains",
        "kitchen appliances",
        "refrigerator",
        "iron",
        "water dispenser",
        "freezer",
        "washing machine",
        "oven",
      ],
      required: [true, "Category is required for product"],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster queries
productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ name: "text", description: "text" });
productSchema.index({ featured: 1 });

// Virtual for warranty duration in months
productSchema.virtual("warrantyDuration").get(function () {
  return this.warrantyYears * 12 + this.warrantyMonths;
});

// Virtual for full warranty string (e.g., "2 years, 6 months")
productSchema.virtual("warrantyString").get(function () {
  let warranty = "";
  if (this.warrantyYears > 0) {
    warranty += `${this.warrantyYears} year${this.warrantyYears > 1 ? "s" : ""}`;
  }

  if (this.warrantyMonths > 0) {
    if (warranty.length > 0) warranty += ", ";
    warranty += `${this.warrantyMonths} month${this.warrantyMonths > 1 ? "s" : ""}`;
  }

  return warranty.length > 0 ? warranty : "No warranty";
});

// Virtual for formatted price

const Product = mongoose.model("Product", productSchema);

export default Product;
