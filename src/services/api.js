// Import configuration and axios
import config from '../config/config.js'
import axios from 'axios'
import { handleApiError } from '../utils/toast.js'
import { enhancedBookingAPI } from './enhancedBookingAPI.js'

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: config.API.BASE_URL,
  timeout: config.API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get auth token
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem(config.STORAGE.USER) || '{}');
  return user.token || null;
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle API errors with toast notifications
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
);

// Generic API request function with retry logic
const apiRequest = async (endpoint, options = {}) => {
  const { method = 'GET', data, params, includeAuth = true, ...restOptions } = options;
  
  const requestConfig = {
    url: endpoint,
    method,
    data,
    params,
    ...restOptions,
  };

  // Remove auth header if not needed
  if (!includeAuth) {
    delete requestConfig.headers?.Authorization;
  }

  let lastError;

  // Retry logic
  for (let attempt = 1; attempt <= config.API.RETRY_ATTEMPTS; attempt++) {
    try {
      const response = await apiClient(requestConfig);
      return response;
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error.message.includes('401') || error.message.includes('403')) {
        throw error;
      }
      
      if (error.message.includes('404')) {
        throw error;
      }
      
      // Wait before retrying
      if (attempt < config.API.RETRY_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, config.API.RETRY_DELAY * attempt));
      }
    }
  }
  
  // If all retries failed
  console.error('API Error after retries:', lastError);
  throw lastError;
};

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      data: userData,
      includeAuth: false,
    });
  },

  // Create master admin
  createMasterAdmin: async (adminData) => {
    return apiRequest('/auth/create-master-admin', {
      method: 'POST',
      data: adminData,
      includeAuth: false,
    });
  },

  // Login user
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      data: credentials,
      includeAuth: false,
    });
  },

  // Get user profile
  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  // Update user profile
  updateProfile: async (updates) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      data: updates,
    });
  },

  // Change password
  changePassword: async (passwordData) => {
    return apiRequest('/auth/change-password', {
      method: 'PUT',
      data: passwordData,
    });
  },

  // Get all users (admin only)
  getAllUsers: async (params = {}) => {
    return apiRequest('/auth/users', {
      method: 'GET',
      params,
    });
  },

  // Get user by ID (admin only)
  getUserById: async (userId) => {
    return apiRequest(`/auth/users/${userId}`);
  },

  // Update user by ID (admin only)
  updateUserById: async (userId, userData) => {
    return apiRequest(`/auth/users/${userId}`, {
      method: 'PUT',
      data: userData,
    });
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    return apiRequest(`/auth/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    return apiRequest('/auth/refresh-token', {
      method: 'POST',
      data: { refreshToken },
      includeAuth: false,
    });
  },

  // Bus Owner Management
  // Create bus owner
  createBusOwner: async (busOwnerData) => {
    return apiRequest('/auth/bus-owners', {
      method: 'POST',
      data: busOwnerData,
    });
  },

  // Get all bus owners
  getAllBusOwners: async (params = {}) => {
    return apiRequest('/auth/bus-owners', {
      method: 'GET',
      params,
    });
  },

  // Get bus owner by ID
  getBusOwnerById: async (busOwnerId) => {
    return apiRequest(`/auth/bus-owners/${busOwnerId}`);
  },

  // Update bus owner
  updateBusOwner: async (busOwnerId, busOwnerData) => {
    return apiRequest(`/auth/bus-owners/${busOwnerId}`, {
      method: 'PUT',
      data: busOwnerData,
    });
  },

  // Delete bus owner
  deleteBusOwner: async (busOwnerId) => {
    return apiRequest(`/auth/bus-owners/${busOwnerId}`, {
      method: 'DELETE',
    });
  },

  // Toggle bus owner status
  toggleBusOwnerStatus: async (busOwnerId) => {
    return apiRequest(`/auth/bus-owners/${busOwnerId}/toggle-status`, {
      method: 'PUT',
    });
  },

  // Create bus admin
  createBusAdmin: async (busAdminData) => {
    return apiRequest('/auth/bus-admins', {
      method: 'POST',
      data: busAdminData,
    });
  },

  // Update bus admin
  updateBusAdmin: async (busAdminId, busAdminData) => {
    return apiRequest(`/auth/bus-admins/${busAdminId}`, {
      method: 'PUT',
      data: busAdminData,
    });
  },

  // Delete bus admin
  deleteBusAdmin: async (busAdminId) => {
    return apiRequest(`/auth/bus-admins/${busAdminId}`, {
      method: 'DELETE',
    });
  },

  // Get all bus admins
  getAllBusAdmins: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/auth/bus-admins${queryParams ? `?${queryParams}` : ''}`);
  },

  // Create booking man
  createBookingMan: async (bookingManData) => {
    return apiRequest('/auth/booking-men', {
      method: 'POST',
      data: bookingManData,
    });
  },

  // Create bus employee
  createBusEmployee: async (busEmployeeData) => {
    return apiRequest('/auth/bus-employees', {
      method: 'POST',
      data: busEmployeeData,
    });
  },

  // Get role hierarchy
  getRoleHierarchy: async () => {
    return apiRequest('/auth/role-hierarchy');
  },

  // Get creatable roles
  getCreatableRoles: async () => {
    return apiRequest('/auth/creatable-roles');
  },
};

