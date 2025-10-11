import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { showToast } from '../../utils/toast'
import { tripAPI, bookingAPI } from '../../services/api'
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Bus,
  Route,
  DollarSign,
  Phone,
  Mail,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Eye,
  MoreVertical,
  User,
  CreditCard,
  Ticket,
  Navigation
} from 'lucide-react'

const TripDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useUser()
  
  // State management
  const [trip, setTrip] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Fetch trip details
  const fetchTripDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await tripAPI.getTripById(id)
      if (response.success) {
        setTrip(response.data.trip)
        setBookings(response.data.bookings || [])
      } else {
        setError('Trip not found')
      }
    } catch (error) {
      console.error('Error fetching trip details:', error)
      setError('Failed to load trip details')
      showToast('Failed to load trip details', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchTripDetails()
    }
  }, [id])

  // Handle status update
  const handleStatusUpdate = async (status) => {
    try {
      setActionLoading(true)
      const response = await tripAPI.updateTripStatus(id, status)
      if (response.success) {
        showToast('Trip status updated successfully', 'success')
        fetchTripDetails()
      }
    } catch (error) {
      console.error('Error updating status:', error)
      showToast('Failed to update trip status', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Handle trip deletion
  const handleDeleteTrip = async () => {
    if (!window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return
    }
    
    try {
      setActionLoading(true)
      const response = await tripAPI.deleteTrip(id)
      if (response.success) {
        showToast('Trip deleted successfully', 'success')
        navigate('/trips')
      }
    } catch (error) {
      console.error('Error deleting trip:', error)
      showToast('Failed to delete trip', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Get status info
  const getStatusInfo = (status) => {
    switch (status) {
      case 'scheduled':
        return { color: 'bg-blue-100 text-blue-800', icon: Calendar, label: 'Scheduled' }
      case 'in_progress':
        return { color: 'bg-green-100 text-green-800', icon: PlayCircle, label: 'In Progress' }
      case 'completed':
        return { color: 'bg-gray-100 text-gray-800', icon: CheckCircle, label: 'Completed' }
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' }
      case 'delayed':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Delayed' }
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: 'Unknown' }
    }
  }

  // Format time
  const formatTime = (time) => {
    return time ? time : 'Not specified'
  }

  // Format date
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Not specified'
  }

  // Get booking status color
  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Trip Not Found</h3>
          <p className="text-gray-600 mb-4">{error || 'The requested trip could not be found.'}</p>
          <button
            onClick={() => navigate('/trips')}
            className="btn-primary"
          >
            Back to Trips
          </button>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(trip.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/trips')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{trip.tripNumber}</h1>
                <p className="text-gray-600 mt-1">
                  {trip.route?.routeName || 'Unknown Route'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${statusInfo.color}`}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {statusInfo.label}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/trips/${id}/edit`)}
                  className="btn-secondary"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDeleteTrip}
                  disabled={actionLoading}
                  className="btn-secondary text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            {trip.status === 'scheduled' && (
              <button
                onClick={() => handleStatusUpdate('in_progress')}
                disabled={actionLoading}
                className="btn-primary"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Trip
              </button>
            )}
            {trip.status === 'in_progress' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={actionLoading}
                  className="btn-primary"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Trip
                </button>
                <button
                  onClick={() => handleStatusUpdate('delayed')}
                  disabled={actionLoading}
                  className="btn-secondary"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Mark Delayed
                </button>
              </>
            )}
            {(trip.status === 'scheduled' || trip.status === 'in_progress') && (
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={actionLoading}
                className="btn-secondary text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Trip
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {[
              { id: 'overview', name: 'Overview', icon: Eye },
              { id: 'bookings', name: 'Bookings', icon: Users },
              { id: 'route', name: 'Route Details', icon: Route },
              { id: 'staff', name: 'Staff', icon: User }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trip Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Bus className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Bus</p>
                      <p className="font-medium">{trip.bus?.busNumber || 'Not assigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Route className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Route</p>
                      <p className="font-medium">{trip.route?.routeName || 'Not assigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Departure Date</p>
                      <p className="font-medium">{formatDate(trip.departureDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Departure Time</p>
                      <p className="font-medium">{formatTime(trip.departureTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Arrival Time</p>
                      <p className="font-medium">{formatTime(trip.arrivalTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Fare</p>
                      <p className="font-medium">₹{trip.fare}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pickup Points */}
              {trip.pickupPoints && trip.pickupPoints.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup Points</h3>
                  <div className="space-y-3">
                    {trip.pickupPoints.map((point, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="flex-1">
                          <p className="font-medium">{point.name}</p>
                          <p className="text-sm text-gray-600">{point.address}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {point.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Drop Points */}
              {trip.dropPoints && trip.dropPoints.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Drop Points</h3>
                  <div className="space-y-3">
                    {trip.dropPoints.map((point, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="flex-1">
                          <p className="font-medium">{point.name}</p>
                          <p className="text-sm text-gray-600">{point.address}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {point.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trip Statistics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Bookings</span>
                    <span className="font-medium">{trip.totalBookings || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Seats</span>
                    <span className="font-medium">{trip.availableSeats || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Occupancy Rate</span>
                    <span className="font-medium">
                      {trip.availableSeats > 0 
                        ? Math.round(((trip.availableSeats - (trip.totalBookings || 0)) / trip.availableSeats) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-medium">₹{(trip.totalBookings || 0) * trip.fare}</span>
                  </div>
                </div>
              </div>

              {/* Staff Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Driver</p>
                    <p className="font-medium">{trip.driver?.name || 'Not assigned'}</p>
                    {trip.driver?.phone && (
                      <p className="text-sm text-gray-500">{trip.driver.phone}</p>
                    )}
                  </div>
                  {trip.helper && (
                    <div>
                      <p className="text-sm text-gray-600">Helper</p>
                      <p className="font-medium">{trip.helper.name}</p>
                      {trip.helper.phone && (
                        <p className="text-sm text-gray-500">{trip.helper.phone}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Bookings</h3>
                <div className="text-sm text-gray-600">
                  {bookings.length} booking(s)
                </div>
              </div>
              
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No bookings found for this trip</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Seats
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {booking.user?.name || 'Unknown'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.user?.phone || 'No phone'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.seats?.join(', ') || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{booking.totalAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBookingStatusColor(booking.bookingStatus)}`}>
                              {booking.bookingStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                              {booking.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-primary hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'route' && trip.route && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Route Information</h4>
                <div className="space-y-2">
                  <p><span className="text-gray-600">From:</span> {trip.route.from}</p>
                  <p><span className="text-gray-600">To:</span> {trip.route.to}</p>
                  {trip.route.distance && (
                    <p><span className="text-gray-600">Distance:</span> {trip.route.distance} km</p>
                  )}
                  {trip.route.duration && (
                    <p><span className="text-gray-600">Duration:</span> {trip.route.duration}</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Bus Information</h4>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Bus Number:</span> {trip.bus?.busNumber}</p>
                  <p><span className="text-gray-600">Bus Name:</span> {trip.bus?.busName}</p>
                  <p><span className="text-gray-600">Type:</span> {trip.bus?.type}</p>
                  <p><span className="text-gray-600">Total Seats:</span> {trip.bus?.totalSeats}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Information</h3>
              {trip.driver ? (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{trip.driver.name}</p>
                      <p className="text-sm text-gray-600">{trip.driver.phone}</p>
                    </div>
                  </div>
                  {trip.driver.licenseNumber && (
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">License Number</p>
                        <p className="font-medium">{trip.driver.licenseNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No driver assigned</p>
              )}
            </div>

            {/* Helper Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Helper Information</h3>
              {trip.helper ? (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{trip.helper.name}</p>
                      <p className="text-sm text-gray-600">{trip.helper.phone}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No helper assigned</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TripDetails

