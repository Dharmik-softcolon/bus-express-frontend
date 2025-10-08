import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { showToast } from '../../utils/toast'
import { bookingAPI, tripAPI, searchAPI } from '../../services/api'
import SeatBookingModal from './SeatBookingModal'
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
  Info
} from 'lucide-react'

const BookingManagement = () => {
  const { user } = useUser()
  
  // State management
  const [activeTab, setActiveTab] = useState('search')
  const [error, setError] = useState(null)
  
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
  const [bookingStats, setBookingStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    commissionEarned: 0
  })
  
  // Filter states
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
      fetchBookingStats()
      fetchBookings()
    }
  }, [user])

  // Fetch booking statistics
  const fetchBookingStats = async () => {
    try {
      const response = await bookingAPI.getBookingStatistics({
        bookingMan: user.id
      })
      if (response.success) {
        setBookingStats(response.data)
      }
    } catch (error) {
      console.error('Error fetching booking stats:', error)
    }
  }

  // Fetch bookings
  const fetchBookings = async () => {
      try {
      const response = await bookingAPI.getAllBookings({
        bookingMan: user.id,
        page: pagination.page,
        limit: pagination.limit,
        ...bookingFilters
      })
      
      if (response.success) {
        setBookings(response.data.bookings || [])
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages
        }))
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      showToast.error('Failed to load bookings')
    }
  }

  // Search trips
  const searchTrips = async () => {
    if (!searchFilters.from || !searchFilters.to || !searchFilters.date) {
      showToast.error('Please fill in all search fields')
      return
    }

      try {
      const response = await searchAPI.searchTrips({
        from: searchFilters.from,
        to: searchFilters.to,
        date: searchFilters.date,
        passengers: searchFilters.passengers
      })
      
      if (response.success) {
        setAvailableTrips(response.data.trips || [])
      } else {
        showToast.error(response.message || 'No trips found')
        setAvailableTrips([])
      }
    } catch (error) {
      console.error('Error searching trips:', error)
      showToast.error('Failed to search trips')
      setAvailableTrips([])
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
      const response = await bookingAPI.createBooking(bookingData)
      
      if (response.success) {
        showToast.success('Booking created successfully!')
        setShowSeatModal(false)
        setSelectedTrip(null)
        fetchBookingStats()
        fetchBookings()
      } else {
        showToast.error(response.message || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      showToast.error('Failed to create booking')
    }
  }

  // Update booking status
  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      const response = await bookingAPI.updateBookingStatus(bookingId, { status })
      
      if (response.success) {
        showToast.success(`Booking ${status} successfully`)
        fetchBookingStats()
        fetchBookings()
      } else {
        showToast.error(response.message || 'Failed to update booking status')
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
      showToast.error('Failed to update booking status')
    }
  }

  // Cancel booking
  const handleCancelBooking = async (bookingId, reason) => {
    try {
      const response = await bookingAPI.cancelBooking(bookingId, { reason })
      
      if (response.success) {
        showToast.success('Booking cancelled successfully')
        fetchBookingStats()
        fetchBookings()
      } else {
        showToast.error(response.message || 'Failed to cancel booking')
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      showToast.error('Failed to cancel booking')
    }
  }

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !bookingFilters.search || 
      booking.bookingReference.toLowerCase().includes(bookingFilters.search.toLowerCase()) ||
      booking.user?.name?.toLowerCase().includes(bookingFilters.search.toLowerCase()) ||
      booking.route?.routeName?.toLowerCase().includes(bookingFilters.search.toLowerCase())
    
    const matchesStatus = bookingFilters.status === 'all' || booking.bookingStatus === bookingFilters.status
    
    const matchesDate = !bookingFilters.dateFrom || new Date(booking.journeyDate) >= new Date(bookingFilters.dateFrom)
    const matchesDateTo = !bookingFilters.dateTo || new Date(booking.journeyDate) <= new Date(bookingFilters.dateTo)
    
    return matchesSearch && matchesStatus && matchesDate && matchesDateTo
  })

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
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  // Statistics Card Component
  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
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

  // Trip Card Component
  const TripCard = ({ trip }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{trip.tripNumber}</h3>
            <p className="text-sm text-gray-600">{trip.route?.routeName}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-blue-600">₹{trip.fare}</div>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            disabled={trip.availableSeats === 0}
          >
            {trip.availableSeats === 0 ? 'Sold Out' : 'Book Seats'}
            {trip.availableSeats > 0 && <ArrowRight className="h-4 w-4 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold" style={{color: "#B99750"}}>Booking Management</h1>
              <p className="text-gray-600 mt-1">Search trips, book seats, and manage customer bookings</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  fetchBookingStats()
                  fetchBookings()
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Statistics */}
        {user?.role === 'booking_manager' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Bookings"
              value={bookingStats.totalBookings}
              icon={BarChart3}
              color="bg-blue-500"
            />
            <StatCard
              title="Confirmed"
              value={bookingStats.confirmedBookings}
              icon={CheckCircle}
              color="bg-green-500"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(bookingStats.totalRevenue)}
              icon={DollarSign}
              color="bg-green-500"
            />
            <StatCard
              title="Commission Earned"
              value={formatCurrency(bookingStats.commissionEarned)}
              icon={TrendingUp}
              color="bg-purple-500"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'search', name: 'Search & Book', icon: Search },
                { id: 'bookings', name: 'My Bookings', icon: Calendar },
                { id: 'analytics', name: 'Analytics', icon: BarChart3 }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
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
                disabled={false}
                className="btn-primary mt-4 flex items-center"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Trips
              </button>
            </div>

            {/* Available Trips */}
            {availableTrips.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Available Trips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableTrips.map((trip) => (
                    <TripCard key={trip._id} trip={trip} />
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

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={bookingFilters.status}
                    onChange={(e) => setBookingFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="input-field"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={bookingFilters.dateFrom}
                    onChange={(e) => setBookingFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={bookingFilters.dateTo}
                    onChange={(e) => setBookingFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={bookingFilters.search}
                      onChange={(e) => setBookingFilters(prev => ({ ...prev, search: e.target.value }))}
                      placeholder="Search bookings..."
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Bookings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.bookingReference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{booking.user?.name || 'N/A'}</div>
                            <div className="text-gray-500">{booking.user?.phone || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{booking.route?.routeName || 'N/A'}</div>
                            <div className="text-gray-500">{booking.bus?.busNumber || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>{formatDate(booking.journeyDate)}</div>
                            <div className="text-gray-500">{booking.trip?.departureTime}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.seats?.length || 0} seats
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(booking.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                // View booking details
                                showToast.info('Booking details modal would open here')
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {booking.bookingStatus === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                                  className="text-green-600 hover:text-green-900"
                                  title="Confirm Booking"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleCancelBooking(booking._id, 'Cancelled by booking manager')}
                                  className="text-red-600 hover:text-red-900"
                                  title="Cancel Booking"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Trends</h3>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Analytics charts will be implemented here</p>
                </div>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Analysis</h3>
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Revenue charts will be implemented here</p>
                </div>
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

export default BookingManagement
