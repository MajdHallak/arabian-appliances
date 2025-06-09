import { User } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config/config.js";

// Generate tokens and create send response
const createSendToken = (user, statusCode, res) => {
  // Generate JWT token
  const token = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    refreshToken,
    data: {
      user,
    },
  });
};

// Register a new user
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, address } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already in use", 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    address,
    role: "user", // Default role
  });

  createSendToken(user, 201, res);
});

// Login user
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // Check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || password === user.password) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // Send token
  createSendToken(user, 200, res);
});

// Refresh token
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError("Refresh token is required", 400));
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("User not found", 401));
    }

    // Generate new tokens
    createSendToken(user, 200, res);
  } catch (error) {
    return next(new AppError("Invalid refresh token", 401));
  }
});

// Get current user
export const getCurrentUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

// Update password
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError("Please provide current and new password", 400));
  }

  // Get user with password
  const user = await User.findById(req.user.id).select("+password");

  // Check if current password is correct
  if (!user.password === currentPassword) {
    return next(new AppError("Current password is incorrect", 401));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Log user in with new token
  createSendToken(user, 200, res);
});

// Update user profile
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, email, phone, address } = req.body;

  // Filter out unwanted fields
  const filteredBody = {
    name,
    email,
    phone,
    address,
  };

  // Remove undefined fields
  Object.keys(filteredBody).forEach((key) => {
    if (filteredBody[key] === undefined) {
      delete filteredBody[key];
    }
  });

  // Update user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