// Search API
export const searchAPI = {
  // Search buses
  searchBuses: async (searchParams) => {
    return apiRequest('/search/buses', {
      method: 'GET',
      params: searchParams,
      includeAuth: false,
    });
  },

  // Get popular routes
  getPopularRoutes: async (params = {}) => {
    return apiRequest('/search/popular-routes', {
      method: 'GET',
      params,
      includeAuth: false,
    });
  },

  // Get available seats
  getAvailableSeats: async (tripId, date) => {
    return apiRequest(`/search/trips/${tripId}/seats`, {
      method: 'GET',
      params: { date },
      includeAuth: false,
    });
  },

  // Get trip details
  getTripDetails: async (tripId) => {
    return apiRequest(`/search/trips/${tripId}`, {
      method: 'GET',
      includeAuth: false,
    });
  },

  // Get search suggestions
  getSearchSuggestions: async (query) => {
    return apiRequest('/search/suggestions', {
      method: 'GET',
      params: { q: query },
      includeAuth: false,
    });
  },
};

// Bus Management API
export const busAPI = {
  // Get all buses
  getAllBuses: async (params = {}) => {
    return apiRequest('/buses', {
      method: 'GET',
      params,
    });
  },

  // Get bus by ID
  getBusById: async (busId) => {
    return apiRequest(`/buses/${busId}`);
  },

  // Create new bus
  createBus: async (busData) => {
    return apiRequest('/buses', {
      method: 'POST',
      data: busData,
    });
  },

  // Update bus
  updateBus: async (busId, busData) => {
    return apiRequest(`/buses/${busId}`, {
      method: 'PUT',
      data: busData,
    });
  },

  // Delete bus
  deleteBus: async (busId) => {
    return apiRequest(`/buses/${busId}`, {
      method: 'DELETE',
    });
  },

  // Update bus status
  updateBusStatus: async (busId, status) => {
    return apiRequest(`/buses/${busId}/status`, {
      method: 'PUT',
      data: { status },
    });
  },

  // Get bus statistics
  getBusStatistics: async (busId) => {
    return apiRequest(`/buses/${busId}/statistics`);
  },

  // Get buses by operator
  getBusesByOperator: async (operatorId, params = {}) => {
    return apiRequest(`/buses/operator/${operatorId}`, {
      method: 'GET',
      params,
    });
  },
};

