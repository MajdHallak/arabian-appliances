import { Maintenance } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";

// Create a new maintenance request (authenticated users only)
export const createMaintenanceRequest = asyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    address,
    productName,
    serialNumber,
    purchaseDate,
    brand,
    category,
    issueDescription,
    preferredDate,
  } = req.body;

  // Create maintenance request
  const maintenanceRequest = await Maintenance.create({
    user: req.user._id,
    name,
    email,
    phone,
    address,
    productName,
    serialNumber,
    purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
    brand,
    category,
    issueDescription,
    preferredDate: preferredDate ? new Date(preferredDate) : undefined,
    status: "pending",
  });

  res.status(201).json({
    status: "success",
    data: maintenanceRequest,
  });
});

// Get all maintenance requests (admin only)
export const getAllMaintenanceRequests = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const queryObj = { ...req.query };

  // Fields to exclude from filtering
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((field) => delete queryObj[field]);

  // Advanced filtering - status, date range, etc.
  let query = {};

  // Filter by status
  if (queryObj.status) {
    query.status = queryObj.status;
    delete queryObj.status;
  }

  // Filter by date range
  if (queryObj.fromDate || queryObj.toDate) {
    query.createdAt = {};
    if (queryObj.fromDate) query.createdAt.$gte = new Date(queryObj.fromDate);
    if (queryObj.toDate) {
      const toDate = new Date(queryObj.toDate);
      toDate.setHours(23, 59, 59, 999);
      query.createdAt.$lte = toDate;
    }
    delete queryObj.fromDate;
    delete queryObj.toDate;
  }

  // Add remaining query params
  Object.assign(query, queryObj);

  // Count total requests
  const totalRequests = await Maintenance.countDocuments(query);

  // Execute query with pagination
  const requests = await Maintenance.find(query)
    .sort(req.query.sort || "-createdAt")
    .skip(skip)
    .limit(limit)
    .populate("user", "name email");

  // Pagination metadata
  const totalPages = Math.ceil(totalRequests / limit);

  res.status(200).json({
    status: "success",
    pagination: {
      count: totalRequests,
      totalPages,
      currentPage: page,
      resultsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    data: requests,
  });
});

// Get user's maintenance requests (for authenticated user)
export const getUserMaintenanceRequests = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Find requests for current user
  const query = { user: req.user._id };

  // Count total requests
  const totalRequests = await Maintenance.countDocuments(query);

  // Get requests with pagination
  const requests = await Maintenance.find(query).sort("-createdAt").skip(skip).limit(limit);

  // Pagination metadata
  const totalPages = Math.ceil(totalRequests / limit);

  res.status(200).json({
    status: "success",
    pagination: {
      count: totalRequests,
      totalPages,
      currentPage: page,
      resultsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    data: requests,
  });
});

// Get maintenance request by ID (admin or owner only)
export const getMaintenanceRequestById = asyncHandler(async (req, res, next) => {
  const request = await Maintenance.findById(req.params.id).populate("user", "name email");

  if (!request) {
    return next(
      new AppError("getMaintenanceRequestById ERROR, Maintenance request not found", 404)
    );
  }

  // Check if user is admin or request owner
  if (req.user.role !== "admin" && request.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You do not have permission to access this request", 403));
  }

  res.status(200).json({
    status: "success",
    data: request,
  });
});
// Get maintenance request by ID (admin or owner only)
// export const getMaintenanceRequestById = asyncHandler(
//   async (req, res, next) => {
//     const request = await Maintenance.findById(
//       req.params.id
//     ).populate("user", "name email");

//     if (!request) {
//       return next(new AppError("Maintenance request not found", 404));
//     }

//     // Check if user is admin or request owner
//     if (
//       req.user.role !== "admin" &&
//       request.user.toString() !== req.user._id.toString()
//     ) {
//       return next(
//         new AppError(
//           "You do not have permission to access this request",
//           403
//         )
//       );
//     }

//     res.status(200).json({
//       status: "success",
//       data: request,
//     });
//   }
// );

// Update maintenance request status (admin only)
export const updateMaintenanceRequestStatus = asyncHandler(async (req, res, next) => {
  const { status, technicalNotes, assignedTechnician, appointmentDateTime } = req.body;

  const request = await Maintenance.findById(req.params.id);

  if (!request) {
    return next(
      new AppError("updateMaintenanceRequestStatus ERROR, Maintenance request not found", 404)
    );
  }

  // Update fields
  if (status) request.status = status;
  if (technicalNotes !== undefined) request.technicalNotes = technicalNotes;
  if (assignedTechnician !== undefined) request.assignedTechnician = assignedTechnician;
  if (appointmentDateTime) request.appointmentDateTime = new Date(appointmentDateTime);

  // If status is completed, add completion date
  if (status === "completed" && request.status !== "completed") {
    request.completedAt = new Date();
  }

  await request.save();

  res.status(200).json({
    status: "success",
    data: request,
  });
});

// Add resolution summary to maintenance request (admin only)
export const addResolutionSummary = asyncHandler(async (req, res, next) => {
  const { resolutionSummary } = req.body;

  if (!resolutionSummary) {
    return next(new AppError("Resolution summary is required", 400));
  }

  const request = await Maintenance.findById(req.params.id);

  if (!request) {
    return next(new AppError("addResolutionSummary ERROR, Maintenance request not found", 404));
  }

  // Update resolution summary
  request.resolutionSummary = resolutionSummary;

  // If request is not completed yet, set status to completed
  if (request.status !== "completed") {
    request.status = "completed";
    request.completedAt = new Date();
  }

  await request.save();

  res.status(200).json({
    status: "success",
    data: request,
  });
});
