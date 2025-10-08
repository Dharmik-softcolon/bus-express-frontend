import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import showToast from '../../utils/toast'
import { bookingAPI, bookingManAPI } from '../../services/api'
import CreateBookingModal from '../booking/CreateBookingModal'
import BookingAnalytics from '../booking/BookingAnalytics'
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

const BookingManagerDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUser()
  
  // Get current active tab from URL
  const getCurrentTab = () => {
    const path = location.pathname
    if (path.includes('/overview')) return 'overview'
    if (path.includes('/bookings')) return 'bookings'
    if (path.includes('/booking-management')) return 'booking-management'
    if (path.includes('/customers')) return 'customers'
    if (path.includes('/analytics')) return 'analytics'
    return 'overview' // default
  }
  
  const [activeTab, setActiveTab] = useState(getCurrentTab())
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalCustomers: 0,
    commissionEarned: 0
  })
  
  const [bookings, setBookings] = useState([])
  const [customers, setCustomers] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  
  // Modal states
  const [showBookingDetails, setShowBookingDetails] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showCreateBookingModal, setShowCreateBookingModal] = useState(false)
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)

  const navigationItems = getNavigationMenu(user?.role)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Sync active tab with URL changes
  useEffect(() => {
    setActiveTab(getCurrentTab())
  }, [location.pathname])

  // Handle tab navigation
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    const basePath = '/booking-man'
    switch (tabId) {
      case 'overview':
        navigate(`${basePath}/overview`)
        break
      case 'bookings':
        navigate(`${basePath}/bookings`)
        break
      case 'booking-management':
        navigate(`${basePath}/booking-management`)
        break
      case 'customers':
        navigate(`${basePath}/customers`)
        break
      case 'analytics':
        navigate(`${basePath}/analytics`)
        break
      default:
        navigate(`${basePath}/overview`)
    }
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Dummy dashboard data
      const dummyStats = {
        totalBookings: 156,
        pendingBookings: 12,
        confirmedBookings: 134,
        cancelledBookings: 10,
        totalRevenue: 187200,
        monthlyRevenue: 45600,
        totalCustomers: 89,
        commissionEarned: 9360
      }
      
      const dummyBookings = [
        {
          _id: 'booking1',
          bookingReference: 'BK12345678',
          user: { name: 'John Doe', phone: '+91 9876543210' },
          route: { name: 'Bangalore to Mumbai' },
          bus: { busNumber: 'KA01AB1234' },
          trip: { departureTime: '08:00' },
          journeyDate: new Date('2024-01-15'),
          seats: [{ seatNumber: 10 }, { seatNumber: 11 }],
          totalAmount: 2400,
          bookingStatus: 'confirmed',
          paymentStatus: 'paid'
        },
        {
          _id: 'booking2',
          bookingReference: 'BK87654321',
          user: { name: 'Jane Smith', phone: '+91 9876543211' },
          route: { name: 'Delhi to Chennai' },
          bus: { busNumber: 'DL02CD5678' },
          trip: { departureTime: '14:30' },
          journeyDate: new Date('2024-01-16'),
          seats: [{ seatNumber: 5 }],
          totalAmount: 1200,
          bookingStatus: 'pending',
          paymentStatus: 'pending'
        },
        {
          _id: 'booking3',
          bookingReference: 'BK11223344',
          user: { name: 'Mike Johnson', phone: '+91 9876543212' },
          route: { name: 'Pune to Hyderabad' },
          bus: { busNumber: 'MH03EF9012' },
          trip: { departureTime: '20:00' },
          journeyDate: new Date('2024-01-17'),
          seats: [{ seatNumber: 15 }, { seatNumber: 16 }, { seatNumber: 17 }],
          totalAmount: 2700,
          bookingStatus: 'confirmed',
          paymentStatus: 'paid'
        }
      ]
      
      const dummyCustomers = [
        {
          _id: 'customer1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+91 9876543210',
          totalBookings: 5,
          totalSpent: 12000,
          lastBooking: new Date('2024-01-15')
        },
        {
          _id: 'customer2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+91 9876543211',
          totalBookings: 3,
          totalSpent: 7200,
          lastBooking: new Date('2024-01-16')
        },
        {
          _id: 'customer3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+91 9876543212',
          totalBookings: 7,
          totalSpent: 16800,
          lastBooking: new Date('2024-01-17')
        }
      ]
      
      const dummyActivities = [
        {
          type: 'booking_created',
          message: 'Booking BK12345678 created for Bangalore to Mumbai',
          timestamp: new Date('2024-01-15T10:30:00')
        },
        {
          type: 'booking_confirmed',
          message: 'Booking BK87654321 confirmed',
          timestamp: new Date('2024-01-16T09:15:00')
        },
        {
          type: 'booking_created',
          message: 'Booking BK11223344 created for Pune to Hyderabad',
          timestamp: new Date('2024-01-17T14:20:00')
        }
      ]
      
      setStats(dummyStats)
      setBookings(dummyBookings)
      setCustomers(dummyCustomers)
      setRecentActivities(dummyActivities)
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      showToast('Failed to load dashboard data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId, newStatus) => {
    await handleBookingStatusUpdate(bookingId, newStatus)
    fetchDashboardData() // Refresh data after status update
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
      
      showToast(`Booking ${newStatus} successfully`, 'success')
    } catch (error) {
      showToast('Failed to update booking status', 'error')
    }
  }

  const handleCancelBooking = async (bookingId, reason) => {
    try {
      const response = await bookingAPI.cancelBooking(bookingId, {
        reason,
        cancelledBy: user.id
      })
      
      if (response.success) {
        showToast('Booking cancelled successfully', 'success')
        fetchDashboardData() // Refresh data
      } else {
        showToast(response.message || 'Failed to cancel booking', 'error')
      }
    } catch (error) {
      showToast('Failed to cancel booking', 'error')
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
        return 'bg-blue-100 text-navy'
      default:
        return 'bg-gray-100 text-gray-800'
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
        return 'bg-blue-100 text-navy'
      default:
        return 'bg-gray-100 text-gray-800'
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
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-navy" />
          <p className="text-gray-600">Loading dashboard...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Booking Manager Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchDashboardData}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-md shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-navy" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Confirmed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.confirmedBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Commission Earned</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.commissionEarned)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: Calendar },
                { id: 'bookings', name: 'Bookings', icon: Calendar },
                { id: 'booking-management', name: 'Booking Management', icon: Plus },
                { id: 'customers', name: 'Customers', icon: Users },
                { id: 'analytics', name: 'Analytics', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-navy text-navy'
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Recent Bookings */}
            <div className="bg-white shadow rounded-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.slice(0, 10).map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.bookingReference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.user?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.route?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(booking.journeyDate)}
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
                          <button
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowBookingDetails(true)
                            }}
                            className="text-navy hover:text-navy-dark mr-3"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {booking.bookingStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleBookingStatusUpdate(booking._id, 'confirmed')}
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleCancelBooking(booking._id, 'Cancelled by booking manager')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white shadow rounded-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
              </div>
              <div className="px-6 py-4">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {recentActivities.map((activity, index) => (
                      <li key={index}>
                        <div className="relative pb-8">
                          {index !== recentActivities.length - 1 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-navy flex items-center justify-center ring-8 ring-white">
                                <Activity className="h-4 w-4 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">{activity.message}</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {formatTime(activity.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white shadow rounded-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">All Bookings</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowCreateBookingModal(true)}
                    className="bg-navy text-white px-4 py-2 rounded-md hover:bg-navy-light transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create New Booking
                  </button>
                  <div className="relative">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
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
                          <div className="font-medium">{booking.route?.name || 'N/A'}</div>
                          <div className="text-gray-500">{booking.bus?.busNumber || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{formatDate(booking.journeyDate)}</div>
                          <div className="text-gray-500">{formatTime(booking.trip?.departureTime)}</div>
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
                            className="text-navy hover:text-navy-dark"
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
        )}

        {activeTab === 'customers' && (
          <div className="bg-white shadow rounded-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Customers</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bookings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Booking</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.totalBookings || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(customer.totalSpent || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.lastBooking ? formatDate(customer.lastBooking) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer)
                            setShowCustomerDetails(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'booking-management' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white shadow rounded-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowCreateBookingModal(true)}
                  className="bg-navy text-white p-4 rounded-md hover:bg-navy-light transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Create New Booking
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="bg-green-600 text-white p-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="h-5 w-5" />
                  View All Bookings
                </button>
                <button
                  onClick={() => setActiveTab('customers')}
                  className="bg-purple-600 text-white p-4 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Users className="h-5 w-5" />
                  Manage Customers
                </button>
              </div>
            </div>

            {/* Recent Bookings Summary */}
            <div className="bg-white shadow rounded-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-navy hover:text-navy-dark text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.slice(0, 5).map((booking) => (
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
                            <div className="font-medium">{booking.route?.name || 'N/A'}</div>
                            <div className="text-gray-500">{booking.bus?.busNumber || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>{formatDate(booking.journeyDate)}</div>
                            <div className="text-gray-500">{formatTime(booking.trip?.departureTime)}</div>
                          </div>
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
                                setSelectedBooking(booking)
                                setShowBookingDetails(true)
                              }}
                              className="text-navy hover:text-navy-dark"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {booking.bookingStatus === 'pending' && (
                              <button
                                onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                className="text-green-600 hover:text-green-900"
                                title="Confirm Booking"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            {booking.bookingStatus !== 'cancelled' && booking.bookingStatus !== 'completed' && (
                              <button
                                onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                className="text-red-600 hover:text-red-900"
                                title="Cancel Booking"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Booking Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white shadow rounded-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-navy" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow rounded-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.pendingBookings}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow rounded-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Confirmed</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.confirmedBookings}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow rounded-md p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Booking Analytics & Commission</h3>
                <button
                  onClick={() => setShowAnalyticsModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  View Detailed Analytics
                </button>
              </div>
              
              {/* Quick Analytics Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-blue-50 rounded-md p-4 text-center">
                  <div className="text-2xl font-bold text-navy mb-1">{stats.totalBookings}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="bg-green-50 rounded-md p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{formatCurrency(stats.totalRevenue)}</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
                <div className="bg-purple-50 rounded-md p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{formatCurrency(stats.commissionEarned)}</div>
                  <div className="text-sm text-gray-600">Commission Earned</div>
                </div>
                <div className="bg-orange-50 rounded-md p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{stats.totalCustomers}</div>
                  <div className="text-sm text-gray-600">Total Customers</div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-md p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-medium">
                        {stats.totalBookings > 0 ? ((stats.confirmedBookings / stats.totalBookings) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cancellation Rate:</span>
                      <span className="font-medium">
                        {stats.totalBookings > 0 ? ((stats.cancelledBookings / stats.totalBookings) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Booking Value:</span>
                      <span className="font-medium">
                        {stats.confirmedBookings > 0 ? formatCurrency(stats.totalRevenue / stats.confirmedBookings) : '₹0'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-md p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Commission Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission Rate:</span>
                      <span className="font-medium">5.0%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Commission:</span>
                      <span className="font-medium text-green-600">{formatCurrency(stats.commissionEarned)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Commission:</span>
                      <span className="font-medium text-green-600">{formatCurrency(stats.commissionEarned * 0.3)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showBookingDetails && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setShowBookingDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Booking Reference</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.bookingReference}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedBooking.bookingStatus)}`}>
                      {selectedBooking.bookingStatus}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.user?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.user?.phone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Route</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.route?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bus</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.bus?.busNumber}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Journey Date</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedBooking.journeyDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Departure Time</label>
                    <p className="mt-1 text-sm text-gray-900">{formatTime(selectedBooking.trip?.departureTime)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Seats</label>
                  <div className="mt-1">
                    {selectedBooking.seats?.map((seat, index) => (
                      <span key={index} className="inline-block bg-gray-100 rounded px-2 py-1 text-sm mr-2 mb-2">
                        Seat {seat.seatNumber} - {seat.passengerName}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedBooking.totalAmount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                      {selectedBooking.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowBookingDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
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

      {/* Create Booking Modal */}
      <CreateBookingModal
        isOpen={showCreateBookingModal}
        onClose={() => {
          setShowCreateBookingModal(false)
          fetchDashboardData() // Refresh data after booking creation
        }}
      />

      {/* Analytics Modal */}
      <BookingAnalytics
        bookingManager={{
          id: 1,
          name: user?.name || 'Booking Manager',
          commission: 5.0,
          totalBookings: stats.totalBookings,
          totalEarnings: stats.commissionEarned,
          bookings: bookings.map(booking => ({
            id: booking._id,
            customerName: booking.user?.name,
            customerPhone: booking.user?.phone,
            route: booking.route?.name,
            busNumber: booking.bus?.busNumber,
            seatNumbers: booking.seats?.map(s => s.seatNumber) || [],
            bookingDate: booking.journeyDate,
            travelDate: booking.journeyDate,
            amount: booking.totalAmount,
            commission: booking.totalAmount * 0.05,
            status: booking.bookingStatus,
            bookingTime: booking.trip?.departureTime,
            bookedByWomen: false
          }))
        }}
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
      />
    </div>
  )
}

export default BookingManagerDashboard

