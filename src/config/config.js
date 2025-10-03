// Application Configuration
const config = {
  // Environment
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  
  // API Configuration
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api/v1',
    TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
    RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 1,
    RETRY_DELAY: parseInt(import.meta.env.VITE_API_RETRY_DELAY) || 1000,
  },
  
  // Authentication
  AUTH: {
    JWT_SECRET: import.meta.env.VITE_JWT_SECRET || 'default-jwt-secret',
    REFRESH_TOKEN_SECRET: import.meta.env.VITE_REFRESH_TOKEN_SECRET || 'default-refresh-secret',
    TOKEN_EXPIRY: import.meta.env.VITE_TOKEN_EXPIRY || '24h',
    REFRESH_TOKEN_EXPIRY: import.meta.env.VITE_REFRESH_TOKEN_EXPIRY || '7d',
    SESSION_TIMEOUT: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 1800000, // 30 minutes
  },
  
  // Application Settings
  APP: {
    NAME: import.meta.env.VITE_APP_NAME || 'BusExpress',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Bus Express Management System',
  },
  
  // Feature Flags
  FEATURES: {
    ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    ENABLE_LOGGING: import.meta.env.VITE_ENABLE_LOGGING === 'true',
    ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
    ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
    ENABLE_CACHE: import.meta.env.VITE_ENABLE_CACHE === 'true',
    ENABLE_CSRF_PROTECTION: import.meta.env.VITE_ENABLE_CSRF_PROTECTION === 'true',
  },
  
  // External Services
  SERVICES: {
    GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    EMAIL_SERVICE_API_KEY: import.meta.env.VITE_EMAIL_SERVICE_API_KEY || '',
    SMS_SERVICE_API_KEY: import.meta.env.VITE_SMS_SERVICE_API_KEY || '',
  },
  
  // File Upload
  UPLOAD: {
    MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760, // 10MB
    ALLOWED_FILE_TYPES: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf'
    ],
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 10,
    MAX_PAGE_SIZE: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE) || 100,
  },
  
  // Cache Settings
  CACHE: {
    DURATION: parseInt(import.meta.env.VITE_CACHE_DURATION) || 300000, // 5 minutes
    ENABLED: import.meta.env.VITE_ENABLE_CACHE === 'true',
  },
  
      // Development Settings
      DEV: {
        ENABLE_MOCK_DATA: false, // Always use API data
      },
  
  // Routes Configuration
  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
    SEARCH: '/search',
    SEATS: '/seats',
    CONFIRMATION: '/confirmation',
    ADMIN: '/admin',
    ADMIN_MASTER: '/admin/master',
    ADMIN_BUS_OWNER: '/admin/bus-owner',
    ADMIN_EMPLOYEE: '/admin/employee',
    ADMIN_ROLES: '/admin/roles',
    ADMIN_BUSES: '/admin/buses',
    ADMIN_ROUTES: '/admin/routes',
    ADMIN_TRIPS: '/admin/trips',
    ADMIN_BOOKING_MEN: '/admin/booking-men',
    ADMIN_USERS: '/admin/users',
    ADMIN_SETTINGS: '/admin/settings',
    ADMIN_REVENUE: '/admin/revenue',
    ADMIN_EXPENSES: '/admin/expenses',
    ADMIN_USER_PROFILES: '/admin/user-profiles',
  },
  
  // User Roles
  ROLES: {
    MASTER_ADMIN: 'MASTER_ADMIN',
    BUS_OWNER: 'BUS_OWNER',
    BUS_ADMIN: 'BUS_ADMIN',
    BOOKING_MAN: 'BOOKING_MAN',
    BUS_EMPLOYEE: 'BUS_EMPLOYEE',
  },
  
  // Bus Employee Subroles
  BUS_EMPLOYEE_SUBROLES: {
    DRIVER: 'DRIVER',
    HELPER: 'HELPER',
  },
  
  // Role Hierarchy - which roles can create which
  ROLE_HIERARCHY: {
    'MASTER_ADMIN': ['BUS_OWNER'],
    'BUS_OWNER': ['BUS_ADMIN'],
    'BUS_ADMIN': ['BOOKING_MAN', 'BUS_EMPLOYEE'],
    'BOOKING_MAN': [],
    'BUS_EMPLOYEE': [],
  },
  
  // Role Limits
  ROLE_LIMITS: {
    MASTER_ADMIN: 1,
    BUS_ADMIN_PER_OWNER: 2,
  },
  
  // Dashboard Routes by Role
  DASHBOARD_ROUTES: {
    'MASTER_ADMIN': '/master-admin',
    'BUS_OWNER': '/bus-owner',
    'BUS_ADMIN': '/bus-admin',
    'BOOKING_MAN': '/booking-man',
    'BUS_EMPLOYEE': '/bus-employee',
  },
  
  // Status Options
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    SCHEDULED: 'scheduled',
    IN_PROGRESS: 'in-progress',
    MAINTENANCE: 'maintenance',
  },
  
  // Bus Types
  BUS_TYPES: {
    ECONOMY: 'Economy',
    STANDARD: 'Standard',
    PREMIUM: 'Premium',
    LUXURY: 'Luxury',
  },
  
  // Expense Types
  EXPENSE_TYPES: {
    FUEL: 'fuel',
    FASTAG: 'fastag',
    MAINTENANCE: 'maintenance',
    TYRES: 'tyres',
    PARKING: 'parking',
    OTHER: 'other',
  },
  
  // Time Periods
  TIME_PERIODS: {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
  },
  
  // Validation Rules
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
    PASSWORD_MIN_LENGTH: 6,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
  },
  
  // Error Messages
  ERRORS: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'Resource not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    TIMEOUT_ERROR: 'Request timeout. Please try again.',
  },
  
  // Success Messages
  SUCCESS: {
    LOGIN: 'Login successful!',
    LOGOUT: 'Logout successful!',
    SAVE: 'Data saved successfully!',
    UPDATE: 'Data updated successfully!',
    DELETE: 'Data deleted successfully!',
    BOOKING: 'Booking confirmed successfully!',
  },
  
  // Local Storage Keys
  STORAGE: {
    USER: 'busexpress_user',
    TOKEN: 'busexpress_token',
    REFRESH_TOKEN: 'busexpress_refresh_token',
    THEME: 'busexpress_theme',
    LANGUAGE: 'busexpress_language',
    SETTINGS: 'busexpress_settings',
  },
  
  // Theme Configuration
  THEME: {
    PRIMARY_COLOR: '#2563eb',
    SECONDARY_COLOR: '#64748b',
    SUCCESS_COLOR: '#059669',
    WARNING_COLOR: '#d97706',
    ERROR_COLOR: '#dc2626',
    INFO_COLOR: '#0891b2',
  },
  
  // Animation Durations
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  
  // Breakpoints
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
}

// Validate required environment variables
const validateConfig = () => {
  const requiredVars = [
    'VITE_API_BASE_URL',
  ]
  
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName])
  
  if (missingVars.length > 0) {
    console.warn('Missing required environment variables:', missingVars)
    console.warn('Using default values. Please check your .env file.')
  }
}

// Development mode validation
if (config.NODE_ENV === 'development') {
  validateConfig()
}

// Export configuration
export default config

// Export individual sections for convenience
export const {
  API,
  AUTH,
  APP,
  FEATURES,
  SERVICES,
  UPLOAD,
  PAGINATION,
  CACHE,
  DEV,
  ROUTES,
  ROLES,
  BUS_EMPLOYEE_SUBROLES,
  ROLE_HIERARCHY,
  ROLE_LIMITS,
  DASHBOARD_ROUTES,
  STATUS,
  BUS_TYPES,
  EXPENSE_TYPES,
  TIME_PERIODS,
  VALIDATION,
  ERRORS,
  SUCCESS,
  STORAGE,
  THEME,
  ANIMATION,
  BREAKPOINTS,
} = config
