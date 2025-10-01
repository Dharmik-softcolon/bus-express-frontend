import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { UserProvider, useUser } from './contexts/UserContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Login from './components/auth/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Customer Pages
import HomePage from './components/customer/HomePage'
import SearchResults from './components/customer/SearchResults'
import SeatSelection from './components/customer/SeatSelection'
import BookingConfirmation from './components/customer/BookingConfirmation'

// Admin Pages
import Dashboard from './components/admin/Dashboard'
import RouteManagement from './components/admin/RouteManagement'
import UserManagement from './components/admin/UserManagement'
import SystemSettings from './components/admin/SystemSettings'
import BusManagement from './components/admin/BusManagement'
import BookingManManagement from './components/admin/BookingManManagement'
import TripManagement from './components/admin/TripManagement'
import MasterAdminDashboard from './components/admin/MasterAdminDashboard'
import BusOwnerDashboard from './components/admin/BusOwnerDashboard'
import BusEmployeeDashboard from './components/admin/BusEmployeeDashboard'
import RoleSwitcher from './components/admin/RoleSwitcher'
import RevenueAnalytics from './components/admin/RevenueAnalytics'
import ExpenseAnalytics from './components/admin/ExpenseAnalytics'
import UserProfileManagement from './components/admin/UserProfileManagement'

// Component to handle home page with auto-redirect for logged-in users
const HomePageWrapper = ({ onSearch }) => {
  const { user, getDashboardRoute } = useUser()
  
  // If user is logged in, redirect to their dashboard
  if (user) {
    return <Navigate to={getDashboardRoute()} replace />
  }
  
  // If not logged in, show home page
  return <HomePage onSearch={onSearch} />
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
            {/* Public Routes */}
            <Route 
              path="/" 
              element={<HomePageWrapper onSearch={setSearchData} />} 
            />
            <Route 
              path="/search" 
              element={<SearchResults searchData={searchData} onSeatSelection={setSelectedSeats} />} 
            />
            <Route 
              path="/seats" 
              element={<SeatSelection selectedSeats={selectedSeats} onBooking={setBookingData} />} 
            />
            <Route 
              path="/confirmation" 
              element={<BookingConfirmation bookingData={bookingData} />} 
            />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="BUS_ADMIN">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/routes" element={
              <ProtectedRoute requiredRole="BUS_ADMIN">
                <RouteManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="BUS_ADMIN">
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requiredRole="BUS_ADMIN">
                <SystemSettings />
              </ProtectedRoute>
            } />
            <Route path="/admin/buses" element={
              <ProtectedRoute requiredRole="BUS_ADMIN">
                <BusManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/booking-men" element={
              <ProtectedRoute requiredRole="BOOKING_MAN">
                <BookingManManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/trips" element={
              <ProtectedRoute requiredRole="BUS_ADMIN">
                <TripManagement />
              </ProtectedRoute>
            } />
            
            {/* Role-Based Dashboards */}
            <Route path="/api/v1/master-admin" element={
              <ProtectedRoute requiredRole="MASTER_ADMIN">
                <MasterAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/api/v1/bus-owner" element={
              <ProtectedRoute requiredRole="BUS_OWNER">
                <BusOwnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/api/v1/bus-admin" element={
              <ProtectedRoute requiredRole="BUS_ADMIN">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/api/v1/booking-man" element={
              <ProtectedRoute requiredRole="BOOKING_MAN">
                <BookingManManagement />
              </ProtectedRoute>
            } />
            <Route path="/api/v1/bus-employee" element={
              <ProtectedRoute requiredRole="BUS_EMPLOYEE">
                <BusEmployeeDashboard />
              </ProtectedRoute>
            } />
            <Route path="/api/v1/customer" element={
              <ProtectedRoute requiredRole="CUSTOMER">
                <HomePage onSearch={setSearchData} />
              </ProtectedRoute>
            } />
            <Route path="/admin/roles" element={
              <ProtectedRoute>
                <RoleSwitcher />
              </ProtectedRoute>
            } />
            
            {/* Analytics Routes */}
            <Route path="/admin/revenue" element={
              <ProtectedRoute requiredRole="BUS_OWNER">
                <RevenueAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/admin/expenses" element={
              <ProtectedRoute requiredRole="BUS_OWNER">
                <ExpenseAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/admin/user-profiles" element={
              <ProtectedRoute requiredRole="MASTER_ADMIN">
                <UserProfileManagement />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </UserProvider>
  )
}

export default App
