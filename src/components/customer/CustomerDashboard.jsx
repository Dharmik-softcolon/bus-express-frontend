import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'

const CustomerDashboard = () => {
  const { user } = useUser()
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch customer's recent bookings
    const fetchRecentBookings = async () => {
      try {
        // TODO: Implement API call to fetch customer bookings
        setRecentBookings([])
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentBookings()
  }, [])

  const navigationItems = getNavigationMenu(user?.role)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="dashboard-content">
        {/* Dashboard Header */}
        <div className="dashboard-action-bar">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
              Welcome back, {user?.name || 'Customer'}!
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600">
              Here's what's happening with your bookings today
            </p>
          </div>
          <div className="dashboard-action-group">
            <a
              href="/"
              className="btn-primary btn-lg flex items-center"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Book New Trip
            </a>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="dashboard-grid dashboard-grid-4 mb-8 sm:mb-12">
          <div className="dashboard-stat">
            <div className="dashboard-stat-icon bg-gradient-to-br from-blue-500 to-navy">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="dashboard-stat-content">
              <p className="dashboard-stat-label">Total Bookings</p>
              <p className="dashboard-stat-value">
                {loading ? (
                  <div className="loading-skeleton h-8 sm:h-10 lg:h-12 w-16 sm:w-20"></div>
                ) : (
                  recentBookings.length
                )}
              </p>
              <p className="dashboard-stat-change positive">
                +12% from last month
              </p>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="dashboard-stat-icon bg-gradient-to-br from-green-500 to-green-600">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="dashboard-stat-content">
              <p className="dashboard-stat-label">Confirmed</p>
              <p className="dashboard-stat-value">
                {loading ? (
                  <div className="loading-skeleton h-8 sm:h-10 lg:h-12 w-16 sm:w-20"></div>
                ) : (
                  recentBookings.filter(b => b.status === 'confirmed').length
                )}
              </p>
              <p className="dashboard-stat-change positive">
                +8% from last month
              </p>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="dashboard-stat-icon bg-gradient-to-br from-yellow-500 to-yellow-600">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="dashboard-stat-content">
              <p className="dashboard-stat-label">Pending</p>
              <p className="dashboard-stat-value">
                {loading ? (
                  <div className="loading-skeleton h-8 sm:h-10 lg:h-12 w-16 sm:w-20"></div>
                ) : (
                  recentBookings.filter(b => b.status === 'pending').length
                )}
              </p>
              <p className="dashboard-stat-change negative">
                -3% from last month
              </p>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="dashboard-stat-icon bg-gradient-to-br from-purple-500 to-purple-600">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="dashboard-stat-content">
              <p className="dashboard-stat-label">Total Spent</p>
              <p className="dashboard-stat-value">
                {loading ? (
                  <div className="loading-skeleton h-8 sm:h-10 lg:h-12 w-20 sm:w-24"></div>
                ) : (
                  `₹${recentBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)}`
                )}
              </p>
              <p className="dashboard-stat-change positive">
                +15% from last month
              </p>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="dashboard-card mb-8 sm:mb-12">
          <div className="dashboard-card-header">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="dashboard-card-title">Recent Bookings</h2>
                <p className="dashboard-card-subtitle">Your latest travel bookings and their status</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <a
                  href="/dashboard/customer/bookings"
                  className="btn-outline btn-sm flex items-center"
                >
                  View All
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12 sm:py-16">
                <div className="loading-spinner h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4"></div>
                <p className="text-sm sm:text-base text-gray-500">Loading bookings...</p>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-6">Get started by making your first booking.</p>
                <a
                  href="/"
                  className="btn-primary btn-lg"
                >
                  Book Your First Trip
                </a>
              </div>
            ) : (
              <div className="dashboard-table">
                <div className="dashboard-table-header">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    <div>Route</div>
                    <div>Date & Time</div>
                    <div>Status</div>
                    <div>Amount</div>
                  </div>
                </div>
                <div className="dashboard-table-body">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="dashboard-table-row">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                        <div>
                          <div className="font-semibold text-gray-900 text-sm sm:text-base">
                            {booking.route?.from} → {booking.route?.to}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {booking.operator || 'BusExpress'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm sm:text-base text-gray-900">
                            {new Date(booking.travelDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {booking.departureTime}
                          </div>
                        </div>
                        <div>
                          <span className={`inline-flex px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${
                            booking.status === 'confirmed' 
                              ? 'status-success'
                              : booking.status === 'pending'
                              ? 'status-warning'
                              : 'status-info'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-gray-900">
                            ₹{booking.totalAmount}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {booking.seats?.length || 1} seat{(booking.seats?.length || 1) > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Help */}
        <div className="dashboard-grid dashboard-grid-2">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Quick Actions</h3>
              <p className="dashboard-card-subtitle">Common tasks and shortcuts</p>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <a
                href="/"
                className="flex items-center p-4 sm:p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-navy transition-colors">Book New Trip</div>
                  <div className="text-xs sm:text-sm text-gray-500">Find and book your next journey</div>
                </div>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-navy transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              
              <a
                href="/dashboard/customer/bookings"
                className="flex items-center p-4 sm:p-5 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-green-600 transition-colors">View All Bookings</div>
                  <div className="text-xs sm:text-sm text-gray-500">Manage your travel history</div>
                </div>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              
              <a
                href="/dashboard/customer/profile"
                className="flex items-center p-4 sm:p-5 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Update Profile</div>
                  <div className="text-xs sm:text-sm text-gray-500">Manage your account settings</div>
                </div>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Need Help?</h3>
              <p className="dashboard-card-subtitle">Get support and assistance</p>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center p-4 sm:p-5 rounded-xl bg-blue-50 border border-blue-200">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm sm:text-base font-semibold text-gray-900">Customer Support</div>
                  <div className="text-xs sm:text-sm text-gray-600">Get help with your bookings</div>
                </div>
                <div className="text-xs sm:text-sm text-navy font-medium">24/7</div>
              </div>
              
              <div className="flex items-center p-4 sm:p-5 rounded-xl bg-green-50 border border-green-200">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm sm:text-base font-semibold text-gray-900">Email Support</div>
                  <div className="text-xs sm:text-sm text-gray-600">support@busexpress.com</div>
                </div>
                <div className="text-xs sm:text-sm text-green-600 font-medium">Fast</div>
              </div>
              
              <div className="flex items-center p-4 sm:p-5 rounded-xl bg-orange-50 border border-orange-200">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm sm:text-base font-semibold text-gray-900">FAQ</div>
                  <div className="text-xs sm:text-sm text-gray-600">Find answers to common questions</div>
                </div>
                <div className="text-xs sm:text-sm text-orange-600 font-medium">Self-help</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard
