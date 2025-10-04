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
  [ROLES.BUS_ADMIN]: '/bus-admin/overview',
  [ROLES.BOOKING_MAN]: '/booking-man',
  [ROLES.BUS_EMPLOYEE]: '/bus-employee',
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
    dashboard: '/bus-admin/overview',
    overview: '/bus-admin/overview',
    buses: '/bus-admin/buses',
    routes: '/bus-admin/routes',
    trips: '/bus-admin/trips',
    employees: '/bus-admin/employees',
    bookingMen: '/bus-admin/booking-men',
    busAnalytics: '/bus-admin/overview#bus-analytics',
    routeAnalytics: '/bus-admin/overview#route-analytics',
    tripAnalytics: '/bus-admin/overview#trip-analytics',
    revenue: '/bus-admin/revenue',
    expenses: '/bus-admin/expenses',
  },
  
  // Booking Man routes
  [ROLES.BOOKING_MAN]: {
    dashboard: '/booking-man',
    overview: '/booking-man/overview',
    bookings: '/booking-man/bookings',
    createBooking: '/booking-man/create-booking',
    customers: '/booking-man/customers',
    analytics: '/booking-man/analytics',
  },
  
  // Bus Employee routes
  [ROLES.BUS_EMPLOYEE]: {
    dashboard: '/bus-employee',
    trips: '/bus-employee/trips',
    profile: '/bus-employee/profile',
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
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].overview]: [ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].buses]: [ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN], // Only bus-admin can create/manage buses
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].routes]: [ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN], // Only bus-admin can create/manage routes
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].trips]: [ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN], // Only bus-admin can create/manage trips
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].employees]: [ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].bookingMen]: [ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].revenue]: [ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BUS_ADMIN].expenses]: [ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN],

  // Booking Manager routes
  [FEATURE_ROUTES[ROLES.BOOKING_MAN].dashboard]: [ROLES.BOOKING_MAN, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BOOKING_MAN].overview]: [ROLES.BOOKING_MAN, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BOOKING_MAN].bookings]: [ROLES.BOOKING_MAN, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BOOKING_MAN].createBooking]: [ROLES.BOOKING_MAN, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BOOKING_MAN].customers]: [ROLES.BOOKING_MAN, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BOOKING_MAN].analytics]: [ROLES.BOOKING_MAN, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  
  // Bus Employee routes
  [FEATURE_ROUTES[ROLES.BUS_EMPLOYEE].dashboard]: [ROLES.BUS_EMPLOYEE, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BUS_EMPLOYEE].trips]: [ROLES.BUS_EMPLOYEE, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
  [FEATURE_ROUTES[ROLES.BUS_EMPLOYEE].profile]: [ROLES.BUS_EMPLOYEE, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN],
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
    { label: 'Overview', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].overview, icon: 'overview' },
    { label: 'Buses', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].buses, icon: 'buses' },
    { label: 'Routes', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].routes, icon: 'routes' },
    { label: 'Trips', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].trips, icon: 'trips' },
    { label: 'Employees', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].employees, icon: 'employees' },
    { label: 'Booking Managers', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].bookingMen, icon: 'booking' },
    { label: 'Revenue', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].revenue, icon: 'revenue' },
    { label: 'Expenses', path: FEATURE_ROUTES[ROLES.BUS_ADMIN].expenses, icon: 'expenses' },
  ],
  
  [ROLES.BOOKING_MAN]: [
    { label: 'Overview', path: FEATURE_ROUTES[ROLES.BOOKING_MAN].overview, icon: 'overview' },
    { label: 'Bookings', path: FEATURE_ROUTES[ROLES.BOOKING_MAN].bookings, icon: 'bookings' },
    { label: 'Create Booking', path: FEATURE_ROUTES[ROLES.BOOKING_MAN].createBooking, icon: 'booking' },
    { label: 'Customers', path: FEATURE_ROUTES[ROLES.BOOKING_MAN].customers, icon: 'customers' },
    { label: 'Analytics', path: FEATURE_ROUTES[ROLES.BOOKING_MAN].analytics, icon: 'analytics' },
  ],
  
  [ROLES.BUS_EMPLOYEE]: [
    { label: 'Dashboard', path: FEATURE_ROUTES[ROLES.BUS_EMPLOYEE].dashboard, icon: 'dashboard' },
    { label: 'My Trips', path: FEATURE_ROUTES[ROLES.BUS_EMPLOYEE].trips, icon: 'trips' },
    { label: 'Profile', path: FEATURE_ROUTES[ROLES.BUS_EMPLOYEE].profile, icon: 'profile' },
  ],
}

export const getNavigationMenu = (role) => {
  return NAVIGATION_MENU[role] || []
}
