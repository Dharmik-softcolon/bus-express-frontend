import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus,
  Search
} from 'lucide-react'

const CustomerDashboard = () => {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingTrips: 0,
    completedTrips: 0,
    totalSpent: 0
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch customer dashboard data
    setTimeout(() => {
      setStats({
        totalBookings: 8,
        upcomingTrips: 2,
        completedTrips: 6,
        totalSpent: 18500
      })
      setRecentBookings([
        {
          id: 1,
          route: 'Mumbai → Delhi',
          date: '2024-01-15',
          time: '06:00 AM',
          status: 'confirmed',
          amount: 2500,
          bus: 'Bus-001'
        },
        {
          id: 2,
          route: 'Delhi → Bangalore',
          date: '2024-01-20',
          time: '08:00 PM',
          status: 'pending',
          amount: 3200,
          bus: 'Bus-002'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const navigationItems = getNavigationMenu(user?.role)

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#B99750]">Customer Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage your bookings and travel history
              </p>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'bookings', name: 'My Bookings' },
                { id: 'profile', name: 'Profile' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors border-0 hover:border-0 active:border-0 focus:border-0 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {loading ? '...' : stats.totalBookings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Trips</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {loading ? '...' : stats.upcomingTrips}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Trips</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {loading ? '...' : stats.completedTrips}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {loading ? '...' : `₹${stats.totalSpent.toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-600">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <a
                    href="/search"
                    className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Search className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Book New Trip</p>
                      <p className="text-xs text-gray-600">Search and book your next journey</p>
                    </div>
                  </a>
                  
                  <a
                    href="/dashboard/customer/bookings"
                    className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">My Bookings</p>
                      <p className="text-xs text-gray-600">View and manage your bookings</p>
                    </div>
                  </a>
                  
                  <a
                    href="/dashboard/customer/profile"
                    className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <Plus className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Update Profile</p>
                      <p className="text-xs text-gray-600">Manage your personal information</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Upcoming Trips */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-600">Upcoming Trips</h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Loading...</p>
                  </div>
                ) : recentBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-600" />
                    <h3 className="mt-2 text-sm font-medium text-gray-600">No upcoming trips</h3>
                    <p className="mt-1 text-sm text-gray-600">Book your next journey to get started.</p>
                    <div className="mt-4">
                      <a
                        href="/search"
                        className="inline-flex items-center px-4 py-2 border-0 shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-hover"
                      >
                        Book a Trip
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-600">
                              {booking.route}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {booking.bus} • {booking.date} at {booking.time}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            <p className="text-sm font-medium text-gray-600 mt-1">
                              ₹{booking.amount}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'bookings' && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600">Booking management feature coming soon</p>
            <p className="text-sm text-gray-600 mt-2">This will include booking history, cancellation, and modification</p>
          </div>
        )}
        
        {activeTab === 'profile' && (
          <div className="text-center py-12">
            <Plus className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600">Profile management feature coming soon</p>
            <p className="text-sm text-gray-600 mt-2">This will include personal information, preferences, and account settings</p>
          </div>
        )}

        {/* Travel Tips */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-600">Travel Tips</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Arrive Early</h3>
                  <p className="text-sm text-gray-600">Reach the bus stop 15 minutes before departure time.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Keep Documents Ready</h3>
                  <p className="text-sm text-gray-600">Have your ID and booking confirmation ready for verification.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Check Weather</h3>
                  <p className="text-sm text-gray-600">Monitor weather conditions for your travel date.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Pack Light</h3>
                  <p className="text-sm text-gray-600">Travel with essential items to ensure comfort during the journey.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard
