import { Product } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";

// Helper function for pagination results
const createPaginationResults = (count, page, limit) => {
  const totalPages = Math.ceil(count / limit);

  return {
    count,
    totalPages,
    currentPage: page,
    resultsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

// Get all products with filtering and pagination
export const getAllProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build query based on query parameters
  const queryObj = { ...req.query };

  // Fields to exclude from filtering
  const excludedFields = ["page", "sort", "limit", "fields", "search"];
  excludedFields.forEach((field) => delete queryObj[field]);

  // Filtering - category, brand, price range, etc.
  let query = {};

  // Handle search query
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
    ];
  }

  // Handle featured flag
  if (queryObj.featured) {
    query.featured = queryObj.featured === "true";
    delete queryObj.featured;
  }

  // Handle in stock flag
  if (queryObj.inStock) {
    query.inStock = queryObj.inStock === "true";
    delete queryObj.inStock;
  }

  // Add remaining query params
  Object.assign(query, queryObj);

  // Always filter for active products
  query.active = true;

  // Build DB query
  let dbQuery = Product.find(query);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    dbQuery = dbQuery.sort(sortBy);
  } else {
    dbQuery = dbQuery.sort("-createdAt");
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    dbQuery = dbQuery.select(fields);
  }

  // Execute query with pagination
  const count = await Product.countDocuments(query);

  const products = await dbQuery.skip(skip).limit(limit);

  // Response
  res.status(200).json({
    status: "success",
    pagination: createPaginationResults(count, page, limit),
    data: products,
  });
});

// Get product by ID
export const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate([
    { path: "category", select: "name" },
    { path: "brand", select: "name" },
  ]);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
});

// Create a new product (admin only)
export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, sku, description, image, category, brand, inStock } = req.body;

  const existingSku = await Product.findOne({ sku });
  if (existingSku) {
    return next(new AppError("SKU already exists", 400));
  }

  // Create product
  const product = await Product.create({
    name,
    sku,
    description,
    image,
    category,
    brand,
    inStock: inStock !== undefined ? inStock : true,
    active: true,
  });

  res.status(201).json({
    status: "success",
    data: product,
  });
});

// Update product (admin only)
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, image, categoryId, brandId, inStock, featured, active } =
    req.body;

  // Find product
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Update fields
  product.name = name || product.name;
  product.description = description !== undefined ? description : product.description;
  product.price = price !== undefined ? price : product.price;
  product.image = image || product.image;
  product.category = categoryId || product.category;
  product.brand = brandId || product.brand;
  product.inStock = inStock !== undefined ? inStock : product.inStock;
  product.featured = featured !== undefined ? featured : product.featured;
  product.active = active !== undefined ? active : product.active;

  await product.save();

  res.status(200).json({
    status: "success",
    data: product,
  });
});

// Delete product (admin only)
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  await product.deleteOne();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Get featured products
export const getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 8;

  const products = await Product.find({
    featured: true,
    active: true,
  })
    .sort("-createdAt")
    .limit(limit)
    .populate([
      { path: "category", select: "name" },
      { path: "brand", select: "name" },
    ]);

  res.status(200).json({
    status: "success",
    count: products.length,
    data: products,
  });
});

// Get products by brand name
export const getProductsByBrand = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const brand = await Brand.findOne({ name: req.params.brandName });

  if (!brand) {
    return next(new AppError("Brand not found", 404));
  }

  // Find categories for this brand
  const categories = await Category.find({ brand: brand._id });
  const categoryIds = categories.map((cat) => cat._id);

  // Find products in these categories
  const count = await Product.countDocuments({
    category: { $in: categoryIds },
    active: true,
  });

  const products = await Product.find({
    category: { $in: categoryIds },
    active: true,
  })
    .skip(skip)
    .limit(limit)
    .sort(req.query.sort || "-createdAt")
    .populate([
      { path: "category", select: "name" },
      { path: "brand", select: "name" },
    ]);

  res.status(200).json({
    status: "success",
    pagination: createPaginationResults(count, page, limit),
    data: products,
  });
});

// Get products by category name
export const getProductsByCategory = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const category = await Category.findOne({
    name: req.params.categoryName,
  });

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  const count = await Product.countDocuments({
    category: category._id,
    active: true,
  });

  const products = await Product.find({
    category: category._id,
    active: true,
  })
    .skip(skip)
    .limit(limit)
    .sort(req.query.sort || "-createdAt")
    .populate([
      { path: "category", select: "name" },
      { path: "brand", select: "name" },
    ]);

  res.status(200).json({
    status: "success",
    pagination: createPaginationResults(count, page, limit),
    data: products,
  });
});
