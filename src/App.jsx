import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { UserProvider, useUser } from './contexts/UserContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Login from './components/auth/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'
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

// Admin Management Components
import CompanyManagement from './components/admin/CompanyManagement'
import BusAdminManagement from './components/admin/BusAdminManagement'

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
import BookingMenManagement from "./components/pages/BookingMenManagement.jsx";
import BusAdminOverview from "./components/pages/BusAdminOverview.jsx";
import BusApiTest from "./components/debug/BusApiTest.jsx";
import BusEmployeeDashboard from "./components/admin/BusEmployeeDashboard.jsx";
import BookingManagerDashboard from "./components/role-dashboards/BookingManagerDashboard.jsx";
import BookingManagement from "./components/booking/BookingManagement.jsx";
import BookingManagerOverview from "./components/booking/BookingManagerOverview.jsx";
import BookingManagerBookings from "./components/booking/BookingManagerBookings.jsx";
import BookingManagerCreateBooking from "./components/booking/BookingManagerCreateBooking.jsx";
import BookingManagerCustomers from "./components/booking/BookingManagerCustomers.jsx";
import BookingManagerAnalytics from "./components/booking/BookingManagerAnalytics.jsx";

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
      <div className="min-h-screen flex flex-col bg-white">
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
            <Route path="/bus-owner/company" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_OWNER, ROLES.MASTER_ADMIN]}>
                <CompanyManagement />
              </ProtectedRoute>
            } />
            <Route path="/bus-owner/bus-admins" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_OWNER, ROLES.MASTER_ADMIN]}>
                <BusAdminManagement />
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

            {/* Bus Admin Route & Pages */}
            <Route path="/bus-admin" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN]}>
                <BusAdminOverview />
              </ProtectedRoute>
            } />
            <Route path="/bus-admin/overview" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN]}>
                <BusAdminOverview />
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
                <BookingMenManagement />
              </ProtectedRoute>
            } />
            <Route path="/bus-admin/revenue" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN]}>
                <Revenue />
              </ProtectedRoute>
            } />
            <Route path="/bus-admin/expenses" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_ADMIN, ROLES.MASTER_ADMIN]}>
                <Expenses />
              </ProtectedRoute>
            } />

            {/* Bus Employee Routes */}
            <Route path="/bus-employee" element={
              <ProtectedRoute requiredRoles={[ROLES.BUS_EMPLOYEE, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN]}>
                <BusEmployeeDashboard />
              </ProtectedRoute>
            } />

            {/* Booking Man Routes */}
            <Route path="/booking-man" element={
              <ProtectedRoute requiredRoles={[ROLES.BOOKING_MAN, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN]}>
                <BookingManagerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/booking-man/overview" element={
              <ProtectedRoute requiredRoles={[ROLES.BOOKING_MAN, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN]}>
                <BookingManagerOverview />
              </ProtectedRoute>
            } />
            <Route path="/booking-man/bookings" element={
              <ProtectedRoute requiredRoles={[ROLES.BOOKING_MAN, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN]}>
                <BookingManagerBookings />
              </ProtectedRoute>
            } />
            <Route path="/booking-man/create-booking" element={
              <ProtectedRoute requiredRoles={[ROLES.BOOKING_MAN, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN]}>
                <BookingManagerCreateBooking />
              </ProtectedRoute>
            } />
            <Route path="/booking-man/customers" element={
              <ProtectedRoute requiredRoles={[ROLES.BOOKING_MAN, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN]}>
                <BookingManagerCustomers />
              </ProtectedRoute>
            } />
            <Route path="/booking-man/analytics" element={
              <ProtectedRoute requiredRoles={[ROLES.BOOKING_MAN, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN]}>
                <BookingManagerAnalytics />
              </ProtectedRoute>
            } />

            {/* Booking Management Route */}
            <Route path="/booking-management" element={
              <ProtectedRoute requiredRoles={[ROLES.BOOKING_MAN, ROLES.BUS_ADMIN, ROLES.BUS_OWNER, ROLES.MASTER_ADMIN]}>
                <BookingManagement />
              </ProtectedRoute>
            } />

            
            {/* Debug/Test Routes */}
            <Route path="/debug/bus-api" element={<BusApiTest />} />
            
            {/* Legacy route redirects for backward compatibility */}
            <Route path="/admin/*" element={<Navigate to="/bus-admin" replace />} />
            <Route path="/dashboard/admin" element={<Navigate to="/bus-admin" replace />} />
            <Route path="/dashboard/booking" element={<Navigate to="/booking-man" replace />} />
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