// Route Management API
export const routeAPI = {
  // Get all routes
  getAllRoutes: async (params = {}) => {
    return apiRequest('/routes', {
      method: 'GET',
      params,
    });
  },

  // Get route by ID
  getRouteById: async (routeId) => {
    return apiRequest(`/routes/${routeId}`);
  },

  // Create new route
  createRoute: async (routeData) => {
    return apiRequest('/routes', {
      method: 'POST',
      data: routeData,
    });
  },

  // Update route
  updateRoute: async (routeId, routeData) => {
    return apiRequest(`/routes/${routeId}`, {
      method: 'PUT',
      data: routeData,
    });
  },

  // Delete route
  deleteRoute: async (routeId) => {
    return apiRequest(`/routes/${routeId}`, {
      method: 'DELETE',
    });
  },

  // Update route status
  updateRouteStatus: async (routeId, status) => {
    return apiRequest(`/routes/${routeId}/status`, {
      method: 'PUT',
      data: { status },
    });
  },

  // Search routes
  searchRoutes: async (searchParams) => {
    return apiRequest('/routes/search', {
      method: 'POST',
      data: searchParams,
    });
  },

  // Get popular routes
  getPopularRoutes: async (params = {}) => {
    return apiRequest('/routes/popular', {
      method: 'GET',
      params,
    });
  },

  // Get route stops
  getRouteStops: async (routeId) => {
    return apiRequest(`/routes/${routeId}/stops`);
  },

  // Add route stop
  addRouteStop: async (routeId, stopData) => {
    return apiRequest(`/routes/${routeId}/stops`, {
      method: 'POST',
      data: stopData,
    });
  },

  // Update route stop
  updateRouteStop: async (routeId, stopId, stopData) => {
    return apiRequest(`/routes/${routeId}/stops/${stopId}`, {
      method: 'PUT',
      data: stopData,
    });
  },

  // Delete route stop
  deleteRouteStop: async (routeId, stopId) => {
    return apiRequest(`/routes/${routeId}/stops/${stopId}`, {
      method: 'DELETE',
    });
  },
};

// Trip Management API
export const tripAPI = {
  // Get all trips
  getAllTrips: async (params = {}) => {
    return apiRequest('/trips', {
      method: 'GET',
      params,
    });
  },

  // Get trips by bus admin
  getTripsByBusAdmin: async (params = {}) => {
    return apiRequest('/trips/bus-admin', {
      method: 'GET',
      params,
    });
  },

  // Get trip by ID
  getTripById: async (tripId) => {
    return apiRequest(`/trips/${tripId}`);
  },

  // Create new trip
  createTrip: async (tripData) => {
    return apiRequest('/trips', {
      method: 'POST',
      data: tripData,
    });
  },

  // Update trip
  updateTrip: async (tripId, tripData) => {
    return apiRequest(`/trips/${tripId}`, {
      method: 'PUT',
      data: tripData,
    });
  },

  // Delete trip
  deleteTrip: async (tripId) => {
    return apiRequest(`/trips/${tripId}`, {
      method: 'DELETE',
    });
  },

  // Update trip status
  updateTripStatus: async (tripId, status) => {
    return apiRequest(`/trips/${tripId}/status`, {
      method: 'PUT',
      data: { status },
    });
  },

  // Get trip statistics
  getTripStatistics: async () => {
    return apiRequest('/trips/statistics');
  },

  // Get trips by route
  getTripsByRoute: async (routeId, params = {}) => {
    return apiRequest(`/trips/route/${routeId}`, {
      method: 'GET',
      params,
    });
  },

  // Get trips by bus
  getTripsByBus: async (busId, params = {}) => {
    return apiRequest(`/trips/bus/${busId}`, {
      method: 'GET',
      params,
    });
  },

  // Get available drivers for a specific date
  getAvailableDrivers: async (date) => {
    return apiRequest('/trips/available/drivers', {
      method: 'GET',
      params: { date },
    });
  },

  // Get available helpers for a specific date
  getAvailableHelpers: async (date) => {
    return apiRequest('/trips/available/helpers', {
      method: 'GET',
      params: { date },
    });
  },

  // Get available buses for a specific date
  getAvailableBuses: async (date) => {
    return apiRequest('/trips/available/buses', {
      method: 'GET',
      params: { date },
    });
  },

  // Bulk update trip status
  bulkUpdateTripStatus: async (tripIds, status) => {
    return apiRequest('/trips/bulk/status', {
      method: 'PUT',
      data: { tripIds, status },
    });
  },

};

