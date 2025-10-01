import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { ROLES } from '../../config/config'
import { FEATURE_ROUTES, getDefaultRoute } from '../../config/routes'

// Import all dashboard components
import MasterAdminDashboard from '../role-dashboards/MasterAdminDashboard'
import BusOwnerDashboard from '../role-dashboards/BusOwnerDashboard'
import BusAdminDashboard from '../role-dashboards/BusAdminDashboard'
import Dashboard from '../admin/Dashboard'
import BookingManManagement from '../admin/BookingManManagement'
import BusEmployeeDashboard from '../admin/BusEmployeeDashboard'

// Import feature components
import UserManagement from '../admin/UserManagement'
import SystemSettings from '../admin/SystemSettings'
import RoleSwitcher from '../admin/RoleSwitcher'
import RevenueAnalytics from '../admin/RevenueAnalytics'
import ExpenseAnalytics from '../admin/ExpenseAnalytics'
import UserProfileManagement from '../admin/UserProfileManagement'
import BusManagement from '../admin/BusManagement'
import RouteManagement from '../admin/RouteManagement'
import TripManagement from '../admin/TripManagement'
import EmployeeManagement from '../admin/EmployeeManagement'

// Customer components
import CustomerDashboard from '../role-dashboards/CustomerDashboard'
import CustomerBookings from '../customer/CustomerBookings'
import CustomerProfile from '../customer/CustomerProfile'

const DashboardRouter = () => {
  const { user } = useUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const userRole = user.role

  return (
    <Routes>
      {/* Master Admin Routes */}
      {userRole === ROLES.MASTER_ADMIN && (
        <>
          <Route 
            path="/master" 
            element={<MasterAdminDashboard />} 
          />
          <Route 
            path="/master/users" 
            element={<UserManagement />} 
          />
          <Route 
            path="/master/settings" 
            element={<SystemSettings />} 
          />
          <Route 
            path="/master/analytics" 
            element={<RevenueAnalytics />} 
          />
          <Route 
            path="/master/roles" 
            element={<RoleSwitcher />} 
          />
        </>
      )}

      {/* Bus Owner Routes */}
      {(userRole === ROLES.BUS_OWNER || userRole === ROLES.MASTER_ADMIN) && (
        <>
          <Route 
            path="/owner" 
            element={<BusOwnerDashboard />} 
          />
          <Route 
            path="/owner/buses" 
            element={<BusManagement />} 
          />
          <Route 
            path="/owner/routes" 
            element={<RouteManagement />} 
          />
          <Route 
            path="/owner/trips" 
            element={<TripManagement />} 
          />
          <Route 
            path="/owner/revenue" 
            element={<RevenueAnalytics />} 
          />
          <Route 
            path="/owner/expenses" 
            element={<ExpenseAnalytics />} 
          />
          <Route 
            path="/owner/employees" 
            element={<EmployeeManagement />} 
          />
        </>
      )}

      {/* Bus Admin Routes */}
      {(userRole === ROLES.BUS_ADMIN || userRole === ROLES.BUS_OWNER || userRole === ROLES.MASTER_ADMIN) && (
        <>
          <Route 
            path="/admin" 
            element={<BusAdminDashboard />} 
          />
          <Route 
            path="/admin/buses" 
            element={<BusManagement />} 
          />
          <Route 
            path="/admin/routes" 
            element={<RouteManagement />} 
          />
          <Route 
            path="/admin/trips" 
            element={<TripManagement />} 
          />
          <Route 
            path="/admin/employees" 
            element={<EmployeeManagement />} 
          />
        </>
      )}

      {/* Booking Manager Routes */}
      {(userRole === ROLES.BOOKING_MAN || userRole === ROLES.BUS_ADMIN || userRole === ROLES.BUS_OWNER || userRole === ROLES.MASTER_ADMIN) && (
        <>
          <Route 
            path="/booking" 
            element={<BookingManManagement />} 
          />
          <Route 
            path="/booking/manage" 
            element={<BookingManManagement />} 
          />
          <Route 
            path="/booking/customers" 
            element={<UserManagement />} 
          />
        </>
      )}

      {/* Bus Employee Routes */}
      {(userRole === ROLES.BUS_EMPLOYEE || userRole === ROLES.BUS_ADMIN || userRole === ROLES.BUS_OWNER || userRole === ROLES.MASTER_ADMIN) && (
        <>
          <Route 
            path="/employee" 
            element={<BusEmployeeDashboard />} 
          />
          <Route 
            path="/employee/trips" 
            element={<TripManagement />} 
          />
          <Route 
            path="/employee/profile" 
            element={<UserProfileManagement />} 
          />
        </>
      )}

      {/* Customer Routes */}
      {userRole === ROLES.CUSTOMER && (
        <>
          <Route 
            path="/customer" 
            element={<CustomerDashboard />} 
          />
          <Route 
            path="/customer/bookings" 
            element={<CustomerBookings />} 
          />
          <Route 
            path="/customer/profile" 
            element={<CustomerProfile />} 
          />
        </>
      )}

      {/* Default redirect to user's dashboard */}
      <Route 
        path="*" 
        element={<Navigate to={getDefaultRoute(userRole)} replace />} 
      />
    </Routes>
  )
}

export default DashboardRouter
