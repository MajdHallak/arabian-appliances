import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByBrand,
  getProductsByCategory,
} from "../controllers/productController.js";
import {
  protect,
  authorize,
  optionalAuth,
} from "../middleware/auth.js";

const router = express.Router();

// Public/optional auth routes
router.get("/featured", getFeaturedProducts);
router.get("/brand/:brandName", getProductsByBrand);
router.get("/category/:categoryName", getProductsByCategory);

// Public routes with optional authentication
router.get("/", optionalAuth, getAllProducts);
router.get("/:id", optionalAuth, getProductById);

// Admin only routes
router.use(protect, authorize("admin"));
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