// Enhanced Booking API - combines original and enhanced functionality
export const bookingAPI = {
  // Original booking API methods (for backward compatibility)
  getAllBookings: async (params = {}) => {
    return apiRequest('/bookings', {
      method: 'GET',
      params,
    });
  },

  getBookingById: async (bookingId) => {
    return apiRequest(`/bookings/${bookingId}`);
  },

  createBooking: async (bookingData) => {
    return apiRequest('/bookings', {
      method: 'POST',
      data: bookingData,
    });
  },

  updateBooking: async (bookingId, bookingData) => {
    return apiRequest(`/bookings/${bookingId}`, {
      method: 'PUT',
      data: bookingData,
    });
  },

  cancelBooking: async (bookingId, cancelData = {}) => {
    return apiRequest(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      data: cancelData,
    });
  },

  getBookingStatistics: async (params = {}) => {
    return apiRequest('/bookings/statistics', {
      method: 'GET',
      params,
    });
  },

  getBookingsByUser: async (userId, params = {}) => {
    return apiRequest(`/bookings/user/${userId}`, {
      method: 'GET',
      params,
    });
  },

  getBookingsByTrip: async (tripId, params = {}) => {
    return apiRequest(`/bookings/trip/${tripId}`, {
      method: 'GET',
      params,
    });
  },

  downloadTicket: async (bookingId) => {
    return apiRequest(`/bookings/${bookingId}/ticket`, {
      method: 'GET',
      responseType: 'blob',
    });
  },

  emailTicket: async (bookingId) => {
    return apiRequest(`/bookings/${bookingId}/email`, {
      method: 'POST',
    });
  },

  updateBookingStatus: async (bookingId, statusData) => {
    return apiRequest(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      data: statusData,
    });
  },

  getBookingByReference: async (reference) => {
    return apiRequest(`/bookings/reference/${reference}`);
  },

  getCustomers: async (params = {}) => {
    return apiRequest('/booking-men/customers', {
      method: 'GET',
      params,
    });
  },

  // Enhanced booking API methods
  ...enhancedBookingAPI
};

// Analytics API
export const analyticsAPI = {
  // Get revenue analytics
  getRevenueAnalytics: async (params = {}) => {
    return apiRequest('/analytics/revenue', {
      method: 'GET',
      params,
    });
  },

  // Get booking analytics
  getBookingAnalytics: async (params = {}) => {
    return apiRequest('/analytics/bookings', {
      method: 'GET',
      params,
    });
  },

  // Get bus performance analytics
  getBusPerformanceAnalytics: async (params = {}) => {
    return apiRequest('/analytics/bus-performance', {
      method: 'GET',
      params,
    });
  },

  // Get dashboard summary
  getDashboardSummary: async (params = {}) => {
    return apiRequest('/analytics/dashboard', {
      method: 'GET',
      params,
    });
  },
};

