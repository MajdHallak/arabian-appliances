import express from "express";
import {
  createMaintenanceRequest,
  getAllMaintenanceRequests,
  getUserMaintenanceRequests,
  getMaintenanceRequestById,
  updateMaintenanceRequestStatus,
  addResolutionSummary,
} from "../controllers/maintenanceController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only routes
router.get("/", authorize("admin"), getAllMaintenanceRequests);
router.put(
  "/:id/status",
  authorize("admin"),
  updateMaintenanceRequestStatus
);
router.put(
  "/:id/resolution",
  authorize("admin"),
  addResolutionSummary
);

// User routes
router.post("/create", createMaintenanceRequest);
router.get("/user/:userId", getUserMaintenanceRequests);
router.get("/:id", getMaintenanceRequestById);

export default router;
