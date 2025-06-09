import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { User, Product } from "../models/index.js";
import config from "../config/config.js";

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Connect to MongoDB
mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

// Brand and Category types that match products.ts
const brands = [
  "general plus",
  "gl-general",
  "starway",
  "general tech",
  "hisense",
  "smart electric",
  "general golden",
  "star vision",
];

const categories = [
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
];

// Sample products that match the structure in products.ts
const products = [
  {
    name: 'Smart 4K TV 55"',
    sku: "GL-TV-55-4K",
    brand: "gl-general",
    category: "tv",
    description: "Ultra HD 4K Smart TV with HDR and built-in streaming apps.",
    image:
      "https://backend.arabianco.com/Uploads/Attachments/c01be8b4-4874-4c3d-8e3a-21deca335f06_638746568475595195.png",
    inStock: true,
    featured: true,
  },
  {
    name: "Automatic Clothes Dryer",
    sku: "SW-CD-01",
    brand: "starway",
    category: "clothes dryer",
    description: "Energy-efficient clothes dryer with multiple drying modes.",
    image:
      "https://backend.arabianco.com/Uploads/Attachments/fd088c0d-7d21-4cca-9335-32aa2625cc67_638746568888565552.png",
    inStock: true,
    featured: false,
  },
  {
    name: "Commercial Air Curtain",
    sku: "GT-AC-01",
    brand: "general tech",
    category: "air curtains",
    description: "Powerful air curtain for commercial entrances.",
    image:
      "https://backend.arabianco.com/Uploads/Attachments/275ef573-4634-4409-b8fe-505785d932a6_638742371375916255.png",
    inStock: true,
    featured: false,
  },
  {
    name: "French Door Refrigerator",
    sku: "HS-RF-01",
    brand: "hisense",
    category: "refrigerator",
    description: "Spacious French door refrigerator with ice maker and water dispenser.",
    image:
      "https://backend.arabianco.com/Uploads/Attachments/36e1449c-6661-42d1-95ea-ab8e99f85825_638726048110953960.png",
    inStock: true,
    featured: true,
  },
  {
    name: "Steam Iron",
    sku: "SE-IR-01",
    brand: "smart electric",
    category: "iron",
    description: "Advanced steam iron with ceramic soleplate.",
    image:
      "https://backend.arabianco.com/Uploads/Attachments/9ad35da9-5b3d-4e0b-959b-108f5a82dd90_638741499647844014.png",
    inStock: true,
    featured: false,
  },
  {
    name: "Hot & Cold Water Dispenser",
    sku: "GL-WD-01",
    brand: "gl-general",
    category: "water dispenser",
    description: "Elegant water dispenser with hot and cold water options.",
    image:
      "https://backend.arabianco.com/Uploads/Attachments/9ad35da9-5b3d-4e0b-959b-108f5a82dd90_638741499647844014.png",
    inStock: true,
    featured: false,
  },
  {
    name: "Chest Freezer 200L",
    sku: "SW-FZ-01",
    brand: "starway",
    category: "freezer",
    description: "Large capacity chest freezer with quick freeze function.",
    image:
      "https://backend.arabianco.com/Uploads/Attachments/9ad35da9-5b3d-4e0b-959b-108f5a82dd90_638741499647844014.png",
    inStock: true,
    featured: true,
  },
];

// Seed data function
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    // await Brand.deleteMany({});
    // await Category.deleteMany({});
    await Product.deleteMany({});

    console.log("Cleared existing data");

    // Create admin user
    const adminPassword = await bcrypt.hash(config.admin.password, 10);
    const admin = await User.create({
      name: config.admin.name,
      email: config.admin.email,
      password: adminPassword,
      role: "admin",
    });

    const userPassword = await bcrypt.hash(config.admin.password, 10);
    const user = await User.create({
      name: config.user.name,
      email: config.user.email,
      password: userPassword,
      role: "user",
    });

    console.log("Created admin: ", admin.email);
    console.log("Created user: ", user.email);

    // Create brands as simple string values
    // const brandDocs = await Promise.all(
    //   brands.map(async (brandName) => {
    //     const brand = await Brand.create({ name: brandName });
    //     return brand;
    //   })
    // );
    // console.log(`Created ${brandDocs.length} brands`);

    // Create categories as simple string values
    // const categoryDocs = await Promise.all(
    //   categories.map(async (categoryName) => {
    //     const category = await Category.create({
    //       name: categoryName,
    //     });
    //     return category;
    //   })
    // );
    // console.log(`Created ${categoryDocs.length} categories`);

    // Create products with references to the brand and category strings
    const createdProducts = await Promise.all(
      products.map(async (product) => {
        // Find the brand document that matches the brand name
        // const brandDoc = brandDocs.find((doc) => doc.name === product.brand);
        // Find the category document that matches the category name
        // const categoryDoc = categoryDocs.find((doc) => doc.name === product.category);

        // if (!brandDoc || !categoryDoc) {
        //   console.log(`Could not find brand or category for product: ${product.name}`);
        //   return null;
        // }

        const newProduct = await Product.create({
          ...product,
          // brand: brandDoc._id,
          // category: categoryDoc._id,
        });
        return newProduct;
      })
    );

    // Filter out any nulls from the array
    const validProducts = createdProducts.filter((p) => p !== null);
    console.log(`Created ${validProducts.length} products`);

    console.log("Seed data created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

// Run seed function
seedData();
