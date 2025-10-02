// Route Configuration
import config from './config'
const { ROLES } = config

// Public routes that don't require authentication
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SEARCH: '/search',
  SEATS: '/seats',
  CONFIRMATION: '/confirmation',
}

// Role-based dashboard routes
export const DASHBOARD_ROUTES = {
  [ROLES.MASTER_ADMIN]: '/master-admin',
  [ROLES.BUS_OWNER]: '/bus-owner',
  [ROLES.BUS_ADMIN]: '/bus-admin',
  [ROLES.BOOKING_MAN]: '/booking-manager',
  [ROLES.BUS_EMPLOYEE]: '/bus-employee',
  [ROLES.CUSTOMER]: '/customer',
}

// Role-based feature routes
export const FEATURE_ROUTES = {
  // Master Admin routes
  [ROLES.MASTER_ADMIN]: {
    dashboard: '/master-admin',
    users: '/dashboard/master/users',
    settings: '/dashboard/master/settings',
    analytics: '/dashboard/master/analytics',
    roles: '/dashboard/master/roles',
  },
  
  // Bus Owner routes (analytics only)
  [ROLES.BUS_OWNER]: {
    dashboard: '/bus-owner',
    busAnalytics: '/bus-owner/bus-analytics',
    routeAnalytics: '/bus-owner/route-analytics',
    tripAnalytics: '/bus-owner/trip-analytics',
    revenue: '/bus-owner/revenue',
    expenses: '/bus-owner/expenses',
  },
  
  // Bus Admin routes (management + analytics)
  [ROLES.BUS_ADMIN]: {
    dashboard: '/bus-admin',
    overview: '/bus-admin/overview',
    buses: '/bus-admin/buses',
    routes: '/bus-admin/routes',
    trips: '/bus-admin/trips',
    employees: '/bus-admin/employees',
    bookingMen: '/bus-admin/booking-men',
    busAnalytics: '/bus-admin/bus-analytics',
    routeAnalytics: '/bus-admin/route-analytics',
    tripAnalytics: '/bus-admin/trip-analytics',
  },
  
  // Booking Manager routes
  [ROLES.BOOKING_MAN]: {
    dashboard: '/booking-manager',
    bookings: '/booking-manager/bookings',
    customers: '/booking-manager/customers',
  },
  
  // Bus Employee routes
  [ROLES.BUS_EMPLOYEE]: {
    dashboard: '/bus-employee',
    trips: '/bus-employee/trips',
    profile: '/bus-employee/profile',
  },
  
  // Customer routes
  [ROLES.CUSTOMER]: {
    dashboard: '/customer',
    bookings: '/dashboard/customer/bookings',
    profile: '/dashboard/customer/profile',
  },
}

// Route access permissions
export const ROUTE_PERMISSIONS = {
  // Public routes
  [PUBLIC_ROUTES.HOME]: [],
  [PUBLIC_ROUTES.LOGIN]: [],
  [PUBLIC_ROUTES.SEARCH]: [],
  [PUBLIC_ROUTES.SEATS]: [],
  [PUBLIC_ROUTES.CONFIRMATION]: [],
  
  // Master Admin routes
  [FEATURE_ROUTES[ROLES.MASTER_ADMIN].dashboard]: [ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.MASTER_ADMIN].users]: [ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.MASTER_ADMIN].settings]: [ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.MASTER_ADMIN].analytics]: [ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.MASTER_ADMIN].roles]: [ROLES.MASTER_ADMIN],
  
  // Bus Owner routes (analytics only)
  [FEATURE_ROUTES[ROLES.BUS_OWNER].dashboard]: [ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BUS_OWNER].busAnalytics]: [ROLES.BUS_OWNER, ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BUS_OWNER].routeAnalytics]: [ROLES.BUS_OWNER, ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BUS_OWNER].tripAnalytics]: [ROLES.BUS_OWNER, ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BUS_OWNER].revenue]: [ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BUS_OWNER].expenses]: [ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  
  // Bus Admin routes (management + analytics)
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].dashboard]: [ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].buses]: [ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN], // Only bus-admin can create/manage buses
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].routes]: [ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN], // Only bus-admin can create/manage routes
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].trips]: [ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN], // Only bus-admin can create/manage trips
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].employees]: [ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].bookingMen]: [ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].busAnalytics]: [ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN], // Shared analytics
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].routeAnalytics]: [ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN], // Shared analytics
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].tripAnalytics]: [ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN], // Shared analytics
  
  // Booking Manager routes
  [FEATURE_ROUTES[ROLES.BOOKING_MAN].dashboard]: [ROLES.BOOKING_MAN, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BOOKING_MAN].bookings]: [ROLES.BOOKING_MAN, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BOOKING_MAN].customers]: [ROLES.BOOKING_MAN, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  
  // Bus Employee routes
  [FEATURE_ROUTES[ROLES.BUS_EMPLOYEE].dashboard]: [ROLES.BUS_EMPLOYEE, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BUS_EMPLOYEE].trips]: [ROLES.BUS_EMPLOYEE, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BUS_EMPLOYEE].profile]: [ROLES.BUS_EMPLOYEE, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  
  // Customer routes
  [FEATURE_ROUTES[ROLES.CUSTOMER].dashboard]: [ROLES.CUSTOMER],
  [FEATURE_ROUTES[ROLES.CUSTOMER].bookings]: [ROLES.CUSTOMER],
  [FEATURE_ROUTES[ROLES.CUSTOMER].profile]: [ROLES.CUSTOMER],
}

