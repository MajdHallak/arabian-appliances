import { apiRequest } from "./api";

export interface MaintenanceRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  productName: string;
  serialNumber?: string;
  purchaseDate: string;
  brand: string;
  category: string;
  issueDescription: string;
  preferredDate: string;
  product?: string;
  status: "pending" | "scheduled" | "in-progress" | "completed" | "cancelled";
  appointmentDateTime?: string;
  resolutionSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequestInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  productName: string;
  serialNumber?: string;
  purchaseDate: string;
  brand: string;
  category: string;
  issueDescription: string;
  preferredDate: string;
  product?: string;
}

// Get all maintenance requests (admin only)
export const getAllMaintenanceRequests = async () => {
  try {
    const response = await apiRequest("/maintenance");
    return (
      response.data?.maintenanceRequests || response.maintenanceRequests || []
    );
  } catch (error) {
    console.error("Error fetching maintenance requests:", error);
    throw error;
  }
};

// Get current user's maintenance requests
export const getUserMaintenanceRequests = async (userId: string) => {
  try {
    const response = await apiRequest(`/maintenance/user/${userId}`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching user maintenance requests:", error);
    throw error;
  }
};

// Get a single maintenance request by ID
export const getMaintenanceRequestById = async (requestId: string) => {
  try {
    const response = await apiRequest(`/maintenance/${requestId}`);
    return response.data || null;
  } catch (error) {
    console.error(`Error fetching maintenance request ${requestId}:`, error);
    throw error;
  }
};

// Create a new maintenance request
export const createMaintenanceRequest = async (
  requestData: MaintenanceRequestInput
) => {
  try {
    const response = await apiRequest(
      "/maintenance/create",
      "POST",
      requestData
    );
    return (
      response.data?.maintenanceRequest || response.maintenanceRequest || null
    );
  } catch (error) {
    console.error("Error creating maintenance request:", error);
    throw error;
  }
};

// Update a maintenance request (partial update)
export const updateMaintenanceRequest = async (
  requestId: string,
  requestData: Partial<MaintenanceRequest>
) => {
  try {
    const response = await apiRequest(
      `/maintenance/${requestId}`,
      "PATCH",
      requestData
    );
    return (
      response.data?.maintenanceRequest || response.maintenanceRequest || null
    );
  } catch (error) {
    console.error(`Error updating maintenance request ${requestId}:`, error);
    throw error;
  }
};

// Update maintenance request status (admin only)
export const updateMaintenanceStatus = async (
  requestId: string,
  status: MaintenanceRequest["status"],
  additionalData?: {
    appointmentDateTime?: string;
    resolutionSummary?: string;
  }
) => {
  try {
    const updateData = {
      status,
      ...additionalData,
    };

    const response = await apiRequest(
      `/maintenance/${requestId}/status`,
      "PATCH",
      updateData
    );
    return (
      response.data?.maintenanceRequest || response.maintenanceRequest || null
    );
  } catch (error) {
    console.error(
      `Error updating status for maintenance request ${requestId}:`,
      error
    );
    throw error;
  }
};

// Cancel a maintenance request
export const cancelMaintenanceRequest = async (requestId: string) => {
  try {
    const response = await apiRequest(
      `/maintenance/${requestId}/cancel`,
      "PATCH"
    );
    return (
      response.data?.maintenanceRequest || response.maintenanceRequest || null
    );
  } catch (error) {
    console.error(`Error cancelling maintenance request ${requestId}:`, error);
    throw error;
  }
};

// Delete a maintenance request (admin only)
export const deleteMaintenanceRequest = async (requestId: string) => {
  try {
    const response = await apiRequest(`/maintenance/${requestId}`, "DELETE");
    return response;
  } catch (error) {
    console.error(`Error deleting maintenance request ${requestId}:`, error);
    throw error;
  }
};

// Get statistics for maintenance requests (admin only)
export const getMaintenanceStatistics = async () => {
  try {
    const response = await apiRequest("/maintenance/statistics");
    return (
      response.data?.statistics ||
      response.statistics || {
        total: 0,
        pending: 0,
        scheduled: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
      }
    );
  } catch (error) {
    console.error("Error fetching maintenance statistics:", error);
    throw error;
  }
};
