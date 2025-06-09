export type Product = {
  id: string;
  sku: string;
  name: string;
  brand: Brand;
  category: Category;
  price: number;
  image: string;
  description: string;
};

export type Brand =
  | "GL-General"
  | "Starway"
  | "GENERAL TECH"
  | "Hisense"
  | "Smart Electric";

export type Category =
  | "tv"
  | "clothes dryer"
  | "air curtains"
  | "kitchen appliances"
  | "refrigerator"
  | "iron"
  | "water dispenser"
  | "freezer"
  | "washing machine"
  | "oven";

export const brands: Brand[] = [
  "GL-General",
  "Starway",
  "GENERAL TECH",
  "Hisense",
  "Smart Electric",
];

export const categories: Category[] = [
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

export const products: Product[] = [
  {
    id: "1",
    sku: "askdpao",
    name: 'Smart 4K TV 55"',
    brand: "GL-General",
    category: "tv",
    price: 899.99,
    image:
      "https://backend.arabianco.com/Uploads/Attachments/c01be8b4-4874-4c3d-8e3a-21deca335f06_638746568475595195.png",
    description: "Ultra HD 4K Smart TV with HDR and built-in streaming apps.",
  },
  {
    id: "2",
    sku: "askdpao",
    name: "Automatic Clothes Dryer",
    brand: "Starway",
    category: "clothes dryer",
    price: 499.99,
    image:
      "https://backend.arabianco.com/Uploads/Attachments/fd088c0d-7d21-4cca-9335-32aa2625cc67_638746568888565552.png",
    description: "Energy-efficient clothes dryer with multiple drying modes.",
  },
  {
    id: "3",
    sku: "askdpao",
    name: "Commercial Air Curtain",
    brand: "GENERAL TECH",
    category: "air curtains",
    price: 349.99,
    image:
      "https://backend.arabianco.com/Uploads/Attachments/275ef573-4634-4409-b8fe-505785d932a6_638742371375916255.png",
    description: "Poweraul c for commercial entrances.",
  },
  {
    id: "4",
    sku: "askdpao",
    name: "French Door Refrigerator",
    brand: "Hisense",
    category: "refrigerator",
    price: 1299.99,
    image:
      "https://backend.arabianco.com/Uploads/Attachments/36e1449c-6661-42d1-95ea-ab8e99f85825_638726048110953960.png",
    description:
      "Spacious French door refrigerator with ice maker and water dispenser.",
  },
  {
    id: "5",
    sku: "askdpao",
    name: "Steam Iron",
    brand: "Smart Electric",
    category: "iron",
    price: 79.99,
    image:
      "https://backend.arabianco.com/Uploads/Attachments/9ad35da9-5b3d-4e0b-959b-108f5a82dd90_638741499647844014.png",
    description: "Advanced steam iron with ceramic soleplate.",
  },
  {
    id: "6",
    sku: "askdpao",
    name: "Hot & Cold Water Dispenser",
    brand: "GL-General",
    category: "water dispenser",
    price: 199.99,
    image:
      "https://backend.arabianco.com/Uploads/Attachments/9ad35da9-5b3d-4e0b-959b-108f5a82dd90_638741499647844014.png",
    description: "Elegant water dispenser with hot and cold water options.",
  },
  {
    id: "7",
    sku: "askdpao",
    name: "chest freezer 200l",
    brand: "Starway",
    category: "freezer",
    price: 549.99,
    image:
      "https://backend.arabianco.com/Uploads/Attachments/9ad35da9-5b3d-4e0b-959b-108f5a82dd90_638741499647844014.png",
    description: "Large capacity chest freezer with quick freeze function.",
  },
  {
    id: "8",
    sku: "askdpao",
    name: "Front Load Washing Machine",
    brand: "GENERAL TECH",
    category: "washing machine",
    price: 679.99,
    image:
      "https://backend.arabianco.com/Uploads/Attachments/9ad35da9-5b3d-4e0b-959b-108f5a82dd90_638741499647844014.png",
    description:
      "Energy-efficient front load washer with multiple wash programs.",
  },
  {
    id: "9",
    sku: "askdpao",
    name: "Electric Built-in Oven",
    brand: "Hisense",
    category: "oven",
    price: 449.99,
    image:
      "https://backend.arabianco.com/Uploads/Attachments/9ad35da9-5b3d-4e0b-959b-108f5a82dd90_638741499647844014.png",
    description:
      "Modern built-in electric oven with multiple cooking functions.",
  },
  {
    id: "10",
    sku: "askdpao",
    name: "Stand Mixer",
    brand: "Smart Electric",
    category: "kitchen appliances",
    price: 249.99,
    image:
      "https://backend.arabianco.com/Uploads/Attachments/9ad35da9-5b3d-4e0b-959b-108f5a82dd90_638741499647844014.png",
    description:
      "Powerful stand mixer with multiple attachments for various cooking tasks.",
  },
  {
    id: "11",
    sku: "askdpao",
    name: 'QLED 65" TV',
    brand: "Hisense",
    category: "tv",
    price: 1299.99,
    image:
      "https://backend.arabianco.com/Uploads/Attachments/9ad35da9-5b3d-4e0b-959b-108f5a82dd90_638741499647844014.png",
    description: "Premium QLED TV with stunning color and contrast.",
  },
  {
    id: "12",
    sku: "askdpao",
    name: "Compact Refrigerator",
    brand: "Starway",
    category: "refrigerator",
    price: 349.99,
    image:
      "https://backend.arabianco.com/Uploads/Attachments/9ad35da9-5b3d-4e0b-959b-108f5a82dd90_638741499647844014.png",
    description: "Compact refrigerator perfect for small spaces.",
  },
  {
    id: "13",
    sku: "askdpao",
    name: "Food Processor",
    brand: "GL-General",
    category: "kitchen appliances",
    price: 129.99,
    image: "processor1.jpg",
    description:
      "Versatile food processor with multiple blades and attachments.",
  },
  {
    id: "14",
    sku: "askdpao",
    name: "Top Load Washing Machine",
    brand: "Smart Electric",
    category: "washing machine",
    price: 499.99,
    image: "washer2.jpg",
    description: "Efficient top load washing machine with large capacity.",
  },
  {
    id: "15",
    sku: "askdpao",
    name: "Countertop Oven",
    brand: "GENERAL TECH",
    category: "oven",
    price: 179.99,
    image: "oven2.jpg",
    description:
      "Versatile countertop oven for baking, toasting, and roasting.",
  },
  {
    id: "16",
    sku: "askdpao",
    name: "Bottom Freezer Refrigerator",
    brand: "GL-General",
    category: "refrigerator",
    price: 899.99,
    image: "fridge3.jpg",
    description: "Energy-efficient refrigerator with bottom freezer design.",
  },
  {
    id: "17",
    sku: "askdpao",
    name: "Cordless Iron",
    brand: "GENERAL TECH",
    category: "iron",
    price: 99.99,
    image: "iron2.jpg",
    description: "Convenient cordless iron with quick heat-up.",
  },
  {
    id: "18",
    sku: "askdpao",
    name: "Upright Freezer",
    brand: "Hisense",
    category: "freezer",
    price: 699.99,
    image: "freezer2.jpg",
    description: "Spacious upright freezer with frost-free technology.",
  },
  {
    id: "19",
    sku: "askdpao",
    name: 'Smart TV 43"',
    brand: "Smart Electric",
    category: "tv",
    price: 499.99,
    image: "tv3.jpg",
    description: "Compact smart TV with excellent picture quality.",
  },
  {
    id: "20",
    sku: "askdpao",
    name: "Bottleless Water Dispenser",
    brand: "Starway",
    category: "water dispenser",
    price: 299.99,
    image: "waterdispenser2.jpg",
    description: "Modern bottleless water dispenser with filtration system.",
  },
];

// Helper function to get products by brand
export const getProductsByBrand = (brand: Brand): Product[] => {
  return products.filter((product) => product.brand === brand);
};

// Helper function to get products by category
export const getProductsByCategory = (category: Category): Product[] => {
  return products.filter((product) => product.category === category);
};

// Helper function to search products
export const searchProducts = (query: string): Product[] => {
  const lowerCaseQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.brand.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery) ||
      product.description.toLowerCase().includes(lowerCaseQuery)
  );
};