// Helper functions
export const getDashboardRoute = (role) => {
  return DASHBOARD_ROUTES[role] || PUBLIC_ROUTES.HOME
}

export const getFeatureRoutes = (role) => {
  return FEATURE_ROUTES[role] || {}
}

export const canAccessRoute = (path, userRole) => {
  // Public routes are accessible to everyone
  if (Object.values(PUBLIC_ROUTES).includes(path)) {
    return true
  }
  
  // Check if user has permission for this route
  const allowedRoles = ROUTE_PERMISSIONS[path]
  if (!allowedRoles) {
    return false
  }
  
  return allowedRoles.includes(userRole)
}

export const getDefaultRoute = (userRole) => {
  if (!userRole) {
    return PUBLIC_ROUTES.HOME
  }
  
  return getDashboardRoute(userRole)
}

// Navigation menu structure for each role
export const NAVIGATION_MENU = {
  [ROLES.MASTER_ADMIN]: [
    { label: 'Dashboard', path: FEATURE_ROUTES[ROLES.MASTER_ADMIN].dashboard, icon: 'dashboard' },
    { label: 'Users', path: FEATURE_ROUTES[ROLES.MASTER_ADMIN].users, icon: 'users' },
    { label: 'Analytics', path: FEATURE_ROUTES[ROLES.MASTER_ADMIN].analytics, icon: 'analytics' },
    { label: 'Roles', path: FEATURE_ROUTES[ROLES.MASTER_ADMIN].roles, icon: 'roles' },
    { label: 'Settings', path: FEATURE_ROUTES[ROLES.MASTER_ADMIN].settings, icon: 'settings' },
  ],
  
  [ROLES.BUS_OWNER]: [
    { label: 'Dashboard', path: FEATURE_ROUTES[ROLES.BUS_OWNER].dashboard, icon: 'dashboard' },
    { label: 'Bus Analytics', path: FEATURE_ROUTES[ROLES.BUS_OWNER].busAnalytics, icon: 'buses' },
    { label: 'Route Analytics', path: FEATURE_ROUTES[ROLES.BUS_OWNER].routeAnalytics, icon: 'routes' },
    { label: 'Trip Analytics', path: FEATURE_ROUTES[ROLES.BUS_OWNER].tripAnalytics, icon: 'trips' },
    { label: 'Revenue', path: FEATURE_ROUTES[ROLES.BUS_OWNER].revenue, icon: 'revenue' },
    { label: 'Expenses', path: FEATURE_ROUTES[ROLES.BUS_OWNER].expenses, icon: 'expenses' },
  ],
  
  [ROLES.BUS_ADMIN]: [
    { label: 'Dashboard', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].dashboard, icon: 'dashboard' },
    { label: 'Overview', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].overview, icon: 'overview' },
    { label: 'Buses', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].buses, icon: 'buses' },
    { label: 'Routes', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].routes, icon: 'routes' },
    { label: 'Trips', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].trips, icon: 'trips' },
    { label: 'Employees', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].employees, icon: 'employees' },
    { label: 'Booking Managers', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].bookingMen, icon: 'booking' },
    { label: 'Bus Analytics', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].busAnalytics, icon: 'analytics' },
    { label: 'Route Analytics', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].routeAnalytics, icon: 'analytics' },
    { label: 'Trip Analytics', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].tripAnalytics, icon: 'analytics' },
  ],
  
  [ROLES.BOOKING_MAN]: [
    { label: 'Dashboard', path: FEATURE_ROUTES[ROLES.BOOKING_MAN].dashboard, icon: 'dashboard' },
    { label: 'Bookings', path: FEATURE_ROUTES[ROLES.BOOKING_MAN].bookings, icon: 'bookings' },
    { label: 'Customers', path: FEATURE_ROUTES[ROLES.BOOKING_MAN].customers, icon: 'customers' },
  ],
  
  [ROLES.BUS_EMPLOYEE]: [
    { label: 'Dashboard', path: FEATURE_ROUTES[ROLES.BUS_EMPLOYEE].dashboard, icon: 'dashboard' },
    { label: 'My Trips', path: FEATURE_ROUTES[ROLES.BUS_EMPLOYEE].trips, icon: 'trips' },
    { label: 'Profile', path: FEATURE_ROUTES[ROLES.BUS_EMPLOYEE].profile, icon: 'profile' },
  ],
  
  [ROLES.CUSTOMER]: [
    { label: 'Dashboard', path: FEATURE_ROUTES[ROLES.CUSTOMER].dashboard, icon: 'dashboard' },
    { label: 'My Bookings', path: FEATURE_ROUTES[ROLES.CUSTOMER].bookings, icon: 'bookings' },
    { label: 'Profile', path: FEATURE_ROUTES[ROLES.CUSTOMER].profile, icon: 'profile' },
  ],
}

export const getNavigationMenu = (role) => {
  return NAVIGATION_MENU[role] || []
}
