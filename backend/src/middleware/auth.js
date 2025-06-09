import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import config from "../config/config.js";
import AppError from "../utils/appError.js";

// Protect routes - verify user is authenticated
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return next(
        new AppError("Authentication required. Please log in.", 401)
      );
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Find user
    const user = await User.findById(decoded.id);

    // Check if user exists
    if (!user) {
      return next(new AppError("User no longer exists.", 401));
    }

    // Grant access
    req.user = user;
    next();
  } catch (error) {
    // If token is expired or invalid
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(
        new AppError(
          "Authentication invalid or expired. Please log in again.",
          401
        )
      );
    }

    return next(error);
  }
};

// Authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action.",
          403
        )
      );
    }

    next();
  };
};

// Set user if exists (optional auth for public routes)
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token, continue as guest
    if (!token) {
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Find user
    const user = await User.findById(decoded.id);

    // Set user or null
    req.user = user || null;
    next();
  } catch (error) {
    // If token verification fails, continue as guest
    req.user = null;
    next();
  }
};
