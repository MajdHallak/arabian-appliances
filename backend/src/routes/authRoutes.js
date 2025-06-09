import express from "express";
import {
  register,
  login,
  refreshToken,
  getCurrentUser,
  updatePassword,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// Protected routes
router.use(protect);
router.get("/me", getCurrentUser);
router.put("/update-password", updatePassword);
router.put("/update-profile", updateProfile);

export default router;
