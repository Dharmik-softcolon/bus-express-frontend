import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import showToast from '../../utils/toast'
import { bookingAPI, bookingManAPI } from '../../services/api'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  Phone,
  Mail,
  User,
  Bus,
  Route,
  CreditCard,
  XCircle,
  CheckCircle2,
  Activity
} from 'lucide-react'

const BookingManagerBookings = () => {
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState([])
  const [showBookingDetails, setShowBookingDetails] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [sortBy, setSortBy] = useState('latest')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      
      // Fetch bookings from API with current filters
      const params = {
        page: 1,
        limit: 50,
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        date: filterDate,
        sortBy: sortBy
      }

      const response = await bookingManAPI.getBookings(params)
      
      console.log('Bookings API Response:', response) // Debug log
      
      // Handle different response structures
      let bookings = []
      
      if (response) {
        // Check if response has success property
        if (response.success && response.data) {
          bookings = response.data.bookings || response.data || []
        }
        // Check if response is direct array
        else if (Array.isArray(response)) {
          bookings = response
        }
        // Check if response has bookings property
        else if (response.bookings) {
          bookings = response.bookings
        }
        // Check if response has data property
        else if (response.data) {
          bookings = Array.isArray(response.data) ? response.data : []
        }
      }
      
      setBookings(bookings)
      
      if (bookings.length === 0) {
        showToast.info('No bookings found')
      }
      
    } catch (error) {
      console.error('Error fetching bookings:', error)
      showToast.error('Failed to load bookings')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId 
          ? { ...booking, bookingStatus: newStatus }
          : booking
      ))
      
      showToast.success(`Booking ${newStatus} successfully`)
    } catch (error) {
      showToast.error('Failed to update booking status')
    }
  }

  const handleCancelBooking = async (bookingId, reason) => {
    try {
      const response = await bookingAPI.cancelBooking(bookingId, {
        reason,
        cancelledBy: user.id
      })
      
      if (response.success) {
        showToast.success('Booking cancelled successfully')
        fetchBookings() // Refresh data
      } else {
        showToast.error(response.message || 'Failed to cancel booking')
      }
    } catch (error) {
      showToast.error('Failed to cancel booking')
    }
  }

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
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.route?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || booking.bookingStatus === filterStatus
    const matchesDate = !filterDate || new Date(booking.journeyDate).toDateString() === new Date(filterDate).toDateString()
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-[#B99750]">All Bookings</h1>
              <p className="text-gray-600 mt-1">Manage and track all customer bookings</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchBookings}
                className="inline-flex items-center px-4 py-2 border-0 rounded-md shadow-sm text-sm font-medium text-gray-600 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-[#B99750] rounded-md focus:ring-primary focus:border-primary w-full"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-[#B99750] rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-3 py-2 border border-[#B99750] rounded-md focus:ring-primary focus:border-primary"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-[#B99750] rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount">Amount</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-600">
              Bookings ({filteredBookings.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Seats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                      {booking.bookingReference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>
                        <div className="font-medium">{booking.user?.name || 'N/A'}</div>
                        <div className="text-gray-600">{booking.user?.phone || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>
                        <div className="font-medium">{booking.route?.name || 'N/A'}</div>
                        <div className="text-gray-600">{booking.bus?.busNumber || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>
                        <div>{formatDate(booking.journeyDate)}</div>
                        <div className="text-gray-600">{formatTime(booking.trip?.departureTime)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {booking.seats?.length || 0} seats
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatCurrency(booking.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking)
                            setShowBookingDetails(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {booking.bookingStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleBookingStatusUpdate(booking._id, 'confirmed')}
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
      </div>

      {/* Booking Details Modal */}
      {showBookingDetails && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-600">Booking Details</h3>
                <button
                  onClick={() => setShowBookingDetails(false)}
                  className="text-gray-600 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Booking Reference</label>
                    <p className="mt-1 text-sm text-gray-600">{selectedBooking.bookingReference}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedBooking.bookingStatus)}`}>
                      {selectedBooking.bookingStatus}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Customer Name</label>
                    <p className="mt-1 text-sm text-gray-600">{selectedBooking.user?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Phone</label>
                    <p className="mt-1 text-sm text-gray-600">{selectedBooking.user?.phone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Route</label>
                    <p className="mt-1 text-sm text-gray-600">{selectedBooking.route?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Bus</label>
                    <p className="mt-1 text-sm text-gray-600">{selectedBooking.bus?.busNumber}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Journey Date</label>
                    <p className="mt-1 text-sm text-gray-600">{formatDate(selectedBooking.journeyDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Departure Time</label>
                    <p className="mt-1 text-sm text-gray-600">{formatTime(selectedBooking.trip?.departureTime)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Seats</label>
                  <div className="mt-1">
                    {selectedBooking.seats?.map((seat, index) => (
                      <span key={index} className="inline-block bg-gray-100 rounded px-2 py-1 text-sm mr-2 mb-2">
                        Seat {seat.seatNumber}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Total Amount</label>
                    <p className="mt-1 text-sm text-gray-600">{formatCurrency(selectedBooking.totalAmount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Payment Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                      {selectedBooking.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowBookingDetails(false)}
                  className="px-4 py-2 border-0 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedBooking.bookingStatus === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleBookingStatusUpdate(selectedBooking._id, 'confirmed')
                        setShowBookingDetails(false)
                      }}
                      className="px-4 py-2 bg-green-600 border-0 rounded-md text-sm font-medium text-white hover:bg-green-700"
                    >
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => {
                        handleCancelBooking(selectedBooking._id, 'Cancelled by booking manager')
                        setShowBookingDetails(false)
                      }}
                      className="px-4 py-2 bg-red-600 border-0 rounded-md text-sm font-medium text-white hover:bg-red-700"
                    >
                      Cancel Booking
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default BookingManagerBookings
