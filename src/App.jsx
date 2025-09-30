import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { UserProvider } from './contexts/UserContext'
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
              element={<HomePage onSearch={setSearchData} />} 
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
              <ProtectedRoute requiredRole="bus-admin">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/routes" element={
              <ProtectedRoute requiredRole="bus-admin">
                <RouteManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="bus-admin">
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requiredRole="bus-admin">
                <SystemSettings />
              </ProtectedRoute>
            } />
            <Route path="/admin/buses" element={
              <ProtectedRoute requiredRole="bus-admin">
                <BusManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/booking-men" element={
              <ProtectedRoute requiredRole="booking-man">
                <BookingManManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/trips" element={
              <ProtectedRoute requiredRole="bus-admin">
                <TripManagement />
              </ProtectedRoute>
            } />
            
            {/* Role-Based Dashboards */}
            <Route path="/admin/master" element={
              <ProtectedRoute requiredRole="master-admin">
                <MasterAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/bus-owner" element={
              <ProtectedRoute requiredRole="bus-owner">
                <BusOwnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/employee" element={
              <ProtectedRoute requiredRole="bus-employee">
                <BusEmployeeDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/roles" element={
              <ProtectedRoute>
                <RoleSwitcher />
              </ProtectedRoute>
            } />
            
            {/* Analytics Routes */}
            <Route path="/admin/revenue" element={
              <ProtectedRoute requiredRole="bus-owner">
                <RevenueAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/admin/expenses" element={
              <ProtectedRoute requiredRole="bus-owner">
                <ExpenseAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/admin/user-profiles" element={
              <ProtectedRoute requiredRole="master-admin">
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
