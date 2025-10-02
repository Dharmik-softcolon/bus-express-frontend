import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { UserProvider, useUser } from './contexts/UserContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Login from './components/auth/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'
import DashboardRouter from './components/routing/DashboardRouter'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Landing and Customer Pages
import LandingPage from './components/landing/LandingPage'
import HomePage from './components/customer/HomePage'
import SearchResults from './components/customer/SearchResults'
import SeatSelection from './components/customer/SeatSelection'
import BookingConfirmation from './components/customer/BookingConfirmation'

// Role-based Dashboards
import MasterAdminDashboard from './components/role-dashboards/MasterAdminDashboard'
import BusOwnerDashboard from './components/role-dashboards/BusOwnerDashboard'
import BusAdminDashboard from './components/role-dashboards/BusAdminDashboard'
import CustomerDashboard from './components/role-dashboards/CustomerDashboard'

// Management Pages
import RouteManagement from './components/pages/RouteManagement'
import TripManagement from './components/pages/TripManagement'
import EmployeeManagement from './components/pages/EmployeeManagement'

// Analytics Pages
import BusAnalytics from './components/pages/BusAnalytics'
import RouteAnalytics from './components/pages/RouteAnalytics'
import TripAnalytics from './components/pages/TripAnalytics'
import Revenue from './components/pages/Revenue'
import Expenses from './components/pages/Expenses'

// Import route configuration
import { ROLES } from './config/config'
import { PUBLIC_ROUTES, getDefaultRoute } from './config/routes'
import BusManagement from "./components/pages/BusManagement.jsx";
import BookingManManagement from "./components/admin/BookingManManagement.jsx";
import BookingManagersManagement from "./components/pages/BookingManagersManagement.jsx";

// Component to handle home page with auto-redirect for logged-in users
const HomePageWrapper = ({ onSearch }) => {
  const { user } = useUser()
  
  // If user is logged in, redirect to their dashboard
  if (user) {
    return <Navigate to={getDefaultRoute(user.role)} replace />
  }
  
  // If not logged in, show landing page
  return <LandingPage onSearch={onSearch} />
}

function App() {
  const [searchData, setSearchData] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [bookingData, setBookingData] = useState(null)

  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Landing Page - Show at root for non-logged in users */}
            <Route 
              path="/" 
              element={<HomePageWrapper onSearch={setSearchData} />} 
            />
            
            {/* Public Routes */}
            <Route 
              path="/home" 
              element={<HomePageWrapper onSearch={setSearchData} />} 
            />
            <Route 
              path={PUBLIC_ROUTES.SEARCH} 
              element={<SearchResults searchData={searchData} onSeatSelection={setSelectedSeats} />} 
            />
            <Route 
              path={PUBLIC_ROUTES.SEATS} 
              element={<SeatSelection selectedSeats={selectedSeats} onBooking={setBookingData} />} 
            />
            <Route 
              path={PUBLIC_ROUTES.CONFIRMATION} 
              element={<BookingConfirmation bookingData={bookingData} />} 
            />
            
            {/* Auth Routes */}
            <Route path={PUBLIC_ROUTES.LOGIN} element={<Login />} />

            {/* master-Admin Routes */}
            <Route path="/master-admin" element={
              <ProtectedRoute requiredRoles={[ROLES.MASTER_ADMIN]}>
                <MasterAdminDashboard />
              </ProtectedRoute>
            } />

            {/* Bus Owner Route & Pages */}
            <Route path="/bus-owner" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_OWNER, ROLES.MASTER_ADMIN]}>
                <BusOwnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/bus-owner/bus-analytics" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_OWNER, ROLES.MASTER_ADMIN]}>
                <BusAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/bus-owner/route-analytics" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_OWNER, ROLES.MASTER_ADMIN]}>
                <RouteAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/bus-owner/trip-analytics" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_OWNER, ROLES.MASTER_ADMIN]}>
                <TripAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/bus-owner/revenue" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_OWNER, ROLES.MASTER_ADMIN]}>
                <Revenue />
              </ProtectedRoute>
            } />
            <Route path="/bus-owner/expenses" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_OWNER, ROLES.MASTER_ADMIN]}>
                <Expenses />
              </ProtectedRoute>
            } />

            {/* Bus Owner Route & Pages */}
            <Route path="/bus-admin" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN]}>
                <BusAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/bus-admin/buses" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN]}>
                <BusManagement />
              </ProtectedRoute>
            } />
            <Route path="/bus-admin/routes" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN]}>
                <RouteManagement />
              </ProtectedRoute>
            } />
            <Route path="/bus-admin/trips" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN]}>
                <TripManagement />
              </ProtectedRoute>
            } />
            <Route path="/bus-admin/employees" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN]}>
                <EmployeeManagement />
              </ProtectedRoute>
            } />
            <Route path="/bus-admin/booking-men" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN]}>
                <BookingManagersManagement />
              </ProtectedRoute>
            } />
            <Route path="/bus-admin/bus-analytics" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN]}>
                <BusAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/bus-admin/route-analytics" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN]}>
                <RouteAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/bus-admin/trip-analytics" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN]}>
                <TripAnalytics />
              </ProtectedRoute>
            } />


            <Route path="/customer" element={
              <ProtectedRoute requiredRoles={[ROLES.CUSTOMER]}>
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            
            {/* Dashboard Routes - All protected routes handled by DashboardRouter */}
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } />
            
            {/* Legacy route redirects for backward compatibility */}
            <Route path="/admin/*" element={<Navigate to="/bus-admin" replace />} />
            <Route path="/dashboard/admin" element={<Navigate to="/bus-admin" replace />} />
            <Route path="/dashboard/booking" element={<Navigate to="/booking-manager" replace />} />
            <Route path="/dashboard/employee" element={<Navigate to="/bus-employee" replace />} />
            
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </UserProvider>
  )
}

export default App
