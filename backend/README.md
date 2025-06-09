# Arabian Appliance Backend

This is the backend API for the Arabian Appliance mobile application, built with Node.js, Express, and MongoDB.

## Features

- **Modern JavaScript**: Uses ECMAScript Modules (ESM) throughout the codebase
- **MongoDB with Mongoose**: Structured data models with relationships
- **Authentication**: JWT-based authentication with refresh tokens
- **Role-Based Access Control**: Three types of users (guest, authenticated user, admin)
- **Product Management**: Hierarchical structure with brands, categories, and products
- **Maintenance Requests**: Service request submission and management
- **API Security**: Implemented with helmet, rate limiting, and proper error handling
- **Logging**: Structured logging with Winston

## Prerequisites

- Node.js 14.16.0 or higher
- MongoDB
- npm or yarn package manager

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd arabian-appliance/backend-new
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/arabian-appliance

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CORS_ORIGIN=*

# Admin User Configuration (for initial setup)
ADMIN_EMAIL=admin@aa.com
ADMIN_PASSWORD=123123
ADMIN_NAME=Administrator

# Logging Configuration
LOG_LEVEL=info
LOG_FILE_PATH=logs/app.log
```

## Usage

### Development

```bash
# Start development server with hot reload
npm run dev
```

### Production

```bash
# Start production server
npm start
```

### Seed Database

```bash
# Seed the database with initial data
npm run seed
```

## Server Management

The backend includes scripts for better server management:

```bash
# Start the server in a managed way
npm run server:start

# Check server status
npm run server:status

# Stop the server
npm run server:stop

# Restart the server
npm run server:restart

# View server logs
npm run server:logs
```

## Troubleshooting Port Conflicts

If you encounter an error related to port 5000 being in use, you can use these scripts:

```bash
# Kill any process using port 5000
npm run kill-port:5000

# Alternative method using kill-port package
npm run clear-port
```

The server will also automatically try to use port 5001 if 5000 is already in use.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh token
- `GET /api/auth/me` - Get current user (authenticated)
- `PUT /api/auth/update-password` - Update user password (authenticated)
- `PUT /api/auth/update-profile` - Update user profile (authenticated)

### Products

- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get product by ID (public)
- `GET /api/products/featured` - Get featured products (public)
- `GET /api/products/brand/:brandName` - Get products by brand (public)
- `GET /api/products/category/:categoryName` - Get products by category (public)
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Brands

- `GET /api/brands` - Get all brands (public)
- `GET /api/brands/:id` - Get brand by ID (public)
- `GET /api/brands/:id/categories` - Get brand with categories (public)
- `POST /api/brands` - Create a new brand (admin only)
- `PUT /api/brands/:id` - Update brand (admin only)
- `DELETE /api/brands/:id` - Delete brand (admin only)

### Categories

- `GET /api/categories` - Get all categories (public)
- `GET /api/categories/:id` - Get category by ID (public)
- `GET /api/categories/brand/:brandId` - Get categories by brand (public)
- `GET /api/categories/:id/products` - Get category with products (public)
- `POST /api/categories` - Create a new category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Maintenance Requests

- `POST /api/maintenance` - Create a new maintenance request (authenticated)
- `GET /api/maintenance/user` - Get user's maintenance requests (authenticated)
- `GET /api/maintenance/:id` - Get maintenance request by ID (authenticated or admin)
- `GET /api/maintenance` - Get all maintenance requests (admin only)
- `PUT /api/maintenance/:id/status` - Update request status (admin only)
- `PUT /api/maintenance/:id/resolution` - Add resolution summary (admin only)

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # API controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Entry point
├── logs/                 # Log files
├── .env                  # Environment variables
├── .env.example          # Example environment variables
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## Default Admin Account

The system is seeded with a default admin account:

- Email: admin@aa.com
- Password: 123123
