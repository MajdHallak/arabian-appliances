import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Configuration object
const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoose: {
    url: process.env.MONGODB_URI || "mongodb://localhost:27017/arabian-appliance",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@aa.com",
    password: process.env.ADMIN_PASSWORD || "123123",
    name: process.env.ADMIN_NAME || "Administrator",
  },
  user: {
    email: process.env.USER_EMAIL1 || "user@gmail.com",
    password: process.env.USER_PASSWORD1 || "123123",
    name: process.env.USERNAME1 || "Jack",
  },
  logs: {
    level: process.env.LOG_LEVEL || "info",
    filePath: process.env.LOG_FILE_PATH || "logs/app.log",
  },
};

export default config;
