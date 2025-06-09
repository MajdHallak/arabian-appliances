import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    // User Information
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
    // Product Information
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    serialNumber: {
      type: String,
      trim: true,
      maxlength: [50, "Serial number cannot exceed 50 characters"],
    },
    purchaseDate: {
      type: Date,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    // Issue Details
    issueDescription: {
      type: String,
      required: [true, "Issue description is required"],
      trim: true,
      maxlength: [1000, "Issue description cannot exceed 1000 characters"],
    },
    preferredDate: {
      type: Date,
    },

    // Service Management
    status: {
      type: String,
      enum: ["pending", "scheduled", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    assignedTechnician: {
      type: String,
      trim: true,
    },
    technicalNotes: {
      type: String,
      trim: true,
      maxlength: [1000, "Technical notes cannot exceed 1000 characters"],
    },
    appointmentDateTime: {
      type: Date,
    },
    resolutionSummary: {
      type: String,
      trim: true,
      maxlength: [1000, "Resolution summary cannot exceed 1000 characters"],
    },

    // Timestamps handled by schema options
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster queries
maintenanceSchema.index({ user: 1 });
maintenanceSchema.index({ email: 1 });
maintenanceSchema.index({ status: 1 });
maintenanceSchema.index({ appointmentDateTime: 1 });
maintenanceSchema.index({ createdAt: -1 });

// Virtual for formatted dates
maintenanceSchema.virtual("formattedSubmissionDate").get(function () {
  return this.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

maintenanceSchema.virtual("formattedAppointmentDate").get(function () {
  if (!this.appointmentDateTime) return "Not scheduled";

  return this.appointmentDateTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

export default Maintenance;
