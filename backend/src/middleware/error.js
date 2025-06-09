import mongoose from "mongoose";
import logger from "../config/logger.js";
import AppError from "../utils/appError.js";

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || "error";

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(
      (val) => val.message
    );
    error = new AppError(messages.join(", "), 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value: ${field} with value '${value}'. Please use another value.`;
    error = new AppError(message, 400);
  }

  // Mongoose cast error (invalid ID)
  if (err instanceof mongoose.Error.CastError) {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token. Please log in again.", 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new AppError(
      "Your token has expired. Please log in again.",
      401
    );
  }

  // Development error response (detailed)
  if (process.env.NODE_ENV === "development") {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      error: err,
      stack: err.stack,
    });
  }

  // Production error response (clean)
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

export default errorHandler;
