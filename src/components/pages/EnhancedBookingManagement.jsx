import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { showToast } from '../../utils/toast'
import { bookingAPI, tripAPI, searchAPI } from '../../services/api'
import SeatBookingModal from '../booking/SeatBookingModal'
import BookingManagement from '../booking/BookingManagement'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Bus, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  Star,
  DollarSign,
  TrendingUp,
  BarChart3,
  Activity,
  Phone,
  Mail,
  User as UserIcon,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
  Settings,
  Bell,
  FileText,
  PieChart,
  LineChart
} from 'lucide-react'

const EnhancedBookingManagement = () => {
  const { user } = useUser()
  
  // State management
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Dashboard states
  const [dashboardStats, setDashboardStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    commissionEarned: 0,
    monthlyGrowth: 0,
    successRate: 0
  })
  
  const [recentBookings, setRecentBookings] = useState([])
  const [upcomingTrips, setUpcomingTrips] = useState([])
  const [bookingTrends, setBookingTrends] = useState([])
  
  // Search and booking states
  const [searchFilters, setSearchFilters] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  })
  const [availableTrips, setAvailableTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [showSeatModal, setShowSeatModal] = useState(false)
  
  // Booking management states
  const [bookings, setBookings] = useState([])
  const [bookingFilters, setBookingFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  })
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  // Load initial data
  useEffect(() => {
    if (user?.role === 'booking_manager') {
      fetchDashboardData()
      fetchRecentBookings()
      fetchUpcomingTrips()
    }
  }, [user])

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await bookingAPI.getBookingAnalytics()
      if (response.success) {
        setDashboardStats(response.data.overview)
        setBookingTrends(response.data.bookingTrends)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  // Fetch recent bookings
  const fetchRecentBookings = async () => {
    try {
      const response = await bookingAPI.getAllBookings({
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })
      if (response.success) {
        setRecentBookings(response.data.bookings || [])
      }
    } catch (error) {
      console.error('Error fetching recent bookings:', error)
    }
  }

  // Fetch upcoming trips
  const fetchUpcomingTrips = async () => {
    try {
      const response = await tripAPI.getAllTrips({
        status: 'scheduled',
        limit: 5,
        sortBy: 'departureDate',
        sortOrder: 'asc'
      })
      if (response.success) {
        setUpcomingTrips(response.data.trips || [])
      }
    } catch (error) {
      console.error('Error fetching upcoming trips:', error)
    }
  }

  // Search trips
  const searchTrips = async () => {
    if (!searchFilters.from || !searchFilters.to || !searchFilters.date) {
      showToast.error('Please fill in all search fields')
      return
    }

    try {
      setLoading(true)
      const response = await searchAPI.searchTrips({
        from: searchFilters.from,
        to: searchFilters.to,
        date: searchFilters.date,
        passengers: searchFilters.passengers
      })
      
      if (response.success) {
        setAvailableTrips(response.data.trips || [])
        setActiveTab('search')
      } else {
        showToast.error(response.message || 'No trips found')
        setAvailableTrips([])
      }
    } catch (error) {
      console.error('Error searching trips:', error)
      showToast.error('Failed to search trips')
      setAvailableTrips([])
    } finally {
      setLoading(false)
    }
  }

  // Handle seat booking
  const handleSeatBooking = (trip) => {
    setSelectedTrip(trip)
    setShowSeatModal(true)
  }

  // Confirm booking
  const handleConfirmBooking = async (bookingData) => {
    try {
      setLoading(true)
      const response = await bookingAPI.createBooking(bookingData)
      
      if (response.success) {
        showToast.success('Booking created successfully!')
        setShowSeatModal(false)
        setSelectedTrip(null)
        fetchDashboardData()
        fetchRecentBookings()
      } else {
        showToast.error(response.message || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      showToast.error('Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  // Update booking status
  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      const response = await bookingAPI.updateBookingStatus(bookingId, { status })
      
      if (response.success) {
        showToast.success(`Booking ${status} successfully`)
        fetchDashboardData()
        fetchRecentBookings()
      } else {
        showToast.error(response.message || 'Failed to update booking status')
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
      showToast.error('Failed to update booking status')
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-primary/10 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Statistics Card Component
  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          {trend > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingUp className="h-4 w-4 text-red-500 mr-1 rotate-180" />
          )}
          <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trend)}% from last month
          </span>
        </div>
      )}
    </div>
  )

  // Quick Action Card Component
  const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
    <div 
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} mr-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
              <p className="text-gray-600 mt-2">
                Manage bookings, track performance, and provide excellent customer service
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={() => {
                  fetchDashboardData()
                  fetchRecentBookings()
                  fetchUpcomingTrips()
                }}
                className="btn-secondary flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
                { id: 'search', name: 'Search & Book', icon: Search },
                { id: 'bookings', name: 'Bookings', icon: Calendar },
                { id: 'analytics', name: 'Analytics', icon: LineChart },
                { id: 'settings', name: 'Settings', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Bookings"
                value={dashboardStats.totalBookings}
                icon={Calendar}
                color="bg-primary"
                trend={dashboardStats.monthlyGrowth}
              />
              <StatCard
                title="Confirmed"
                value={dashboardStats.confirmedBookings}
                icon={CheckCircle}
                color="bg-green-500"
                subtitle={`${dashboardStats.successRate}% success rate`}
              />
              <StatCard
                title="Total Revenue"
                value={formatCurrency(dashboardStats.totalRevenue)}
                icon={DollarSign}
                color="bg-green-500"
              />
              <StatCard
                title="Commission Earned"
                value={formatCurrency(dashboardStats.commissionEarned)}
                icon={TrendingUp}
                color="bg-purple-500"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <QuickActionCard
                title="New Booking"
                description="Book seats for customers"
                icon={Plus}
                color="bg-primary"
                onClick={() => setActiveTab('search')}
              />
              <QuickActionCard
                title="View Bookings"
                description="Manage existing bookings"
                icon={Calendar}
                color="bg-green-500"
                onClick={() => setActiveTab('bookings')}
              />
              <QuickActionCard
                title="Analytics"
                description="View performance metrics"
                icon={BarChart3}
                color="bg-purple-500"
                onClick={() => setActiveTab('analytics')}
              />
              <QuickActionCard
                title="Settings"
                description="Configure preferences"
                icon={Settings}
                color="bg-gray-500"
                onClick={() => setActiveTab('settings')}
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Bookings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{booking.bookingReference}</div>
                            <div className="text-sm text-gray-600">{booking.user?.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus}
                          </span>
                          <div className="text-sm text-gray-600 mt-1">{formatCurrency(booking.totalAmount)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="text-primary hover:text-blue-800 text-sm font-medium"
                    >
                      View all bookings →
                    </button>
                  </div>
                </div>
              </div>

              {/* Upcoming Trips */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Upcoming Trips</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {upcomingTrips.map((trip) => (
                      <div key={trip._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <Bus className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{trip.tripNumber}</div>
                            <div className="text-sm text-gray-600">{trip.route?.routeName}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{trip.departureTime}</div>
                          <div className="text-sm text-gray-600">{formatDate(trip.departureDate)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setActiveTab('search')}
                      className="text-primary hover:text-blue-800 text-sm font-medium"
                    >
                      Book seats →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Search Available Trips</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <input
                    type="text"
                    value={searchFilters.from}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, from: e.target.value }))}
                    placeholder="Pickup location"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <input
                    type="text"
                    value={searchFilters.to}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, to: e.target.value }))}
                    placeholder="Drop location"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    value={searchFilters.date}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, date: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passengers
                  </label>
                  <input
                    type="number"
                    value={searchFilters.passengers}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                    min="1"
                    max="10"
                    className="input-field"
                  />
                </div>
              </div>
              <button
                onClick={searchTrips}
                disabled={loading}
                className="btn-primary mt-4 flex items-center"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search Trips
              </button>
            </div>

            {/* Available Trips */}
            {availableTrips.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Available Trips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableTrips.map((trip) => (
                    <div key={trip._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{trip.tripNumber}</h3>
                            <p className="text-sm text-gray-600">{trip.route?.routeName}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-primary">₹{trip.fare}</div>
                            <div className="text-sm text-gray-500">per seat</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Bus className="h-4 w-4 mr-2" />
                            {trip.bus?.busName} ({trip.bus?.busNumber})
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {trip.departureTime} - {trip.arrivalTime}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(trip.departureDate)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            {trip.availableSeats} seats available
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">4.5</span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500 capitalize">{trip.bus?.type}</span>
                          </div>
                          <button
                            onClick={() => handleSeatBooking(trip)}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary transition-colors flex items-center"
                            disabled={trip.availableSeats === 0}
                          >
                            {trip.availableSeats === 0 ? 'Sold Out' : 'Book Seats'}
                            {trip.availableSeats > 0 && <ArrowRight className="h-4 w-4 ml-2" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {availableTrips.length === 0 && !loading && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
                <p className="text-gray-600">Search for trips to get started</p>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <BookingManagement />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Trends</h3>
                <div className="text-center py-8">
                  <LineChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Analytics charts will be implemented here</p>
                </div>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Analysis</h3>
                <div className="text-center py-8">
                  <PieChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Revenue charts will be implemented here</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Preferences</h3>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Settings panel will be implemented here</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Seat Booking Modal */}
      {showSeatModal && selectedTrip && (
        <SeatBookingModal
          isOpen={showSeatModal}
          onClose={() => {
            setShowSeatModal(false)
            setSelectedTrip(null)
          }}
          bus={selectedTrip.bus}
          trip={selectedTrip}
          onConfirmBooking={handleConfirmBooking}
          loading={loading}
        />
      )}
    </div>
  )
}

export default EnhancedBookingManagement