// Expense API
export const expenseAPI = {
  // Get all expenses
  getAllExpenses: async (params = {}) => {
    return apiRequest('/expenses', {
      method: 'GET',
      params,
    });
  },

  // Get expense by ID
  getExpenseById: async (expenseId) => {
    return apiRequest(`/expenses/${expenseId}`);
  },

  // Create new expense
  createExpense: async (expenseData) => {
    return apiRequest('/expenses', {
      method: 'POST',
      data: expenseData,
    });
  },

  // Update expense
  updateExpense: async (expenseId, expenseData) => {
    return apiRequest(`/expenses/${expenseId}`, {
      method: 'PUT',
      data: expenseData,
    });
  },

  // Delete expense
  deleteExpense: async (expenseId) => {
    return apiRequest(`/expenses/${expenseId}`, {
      method: 'DELETE',
    });
  },

  // Get expense statistics
  getExpenseStatistics: async (params = {}) => {
    return apiRequest('/expenses/statistics', {
      method: 'GET',
      params,
    });
  },

  // Get expenses by bus
  getExpensesByBus: async (busId, params = {}) => {
    return apiRequest(`/expenses/bus/${busId}`, {
      method: 'GET',
      params,
    });
  },

  // Get expenses by type
  getExpensesByType: async (type, params = {}) => {
    return apiRequest(`/expenses/type/${type}`, {
      method: 'GET',
      params,
    });
  },

  // Get expenses by employee
  getExpensesByEmployee: async (employeeId, params = {}) => {
    return apiRequest(`/expenses/employee/${employeeId}`, {
      method: 'GET',
      params,
    });
  },
};

// Bus Employee API
export const busEmployeeAPI = {
  // Get all bus employees
  getAllEmployees: async (params = {}) => {
    return apiRequest('/bus-admin/bus-employees', {
      method: 'GET',
      params,
    });
  },

  // Get employee by ID
  getEmployeeById: async (employeeId) => {
    return apiRequest(`/bus-admin/bus-employees/${employeeId}`);
  },

  // Create new bus employee
  createEmployee: async (employeeData) => {
    return apiRequest('/bus-admin/bus-employees', {
      method: 'POST',
      data: employeeData,
    });
  },

  // Update bus employee
  updateEmployee: async (employeeId, employeeData) => {
    return apiRequest(`/bus-admin/bus-employees/${employeeId}`, {
      method: 'PUT',
      data: employeeData,
    });
  },

  // Delete bus employee
  deleteEmployee: async (employeeId) => {
    return apiRequest(`/bus-admin/bus-employees/${employeeId}`, {
      method: 'DELETE',
    });
  },

  // Toggle bus employee status
  updateEmployeeStatus: async (employeeId) => {
    return apiRequest(`/bus-admin/bus-employees/${employeeId}/toggle-status`, {
      method: 'PUT',
    });
  },

  // Get employee statistics
  getEmployeeStatistics: async (params = {}) => {
    return apiRequest('/bus-admin/bus-employees', {
      method: 'GET',
      params: { ...params, statistics: true },
    });
  },
};

