import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar, 
  MapPin, 
  BarChart3,
  PieChart,
  Activity,
  Download,
  Filter,
  XCircle
} from 'lucide-react'

const BookingAnalytics = ({ bookingManager, isOpen, onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [selectedRoute, setSelectedRoute] = useState('all')

  if (!isOpen || !bookingManager) return null

  // Calculate analytics data
  const confirmedBookings = bookingManager.bookings.filter(b => b.status === 'confirmed')
  const cancelledBookings = bookingManager.bookings.filter(b => b.status === 'cancelled')
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + parseFloat(b.amount), 0)
  const totalCommission = bookingManager.totalEarnings

  // Calculate route-wise performance
  const routePerformance = confirmedBookings.reduce((acc, booking) => {
    const route = booking.route
    if (!acc[route]) {
      acc[route] = { bookings: 0, revenue: 0, commission: 0 }
    }
    acc[route].bookings += 1
    acc[route].revenue += parseFloat(booking.amount)
    acc[route].commission += (parseFloat(booking.amount) * bookingManager.commission / 100)
    return acc
  }, {})

  // Calculate monthly earnings (mock data for demo)
  const monthlyEarnings = [
    { month: 'Jan', earnings: 180.50, bookings: 12 },
    { month: 'Feb', earnings: 225.75, bookings: 15 },
    { month: 'Mar', earnings: 195.25, bookings: 13 },
    { month: 'Apr', earnings: 240.00, bookings: 16 },
    { month: 'May', earnings: 210.30, bookings: 14 },
    { month: 'Jun', earnings: 275.80, bookings: 18 }
  ]

  const successRate = bookingManager.totalBookings > 0 
    ? ((confirmedBookings.length / bookingManager.totalBookings) * 100).toFixed(1) 
    : 0

  const cancellationRate = bookingManager.totalBookings > 0 
    ? ((cancelledBookings.length / bookingManager.totalBookings) * 100).toFixed(1) 
    : 0

  const avgBookingValue = confirmedBookings.length > 0 
    ? (totalRevenue / confirmedBookings.length).toFixed(2) 
    : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold" style={{color: "#B99750"}}>Booking Analytics & Commission</h2>
              <p className="text-gray-600 mt-1">Detailed performance metrics and earnings analysis</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{bookingManager.totalBookings}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
              <div className="text-xs text-gray-600 mt-1">
                {confirmedBookings.length} confirmed, {cancelledBookings.length} cancelled
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">₹{totalRevenue.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-xs text-gray-600 mt-1">
                From {confirmedBookings.length} confirmed bookings
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">₹{totalCommission.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Commission</div>
              <div className="text-xs text-gray-600 mt-1">
                {bookingManager.commission}% commission rate
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
                  <span className="font-medium">₹{avgBookingValue}</span>
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
                  <span className="font-medium">{bookingManager.commission}%</span>
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
                      <span className="text-sm font-medium">₹{month.earnings}</span>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{data.revenue.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">₹{data.commission.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{(data.revenue / data.bookings).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-orange-600" />
              Recent Booking Activity
            </h3>
            <div className="space-y-3">
              {bookingManager.bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-sm text-gray-600">{booking.route}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{booking.amount}</div>
                    <div className="text-sm text-gray-600">
                      Commission: ₹{booking.commission?.toFixed(2) || '0.00'}
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
              onClick={onClose}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingAnalytics
