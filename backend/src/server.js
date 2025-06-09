import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";

// Import custom modules
import config from "./config/config.js";
import connectDB from "./config/db.js";
import logger from "./config/logger.js";
import errorHandler from "./middleware/error.js";
import AppError from "./utils/appError.js";
import killProcessAtPort from "./utils/killPort.js";

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Body parser middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (config.env === "development") {
  app.use(morgan("dev"));
}

// Rate limiting middleware
const limiter = rateLimit({
  max: 100, // Max requests per IP
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// CORS middleware
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Compression middleware
app.use(compression());

// Set global variables
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/maintenance", maintenanceRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is up and running",
    env: config.env,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/ping", (req, res) => {
  res.send("pong");
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Arabian Appliance API",
    version: "1.0.0",
  });
});

// 404 handler for undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(errorHandler);

// Helper function to start the server
const startServer = async (port, retryCount = 0) => {
  try {
    const server = app.listen(port, "0.0.0.0", () => {
      logger.info(`Server running in ${config.env} mode on port ${port}`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
      logger.error(err.name, err.message);

      // Graceful shutdown
      server.close(() => {
        process.exit(1);
      });
    });

    return server;
  } catch (err) {
    // If the port is already in use and we haven't retried too many times
    if (err.code === "EADDRINUSE" && retryCount < 3) {
      logger.warn(`Port ${port} is already in use.`);

      // Try to kill the process using the port
      try {
        const killed = await killProcessAtPort(port);
        if (killed) {
          logger.info(`Killed process using port ${port}, retrying...`);
          // Wait a bit for the port to be released
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return startServer(port, retryCount + 1);
        }
      } catch (killErr) {
        logger.error(`Failed to kill process: ${killErr.message}`);
      }

      // If we couldn't kill the process, try the next port
      const nextPort = port + 1;
      logger.info(`Trying port ${nextPort} instead`);
      return startServer(nextPort, 0);
    }

    // For other errors or if we've retried too many times
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

// Start the server
const PORT = parseInt(config.port, 10);
startServer(PORT);

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error(err);
  process.exit(1);
});

export default app;