// Booking Manager API
export const bookingManAPI = {
  // Get all booking men (for admin)
  getAllBookingMen: async (params = {}) => {
    return apiRequest('/bus-admin/booking-men', {
      method: 'GET',
      params,
    });
  },

  // Get booking man by ID (for admin)
  getBookingManById: async (manId) => {
    return apiRequest(`/bus-admin/booking-men/${manId}`);
  },

  // Create new booking man (for admin)
  createBookingMan: async (manData) => {
    return apiRequest('/bus-admin/booking-men', {
      method: 'POST',
      data: manData,
    });
  },

  // Update booking man (for admin)
  updateBookingMan: async (manId, manData) => {
    return apiRequest(`/bus-admin/booking-men/${manId}`, {
      method: 'PUT',
      data: manData,
    });
  },

  // Delete booking man (for admin)
  deleteBookingMan: async (manId) => {
    return apiRequest(`/bus-admin/booking-men/${manId}`, {
      method: 'DELETE',
    });
  },

  // Get booking man statistics (for admin)
  getBookingManStatistics: async (params = {}) => {
    return apiRequest('/bus-admin/booking-men', {
      method: 'GET',
      params: { ...params, statistics: true },
    });
  },

  // Booking Man Dashboard API
  getDashboard: async () => {
    return apiRequest('/booking-man/dashboard');
  },

  // Get bookings for booking man
  getBookings: async (params = {}) => {
    return apiRequest('/booking-man/bookings', {
      method: 'GET',
      params,
    });
  },

  // Get customers for booking man
  getCustomers: async (params = {}) => {
    return apiRequest('/booking-man/customers', {
      method: 'GET',
      params,
    });
  },

  // Update booking status
  updateBookingStatus: async (bookingId, data) => {
    return apiRequest(`/booking-man/bookings/${bookingId}/status`, {
      method: 'PUT',
      data,
    });
  },

  // Cancel booking
  cancelBooking: async (bookingId, data) => {
    return apiRequest(`/booking-man/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      data,
    });
  },
};

// Legacy Employee API (for backward compatibility)
export const employeeAPI = {
  // Get all bus employees
  getAllEmployees: async (params = {}) => {
    return busEmployeeAPI.getAllEmployees(params);
  },

  // Get employee by ID
  getEmployeeById: async (employeeId) => {
    return busEmployeeAPI.getEmployeeById(employeeId);
  },

  // Create new bus employee
  createEmployee: async (employeeData) => {
    return busEmployeeAPI.createEmployee(employeeData);
  },

  // Update bus employee
  updateEmployee: async (employeeId, employeeData) => {
    return busEmployeeAPI.updateEmployee(employeeId, employeeData);
  },

  // Delete bus employee
  deleteEmployee: async (employeeId) => {
    return busEmployeeAPI.deleteEmployee(employeeId);
  },

  // Toggle bus employee status
  updateEmployeeStatus: async (employeeId) => {
    return busEmployeeAPI.updateEmployeeStatus(employeeId);
  },

  // Get employee statistics
  getEmployeeStatistics: async (params = {}) => {
    return busEmployeeAPI.getEmployeeStatistics(params);
  },

  // Get employees by role
  getEmployeesByRole: async (role, params = {}) => {
    return busEmployeeAPI.getAllEmployees({ ...params, subrole: role });
  },
};

// Dashboard API
export const dashboardAPI = {
  // Get Master Admin Dashboard
  getMasterAdminDashboard: async () => {
    return apiRequest('/master-admin', {
      method: 'GET',
    });
  },

  // Get Bus Owner Dashboard
  getBusOwnerDashboard: async () => {
    return apiRequest('/bus-owner', {
      method: 'GET',
    });
  },

  // Get Bus Admin Dashboard
  getBusAdminDashboard: async () => {
    return apiRequest('/bus-admin/dashboard', {
      method: 'GET',
    });
  },

  // Get Booking Man Dashboard
  getBookingManDashboard: async () => {
    return apiRequest('/booking-man/dashboard', {
      method: 'GET',
    });
  },

  // Get Bus Employee Dashboard
  getBusEmployeeDashboard: async () => {
    return apiRequest('/bus-employee/dashboard', {
      method: 'GET',
    });
  },

  // Get Customer Dashboard
  getCustomerDashboard: async () => {
    return apiRequest('/customer/dashboard', {
      method: 'GET',
    });
  },

  // Bus Admin Dashboard APIs (for comprehensive bus admin dashboard)

  getBusAdminBuses: async (params = {}) => {
    return apiRequest('/bus-admin/buses', {
      method: 'GET',
      params,
    });
  },

  getBusAdminRoutes: async (params = {}) => {
    return apiRequest('/bus-admin/routes', {
      method: 'GET',
      params,
    });
  },

  getBusAdminBookings: async (params = {}) => {
    return apiRequest('/bus-admin/bookings', {
      method: 'GET',
      params,
    });
  },

  getBusAdminExpenses: async (params = {}) => {
    return apiRequest('/bus-admin/expenses', {
      method: 'GET',
      params,
    });
  },

  getBusAdminEarnings: async (params = {}) => {
    return apiRequest('/bus-admin/earnings', {
      method: 'GET',
      params,
    });
  },
};

// Health API
export const healthAPI = {
  // Get health status
  getHealthStatus: async () => {
    return apiRequest('/health', {
      method: 'GET',
      includeAuth: false,
    });
  },

  // Get system info
  getSystemInfo: async () => {
    return apiRequest('/health/system', {
      method: 'GET',
      includeAuth: false,
    });
  },
};

// Export default apiClient for direct use if needed
export default apiClient;