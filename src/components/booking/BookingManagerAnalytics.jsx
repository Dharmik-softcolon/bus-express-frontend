import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import showToast from '../../utils/toast'
import { bookingAPI } from '../../services/api'
import BookingAnalytics from './BookingAnalytics'
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
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react'

const BookingManagerAnalytics = () => {
  const { user } = useUser()
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
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Dummy analytics data
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
        },
        {
          _id: 'booking4',
          bookingReference: 'BK55667788',
          user: { name: 'Sarah Wilson', phone: '+91 9876543213' },
          route: { name: 'Mumbai to Goa' },
          bus: { busNumber: 'MH04GH3456' },
          trip: { departureTime: '22:00' },
          journeyDate: new Date('2024-01-18'),
          seats: [{ seatNumber: 8 }, { seatNumber: 9 }],
          totalAmount: 1800,
          bookingStatus: 'cancelled',
          paymentStatus: 'refunded'
        },
        {
          _id: 'booking5',
          bookingReference: 'BK99887766',
          user: { name: 'David Brown', phone: '+91 9876543214' },
          route: { name: 'Chennai to Bangalore' },
          bus: { busNumber: 'TN05IJ7890' },
          trip: { departureTime: '06:00' },
          journeyDate: new Date('2024-01-19'),
          seats: [{ seatNumber: 12 }],
          totalAmount: 1500,
          bookingStatus: 'confirmed',
          paymentStatus: 'paid'
        }
      ]
      
      setStats(dummyStats)
      setBookings(dummyBookings)
      
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      showToast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

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

  // Calculate analytics metrics
  const successRate = stats.totalBookings > 0 
    ? ((stats.confirmedBookings / stats.totalBookings) * 100).toFixed(1) 
    : 0

  const cancellationRate = stats.totalBookings > 0 
    ? ((stats.cancelledBookings / stats.totalBookings) * 100).toFixed(1) 
    : 0

  const avgBookingValue = stats.confirmedBookings > 0 
    ? (stats.totalRevenue / stats.confirmedBookings).toFixed(2) 
    : 0

  // Monthly earnings data
  const monthlyEarnings = [
    { month: 'Jan', earnings: 180.50, bookings: 12 },
    { month: 'Feb', earnings: 225.75, bookings: 15 },
    { month: 'Mar', earnings: 195.25, bookings: 13 },
    { month: 'Apr', earnings: 240.00, bookings: 16 },
    { month: 'May', earnings: 210.30, bookings: 14 },
    { month: 'Jun', earnings: 275.80, bookings: 18 }
  ]

  // Route performance data
  const routePerformance = bookings.reduce((acc, booking) => {
    const route = booking.route?.name || 'Unknown'
    if (!acc[route]) {
      acc[route] = { bookings: 0, revenue: 0, commission: 0 }
    }
    acc[route].bookings += 1
    acc[route].revenue += parseFloat(booking.totalAmount)
    acc[route].commission += (parseFloat(booking.totalAmount) * 0.05)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading analytics...</p>
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
              <h1 className="text-2xl font-bold text-[#B99750]">Analytics & Commission</h1>
              <p className="text-gray-600 mt-1">Track performance, earnings, and commission details</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchAnalyticsData}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-600 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => setShowAnalyticsModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalBookings}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
            <div className="text-xs text-gray-600 mt-1">
              {stats.confirmedBookings} confirmed, {stats.cancelledBookings} cancelled
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(stats.totalRevenue)}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="text-xs text-gray-600 mt-1">
              From {stats.confirmedBookings} confirmed bookings
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{formatCurrency(stats.commissionEarned)}</div>
            <div className="text-sm text-gray-600">Total Commission</div>
            <div className="text-xs text-gray-600 mt-1">
              5% commission rate
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{successRate}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
            <div className="text-xs text-gray-600 mt-1">
              {cancellationRate}% cancellation rate
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Average Booking Value:</span>
                <span className="font-medium">{formatCurrency(avgBookingValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate:</span>
                <span className="font-medium">{successRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cancellation Rate:</span>
                <span className="font-medium">{cancellationRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Commission Rate:</span>
                <span className="font-medium">5.0%</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
              Monthly Earnings Trend
            </h3>
            <div className="space-y-3">
              {monthlyEarnings.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{month.month}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">{formatCurrency(month.earnings)}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(month.earnings / 300) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Route Performance */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-purple-600" />
            Route-wise Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Bookings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Commission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Avg per Booking</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(routePerformance).map(([route, data]) => (
                  <tr key={route}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{route}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{data.bookings}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatCurrency(data.revenue)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{formatCurrency(data.commission)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatCurrency(data.revenue / data.bookings)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Booking Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-orange-600" />
            Recent Booking Activity
          </h3>
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    booking.bookingStatus === 'confirmed' ? 'bg-green-500' : 
                    booking.bookingStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <div className="font-medium">{booking.user?.name}</div>
                    <div className="text-sm text-gray-600">{booking.route?.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(booking.totalAmount)}</div>
                  <div className="text-sm text-gray-600">
                    Commission: {formatCurrency(booking.totalAmount * 0.05)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button className="btn-primary px-6 py-2 rounded-lg flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </button>
          <button
            onClick={() => setShowAnalyticsModal(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Detailed Analytics
          </button>
        </div>
      </div>

      {/* Detailed Analytics Modal */}
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

export default BookingManagerAnalytics
